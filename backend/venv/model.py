from datetime import datetime, timezone
from extensions import db


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    login_id = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), nullable=False)          # 'teacher' or 'mentor'
    level = db.Column(db.String(255), nullable=True)         # for teacher level assignment
    photo = db.Column(db.LargeBinary, nullable=True)         # BYTEA in PostgreSQL
    created_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    def __repr__(self):
        return f'<User {self.login_id} ({self.role})>'

class Student(db.Model):
    __tablename__ = 'students'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    roll_no = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(120), nullable=False)
    mobile = db.Column(db.String(20), nullable=False)
    father_name = db.Column(db.String(120), nullable=False)
    gender = db.Column(db.String(20), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    address = db.Column(db.Text, nullable=False)
    pin_code = db.Column(db.String(20), nullable=False)
    level = db.Column(db.String(50), nullable=False)
    points = db.Column(db.Integer, default=0, nullable=False)
    created_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    def __repr__(self):
        return f'<Student {self.roll_no} - {self.name}>'

class AuditLog(db.Model):
    __tablename__ = 'audit_logs'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_name = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(50), nullable=False)
    action_type = db.Column(db.String(100), nullable=False)
    details = db.Column(db.Text, nullable=False)
    timestamp = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    def __repr__(self):
        return f'<AuditLog {self.action_type} by {self.user_name}>'


class Attendance(db.Model):
    __tablename__ = 'attendance'
    __table_args__ = (
        db.UniqueConstraint('student_id', 'date', name='uq_student_date'),
    )

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id', ondelete='CASCADE'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(20), nullable=False)  # 'Present' or 'Absent'
    marked_by = db.Column(db.String(120), nullable=False)
    timestamp = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    student = db.relationship('Student', backref=db.backref('attendance_records', cascade='all, delete-orphan'))

    def __repr__(self):
        return f'<Attendance {self.date} - Student {self.student_id}: {self.status}>'

