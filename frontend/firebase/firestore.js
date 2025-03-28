import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  serverTimestamp 
} from "firebase/firestore";

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

/**
 * Fetches all applicants from Firestore
 * @returns {Promise<Array>} - Array of applicant documents with their IDs
 */
export const getAllApplicants = async () => {
  try {
    const applicantsRef = collection(db, "applicants");
    const snapshot = await getDocs(applicantsRef);
    
    // Map over documents to include both ID and data
    const applicants = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore timestamp to JS Date if it exists
      timestamp: doc.data().timestamp?.toDate() || new Date()
    }));
    
    // Sort by timestamp (newest first)
    applicants.sort((a, b) => b.timestamp - a.timestamp);
    
    return applicants;
  } catch (error) {
    console.error("Error fetching applicants:", error);
    throw error;
  }
};

export { db };