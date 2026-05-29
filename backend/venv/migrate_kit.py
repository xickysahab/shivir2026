import os
import sys

# Change working directory to backend/venv
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from extensions import db
from sqlalchemy import text

app = create_app()

with app.app_context():
    try:
        # Add kit_received column to students table
        db.session.execute(text("ALTER TABLE students ADD COLUMN IF NOT EXISTS kit_received BOOLEAN NOT NULL DEFAULT FALSE;"))
        db.session.commit()
        print("Successfully added kit_received column to students table.")
    except Exception as e:
        print(f"Error migrating database: {e}")
        db.session.rollback()
