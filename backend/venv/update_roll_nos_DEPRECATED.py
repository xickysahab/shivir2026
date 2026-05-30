from app import create_app
from extensions import db
from model import Student
import re

app = create_app()

def get_prefix(level):
    level_map = {
        'Level 1': 'A',
        'Level 2': 'B',
        'Level 3': 'C',
        'Level 4': 'D',
        'Level 5': 'E',
        'प्रौढ़ कक्षा': 'P'
    }
    if not level: return 'A'
    cleaned = str(level).replace('Level -', 'Level ').strip()
    return level_map.get(cleaned, 'A')

with app.app_context():
    students = Student.query.all()
    
    # Sort students by their name alphabetically to assign roll numbers in alphabetical order
    students.sort(key=lambda s: str(s.name).strip().lower() if s.name else '')
    
    prefix_groups = {}
    for s in students:
        prefix = get_prefix(s.level)
        if prefix not in prefix_groups:
            prefix_groups[prefix] = []
        prefix_groups[prefix].append(s)
        
    import uuid
    for prefix, group in prefix_groups.items():
        for s in group:
            s.roll_no = f"temp_{uuid.uuid4().hex}"
            
    db.session.flush()
    
    updated_count = 0
    for prefix, group in prefix_groups.items():
        for i, s in enumerate(group):
            new_roll = f"{prefix}{i + 1}"
            print(f"Updating {s.name} (Level: {s.level}): -> {new_roll}")
            s.roll_no = new_roll
            updated_count += 1
            
    db.session.commit()
    print(f"Successfully updated {updated_count} students with new prefix-based roll numbers.")
