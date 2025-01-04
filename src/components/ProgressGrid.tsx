import { CheckCircle2, XCircle } from 'lucide-react'
import {
  type DayProgress,
  type ExamProgress,
  type ExamResult,
  type ExamDay,
  getCurrentExamResult,
  EXAM_CONFIGS
} from '../types'
import { calculatePushupSets } from '../utils'

interface ProgressGridProps {
  currentDay: number
  totalDays: number
  progress: (DayProgress | ExamProgress)[]
  examResults: Partial<Record<ExamDay, ExamResult>>
}

export const ProgressGrid = ({
  currentDay,
  totalDays,
  progress,
  examResults
}: ProgressGridProps) => {
  const examDayMap = Object.keys(EXAM_CONFIGS).reduce(
    (acc, examDay) => {
      const day = parseInt(examDay)
      acc[day + 1] = examDay
      return acc
    },
    {} as Record<number, ExamDay>
  )

  const renderDay = (day: number) => {
    const allDayAttempts = progress.filter(
      (p): p is DayProgress => !('result' in p) && p.day === day
    )
    const latestAttempt = allDayAttempts[allDayAttempts.length - 1]

    // Calculate expected pushups
    const { result } = getCurrentExamResult(day, examResults)
    const plannedPushups = result
      ? calculatePushupSets(day, result).reduce((a, b) => a + b, 0)
      : null
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
        <div className='text-sm text-gray-600 mb-1'>Day {day}</div>
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

  const renderExam = (examDay: ExamDay) => {
    const examProgress = progress.find(
      (p): p is ExamProgress => 'result' in p && p.day === examDay
    )

    return (
      <div className='my-6 text-center'>
        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-gray-300'></div>
          </div>
          <div className='relative flex justify-center'>
            <div className='bg-white px-4 py-2 text-sm font-medium text-gray-500'>
              {EXAM_CONFIGS[examDay].title}
              {examProgress && (
                <span className='ml-2 text-purple-600'>
                  ({examProgress.result.pushupRange} pushups -{' '}
                  {examProgress.result.level})
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
    let currentDayNum = 1
    while (currentDayNum <= totalDays) {
      // Add exam divider if it's an exam day
      if (examDayMap[currentDayNum] !== undefined) {
        elements.push(renderExam(examDayMap[currentDayNum]))
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
