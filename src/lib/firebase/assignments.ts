// Judge assignment database operations

import { collection, addDoc, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { db } from './config';
import { JudgeAssignment } from '@/lib/types';
import { COLLECTIONS } from '@/utils/constants';

export async function saveAssignment(
  queueId: string,
  questionId: string,
  judgeIds: string[]
): Promise<void> {
  const assignmentsRef = collection(db, COLLECTIONS.ASSIGNMENTS);

  // Check if assignment exists
  const q = query(
    assignmentsRef,
    where('queueId', '==', queueId),
    where('questionId', '==', questionId)
  );
  const snapshot = await getDocs(q);

  const now = Date.now();

  if (snapshot.empty) {
    // Create new assignment
    await addDoc(assignmentsRef, {
      queueId,
      questionId,
      judgeIds,
      createdAt: now,
      updatedAt: now,
    });
  } else {
    // Update existing assignment
    const docRef = doc(db, COLLECTIONS.ASSIGNMENTS, snapshot.docs[0].id);
    await updateDoc(docRef, {
      judgeIds,
      updatedAt: now,
    });
  }
}

export async function getAssignments(queueId: string): Promise<JudgeAssignment[]> {
  const assignmentsRef = collection(db, COLLECTIONS.ASSIGNMENTS);
  const q = query(assignmentsRef, where('queueId', '==', queueId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as JudgeAssignment));
}
