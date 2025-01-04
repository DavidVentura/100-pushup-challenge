import { CheckCircle2, XCircle } from 'lucide-react'
import {
  type DayProgress,
  type ExamResult,
  type ExamPhase,
  EXAM_CONFIGS
} from '../types'
import { examResult, pushupsForDay, requiredExam } from '../utils'

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

  const renderDay = (day: number) => {
    const allDayAttempts = progress.filter((p) => p.day === day)
    const latestAttempt = allDayAttempts[allDayAttempts.length - 1]

    // Calculate expected pushups
    const plannedPushups = pushupsForDay(day, examResults).reduce(
      (a, b) => a + b,
      0
    )
    return (
      <div
        key={day}
        className={`p-4 rounded ${
          day === currentDay
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

  const renderExam = (phase: ExamPhase) => {
    const result = examResult(phase, examResults)

    return (
      <div className='my-6 text-center'>
        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-gray-300'></div>
          </div>
          <div className='relative flex justify-center'>
            <div className='bg-white px-4 py-2 text-sm font-medium text-gray-500'>
              {EXAM_CONFIGS[phase].title}
              {result && (
                <span className='ml-2 text-purple-600'>
                  ({result.pushupRange} pushups)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderDays = () => {
    let elements = []
    let currentDayNum = 0
    while (currentDayNum < totalDays) {
      const e = requiredExam(currentDayNum)
      if (e && !renderedExams[e]) {
        renderedExams[e] = true
        elements.push(renderExam(e))
      }

      // Add grid of 3 days
      elements.push(
        <div key={`grid-${currentDayNum}`} className='grid grid-cols-3 gap-4'>
          {[0, 1, 2].map((offset) => {
            const dayNum = currentDayNum + offset
            return dayNum <= totalDays ? (
              renderDay(dayNum)
            ) : (
              <div key={`empty-${dayNum}`} />
            )
          })}
        </div>
      )

      currentDayNum += 3
    }

    return elements
  }

  return <div className='space-y-4'>{renderDays()}</div>
}
