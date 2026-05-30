import csv
import io

csv_data = """Roll No\tName\tMobile No. \tfather name \tGender\tAge\tAddress\tPin Code\tLevel
\tpulak jain \t+91 95483 61996\taashish jain \tMale\t9\tpuri basti etah\t110053\tLevel 1"""

stream = io.StringIO(csv_data)

# if delimiter is tab
reader = csv.reader(stream, delimiter='\t')
headers = next(reader, None)
if headers:
    normalized_headers = []
    for h in headers:
        h_clean = h.lower().strip().replace(' ', '_').replace('.', '')
        if 'mobile' in h_clean or 'phone' in h_clean:
            h_clean = 'mobile'
        elif 'roll' in h_clean:
            h_clean = 'roll_no'
        elif 'pin' in h_clean:
            h_clean = 'pin_code'
        elif 'father' in h_clean:
            h_clean = 'father_name'
        normalized_headers.append(h_clean)
    
    print("Normalized headers:", normalized_headers)
    csv_input = csv.DictReader(stream, fieldnames=normalized_headers, delimiter='\t')
    for row in csv_input:
        print(row)
