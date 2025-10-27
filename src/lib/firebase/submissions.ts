// Submission database operations

import { collection, addDoc, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from './config';
import { Submission } from '@/lib/types';
import { COLLECTIONS } from '@/utils/constants';

export async function uploadSubmissions(submissions: Submission[]): Promise<void> {
  const submissionsRef = collection(db, COLLECTIONS.SUBMISSIONS);

  for (const submission of submissions) {
    await addDoc(submissionsRef, {
      ...submission,
      uploadedAt: Date.now(),
    });
  }
}

export async function getSubmissions(queueId?: string): Promise<Submission[]> {
  const submissionsRef = collection(db, COLLECTIONS.SUBMISSIONS);

  let q = query(submissionsRef);
  if (queueId) {
    q = query(submissionsRef, where('queueId', '==', queueId));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Submission));
}

export async function getSubmissionById(id: string): Promise<Submission | null> {
  const docRef = doc(db, COLLECTIONS.SUBMISSIONS, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Submission;
  }
  return null;
}
