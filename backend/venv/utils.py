from flask import jsonify
from functools import wraps
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from extensions import db
from model import AuditLog

# ── Hardcoded Admin Credentials ──
ADMIN_USERNAME = 'admin'
ADMIN_PASSWORD = 'admin123'

# RBAC Decorator
def role_required(allowed_roles):
    def decorator(fn):
        @wraps(fn)
        @jwt_required()
        def wrapper(*args, **kwargs):
            claims = get_jwt()
            user_role = claims.get('role', '')
            if user_role not in allowed_roles:
                return jsonify({'success': False, 'message': 'Access forbidden: Insufficient permissions'}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator

def log_activity(action_type, details):
    claims = get_jwt()
    role = claims.get('role', 'unknown')
    name = claims.get('name') if claims.get('name') else get_jwt_identity()
    
    log = AuditLog(
        user_name=name,
        role=role,
        action_type=action_type,
        details=details
    )
    db.session.add(log)
