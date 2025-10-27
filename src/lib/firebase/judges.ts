// Judge database operations

import { collection, addDoc, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from './config';
import { Judge, CreateJudgeInput } from '@/lib/types';
import { COLLECTIONS } from '@/utils/constants';

export async function createJudge(input: CreateJudgeInput): Promise<Judge> {
  const judgesRef = collection(db, COLLECTIONS.JUDGES);
  const now = Date.now();

  const judgeData = {
    ...input,
    active: true,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await addDoc(judgesRef, judgeData);

  return {
    id: docRef.id,
    ...judgeData,
  };
}

export async function getJudges(): Promise<Judge[]> {
  const judgesRef = collection(db, COLLECTIONS.JUDGES);
  const snapshot = await getDocs(judgesRef);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Judge));
}

export async function updateJudge(id: string, updates: Partial<Judge>): Promise<void> {
  const judgeRef = doc(db, COLLECTIONS.JUDGES, id);
  await updateDoc(judgeRef, {
    ...updates,
    updatedAt: Date.now(),
  });
}

export async function toggleJudgeActive(id: string, active: boolean): Promise<void> {
  const judgeRef = doc(db, COLLECTIONS.JUDGES, id);
  await updateDoc(judgeRef, {
    active,
    updatedAt: Date.now(),
  });
}
