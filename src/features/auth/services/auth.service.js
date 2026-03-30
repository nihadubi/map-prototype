import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../../../config/firebase';

export async function signUpWithEmail({ email, password, displayName }) {
  console.info('[CityLayer Auth] createUserWithEmailAndPassword', { email });
  const credentials = await createUserWithEmailAndPassword(auth, email, password);

  if (displayName) {
    await updateProfile(credentials.user, { displayName });
  }

  return credentials.user;
}

export async function loginWithEmail({ email, password }) {
  console.info('[CityLayer Auth] signInWithEmailAndPassword', { email });
  const credentials = await signInWithEmailAndPassword(auth, email, password);
  return credentials.user;
}

export async function logoutUser() {
  await signOut(auth);
}
