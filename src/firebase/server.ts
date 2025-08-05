import admin from "firebase-admin";
import type { ServiceAccount } from "firebase-admin";

// Check if we have the required environment variables
const hasRequiredEnvVars =
  import.meta.env.FIREBASE_PROJECT_ID &&
  import.meta.env.FIREBASE_PRIVATE_KEY &&
  import.meta.env.FIREBASE_CLIENT_EMAIL;

// Your service account details
const serviceAccount = {
  type: "service_account",
  project_id: import.meta.env.FIREBASE_PROJECT_ID,
  private_key_id: import.meta.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: import.meta.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  client_email: import.meta.env.FIREBASE_CLIENT_EMAIL,
  client_id: import.meta.env.FIREBASE_CLIENT_ID,
  auth_uri: import.meta.env.FIREBASE_AUTH_URI,
  token_uri: import.meta.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: import.meta.env.FIREBASE_AUTH_CERT_URL,
  client_x509_cert_url: import.meta.env.FIREBASE_CLIENT_CERT_URL,
};

// Check if any apps have been initialized. If not, initialize a new app
export const app = admin.apps.length
  ? admin.app() // Use the existing app instance
  : hasRequiredEnvVars
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as ServiceAccount),
    })
  : null; // Don't initialize if credentials are missing

// Export a safe getter for the app
export const getApp = () => {
  if (!app) {
    console.warn(
      "Firebase Admin not initialized. Please configure your service account credentials."
    );
    return null;
  }
  return app;
};
