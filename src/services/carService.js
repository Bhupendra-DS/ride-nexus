import { db } from "./firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  increment,
} from "firebase/firestore";

const carsCollection = collection(db, "cars");

export const createCarListing = async (ownerId, data) => {
  const payload = {
    ownerId,
    brand: data.brand,
    model: data.model,
    city: data.city,
    seats: Number(data.seats) || 4,
    fuelType: data.fuelType,
    transmission: data.transmission,
    pricePerHour: Number(data.pricePerHour) || 0,
    status: "pending",
    rating: 0,
    trips: 0,
    image:
      data.image ||
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80",
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(carsCollection, payload);

  // Increment owner's carsCount
  await updateDoc(doc(db, "users", ownerId), {
    carsCount: increment(1),
  });

  return { id: docRef.id, ...payload };
};

export const subscribeOwnerCars = (ownerId, callback) => {
  const q = query(carsCollection, where("ownerId", "==", ownerId));
  return onSnapshot(q, (snapshot) => {
    const cars = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(cars);
  });
};

export const subscribeAllCars = (callback) => {
  return onSnapshot(carsCollection, (snapshot) => {
    const cars = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(cars);
  });
};

export const subscribeApprovedCars = (callback) => {
  const q = query(carsCollection, where("status", "==", "approved"));
  return onSnapshot(q, (snapshot) => {
    const cars = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(cars);
  });
};

export const updateCarStatus = async (carId, status) => {
  const carRef = doc(db, "cars", carId);
  await updateDoc(carRef, { status });
};

