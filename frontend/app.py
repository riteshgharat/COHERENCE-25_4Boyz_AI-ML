import streamlit as st
import plotly.graph_objects as go
import docx
import PyPDF2
import re

# function to extract text from PDF
def extract_text_from_pdf(pdf_file):
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

# function to extract text from DOCX
def extract_text_from_docx(docx_file):
    doc = docx.Document(docx_file)
    text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
    return text

tech_keywords = [
    'data analysis', 'machine learning', 'sql', 'python', 'data visualization', 
    'statistical analysis', 'deep learning', 'ai', 'algorithm', 'data science',
    'tensorflow', 'keras', 'pandas', 'numpy', 'scikit-learn', 'jupyter'
]
    
achievement_keywords = [
    'increased', 'improved', 'reduced', 'optimized', 'developed', 
    'implemented', 'designed', 'led', 'managed', 'created'
]

# mock function to calc ATS score
def calculate_ats_score(resume_text):
    keyword_match = sum(keyword.lower() in resume_text.lower() for keyword in tech_keywords)
    achievement_match = sum(keyword.lower() in resume_text.lower() for keyword in achievement_keywords)
    
    keyword_score = min(keyword_match / len(tech_keywords) * 100, 100)
    achievement_score = min(achievement_match / len(achievement_keywords) * 100, 100)
    length_score = min(len(resume_text.split()) / 500 * 100, 100)
    
    ats_score = (
        keyword_score * 0.4 +  # Keywords most important
        achievement_score * 0.3 + 
        length_score * 0.3
    )
    
    return {
        'total_score': round(ats_score, 2),
        'keyword_match': round(keyword_score, 2),
        'achievements': round(achievement_score, 2),
        'resume_length': round(length_score, 2),
        'matched_keywords': [kw for kw in tech_keywords if kw.lower() in resume_text.lower()]
    }

st.set_page_config(page_title="ATS Resume Checker", layout="wide")
st.markdown(
    """
    <style>
        body { background-color: #0e0e0e; color: white; }
        .stProgress > div > div > div > div { border-radius: 10px; }
        .ai-box { background: linear-gradient(135deg, #1a1a1a, #333); padding: 15px; border-radius: 10px; margin-bottom: 10px; }
        .critical-issue { padding: 10px; border-radius: 5px; color: white; font-weight: bold; }
        .red { background-color: #ff4c4c; }
        .orange { background-color: #ffa500; }
        .green { background-color: #32cd32; }
        .upload-box { border: 2px dashed #555; border-radius: 10px; padding: 20px; background: linear-gradient(135deg, #4b0082, #8a2be2); text-align: center; color: white; }
        .sidebar-header { font-size: 20px; font-weight: bold; }
    </style>
    """,
    unsafe_allow_html=True
)

# sidebar
st.sidebar.markdown("<p class='sidebar-header'>📄 Upload Your Resume</p>", unsafe_allow_html=True)
uploaded_file = st.sidebar.file_uploader("Upload PDF or DOCX", type=["pdf", "docx"])

# main app
if uploaded_file is not None:
    if uploaded_file.name.endswith('.pdf'):
        resume_text = extract_text_from_pdf(uploaded_file)
    else:
        resume_text = extract_text_from_docx(uploaded_file)
    
    ats_analysis = calculate_ats_score(resume_text)
    ats_score = ats_analysis['total_score']
    
    critical_issues = []
    if ats_analysis['keyword_match'] < 50:
        critical_issues.append((
            "Missing key industry keywords", 
            f"Add keywords like: {', '.join(set(tech_keywords) - set(ats_analysis['matched_keywords']))}", 
            "red"
        ))
    
    if ats_analysis['achievements'] < 50:
        critical_issues.append((
            "Weak Achievement Descriptions", 
            "Use more quantitative achievement language", 
            "orange"
        ))
    
    if len(resume_text.split()) > 500:
        critical_issues.append((
            "Strong Resume Content", 
            "Your resume has comprehensive content", 
            "green"
        ))
    
    # layout
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.subheader("📊 Your ATS Score")
        fig = go.Figure(go.Indicator(
            mode="gauge+number",
            value=ats_score,
            title={"text": "ATS Score"},
            gauge={
                "axis": {"range": [0, 100]},
                "bar": {"color": "#1E90FF"},
                "steps": [
                    {"range": [0, 50], "color": "#ff4c4c"},
                    {"range": [50, 75], "color": "#ffa500"},
                    {"range": [75, 100], "color": "#32cd32"},
                ]
            }
        ))
        st.plotly_chart(fig, use_container_width=True)
        st.markdown(f"<div class='ai-box'>Matched Keywords: {len(ats_analysis['matched_keywords'])}</div>", unsafe_allow_html=True)
    
    with col2:
        st.subheader("🤖 AI-Generated Suggestions")
        st.markdown(f"<div class='ai-box'><b>Your Resume:</b> {uploaded_file.name}</div>", unsafe_allow_html=True)
        
        for title, message, color in critical_issues:
            st.markdown(f"<div class='critical-issue {color}'>{title}<br>{message}</div>", unsafe_allow_html=True)
    
    st.subheader("📌 Key Metrics")
    metrics = {
        "Keyword Match": ats_analysis['keyword_match'],
        "Achievement Language": ats_analysis['achievements'],
        "Resume Length": ats_analysis['resume_length']
    }
    
    for metric, value in metrics.items():
        st.text(f"{metric}: {value}%")
        st.progress(value / 100)
    
    st.subheader("🏷 Matched Keywords")
    st.write(", ".join(ats_analysis['matched_keywords']) or "No keywords found")

else:
    st.markdown("""
    <div class='upload-box'>
        <h2>📤 Upload Your Resume</h2>
        <p>Analyze your resume's ATS compatibility instantly!</p>
    </div>
    """, unsafe_allow_html=True)

st.markdown("<br><center>🤖 Powered by AI Resume Analysis</center>", unsafe_allow_html=True)