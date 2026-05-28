import os
import sys
from dotenv import load_dotenv
from app import create_app
from extensions import db, bcrypt
from model import User

# Load environment variables from .env
load_dotenv()

def seed_database(db_url, db_name):
    # Standardize connection string from postgres:// to postgresql:// for SQLAlchemy
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)

    print(f"\nConnecting to {db_name}...")
    
    # Temporarily override configuration for app context
    app = create_app()
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url

    with app.app_context():
        # Check if admin user already exists
        existing_admin = User.query.filter_by(login_id='admin').first()
        
        # Generate bcrypt password hash
        password = "shivir$2026"
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        if existing_admin:
            print(f"Admin user already exists in {db_name}. Updating password...")
            existing_admin.password_hash = hashed_password
            existing_admin.name = "Super Admin"
            existing_admin.phone = "9999999999"
            existing_admin.role = "admin"
        else:
            print(f"Creating new Admin user in {db_name}...")
            admin_user = User(
                name="Super Admin",
                phone="9999999999",
                login_id="admin",
                password_hash=hashed_password,
                role="admin"
            )
            db.session.add(admin_user)
            
        try:
            db.session.commit()
            print(f"SUCCESS: Admin account seeded successfully in {db_name}!")
        except Exception as e:
            db.session.rollback()
            print(f"ERROR seeding {db_name}: {e}")

def main():
    local_db_url = os.environ.get("DATABASE_URL")
    render_db_url = os.environ.get("RENDER_EXTERNAL_DB_URL")

    if not local_db_url:
        print("ERROR: DATABASE_URL is not set in your .env file.")
        sys.exit(1)

    # Seed local database
    seed_database(local_db_url, "LOCAL Database")

    # Seed Render database (if configured)
    if render_db_url:
        seed_database(render_db_url, "RENDER Database")
    else:
        print("\nWARNING: RENDER_EXTERNAL_DB_URL is not configured in .env. Skipping Render DB seeding.")

if __name__ == '__main__':
    main()
