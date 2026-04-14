import { getApps, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDtccFVulVM9MpVD8_GiV_9-wjE4_7-1jc",
  authDomain: "segal-build-app.firebaseapp.com",
  projectId: "segal-build-app",
  storageBucket: "segal-build-app.firebasestorage.app",
  messagingSenderId: "24566954697",
  appId: "1:24566954697:web:ce7854cfca774527b1eb18",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const db = getFirestore(app);
export default app;
