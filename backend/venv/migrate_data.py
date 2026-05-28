import os
from sqlalchemy import create_engine, MetaData
from app import create_app
from extensions import db

local_db_url = "postgresql://aagamjain@localhost:5432/shivir2026"
supabase_url = "postgresql://postgres:Yqr8f47js8GK%40y_@db.zdolbjhajzmapasjaciq.supabase.co:5432/postgres"

def migrate():
    print("Setting up engines...")
    local_engine = create_engine(local_db_url)
    
    app = create_app()
    with app.app_context():
        # App automatically loads Supabase URL from updated .env
        supa_engine = db.engine
        
        print(f"Connected to Supabase engine: {supa_engine.url}")
        print("Ensuring tables exist in Supabase...")
        db.create_all()
        
        print("Reflecting metadata from both databases...")
        local_metadata = MetaData()
        local_metadata.reflect(bind=local_engine)
        
        supa_metadata = MetaData()
        supa_metadata.reflect(bind=supa_engine)

        tables_to_migrate = ['students', 'attendance']

        with local_engine.connect() as local_conn:
            with supa_engine.begin() as supa_conn:
                for table_name in tables_to_migrate:
                    if table_name not in local_metadata.tables:
                        print(f"Table {table_name} not found in local DB!")
                        continue
                        
                    local_table = local_metadata.tables[table_name]
                    supa_table = supa_metadata.tables[table_name]
                    
                    print(f"Reading {table_name} from local...")
                    rows = local_conn.execute(local_table.select()).fetchall()
                    if not rows:
                        print(f"No data in {table_name}.")
                        continue
                    
                    # Convert to list of dicts
                    rows_dicts = [dict(row._mapping) for row in rows]
                    
                    print(f"Inserting {len(rows_dicts)} records into Supabase {table_name}...")
                    # Clear existing to prevent duplicate key errors if run multiple times
                    supa_conn.execute(supa_table.delete())
                    supa_conn.execute(supa_table.insert(), rows_dicts)
                    print(f"Finished migrating {table_name}.")

    print("Migration complete!")

if __name__ == '__main__':
    migrate()
