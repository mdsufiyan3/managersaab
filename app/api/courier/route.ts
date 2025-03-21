import { NextResponse } from 'next/server';
import { db } from '../../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export async function GET() {
  try {
    const couriersRef = collection(db, 'couriers');
    const snapshot = await getDocs(couriersRef);
    const couriers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(couriers);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch couriers' },
      { status: 500 }
    );
  }
}
