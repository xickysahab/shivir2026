from app import create_app
from model import AuditLog
app = create_app()
with app.app_context():
    def test_filter():
        from sqlalchemy import or_
        q = AuditLog.query
        search_pattern = "%admin%"
        q = q.filter(or_(
            AuditLog.user_name.ilike(search_pattern),
            AuditLog.details.ilike(search_pattern)
        ))
        print("Count:", q.count())
    test_filter()
