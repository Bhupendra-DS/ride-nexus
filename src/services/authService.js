import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const signupUser = async (name, email, password, role) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    name: name,
    email: email,
    role: role,
    tripsCount: 0,
    carsCount: 0,
    createdAt: new Date()
  });

  return user;
};

export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return userCredential.user;
};

/**
 * Full profile from Firestore (name + role + email).
 * Used so UI shows the name saved at signup, not only Firebase Auth displayName.
 */
export const getUserProfile = async (uid) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  const d = docSnap.data();
  return {
    role: d.role,
    name: typeof d.name === "string" ? d.name.trim() : "",
    email: typeof d.email === "string" ? d.email : "",
  };
};

export const getUserRole = async (uid) => {
  const profile = await getUserProfile(uid);
  return profile?.role ?? null;
};

/** Ends Firebase session (clears persisted auth). Always call when logging out. */
export const signOutUser = () => signOut(auth);

