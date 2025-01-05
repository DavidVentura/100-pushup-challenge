// utils.ts
import { type ExamResult, type ExamPhase } from './types'
import { workoutPlan, type DayWorkout } from './workoutPlan'

export const calculatePushupSets = (
  currentDay: number,
  result: ExamResult
): number[] => {
  return getWorkout(currentDay).sets[result!.level]!
}

export const getWorkout = (day: number): DayWorkout => {
  const week = Math.floor(day / 3)
  const weekPlan = workoutPlan[week]
  const dayPlan = weekPlan.days[day % 3]
  return dayPlan
}
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export const requiredExam = (day: number): ExamPhase => {
  const week = Math.floor(day / 3)
  const weekPlan = workoutPlan[week]
  return weekPlan.requiredExam
}

export const passedExam = (p: ExamPhase, results: ExamResult[]): boolean => {
  return (
    results.findLast((ph) => ph.phase === p && ph.level != 'fail') !== undefined
  )
}

export const examResult = (
  p: ExamPhase,
  results: ExamResult[]
): ExamResult | null => {
  return results.findLast((ph) => ph.phase === p && ph.level !== 'fail') || null
}

export const pushupsForDay = (day: number, results: ExamResult[]): number[] => {
  const exam = requiredExam(day)
  const result = exam ? examResult(exam, results) : null
  const plannedPushups = result ? calculatePushupSets(day, result) : []
  return plannedPushups
}
