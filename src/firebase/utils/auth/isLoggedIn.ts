/**
 * Checks if a user is logged in by verifying the session cookie.
 *
 * @param {string} cookie - The session cookie to verify.
 * @returns {Promise<boolean>} - A promise that resolves to true if the user is logged in, otherwise false.
 * @throws {Error} - If an error occurs during the verification of the session cookie.
 */
import { getAuth } from "firebase-admin/auth";
import { getApp } from "@/firebase/server";

async function isLoggedIn(cookie: string): Promise<boolean> {
  const app = getApp();
  if (!app) {
    console.warn("Firebase Admin not available. Cannot verify login status.");
    return false;
  }

  const auth = getAuth(app);

  if (cookie) {
    try {
      const decodedCookie = await auth.verifySessionCookie(cookie);
      if (decodedCookie) {
        return true; // if session cookie is valid, return true
      }
    } catch (error) {
      console.error("Error verifying session cookie:", error);
      // You can handle/log the error as required.
    }
  }

  return false;
}
export default isLoggedIn;
