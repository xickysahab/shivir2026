from flask import Blueprint, request, jsonify
from extensions import db
from model import AuditLog
from utils import role_required

logs_bp = Blueprint('logs', __name__)

@logs_bp.route('/', methods=['GET'])
@role_required(['admin'])
def get_logs():
    search = request.args.get('search', '')
    action = request.args.get('action', '')

    query = AuditLog.query

    if search:
        from sqlalchemy import or_
        search_pattern = f"%{search}%"
        query = query.filter(or_(
            AuditLog.user_name.ilike(search_pattern),
            AuditLog.role.ilike(search_pattern),
            AuditLog.action_type.ilike(search_pattern),
            AuditLog.details.ilike(search_pattern)
        ))

    if action and action != 'All':
        query = query.filter(AuditLog.action_type == action)

    logs = query.order_by(AuditLog.timestamp.desc()).all()
    log_list = [{
        'id': l.id,
        'user_name': l.user_name,
        'role': l.role,
        'action_type': l.action_type,
        'details': l.details,
        'timestamp': l.timestamp.isoformat()
    } for l in logs]
    return jsonify({'success': True, 'data': log_list}), 200


