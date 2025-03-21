import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  User,
  GithubAuthProvider,
  OAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';

// Helper function to save user data to Firestore
const saveUserToFirestore = async (user: User, additionalData = {}) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        ...additionalData
      };

      await setDoc(userRef, userData);
    } else {
      // Update last login time
      await setDoc(userRef, {
        lastLogin: serverTimestamp()
      }, { merge: true });
    }
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};

export const signUp = async (email: string, password: string, additionalData = {}) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Save user data to Firestore
    await saveUserToFirestore(user, additionalData);
    
    return user;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Save Google user data to Firestore
    await saveUserToFirestore(user, {
      authProvider: 'google',
      // You can add more Google-specific data here
      googleData: {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }
    });

    return user;
  } catch (error) {
    throw error;
  }
};

export const signInWithGithub = async () => {
  try {
    const provider = new GithubAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Save GitHub user data to Firestore
    await saveUserToFirestore(user, {
      authProvider: 'github',
      githubData: {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }
    });

    return user;
  } catch (error) {
    throw error;
  }
};

export const signInWithYahoo = async () => {
  try {
    const provider = new OAuthProvider('yahoo.com');
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Save Yahoo user data to Firestore
    await saveUserToFirestore(user, {
      authProvider: 'yahoo',
      yahooData: {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }
    });

    return user;
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (user: User, data: { displayName?: string; photoURL?: string }) => {
  try {
    await updateProfile(user, data);
  } catch (error) {
    throw error;
  }
};

// New function to get user data from Firestore
export const getUserData = async (uid: string) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    
    return null;
  } catch (error) {
    throw error;
  }
};

// New function to update user data in Firestore
export const updateUserData = async (uid: string, data: any) => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    throw error;
  }
};
