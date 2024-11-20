import { initializeApp, getApps, getApp } from "firebase/app";
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyDK1Q5m_r022sTCnGWOjSXzccLN9fKP0gA",
    authDomain: "personalised-content.firebaseapp.com",
    projectId: "personalised-content",
    storageBucket: "personalised-content.firebasestorage.app",
    messagingSenderId: "453980710643",
    appId: "1:453980710643:web:8cee6b39000ef101513986",
    measurementId: "G-WPV3PH222V"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

const auth = getAuth(app)

export {app, auth}