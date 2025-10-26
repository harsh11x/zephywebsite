import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

// Check if required environment variables are set
const projectId = process.env.FIREBASE_PROJECT_ID
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

let app: any = null
let auth: any = null

if (projectId && clientEmail && privateKey) {
  const firebaseAdminConfig = {
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  }
  
  app = getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApps()[0]
  auth = getAuth(app)
} else {
  console.warn('Firebase Admin SDK environment variables not set. Authentication features will not work.')
  // Create a mock auth object for build purposes
  auth = {
    verifyIdToken: async () => {
      throw new Error('Firebase Admin not configured')
    }
  }
}

export { auth }
