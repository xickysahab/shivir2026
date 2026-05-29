from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt, get_jwt_identity
from datetime import datetime, timezone, timedelta
from extensions import db
from model import Student, Attendance
from utils import role_required, log_activity, natural_sort_key

attendance_bp = Blueprint('attendance', __name__)

@attendance_bp.route('/', methods=['GET'])
@role_required(['admin', 'teacher', 'mentor'])
def get_attendance():
    claims = get_jwt()
    user_role = claims.get('role')
    assigned_level = claims.get('assigned_level')

    date_str = request.args.get('date', '')
    try:
        if date_str:
            target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        else:
            target_date = datetime.now(timezone.utc).date()
    except ValueError:
        return jsonify({'success': False, 'message': 'Invalid date format. Use YYYY-MM-DD'}), 400

    level = request.args.get('level', '')
    
    query = Student.query
    if user_role == 'teacher' and assigned_level:
        assigned_levels = [l.strip() for l in assigned_level.split(',')]
        query = query.filter(Student.level.in_(assigned_levels))
        if level and level != 'All':
            if level in assigned_levels:
                query = query.filter(Student.level == level)
            else:
                query = query.filter(Student.level == 'none')
    else:
        if level and level != 'All':
            query = query.filter(Student.level == level)
        
    students = query.all()
    students.sort(key=natural_sort_key)

    student_ids = [s.id for s in students]
    if student_ids:
        attendance_records = Attendance.query.filter(
            Attendance.student_id.in_(student_ids),
            Attendance.date == target_date
        ).all()
    else:
        attendance_records = []

    attendance_map = {r.student_id: r.status for r in attendance_records}

    student_list = [{
        'id': s.id,
        'roll_no': s.roll_no,
        'name': s.name,
        'father_name': s.father_name,
        'gender': s.gender,
        'age': s.age,
        'level': s.level,
        'status': attendance_map.get(s.id, None)
    } for s in students]

    return jsonify({
        'success': True,
        'date': target_date.strftime('%Y-%m-%d'),
        'level': level,
        'data': student_list
    }), 200

@attendance_bp.route('/', methods=['POST'])
@role_required(['admin', 'teacher', 'mentor'])
def save_attendance():
    claims = get_jwt()
    user_role = claims.get('role')
    assigned_level = claims.get('assigned_level')
    user_name = claims.get('name') if claims.get('name') else get_jwt_identity()

    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'message': 'Missing request payload'}), 400

    date_str = data.get('date')
    attendance_list = data.get('attendance')

    if not date_str or not attendance_list:
        return jsonify({'success': False, 'message': 'Missing date or attendance data'}), 400

    try:
        target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'success': False, 'message': 'Invalid date format. Use YYYY-MM-DD'}), 400

    today = (datetime.now(timezone.utc) + timedelta(hours=5, minutes=30)).date()

    if user_role != 'admin' and target_date > today:
        return jsonify({
            'success': False,
            'message': 'Access forbidden: You cannot mark attendance for future dates.'
        }), 403

    try:
        saved_count = 0
        for item in attendance_list:
            s_id = item.get('student_id')
            status = item.get('status')
            if not s_id or status not in ('Present', 'Absent', None):
                continue

            student = Student.query.get(s_id)
            if not student:
                continue

            if user_role == 'teacher' and assigned_level:
                assigned_levels = [l.strip() for l in assigned_level.split(',')]
                if student.level not in assigned_levels:
                    continue

            existing = Attendance.query.filter_by(student_id=s_id, date=target_date).first()
            if status is None:
                if existing:
                    db.session.delete(existing)
                    saved_count += 1
                continue

            if existing:
                existing.status = status
                existing.marked_by = user_name
            else:
                new_rec = Attendance(
                    student_id=s_id,
                    date=target_date,
                    status=status,
                    marked_by=user_name
                )
                db.session.add(new_rec)
            saved_count += 1

        log_activity("MARK_ATTENDANCE", f"Marked attendance for {saved_count} students on {date_str}")
        db.session.commit()
        return jsonify({
            'success': True,
            'message': f'Attendance for {saved_count} students saved successfully!'
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@attendance_bp.route('/summary', methods=['GET'])
@role_required(['admin', 'teacher', 'mentor'])
def get_attendance_summary():
    import calendar
    from datetime import date
    claims = get_jwt()
    user_role = claims.get('role')
    assigned_level = claims.get('assigned_level')

    year = request.args.get('year')
    month = request.args.get('month')
    if not year or not month:
        now = datetime.now(timezone.utc) + timedelta(hours=5, minutes=30)
        year = str(now.year)
        month = str(now.month).zfill(2)
        
    query = Student.query
    if user_role == 'teacher' and assigned_level:
        assigned_levels = [l.strip() for l in assigned_level.split(',')]
        query = query.filter(Student.level.in_(assigned_levels))
        if level and level != 'All':
            if level in assigned_levels:
                query = query.filter(Student.level == level)
            else:
                query = query.filter(Student.level == 'none')
    else:
        if level and level != 'All':
            query = query.filter(Student.level == level)
        
    students = query.all()
    student_ids = [s.id for s in students]
    total_students = len(students)
    
    if not student_ids:
        return jsonify({'success': True, 'data': {}, 'totalStudents': 0}), 200
        
    year_int, month_int = int(year), int(month)
    _, last_day = calendar.monthrange(year_int, month_int)
    start_date = date(year_int, month_int, 1)
    end_date = date(year_int, month_int, last_day)

    attendance_records = Attendance.query.filter(
        Attendance.student_id.in_(student_ids),
        Attendance.date >= start_date,
        Attendance.date <= end_date
    ).all()
    
    # Aggregate by date
    summary = {}
    for r in attendance_records:
        date_str = r.date.strftime('%Y-%m-%d')
        if date_str not in summary:
            summary[date_str] = {'Present': 0, 'Absent': 0}
            
        if r.status == 'Present':
            summary[date_str]['Present'] += 1
        elif r.status == 'Absent':
            summary[date_str]['Absent'] += 1
            
    for date_str in summary:
        marked = summary[date_str]['Present'] + summary[date_str]['Absent']
        summary[date_str]['Unmarked'] = total_students - marked
        
    return jsonify({
        'success': True,
        'year': year,
        'month': month,
        'level': level,
        'totalStudents': total_students,
        'data': summary
    }), 200

@attendance_bp.route('/student/<int:student_id>', methods=['GET'])
@role_required(['admin', 'teacher', 'mentor'])
def get_student_attendance(student_id):
    claims = get_jwt()
    user_role = claims.get('role')
    assigned_level = claims.get('assigned_level')
    
    if user_role == 'teacher' and assigned_level:
        assigned_levels = [l.strip() for l in assigned_level.split(',')]
        student = Student.query.get(student_id)
        if not student or student.level not in assigned_levels:
            return jsonify({'success': False, 'message': 'Access forbidden'}), 403
            
    records = Attendance.query.filter_by(student_id=student_id).all()
    data = {r.date.strftime('%Y-%m-%d'): r.status for r in records}
    
    return jsonify({
        'success': True,
        'data': data
    }), 200
