import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyD-039ZlhhTU64DRWyCqXHynJLhQqj7BGU",
  authDomain: "fir-24b2d.firebaseapp.com",
  projectId: "fir-24b2d",
  storageBucket: "fir-24b2d.firebasestorage.app",
  messagingSenderId: "483398431336",
  appId: "1:483398431336:web:6cba6662990de5c34601dd",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, firebaseConfig };
