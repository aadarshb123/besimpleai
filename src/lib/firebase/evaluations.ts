// Evaluation database operations

import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './config';
import { Evaluation, EvaluationFilters } from '@/lib/types';
import { COLLECTIONS } from '@/utils/constants';

export async function saveEvaluation(evaluation: Omit<Evaluation, 'id'>): Promise<void> {
  const evaluationsRef = collection(db, COLLECTIONS.EVALUATIONS);
  await addDoc(evaluationsRef, evaluation);
}

export async function getEvaluations(filters?: EvaluationFilters): Promise<Evaluation[]> {
  const evaluationsRef = collection(db, COLLECTIONS.EVALUATIONS);
  let q = query(evaluationsRef);

  // Apply filters if provided
  if (filters?.judgeIds && filters.judgeIds.length > 0) {
    q = query(q, where('judgeId', 'in', filters.judgeIds));
  }
  if (filters?.questionIds && filters.questionIds.length > 0) {
    q = query(q, where('questionId', 'in', filters.questionIds));
  }
  if (filters?.verdicts && filters.verdicts.length > 0) {
    q = query(q, where('verdict', 'in', filters.verdicts));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Evaluation));
}
