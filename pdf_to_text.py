import pymupdf

def convert_pdf_to_txt(file):
    with pymupdf.open(stream=file.read(), filetype='pdf') as pdf:
        text = ''
        for page in pdf:
            text += page.get_text()
        return text