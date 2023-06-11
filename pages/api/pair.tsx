import { NextApiRequest, NextApiResponse } from 'next';
import { collection, getDocs, addDoc, where, query } from 'firebase/firestore';
import db from '../../firebase.tsx';

async function createPairs(name: string) {
  const namesCollection = collection(db, 'names');
  const namesSnapshot = await getDocs(namesCollection);

  // Retrieve all names
  const names = namesSnapshot.docs.map((doc) => doc.data().name);

  const pairsCollection = collection(db, 'pairs');
  const pairsSnapshot = await getDocs(pairsCollection);

  // Retrieve existing pairs
  const pairs = pairsSnapshot.docs.map((doc) => {
    const pairData = doc.data();
    return {
      name1: pairData.name1,
      name2: pairData.name2,
    };
  });

  // Check if the name is already paired
  const pairedName = pairs.find(
    (pair) => pair.name1 === name || pair.name2 === name
  );
  console.log(pairedName)
  if (pairedName) {
    const nameToReturn = pairedName.name1 === name ? pairedName.name2 : pairedName.name1;
    console.log(nameToReturn)
    return nameToReturn;
  }

  // Find an available name to pair
  const availableNames = names.filter(
    (n) => n !== name && !pairs.some((pair) => pair.name1 === n || pair.name2 === n)
  );

  if (availableNames.length > 0) {
    // Randomly select an available name to pair
    const randomIndex = Math.floor(Math.random() * availableNames.length);
    const pairedName = availableNames[randomIndex];

    // Create a new pair
    await addDoc(pairsCollection, { name1: name, name2: pairedName });
    return pairedName;
  } else {
    // No available name to pair
    return name;
  }
}

async function addNameToCollection(name: string) {
  const namesCollection = collection(db, 'names');

  // Check if the name already exists in the collection
  const querySnapshot = await getDocs(
    query(namesCollection, where('name', '==', name))
  );
  if (!querySnapshot.empty) {
    console.log('Name already exists in the collection.');
  } else {
    await addDoc(namesCollection, { name });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { name } = req.body; // Assuming the input name is passed in the request body

    if (name) {
      await addNameToCollection(name);
    }

    const pairedName = await createPairs(name);
    console.log(pairedName, "❤️❤️❤️")
    res.status(200).json({ pairedName });
  } catch (error) {
    console.error('Error creating pairs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
