import { db } from "./firebase";
import { addDoc, collection, getDocs, orderBy, query } from "firebase/firestore";

export const submitQuery = async (payload) => {
  await addDoc(collection(db, "queries"), {
    ...payload,
    createdAt: new Date(),
  });
};

export const getAllQueries = async () => {
  const q = query(collection(db, "queries"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

