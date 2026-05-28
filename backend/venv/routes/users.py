import math
from flask import Blueprint, request, jsonify
from extensions import db, bcrypt
from model import User
from utils import role_required, log_activity

users_bp = Blueprint('users', __name__)

@users_bp.route('/', methods=['GET'])
@role_required(['admin'])
def get_users():
    search = request.args.get('search', '')
    role_filter = request.args.get('role', '')

    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        if page < 1: page = 1
        if limit < 1: limit = 10
    except ValueError:
        page = 1
        limit = 10

    query = User.query

    if search:
        from sqlalchemy import or_
        search_pattern = f"%{search}%"
        query = query.filter(or_(
            User.name.ilike(search_pattern),
            User.phone.ilike(search_pattern),
            User.login_id.ilike(search_pattern)
        ))

    if role_filter and role_filter != 'All':
        query = query.filter(User.role == role_filter.lower())

    users = query.all()
    users.sort(key=lambda u: u.id)

    total_count = len(users)
    start_index = (page - 1) * limit
    end_index = start_index + limit
    
    if request.args.get('all') == 'true':
        paginated_users = users
        page = 1
        limit = total_count
        total_pages = 1
    else:
        paginated_users = users[start_index:end_index]
        total_pages = math.ceil(total_count / limit) if total_count > 0 else 1

    user_list = [{
        'id': u.id,
        'name': u.name,
        'phone': u.phone,
        'login_id': u.login_id,
        'role': u.role,
        'level': u.level
    } for u in paginated_users]
    
    return jsonify({
        'success': True, 
        'data': user_list,
        'pagination': {
            'total': total_count,
            'page': page,
            'limit': limit,
            'total_pages': total_pages
        }
    }), 200


@users_bp.route('/create-user', methods=['POST'])
@role_required(['admin'])
def create_user():
    try:
        name = request.form.get('name')
        phone = request.form.get('phone')
        login_id = request.form.get('login_id')
        password = request.form.get('password')
        role = request.form.get('role')
        level = request.form.get('level') if role == 'teacher' else None

        if not all([name, phone, login_id, password, role]):
            return jsonify({'success': False, 'message': 'All fields are required'}), 400
        if role not in ('teacher', 'mentor'):
            return jsonify({'success': False, 'message': 'Role must be teacher or mentor'}), 400

        if User.query.filter_by(login_id=login_id).first():
            return jsonify({'success': False, 'message': 'Login ID already exists'}), 409

        password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

        photo_data = None
        if 'photo' in request.files:
            photo_file = request.files['photo']
            if photo_file.filename:
                photo_data = photo_file.read()

        new_user = User(
            name=name, phone=phone, login_id=login_id,
            password_hash=password_hash, role=role, photo=photo_data, level=level
        )
        db.session.add(new_user)
        log_activity("CREATE_USER", f"Created {role} user: {name} (ID: {login_id})")
        db.session.commit()

        return jsonify({'success': True, 'message': 'User created successfully!'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500


@users_bp.route('/<int:id>', methods=['PUT'])
@role_required(['admin'])
def update_user(id):
    data = request.get_json()
    user = User.query.get(id)
    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 404

    try:
        user.name = data.get('name', user.name)
        user.phone = data.get('phone', user.phone)
        user.role = data.get('role', user.role)
        if user.role == 'teacher':
            user.level = data.get('level', user.level)
        else:
            user.level = None
        
        new_password = data.get('new_password')
        if new_password and new_password.strip():
            user.password_hash = bcrypt.generate_password_hash(new_password.strip()).decode('utf-8')
            
        log_activity("UPDATE_USER", f"Updated user: {user.name} ({user.role})")
        db.session.commit()
        return jsonify({'success': True, 'message': 'User updated successfully!'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500


@users_bp.route('/<int:id>', methods=['DELETE'])
@role_required(['admin'])
def delete_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 404
    try:
        db.session.delete(user)
        log_activity("DELETE_USER", f"Deleted user: {user.name} ({user.role})")
        db.session.commit()
        return jsonify({'success': True, 'message': 'User deleted successfully!'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500
