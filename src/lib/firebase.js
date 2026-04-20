/**
 * @file firebase.js
 * @description Google Firebase initialization and analytics utility.
 * 
 * PRODUCTION SCALING COMMENTARY (GCP):
 * In a production environment, the data logged here via `logEvent` is ingested by 
 * Google Analytics and automatically exported to BigQuery for real-time analysis.
 * Cloud Functions can be triggered by these events to scale GCP resources 
 * (like Cloud Run or GKE) or to dispatch Firebase Cloud Messaging (FCM) 
 * alerts for emergency crowd-management protocols.
 */

import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent as firebaseLogEvent } from "firebase/analytics";

// Placeholder configuration for FlowState Arena
const firebaseConfig = {
    apiKey: "AIzaSy_PLACEHOLDER_KEY",
    authDomain: "flowstate-arena.firebaseapp.com",
    projectId: "flowstate-arena",
    storageBucket: "flowstate-arena.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456",
    measurementId: "G-ABCEDFG123"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

/**
 * Logs context-aware events to Google Analytics.
 * @param {string} eventName - Name of the event (e.g., 'crowd_surge_detected').
 * @param {Object} params - Additional metadata for the event.
 */
export const logEvent = (eventName, params) => {
    if (analytics) {
        firebaseLogEvent(analytics, eventName, params);
    }
    console.log(`[GCP Signal] Event logged: ${eventName}`, params);
};

export default app;
