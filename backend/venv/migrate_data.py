import os
import sys
from sqlalchemy import create_engine, MetaData
from dotenv import load_dotenv
from app import create_app
from extensions import db

# Load environment variables
load_dotenv()

def migrate():
    local_db_url = os.environ.get("DATABASE_URL")
    render_db_url = os.environ.get("RENDER_EXTERNAL_DB_URL")

    if not local_db_url:
        print("ERROR: DATABASE_URL is not set in your .env file.")
        sys.exit(1)

    if not render_db_url:
        print("\n" + "="*70)
        print("ERROR: RENDER_EXTERNAL_DB_URL is empty in your .env file!")
        print("Please copy the 'External Database URL' from your Render PostgreSQL page,")
        print("paste it in backend/venv/.env under RENDER_EXTERNAL_DB_URL, and try again.")
        print("="*70 + "\n")
        sys.exit(1)

    # Standardize Render connection string from postgres:// to postgresql:// for SQLAlchemy
    if render_db_url.startswith("postgres://"):
        render_db_url = render_db_url.replace("postgres://", "postgresql://", 1)

    print("Setting up engines...")
    print(f"Local DB: {local_db_url}")
    # Hide password in logs
    safe_render_url = render_db_url.split('@')[-1] if '@' in render_db_url else render_db_url
    print(f"Render DB (External Host): {safe_render_url}")

    local_engine = create_engine(local_db_url)
    render_engine = create_engine(render_db_url)

    # Create app context to load models into SQLAlchemy metadata
    app = create_app()
    with app.app_context():
        print("\nEnsuring all tables are created in the Render database...")
        db.metadata.create_all(bind=render_engine)
        
        print("Reflecting metadata from both databases...")
        local_metadata = MetaData()
        local_metadata.reflect(bind=local_engine)
        
        render_metadata = MetaData()
        render_metadata.reflect(bind=render_engine)

        # Migrate specific tables
        tables_to_migrate = ['students', 'attendance']

        with local_engine.connect() as local_conn:
            with render_engine.begin() as render_conn:
                for table_name in tables_to_migrate:
                    if table_name not in local_metadata.tables:
                        print(f"Table {table_name} not found in local DB!")
                        continue
                        
                    local_table = local_metadata.tables[table_name]
                    render_table = render_metadata.tables[table_name]
                    
                    print(f"Reading {table_name} data from local database...")
                    rows = local_conn.execute(local_table.select()).fetchall()
                    if not rows:
                        print(f"No data in local {table_name} table to migrate.")
                        continue
                    
                    # Convert to list of dicts
                    rows_dicts = [dict(row._mapping) for row in rows]
                    
                    print(f"Writing {len(rows_dicts)} records to Render {table_name} table...")
                    # Delete existing records to allow re-runs without duplication
                    render_conn.execute(render_table.delete())
                    render_conn.execute(render_table.insert(), rows_dicts)
                    print(f"Successfully migrated {table_name}!")

    print("\nData migration finished successfully! Your Render database is now up to date.")

if __name__ == '__main__':
    migrate()
