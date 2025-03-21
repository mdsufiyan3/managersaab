import { NextResponse } from 'next/server';
import { db } from '../../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const trackingId = searchParams.get('trackingId');

  if (!trackingId) {
    return NextResponse.json(
      { error: 'Tracking ID is required' },
      { status: 400 }
    );
  }

  try {
    const trackingRef = doc(db, 'tracking', trackingId);
    const trackingDoc = await getDoc(trackingRef);

    if (!trackingDoc.exists()) {
      return NextResponse.json(
        { error: 'Tracking information not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: trackingDoc.id,
      ...trackingDoc.data()
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tracking information' },
      { status: 500 }
    );
  }
}
