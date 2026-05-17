import os
import re
import json
import pdfplumber

BASE_DIR = r"C:\Users\Jaloliddin\Desktop\exam materials"
DATA_DIR = r"c:\Users\Jaloliddin\.gemini\antigravity\scratch\cefrprep\src\data"
OUTPUT_FILE = os.path.join(DATA_DIR, "mocks_data.json")
MAPPING_FILE = os.path.join(DATA_DIR, "mock_mapping.json")

def extract_all_text(full_path):
    segments = {"listening": [], "reading": [], "answers": {}}
    try:
        with pdfplumber.open(full_path) as pdf:
            all_text = ""
            for i, page in enumerate(pdf.pages):
                text = page.extract_text() or ""
                # Detect Answer sheet
                if "ANSWER SHEET" in text.upper() or (i == len(pdf.pages) - 1 and ("LISTENING" in text.upper() or "READING" in text.upper())):
                    segments["answers_text"] = text
                all_text += f"\n---PAGE {i+1}---\n" + text

            # Split by Paper headings
            papers = re.split(r'PAPER\s*[12]:\s*(LISTENING|READING)', all_text, flags=re.IGNORECASE)
            
            # This handles typical structure: [0] before L, [1] "LISTENING", [2] L text, [3] "READING", [4] R text
            if len(papers) >= 5:
                segments["listening_raw"] = papers[2]
                segments["reading_raw"] = papers[4]
            else:
                # Fallback if headings differ
                segments["listening_raw"] = all_text

            # Further split into Parts
            segments["listening_parts"] = re.split(r'PART\s*[1-6]', segments.get("listening_raw", ""), flags=re.IGNORECASE)[1:]
            segments["reading_parts"] = re.split(r'PART\s*[1-5]', segments.get("reading_raw", ""), flags=re.IGNORECASE)[1:]
            
            return segments
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return segments

def extract_keys(text):
    if not text: return {"listening": {}, "reading": {}}
    keys = {"listening": {}, "reading": {}}
    
    # Simple strategy: find numbers sequence
    lines = text.split('\n')
    current_section = "listening"
    for line in lines:
        if "READING" in line.upper(): current_section = "reading"
        
        match = re.search(r'(\d+)\.\s*([A-Za-z\(\)\/\s\-]+)', line)
        if match:
            num = match.group(1)
            val = match.group(2).strip()
            if int(num) <= 35:
                keys[current_section][num] = val
    return keys

def clean_passage(text):
    if not text: return ""
    # Remove junk headers
    junk = [
        r"CEFR\s*academy", r"Page\s*\d+\s*of\s*\d+", r"GO\s*TO\s*THE\s*NEXT\s*PAGE", 
        r"DO\s*NOT\s*TURN\s*OVER", r"GOOD\s*LUCK", r"STUDENT\s*NAME", r"DATE:",
        r"Instructions:.*?\n", r"Read the text.*?\n"
    ]
    for pattern in junk:
        text = re.sub(pattern, "", text, flags=re.IGNORECASE)
    
    # Strip excessive newlines
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

def run():
    if not os.path.exists(MAPPING_FILE):
        print("Mapping file missing!")
        return

    with open(MAPPING_FILE, 'r') as f:
        mapping = json.load(f)

    final_mocks = {}

    for display_id, source_id in mapping.items():
        folder_name = f"mock {source_id}"
        folder_path = os.path.join(BASE_DIR, folder_name)
        
        pdf_file = next((f for f in os.listdir(folder_path) if f.endswith(".pdf")), None)
        if not pdf_file: continue
        
        print(f"Deep cleaning Mock {display_id}...")
        full_path = os.path.join(folder_path, pdf_file)
        
        data = extract_all_text(full_path)
        keys = extract_keys(data.get("answers_text", ""))
        
        final_mocks[display_id] = {
            "title": f"CEFR Mock Exam #{display_id}",
            "listening": [clean_passage(p) for p in data.get("listening_parts", [])],
            "reading": [clean_passage(p) for p in data.get("reading_parts", [])],
            "keys": keys
        }

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(final_mocks, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    run()
