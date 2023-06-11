import React, { useState, useEffect } from 'react';
import db from '../firebase.tsx';
import { collection, getDocs, deleteDoc, query,where, doc } from 'firebase/firestore';

interface Pair {
  name1: string;
  name2: string;
  id: string; // Add an ID field to identify each pair
}

interface FormProps {}

const AdminPage: React.FC<FormProps> = () => {
  const [names, setNames] = useState<string[]>([]);
  const [pairs, setPairs] = useState<Pair[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Retrieve all names
      const namesCollection = collection(db, 'names');
      const namesSnapshot = await getDocs(namesCollection);
      const namesList: string[] = [];
      namesSnapshot.forEach((doc) => {
        namesList.push(doc.data().name);
      });
      setNames(namesList);

      // Retrieve all pairs
      const pairsCollection = collection(db, 'pairs');
      const pairsSnapshot = await getDocs(pairsCollection);
      const pairsList: Pair[] = [];
      pairsSnapshot.forEach((doc) => {
        const pair: Pair = {
          name1: doc.data().name1,
          name2: doc.data().name2,
          id: doc.id, // Assign the ID of each pair document
        };
        pairsList.push(pair);
      });
      setPairs(pairsList);
    };

    fetchData();
  }, []);

  const handleDeleteName = async (name: string) => {
    try {
      // Find the document in the 'names' collection with the given name
      const namesCollection = collection(db, 'names');
      const queryRef = query(namesCollection, where('name', '==', name));
      const querySnapshot = await getDocs(queryRef);

      querySnapshot.forEach(async (doc) => {
        // Delete the document
        await deleteDoc(doc.ref);
      });

      // Remove the name from the names state
      setNames((prevNames) => prevNames.filter((n) => n !== name));
    } catch (error) {
      console.error('Failed to delete name:', error);
    }
  };

  const handleDeletePair = async (pairId: string) => {
    try {
      // Delete the document in the 'pairs' collection with the given ID
      const pairsCollection = collection(db, 'pairs');
      const pairRef = doc(pairsCollection, pairId);
      await deleteDoc(pairRef);
  
      // Remove the pair from the pairs state
      setPairs((prevPairs) => prevPairs.filter((pair) => pair.id !== pairId));
    } catch (error) {
      console.error('Failed to delete pair:', error);
    }
  };

  const handleDeleteAllNames = async () => {
    try {
      // Get all documents in the 'names' collection
      const namesCollection = collection(db, 'names');
      const namesQuery = query(namesCollection);
      const namesSnapshot = await getDocs(namesQuery);

      // Delete each document one by one
      namesSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      // Clear the names state
      setNames([]);

      // Delete all documents in the 'pairs' collection
      const pairsCollection = collection(db, 'pairs');
      const pairsQuery = query(pairsCollection);
      const pairsSnapshot = await getDocs(pairsQuery);

      // Delete each document one by one
      pairsSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      // Clear the pairs state
      setPairs([]);
    } catch (error) {
      console.error('Failed to delete names and pairs:', error);
    }
  };

  return (
    <div>
      <h1>Registered Names</h1>
      <ul>
        {names.map((name, index) => (
          <li key={index}>
            {name}
            <button onClick={() => handleDeleteName(name)}>Delete</button>
          </li>
        ))}
      </ul>

      <h1>All Pairs</h1>
      <ul>
        {pairs.map((pair) => (
          <li key={pair.id}>
            {pair.name1} - {pair.name2}
            <button onClick={() => handleDeletePair(pair.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <button onClick={handleDeleteAllNames}>Delete All Names and Pairs</button>
    </div>
  );
};

export default AdminPage;
