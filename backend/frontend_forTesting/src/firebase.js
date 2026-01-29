import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBFBak1n1SbsnVCBdkQiH01v8S2_qpgYUY",
  authDomain: "microgrid-cc545.firebaseapp.com",
  projectId: "microgrid-cc545",
  storageBucket: "microgrid-cc545.firebasestorage.app",
  messagingSenderId: "227920222053",
  appId: "1:227920222053:web:17bf7077ff2ac40380338c",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
