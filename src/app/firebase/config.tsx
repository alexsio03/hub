import { initializeApp } from "firebase/app"

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    // The value of `databaseURL` depends on the location of the database
    // databaseURL: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_NEXT_PUBLIC_FIREBASE_APP_ID,
    // For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

export const app = initializeApp(firebaseConfig);

export const initFirebase = () => {
    return app;
}