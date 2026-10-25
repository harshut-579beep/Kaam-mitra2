import zipfile
import os
import sys

def create_project_zip(output_path='kaam-mitra-project.zip'):
    exclude_dirs = {'node_modules', '.git', 'dist', '.cache', '__pycache__', '.aistudio'}
    exclude_files = {'kaam-mitra-project.zip', 'kaam-mitra-complete-project.zip'}
    
    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk('.'):
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            for file in files:
                if file not in exclude_files:
                    file_path = os.path.join(root, file)
                    arcname = os.path.relpath(file_path, '.')
                    zipf.write(file_path, arcname)
    print(f"Created {output_path} with {len(zipf.namelist())} files")

if __name__ == '__main__':
    target = sys.argv[1] if len(sys.argv) > 1 else 'kaam-mitra-project.zip'
    create_project_zip(target)
