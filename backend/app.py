from flask import Flask, request, jsonify
import spacy
from gensim import corpora
from gensim.models import LdaModel
import numpy as np
import re

app = Flask(__name__)

from PyPDF2 import PdfReader
import os
# import spacy
# from gensim import corpora
# from gensim.models import LdaModel
# import numpy as np

nlp = spacy.load("en_core_web_sm")

folder_path = "./uploads"
resumes = []
for filename in os.listdir(folder_path):
    if filename.endswith(".pdf"):
        reader = PdfReader(os.path.join(folder_path, filename))
        text = ""
        for page in reader.pages:
            text += page.extract_text()
        resumes.append(text.strip())


import re

def clean_resume(text):
    if not text.strip():  
        return None
    # Remove Unicode icons and extra whitespace
    text = re.sub(r'[\uf000-\uf8ff]', '', text)  
    text = re.sub(r'\s+', ' ', text)  
    return text.strip()

cleaned_resumes = [clean_resume(resume) for resume in resumes if clean_resume(resume)]


def preprocess_resume(resume):
    doc = nlp(resume)
    entities = [ent.text for ent in doc.ents if ent.label_ in ["ORG", "DATE", "PERSON", "GPE"]]
    tokens = [token.text.lower() for token in doc if not token.is_stop and not token.is_punct]
    return entities + tokens

processed_resumes = [preprocess_resume(resume) for resume in cleaned_resumes]

# Create dictionary and corpus
dictionary = corpora.Dictionary(processed_resumes)
corpus = [dictionary.doc2bow(text) for text in processed_resumes]

# Train LDA model
num_topics = 3
lda_model = LdaModel(corpus=corpus, id2word=dictionary, num_topics=num_topics, passes=10, random_state=42)

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

# API endpoint to rate resumes
@app.route('/rate_resumes', methods=['POST'])
def rate_resumes():
    data = request.get_json()
    if not data or 'job_requirement' not in data:
        return jsonify({"error": "Missing 'job_requirement' in request body"}), 400

    job_requirement = data['job_requirement']
    if not job_requirement.strip():
        return jsonify({"error": "Job requirement cannot be empty"}), 400

    # Process job requirement
    job_processed = preprocess_resume(job_requirement)
    job_bow = dictionary.doc2bow(job_processed)
    job_topics = lda_model[job_bow]

    # Score resumes
    resume_scores = []
    for i, (resume, resume_bow) in enumerate(zip(cleaned_resumes, corpus)):
        score = calculate_score(resume_bow, job_topics, num_topics)
        resume_scores.append({
            "resume_id": f"Resume {i+1}",
            "preview": resume[:50] + "...",
            "score": round(score, 2)
        })

    # Return results as JSON
    response = {
        "job_requirement": job_requirement,
        "resume_count": len(cleaned_resumes),
        "results": resume_scores
    }
    return jsonify(response), 200

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "API is running", "resume_count": len(cleaned_resumes)}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)