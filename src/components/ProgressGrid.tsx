import { CheckCircle2, XCircle, Dumbbell } from 'lucide-react'
import {
  type DayProgress,
  type ExamResult,
  type ExamPhase,
  EXAM_CONFIGS
} from '../types'
import { passedExam, examResult, pushupsForDay, requiredExam } from '../utils'
import cn from 'classnames'

interface ProgressGridProps {
  currentDay: number
  totalDays: number
  progress: DayProgress[]
  examResults: ExamResult[]
}

export const ProgressGrid = ({
  currentDay,
  totalDays,
  progress,
  examResults
}: ProgressGridProps) => {
  const renderedExams: Partial<Record<ExamPhase, any>> = {}

  const renderDay = (day: number, isExamActive: boolean) => {
    const allDayAttempts = progress.filter(
      (p) => !p.overridden && p.day === day
    )
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
          isActive = !foundActive && !passedExam(firstDayPhase, examResults)
          foundActive = foundActive || !passedExam(firstDayPhase, examResults)
        }

        elements.push(renderExam(e, isActive))
      }

      // Add grid of 3 days
      elements.push(
        <>
          <div>Week {currentDayNum / 3 + 1}</div>
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

  const terms = [
    {
      exam: { label: 'first exam', result: 'high' },
      weeks: [
        [
          { pushupCount: 50, status: 'done' },
          { pushupCount: 10, status: 'failed' },
          { pushupCount: 10 }
        ],
        [{ pushupCount: 22 }, { pushupCount: 33 }, { pushupCount: 10 }]
      ]
    },
    {
      exam: { label: 'first exam', result: null },
      weeks: [[{ pushupCount: 50 }, { pushupCount: 10 }, { pushupCount: 10 }]]
    }
  ]
  return (
    <div className='space-y-4'>
      <div className='gap-3 grid grid-cols-[36px_repeat(3,_minmax(0,_1fr))]'>
        {terms.map((t) => (
          <>
            {t.weeks.map((week, idx) => (
              <>
                {idx === 0 ? (
                  <div className={
                    cn('rounded-full place-self-center p-2 border',
                    {
                      'bg-green-100 border-green-600 text-green-600': ![null, 'failed'].includes(t.exam.result),
                      'bg-red-100 border-red-600 text-red-600': t.exam.result == 'failed',
                      'bg-gray-100 border-gray-100 text-gray-600': t.exam.result == null,
                      
                    })}>
                    <Dumbbell strokeWidth={1.5} className='w-4 h-4'></Dumbbell>
                  </div>
                ) : (
                  <div></div>
                )}
                {week.map((day, didx) => (
                  <div className={cn('p-2 rounded-md relative', {
                    'bg-gray-100': !('status' in day),
                    'bg-green-100': day.status === 'done',
                    'bg-red-100': day.status === 'failed'
                  })}>
                    <h4 className='text-xs text-gray-700'>
                      Day {didx + 1 + idx * 3}
                    </h4>
                    <span>{day.pushupCount}</span>
                    {'status' in day &&
                      (day.status === 'done' ? (
                        <CheckCircle2 className='absolute bottom-1 right-2 w-4 text-green-500'></CheckCircle2>
                      ) : (
                        <XCircle className='absolute bottom-1 right-2 w-4 text-red-500'></XCircle>
                      ))}
                  </div>
                ))}
              </>
            ))}
          </>
        ))}
      </div>
    </div>
  )
}
