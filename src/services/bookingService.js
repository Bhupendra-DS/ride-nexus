import { addDoc, collection, getDocs, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "./firebase";

export const createBooking = async (bookingData) => {
  await addDoc(collection(db, "bookings"), {
    ...bookingData,
    status: "pending",
    createdAt: new Date(),
  });

  // Increment user's tripsCount
  if (bookingData.userId) {
    await updateDoc(doc(db, "users", bookingData.userId), {
      tripsCount: increment(1),
    });
  }
};

export const getAllBookings = async () => {
  const snapshot = await getDocs(collection(db, "bookings"));

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
};

export const updateBookingStatus = async (bookingId, status) => {
  const ref = doc(db, "bookings", bookingId);

  await updateDoc(ref, {
    status,
  });
};

