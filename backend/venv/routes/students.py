import csv
import io
import math
from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt
from extensions import db
from model import Student
import re
from utils import role_required, log_activity, natural_sort_key

students_bp = Blueprint('students', __name__)

def normalize_level(raw_level):
    if not raw_level:
        return 'Level 1'
    
    val = str(raw_level).strip().lower()
    
    # Check for adult / praudh class
    if any(x in val for x in ['प्रौढ़', 'praudh', 'adult', 'prouch', 'proudh', 'pradh']):
        return 'प्रौढ़ कक्षा'
        
    # Standardize spaces and hyphens, remove them
    val_clean = val.replace(' ', '').replace('-', '').replace('_', '')
    
    # Try to find numbers 1 to 5
    if 'level' in val_clean:
        match = re.search(r'level(\d)', val_clean)
        if match:
            num = match.group(1)
            if num in ['1', '2', '3', '4', '5']:
                return f'Level {num}'
                
    # Direct fallback search for digits
    match_digit = re.search(r'(\d)', val_clean)
    if match_digit:
        num = match_digit.group(1)
        if num in ['1', '2', '3', '4', '5']:
            return f'Level {num}'
            
    # Default fallback
    return 'Level 1'

def sync_roll_numbers(prefix):
    students = Student.query.all()
    level_students = []
    for s in students:
        if s.roll_no:
            match = re.match(rf'^{prefix}(\d+)$', s.roll_no.strip())
            if match:
                level_students.append((s, int(match.group(1))))
    
    # Sort by current numeric suffix
    level_students.sort(key=lambda item: item[1])
    
    # Re-assign sequentially starting from 1
    for idx, (s, _) in enumerate(level_students):
        s.roll_no = f"{prefix}{idx + 1}"

@students_bp.route('/', methods=['GET'])
@role_required(['admin', 'teacher', 'mentor'])
def get_students():
    claims = get_jwt()
    user_role = claims.get('role')
    assigned_level = claims.get('assigned_level')
    
    search = request.args.get('search', '')
    level = request.args.get('level', '')
    gender = request.args.get('gender', '')

    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        if page < 1: page = 1
        if limit < 1: limit = 10
    except ValueError:
        page = 1
        limit = 10

    query = Student.query
    
    if user_role == 'teacher' and assigned_level:
        assigned_levels = [l.strip() for l in assigned_level.split(',')]
        query = query.filter(Student.level.in_(assigned_levels))
        
        # If specific level is requested, ensure it's allowed or block
        if level and level != 'All':
            if level in assigned_levels:
                query = query.filter(Student.level == level)
            else:
                query = query.filter(Student.level == 'none') # Prevent access
    
    if search:
        from sqlalchemy import or_
        search_pattern = f"%{search}%"
        query = query.filter(or_(
            Student.name.ilike(search_pattern),
            Student.mobile.ilike(search_pattern),
            Student.father_name.ilike(search_pattern)
        ))
        
    if level and level != 'All' and user_role != 'teacher':
        query = query.filter(Student.level == level)
        
    if gender and gender != 'All':
        query = query.filter(Student.gender == gender)
        
    students = query.all()
    
    # Proper ascending sort by roll_no using shared natural sort key
    students.sort(key=natural_sort_key)

    total_count = len(students)
    start_index = (page - 1) * limit
    end_index = start_index + limit
    
    if request.args.get('all') == 'true':
        paginated_students = students
        page = 1
        limit = total_count
        total_pages = 1
    else:
        paginated_students = students[start_index:end_index]
        total_pages = math.ceil(total_count / limit) if total_count > 0 else 1

    student_list = [{
        'id': s.id,
        'roll_no': s.roll_no,
        'name': s.name,
        'mobile': s.mobile,
        'father_name': s.father_name,
        'gender': s.gender,
        'age': s.age,
        'address': s.address,
        'pin_code': s.pin_code,
        'level': s.level,
        'points': s.points
    } for s in paginated_students]
    
    return jsonify({
        'success': True, 
        'data': student_list,
        'pagination': {
            'total': total_count,
            'page': page,
            'limit': limit,
            'total_pages': total_pages
        }
    }), 200


@students_bp.route('/', methods=['POST'])
@role_required(['admin', 'teacher', 'mentor'])
def add_student():
    data = request.get_json()
    try:
        # Determine prefix based on student's level
        level = data.get('level')
        level_map = {
            'Level 1': 'A',
            'Level 2': 'B',
            'Level 3': 'C',
            'Level 4': 'D',
            'Level 5': 'E',
            'प्रौढ़ कक्षा': 'P'
        }
        prefix = level_map.get(level, 'A')
        
        # Find maximum numeric roll number suffix for this level/prefix
        students = Student.query.all()
        max_suffix = 0
        for s in students:
            if s.roll_no:
                match = re.match(rf'^{prefix}(\d+)$', s.roll_no.strip())
                if match:
                    val = int(match.group(1))
                    if val > max_suffix:
                        max_suffix = val
        
        new_roll_no = f"{prefix}{max_suffix + 1}"

        new_student = Student(
            roll_no=new_roll_no,
            name=data.get('name'),
            mobile=data.get('mobile'),
            father_name=data.get('father_name'),
            gender=data.get('gender'),
            age=data.get('age'),
            address=data.get('address'),
            pin_code=data.get('pin_code'),
            level=data.get('level'),
            points=data.get('points', 0)
        )
        db.session.add(new_student)
        log_activity("ADD_STUDENT", f"Added student: {new_student.name} (Roll No: {new_roll_no})")
        db.session.commit()
        return jsonify({'success': True, 'message': 'Student added successfully!'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500


@students_bp.route('/<int:id>', methods=['PUT'])
@role_required(['admin', 'teacher', 'mentor'])
def update_student(id):
    data = request.get_json()
    student = Student.query.get(id)
    if not student:
        return jsonify({'success': False, 'message': 'Student not found'}), 404

    try:
        old_level = student.level
        new_level = data.get('level', student.level)
        
        # Extract old prefix for syncing later if level changes
        old_prefix = 'A'
        if student.roll_no:
            match = re.match(r'^([A-Za-z]+)', student.roll_no.strip())
            if match:
                old_prefix = match.group(1).upper()

        student.name = data.get('name', student.name)
        student.mobile = data.get('mobile', student.mobile)
        student.father_name = data.get('father_name', student.father_name)
        student.gender = data.get('gender', student.gender)
        student.age = data.get('age', student.age)
        student.address = data.get('address', student.address)
        student.pin_code = data.get('pin_code', student.pin_code)
        
        if old_level != new_level:
            student.level = new_level
            # Auto-assign roll no in new level
            level_map = {
                'Level 1': 'A',
                'Level 2': 'B',
                'Level 3': 'C',
                'Level 4': 'D',
                'Level 5': 'E',
                'प्रौढ़ कक्षा': 'P'
            }
            new_prefix = level_map.get(new_level, 'A')
            
            # Find max in new prefix
            students = Student.query.all()
            max_suffix = 0
            for s in students:
                if s.roll_no and s.id != student.id:
                    m = re.match(rf'^{new_prefix}(\d+)$', s.roll_no.strip())
                    if m:
                        val = int(m.group(1))
                        if val > max_suffix:
                            max_suffix = val
            
            student.roll_no = f"{new_prefix}{max_suffix + 1}"
            
            # Flush changes and sync the old prefix series to close the gap
            db.session.flush()
            sync_roll_numbers(old_prefix)
        
        log_activity("UPDATE_STUDENT", f"Updated student: {student.name} (Roll No: {student.roll_no})")
        db.session.commit()
        return jsonify({'success': True, 'message': 'Student updated successfully!'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500


@students_bp.route('/<int:id>/points', methods=['PATCH'])
@role_required(['admin', 'teacher', 'mentor'])
def update_student_points(id):
    data = request.get_json()
    student = Student.query.get(id)
    if not student:
        return jsonify({'success': False, 'message': 'Student not found'}), 404

    try:
        points = data.get('points')
        if points is not None:
            student.points = points
            log_activity("UPDATE_POINTS", f"Set points to {points} for {student.name} (Roll No: {student.roll_no})")
            db.session.commit()
            return jsonify({'success': True, 'message': 'Points updated successfully!'}), 200
        return jsonify({'success': False, 'message': 'Points value missing'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500


@students_bp.route('/<int:id>', methods=['DELETE'])
@role_required(['admin'])
def delete_student(id):
    student = Student.query.get(id)
    if not student:
        return jsonify({'success': False, 'message': 'Student not found'}), 404
        
    deleted_roll_str = student.roll_no
    try:
        # Find prefix of the deleted student
        prefix = 'A'
        if student.roll_no:
            match = re.match(r'^([A-Za-z]+)', student.roll_no.strip())
            if match:
                prefix = match.group(1).upper()
        
        db.session.delete(student)
        db.session.flush() # Ensure deleted from session so sync_roll_numbers doesn't see it
        
        # Auto-sync the specific level series
        sync_roll_numbers(prefix)
                        
        log_activity("DELETE_STUDENT", f"Deleted student: {student.name} (Roll No: {deleted_roll_str})")
        db.session.commit()
        return jsonify({'success': True, 'message': 'Student deleted and roll numbers synced successfully!'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500


@students_bp.route('/bulk-upload', methods=['POST'])
@role_required(['admin'])
def bulk_upload():
    if 'file' not in request.files:
        return jsonify({'success': False, 'message': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'success': False, 'message': 'No selected file'}), 400
        
    if not file.filename.endswith('.csv'):
        return jsonify({'success': False, 'message': 'Only CSV files are allowed'}), 400

    try:
        stream = io.StringIO(file.stream.read().decode("UTF8"), newline=None)
        csv_input = csv.DictReader(stream)
        
        # Load all students to calculate suffixes locally
        students = Student.query.all()
        
        # Map levels to prefix roll numbers
        level_map = {
            'Level 1': 'A',
            'Level 2': 'B',
            'Level 3': 'C',
            'Level 4': 'D',
            'Level 5': 'E',
            'प्रौढ़ कक्षा': 'P'
        }
        
        # Track the maximum suffix for each prefix in-memory to assign sequentially
        prefix_suffixes = {}
        for level, prefix in level_map.items():
            max_suffix = 0
            for s in students:
                if s.roll_no:
                    match = re.match(rf'^{prefix}(\d+)$', s.roll_no.strip())
                    if match:
                        val = int(match.group(1))
                        if val > max_suffix:
                            max_suffix = val
            prefix_suffixes[prefix] = max_suffix

        added_count = 0
        for row in csv_input:
            # Skip empty rows (require at least a name)
            name = row.get('name', '').strip()
            if not name:
                continue
                
            level_str = normalize_level(row.get('level', ''))
            
            roll_no = row.get('roll_no', '').strip()
            
            # If roll number is not provided, auto-assign sequentially
            if not roll_no:
                prefix = level_map.get(level_str, 'A')
                prefix_suffixes[prefix] += 1
                roll_no = f"{prefix}{prefix_suffixes[prefix]}"
            
            # Skip if student with this roll number already exists
            if Student.query.filter_by(roll_no=roll_no).first():
                continue
                
            new_student = Student(
                roll_no=roll_no,
                name=name,
                mobile=row.get('mobile', ''),
                father_name=row.get('father_name', ''),
                gender=row.get('gender', ''),
                age=int(row.get('age', 0)) if row.get('age') else 0,
                address=row.get('address', ''),
                pin_code=row.get('pin_code', ''),
                level=level_str,
                points=int(row.get('points', 0)) if row.get('points') else 0
            )
            db.session.add(new_student)
            added_count += 1
            
        log_activity("BULK_UPLOAD", f"Bulk uploaded {added_count} students via CSV")
        db.session.commit()
        return jsonify({'success': True, 'message': f'{added_count} students added successfully!'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Error processing file: {str(e)}'}), 500
