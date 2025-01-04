// utils.ts
import { type ExamResult, type ExamPhase } from './types';
import { workoutPlan } from './workoutPlan';

export const calculatePushupSets = (
  currentDay: number,
  result: ExamResult,
): number[] => {
  const week = Math.floor(currentDay / 3);
  if ( week == 6) {
    return [9999]; // FIXME this hsouldn't be called
  }

  const weekPlan = workoutPlan[week];
  const dayPlan = weekPlan[currentDay % 3];
  return dayPlan.sets[result!.level];
};

export const getNextExamPhase = (currentPhase: ExamPhase): ExamPhase => {
  switch (currentPhase) {
    case 'day0':
      return 'day6';
    case 'day6':
      return 'day12';
    case 'day12':
      return 'completed';
    default:
      return 'completed';
  }
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};