from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from extensions import bcrypt
from model import User
from utils import ADMIN_USERNAME, ADMIN_PASSWORD

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    username = data.get('username', '')
    password = data.get('password', '')

    if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
        access_token = create_access_token(
            identity=username, 
            additional_claims={'role': 'admin'}
        )
        return jsonify({'success': True, 'role': 'admin', 'token': access_token}), 200
    return jsonify({'success': False, 'message': 'Invalid admin credentials'}), 401

@auth_bp.route('/login', methods=['POST'])
def user_login():
    data = request.get_json()
    login_id = data.get('login_id', '')
    password = data.get('password', '')

    user = User.query.filter_by(login_id=login_id).first()

    if user and bcrypt.check_password_hash(user.password_hash, password):
        claims = {'role': user.role, 'name': user.name}
        if user.role == 'teacher' and user.level:
            claims['assigned_level'] = user.level
            
        access_token = create_access_token(
            identity=user.login_id, 
            additional_claims=claims
        )
        return jsonify({
            'success': True,
            'role': user.role,
            'name': user.name,
            'level': user.level,
            'token': access_token
        }), 200

    return jsonify({'success': False, 'message': 'Invalid Login ID or Password'}), 401
