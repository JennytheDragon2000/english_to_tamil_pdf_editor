import requests

# Replace 'your_pdf_file.pdf' with the path to your PDF file
file_path = '/home/jenny/Downloads/PDF/public/blank-Pdf.pdf'
url = 'http://localhost:5000/upload'

# Prepare the file to be sent
files = {'file': open(file_path, 'rb')}

# Send the POST request
response = requests.post(url, files=files)

# Save the modified PDF
with open('modified.pdf', 'wb') as f:
    f.write(response.content)

