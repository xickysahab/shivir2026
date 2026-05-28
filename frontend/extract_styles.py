import os
import re
import glob

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Match `const styles = { ... };` at the end of the file
    # We'll use a regex that looks for `const styles = {` and captures everything until the end of the file
    match = re.search(r'const styles = (\{.*\}\s*;?)\s*$', content, re.DOTALL)
    
    if match:
        styles_content = match.group(1)
        # Remove it from the original content
        new_content = content[:match.start()].strip() + '\n'
        
        # Add the import at the top
        # Find the last import line
        imports = re.findall(r'^import .*;?$', new_content, re.MULTILINE)
        import_stmt = f"import styles from './{os.path.basename(filepath).replace('.jsx', '.styles')}';"
        
        if imports:
            last_import = imports[-1]
            new_content = new_content.replace(last_import, last_import + '\n' + import_stmt, 1)
        else:
            new_content = import_stmt + '\n\n' + new_content

        # Write back the new content
        with open(filepath, 'w') as f:
            f.write(new_content)
            
        # Write the styles file
        styles_file = filepath.replace('.jsx', '.styles.js')
        with open(styles_file, 'w') as f:
            f.write(f"const styles = {styles_content}\n\nexport default styles;\n")
            
        print(f"Extracted styles from {filepath} to {styles_file}")
    else:
        print(f"No styles found in {filepath}")

if __name__ == "__main__":
    files = glob.glob('src/features/**/*.jsx', recursive=True)
    for file in files:
        process_file(file)
