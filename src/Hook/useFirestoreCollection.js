import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../utils/Firebase";

const useFirestoreCollection = (collectionName) => {
  const [data, setData] = useState([]);
  const [loader, loaderF] = useState(true);

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, collectionName),
      (snapshot) => {
        const dataList = [];
        const transactionsList = [];

        snapshot.docs.forEach((doc) => {
          const data = { id: doc.id, ...doc.data() };
          dataList.push(data);

          // Assuming 'transactions' is the key for transactions array in user object
          if (data.transactions) {
            transactionsList.push(...data.transactions);
          }
        });

        setData(dataList);
        setTransactions(transactionsList);
        loaderF(false);
      }
      // ...error handling
    );

    return () => {
      unsubscribe();
    };
  }, [collectionName]);

  return { data, loader, transactions };
};

export default useFirestoreCollection;

// Helper function to fetch doc from Firestore
export const fetchFirestoreDataQuery = async (collectionName, user = null) => {
  try {
    const votersRef = collection(db, collectionName);
    const q = query(votersRef, where("userId", "==", user?.uid));
    const snapshot = await getDocs(q);

    // Loop through the documents and convert them to an array of data with document IDs
    const data = [];
    snapshot.forEach((doc) => {
      data.push({
        id: doc.id, // Add the document ID to the data
        ...doc.data(), // Spread the rest of the document data
      });
    });

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
