import { NextResponse } from 'next/server';
import { db } from '../../../firebase/config';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    );
  }

  try {
    const paymentsRef = collection(db, 'payments');
    const q = query(paymentsRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    
    const payments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(payments);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch payment history' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.userId || !body.amount || !body.method) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const paymentData = {
      ...body,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'payments'), paymentData);

    return NextResponse.json({
      message: 'Payment initiated successfully',
      paymentId: docRef.id
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
}
