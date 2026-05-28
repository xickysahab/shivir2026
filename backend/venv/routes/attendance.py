from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt, get_jwt_identity
from datetime import datetime, timezone, timedelta
from extensions import db
from model import Student, Attendance
from utils import role_required, log_activity

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
    
    if user_role == 'teacher' and assigned_level:
        level = assigned_level
    
    query = Student.query
    if level and level != 'All':
        query = query.filter(Student.level == level)
        
    students = query.all()
    students.sort(key=lambda s: int(s.roll_no) if (s.roll_no and s.roll_no.isdigit()) else float('inf'))

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
    
    if user_role != 'admin' and target_date < today:
        return jsonify({
            'success': False, 
            'message': 'Access forbidden: Only Administrators can modify previous attendance records.'
        }), 403

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

            if user_role == 'teacher' and assigned_level and student.level != assigned_level:
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
