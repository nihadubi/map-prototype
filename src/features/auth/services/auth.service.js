import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../../../config/firebase';

export async function signUpWithEmail({ email, password, displayName }) {
  const credentials = await createUserWithEmailAndPassword(auth, email, password);

  if (displayName) {
    await updateProfile(credentials.user, { displayName });
  }

  return credentials.user;
}

export async function loginWithEmail({ email, password }) {
  const credentials = await signInWithEmailAndPassword(auth, email, password);
  return credentials.user;
}

export async function logoutUser() {
  await signOut(auth);
}
