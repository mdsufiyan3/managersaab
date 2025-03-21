import { 
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  WhereFilterOp,
  setDoc,
  serverTimestamp
} from '@firebase/firestore';
import { db } from './config';

export const getDocument = async (collectionName: string, docId: string) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    throw error;
  }
};

export const getCollection = async (collectionName: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw error;
  }
};

export const addDocument = async (collectionName: string, data: any) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const updateDocument = async (collectionName: string, docId: string, data: any) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
  } catch (error) {
    throw error;
  }
};

export const deleteDocument = async (collectionName: string, docId: string) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error) {
    throw error;
  }
};

export const queryDocuments = async (
  collectionName: string,
  field: string,
  operator: WhereFilterOp,
  value: any
) => {
  try {
    const q = query(collection(db, collectionName), where(field, operator, value));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw error;
  }
};

export const saveOnboardingData = async (userId: string, data: any, isPartial = false) => {
  try {
    const onboardingRef = doc(db, 'users', userId);
    
    // Update the user document
    await setDoc(onboardingRef, {
      onboardingData: data,
      onboardingCompleted: !isPartial,
      updatedAt: serverTimestamp(),
      lastStepCompleted: data.currentStep || 1
    }, { merge: true });
    
    // Only create public profile if we have complete personal info
    if (data.personalInfo && !isPartial) {
      const publicProfileRef = doc(db, 'publicProfiles', userId);
      await setDoc(publicProfileRef, {
        displayName: `${data.personalInfo.firstName} ${data.personalInfo.lastName}`,
        businessName: data.personalInfo.companyName || '',
        businessType: data.personalInfo.businessType,
        city: data.courierServices?.pickupCity || '',
        country: data.courierServices?.pickupCountry || 'IN',
        createdAt: serverTimestamp()
      }, { merge: true });
    }

    return true;
  } catch (error) {
    console.error('Error saving onboarding data:', error);
    throw error;
  }
};

export { doc };
