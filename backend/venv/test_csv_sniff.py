import csv
import io

csv_data = """Roll No\tName\tMobile No. \tfather name \tGender\tAge\tAddress\tPin Code\tLevel
\tpulak jain \t+91 95483 61996\taashish jain \tMale\t9\tpuri basti etah\t110053\tLevel 1"""

content = csv_data
stream = io.StringIO(content, newline=None)

try:
    dialect = csv.Sniffer().sniff(content[:1024])
    reader = csv.reader(stream, dialect)
except csv.Error:
    stream.seek(0)
    reader = csv.reader(stream)

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
        elif not h_clean:
            h_clean = 'unknown' # handle empty headers
        normalized_headers.append(h_clean)
    
    print("Normalized headers:", normalized_headers)
    csv_input = csv.DictReader(stream, fieldnames=normalized_headers, dialect=dialect if 'dialect' in locals() else 'excel')
    for row in csv_input:
        print(row)
