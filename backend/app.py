from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import spacy
from gensim import corpora
from gensim.models import LdaModel
import numpy as np
import re
from PyPDF2 import PdfReader
import os
from spacy.matcher import Matcher
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


nlp = spacy.load("en_core_web_sm")  

UPLOAD_FOLDER = './uploads'
ALLOWED_EXTENSIONS = {'pdf'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


resumes = []  # List of (filename, text) 
cleaned_resumes = []  # List of (filename, cleaned_text) 
processed_resumes = []
dictionary = None
corpus = None
lda_model = None
num_topics = 3


TECH_ENTITIES = [
    "Python", "Java", "C++", "JavaScript", "PHP", "SQL", "MySQL", "MongoDB", "SQLite", "BigQuery",
    "PostgreSQL", "HTML", "CSS", "Dart", "R", "Ruby", "Swift", "Kotlin", "TypeScript",
    "NumPy", "Pandas", "SciPy", "Dask", "GeoPandas", "Sklearn", "NLTK", "OpenCV", "Keras",
    "TensorFlow", "Pytorch", "AzureML", "Matplotlib", "Seaborn", "Plotly", "Flask", "Django",
    "Node.js", "React", "Flutter", "Bootstrap", "CodeIgniter", "REST API", "WebRTC", "MLOps",
    "Docker", "Kubernetes", "Kubeflow", "AWS", "GCP", "Azure", "Google Colab", "Heroku",
    "Jupyter", "Git", "Github", "VSCode", "Machine Learning", "Deep Learning", "NLP",
    "Computer Vision", "Data Engineering", "IoT", "Cloud Computing", "AutoCAD",
]

# Initialize SpaCy matcher for tech entities
matcher = Matcher(nlp.vocab)
for tech in TECH_ENTITIES:
    pattern = [{"LOWER": tech.lower()}]
    matcher.add(tech, [pattern])

# Helper function to check file extension
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def load_initial_resumes():
    global resumes, cleaned_resumes, processed_resumes, dictionary, corpus, lda_model
    resumes = []
    for filename in os.listdir(app.config['UPLOAD_FOLDER']):
        if filename.endswith(".pdf"):
            reader = PdfReader(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            text = ""
            for page in reader.pages:
                text += page.extract_text()
            resumes.append((filename, text.strip()))
    process_resumes()

# Clean resumes
def clean_resume(text):
    if not text.strip():
        return None
    text = re.sub(r'[\uf000-\uf8ff]', '', text) 
    text = re.sub(r'\s+', ' ', text) 
    return text.strip()

# Preprocess with SpaCy
def preprocess_resume(resume):
    doc = nlp(resume)
    entities = [ent.text for ent in doc.ents if ent.label_ in ["ORG", "DATE", "PERSON", "GPE"]]
    tokens = [token.text.lower() for token in doc if not token.is_stop and not token.is_punct]
    return entities + tokens

# Process and train LDA model
def process_resumes():
    global cleaned_resumes, processed_resumes, dictionary, corpus, lda_model
    cleaned_resumes = [(filename, clean_resume(text)) for filename, text in resumes if clean_resume(text)]
    processed_resumes = [preprocess_resume(text) for _, text in cleaned_resumes]
    if processed_resumes:
        dictionary = corpora.Dictionary(processed_resumes)
        corpus = [dictionary.doc2bow(text) for text in processed_resumes]
        lda_model = LdaModel(corpus=corpus, id2word=dictionary, num_topics=num_topics, passes=10, random_state=42)
    else:
        dictionary, corpus, lda_model = None, None, None

# Scoring function
def calculate_score(resume_bow, job_topics, num_topics):
    resume_topics = lda_model[resume_bow]
    resume_vec = [0] * num_topics
    for topic_id, prob in resume_topics:
        resume_vec[topic_id] = prob
    job_vec = [0] * num_topics
    for topic_id, prob in job_topics:
        job_vec[topic_id] = prob
    dot_product = np.dot(resume_vec, job_vec)
    norm_resume = np.linalg.norm(resume_vec)
    norm_job = np.linalg.norm(job_vec)
    km = dot_product / (norm_resume * norm_job if norm_resume * norm_job != 0 else 1)
    wm = max(resume_vec)
    final_score = km * wm
    mean, sd = 0.5, 0.1
    diff = (final_score - mean) / sd
    return min(10, max(0, 5 + diff))


# Load initial resumes on startup
load_initial_resumes()


@app.route('/upload', methods=['POST'])
def upload_resumes():
    if 'files' not in request.files:
        return jsonify({"error": "No files part in the request"}), 400
    
    files = request.files.getlist('files')
    if not files or all(file.filename == '' for file in files):
        return jsonify({"error": "No files selected"}), 400

    uploaded_files = []
    skipped_files = []
    for file in files:
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            
            if os.path.exists(file_path):
                skipped_files.append(filename)
                continue
            
            file.save(file_path)
            reader = PdfReader(file_path)
            text = ""
            for page in reader.pages:
                text += page.extract_text()
            resumes.append((filename, text.strip()))
            uploaded_files.append(filename)
        else:
            return jsonify({"error": f"Invalid file type: {file.filename}. Only PDFs are allowed."}), 400

    if uploaded_files:
        process_resumes()

    response = {
        "message": "Upload processed",
        "uploaded_files": uploaded_files,
        "skipped_files": skipped_files,
        "resume_count": len(cleaned_resumes)
    }
    return jsonify(response), 201 if uploaded_files else 200

# Delete endpoint
@app.route('/delete', methods=['POST'])
def delete_resume():
    data = request.get_json()
    if not data or 'filename' not in data:
        return jsonify({"error": "Missing 'filename' in request body"}), 400

    filename = secure_filename(data['filename'])
    if not filename.endswith('.pdf'):
        return jsonify({"error": "Invalid file type. Only PDFs can be deleted."}), 400

    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    
    if not os.path.exists(file_path):
        return jsonify({"error": f"File '{filename}' not found"}), 404

    os.remove(file_path)
    global resumes
    resumes = [(fname, text) for fname, text in resumes if fname != filename]
    process_resumes()

    return jsonify({
        "message": f"File '{filename}' deleted successfully",
        "resume_count": len(cleaned_resumes)
    }), 200

# Extract technical entities endpoint
@app.route('/extract_tech', methods=['GET'])
def extract_tech_entities():
    if not cleaned_resumes:
        return jsonify({"error": "No resumes available"}), 400

    tech_entities_per_resume = []
    for i, (filename, resume) in enumerate(cleaned_resumes):
        doc = nlp(resume)
        matches = matcher(doc)
        tech_entities = set()
        for match_id, start, end in matches:
            tech_entities.add(doc[start:end].text)
        tech_entities_per_resume.append({
            "resume_id": f"Resume {i+1}",
            "filename": filename,
            "tech_entities": list(tech_entities)
        })

    response = {
        "resume_count": len(cleaned_resumes),
        "results": tech_entities_per_resume
    }
    return jsonify(response), 200

# Rate resumes endpoint with filenames
@app.route('/rate_resumes', methods=['POST'])
def rate_resumes():
    if not cleaned_resumes:
        return jsonify({"error": "No resumes available to rate"}), 400

    data = request.get_json()
    if not data or 'job_requirement' not in data:
        return jsonify({"error": "Missing 'job_requirement' in request body"}), 400

    job_requirement = data['job_requirement']
    if not job_requirement.strip():
        return jsonify({"error": "Job requirement cannot be empty"}), 400

    job_processed = preprocess_resume(job_requirement)
    job_bow = dictionary.doc2bow(job_processed)
    job_topics = lda_model[job_bow]

    resume_scores = []
    for i, ((filename, resume), resume_bow) in enumerate(zip(cleaned_resumes, corpus)):
        score = calculate_score(resume_bow, job_topics, num_topics)
        resume_scores.append({
            "resume_id": f"Resume {i+1}",
            "filename": filename,
            "score": round(score, 2)
        })

    response = {
        "job_requirement": job_requirement,
        "resume_count": len(cleaned_resumes),
        "results": resume_scores
    }
    return jsonify(response), 200



@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "API is running", "resume_count": len(cleaned_resumes)}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)