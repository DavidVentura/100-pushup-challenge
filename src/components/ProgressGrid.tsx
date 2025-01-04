import { CheckCircle2, XCircle } from 'lucide-react'
import {
  type DayProgress,
  type ExamResult,
  type ExamPhase,
  EXAM_CONFIGS
} from '../types'
import {
  completedExam,
  examResult,
  pushupsForDay,
  requiredExam
} from '../utils'

interface ProgressGridProps {
  currentDay: number
  totalDays: number
  progress: DayProgress[]
  examResults: Partial<Record<ExamPhase, ExamResult>>
}

export const ProgressGrid = ({
  currentDay,
  totalDays,
  progress,
  examResults
}: ProgressGridProps) => {
  const renderedExams: Partial<Record<ExamPhase, any>> = {}

  const renderDay = (day: number, isExamActive: boolean) => {
    const allDayAttempts = progress.filter((p) => p.day === day)
    const latestAttempt = allDayAttempts[allDayAttempts.length - 1]
    const plannedPushups = pushupsForDay(day, examResults).reduce(
      (a, b) => a + b,
      0
    )
    return (
      <div
        key={day}
        className={`p-4 rounded ${
          day === currentDay && !isExamActive
            ? 'border-2 border-blue-500'
            : latestAttempt?.success
              ? 'bg-green-100'
              : latestAttempt?.success === false
                ? 'bg-red-100'
                : 'bg-gray-50'
        }`}
      >
        <div className='text-sm text-gray-600 mb-1'>Day {day + 1}</div>
        <div className='flex items-center justify-between'>
          <span
            className={`${plannedPushups ? 'text-gray-900' : 'text-gray-300'} font-medium`}
          >
            {latestAttempt
              ? latestAttempt.totalPushups
              : plannedPushups || 'N/A'}
          </span>
          {latestAttempt?.success === true && (
            <CheckCircle2 className='w-4 h-4 text-green-500' />
          )}
          {latestAttempt?.success === false && (
            <XCircle className='w-4 h-4 text-red-500' />
          )}
        </div>
      </div>
    )
  }

  const renderExam = (phase: ExamPhase, isActive: boolean) => {
    const result = examResult(phase, examResults)
    return (
      <div
        className={`p-4 rounded border ${isActive ? ' border-2 border-blue-500' : result ? 'bg-purple-50 border-purple-400' : 'border-gray-500'}`}
      >
        <div className='flex justify-center'>
          <div className='px-4 py-2 text-sm font-medium text-gray-500'>
            {EXAM_CONFIGS[phase].title}
            {result && (
              <span className='px-4 py-2 text-xs font-medium text-gray-500'>
                {result.pushupRange} pushups
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderDays = () => {
    let elements = []
    let currentDayNum = 0
    let foundActive = false
    while (currentDayNum < totalDays) {
      const e = requiredExam(currentDayNum)
      if (e && !renderedExams[e]) {
        renderedExams[e] = true
        // Only first one is active
        const firstDayPhase = requiredExam(currentDay)
        let isActive = false
        if (e == firstDayPhase) {
          isActive = !foundActive && !completedExam(firstDayPhase, examResults)
          foundActive =
            foundActive || !completedExam(firstDayPhase, examResults)
        }

        elements.push(renderExam(e, isActive))
      }

      // Add grid of 3 days
      elements.push(
        <>
        <div>
          Week {currentDayNum / 3 + 1}
        </div>
        <div key={`grid-${currentDayNum}`} className='grid grid-cols-3 gap-4'>
          {[0, 1, 2].map((offset) => {
            const dayNum = currentDayNum + offset
            return dayNum <= totalDays ? (
              renderDay(dayNum, foundActive)
            ) : (
              <div key={`empty-${dayNum}`} />
            )
          })}
        </div>
        </>
      )

      currentDayNum += 3
    }

    return elements
  }

  return <div className='space-y-4'>{renderDays()}</div>
}
