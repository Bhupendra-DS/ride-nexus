import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "./firebase";

export const getTotalUsers = async () => {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.size;
};

export const getTotalCars = async () => {
  const snapshot = await getDocs(collection(db, "cars"));
  return snapshot.size;
};

export const getTotalBookings = async () => {
  const snapshot = await getDocs(collection(db, "bookings"));
  return snapshot.size;
};

export const getPendingBookings = async () => {
  const q = query(
    collection(db, "bookings"),
    where("status", "==", "pending")
  );

  const snapshot = await getDocs(q);
  return snapshot.size;
};

export const getRevenue = async () => {
  const approvedQuery = query(
    collection(db, "bookings"),
    where("status", "==", "approved"),
  );
  const snapshot = await getDocs(approvedQuery);

  let revenue = 0;

  snapshot.forEach((d) => {
    const data = d.data();
    revenue += data.totalPrice || 0;
  });

  return revenue;
};

export const getPendingCars = async () => {
  const q = query(collection(db, "cars"), where("status", "==", "pending"));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
};

export const getRecentBookings = async () => {
  const q = query(
    collection(db, "bookings"),
    orderBy("createdAt", "desc"),
    limit(5),
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
};

export const getAllUsers = async () => {
  const snapshot = await getDocs(collection(db, "users"));

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
};

export const updateBookingStatus = async (bookingId, status) => {
  const ref = doc(db, "bookings", bookingId);
  await updateDoc(ref, { status });
};

export const updateCarStatus = async (carId, status) => {
  const ref = doc(db, "cars", carId);
  await updateDoc(ref, { status });
};

