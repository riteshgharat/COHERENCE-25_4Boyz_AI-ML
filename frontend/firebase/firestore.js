import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_Zgf289O5WLWuMJKZisFrNE6XTU__x5g",
  authDomain: "coherence-ai-ml.firebaseapp.com",
  projectId: "coherence-ai-ml",
  storageBucket: "coherence-ai-ml.firebasestorage.app",
  messagingSenderId: "412299809588",
  appId: "1:412299809588:web:9eb43c4dae068964298b61",
  measurementId: "G-DTMFT3LNKL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firestore
const db = getFirestore(app);

/**
 * Saves applicant data to Firestore
 * @param {Object} applicantData - The applicant data to save
 * @returns {Promise<string>} - The ID of the created document
 */
export const saveApplicantData = async (applicantData) => {
  try {
    // Add timestamp to the data
    const dataWithTimestamp = {
      ...applicantData,
      timestamp: serverTimestamp()
    };
    
    // Add document to 'applicants' collection
    const docRef = await addDoc(collection(db, "applicants"), dataWithTimestamp);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

export { db };