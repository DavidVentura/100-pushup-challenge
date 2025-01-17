import { CheckCircle2, XCircle, Dumbbell } from 'lucide-react'
import { type DayProgress, type ExamResult, type ExamPhase } from '../types'
import { examResult, pushupsForDay, requiredExam } from '../utils'
import cn from 'classnames'
import { Fragment } from 'react/jsx-runtime'

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
  interface F {
    exam: ExamResult | null
    days: { day: number; pushupCount: number; status?: 'done' | 'failed' }[]
  }
  const tt: Partial<Record<ExamPhase, F>> = {}
  const phases: ExamPhase[] = []

  let currentDayNum = 0
  while (currentDayNum < totalDays) {
    const allDayAttempts = progress.filter(
      (p) => !p.overridden && p.day === currentDayNum
    )
    const latestAttempt = allDayAttempts[allDayAttempts.length - 1]

    const p = requiredExam(currentDayNum)
    if (!phases.includes(p)) {
      phases.push(p)
    }
    if (tt[p] === undefined) {
      const res = examResult(p, examResults)
      tt[p] = {
        exam: res,
        days: []
      }
    }
    const pushupCount = pushupsForDay(currentDayNum, examResults).reduce(
      (a, b) => a + b,
      0
    )
    tt[p].days.push({
      day: currentDayNum,
      pushupCount,
      status:
        latestAttempt === undefined
          ? undefined
          : latestAttempt.success
            ? 'done'
            : 'failed'
    })
    currentDayNum++
  }
  const terms2 = phases.map((k) => tt[k]!)

  return (
    <div className='space-y-4'>
      <div className='gap-3 grid grid-cols-[36px_repeat(3,_minmax(0,_1fr))]'>
        {terms2.map((t, tidx) => (
          <Fragment key={`term-parent-${tidx}`}>
            <div
              key={`term-${tidx}`}
              className={cn('rounded-full place-self-start p-2 border', {
                'bg-green-100 border-green-600 text-green-600':
                  t.exam && t.exam.level != 'fail',
                'bg-red-100 border-red-600 text-red-600':
                  t.exam && t.exam.level == 'fail',
                'bg-gray-100 border-gray-100 text-gray-600': t.exam == null,
                'row-span-2': t.days.length == 6,
                'row-span-3': t.days.length == 9,
                // The icon spans two rows verically, and the rows
                // have gap of "gap-3" between them, which is 0.75rem = 12px
                // so we need to substract the entire gap from the Y coordinate
                'translate-y-[calc(50%_-_6px)]': true
              })}
            >
              <Dumbbell strokeWidth={1.5} className='w-4 h-4'></Dumbbell>
            </div>
            {t.days.map((day) => (
              <div
                key={`term-${tidx}-day-${day.day}`}
                className={cn('p-2 rounded-md outline-none relative', {
                  'bg-gray-100': day.status === undefined,
                  'bg-green-100': day.status === 'done',
                  'bg-red-100': day.status === 'failed',
                  'outline-1 outline-red-600 outline-offset-[-1px]':
                    day.status !== undefined && day.day === currentDay,
                  'outline-1 outline-blue-600 outline-offset-[-1px]':
                    day.status === undefined && day.day === currentDay
                })}
              >
                <h4 className='text-xs text-gray-700'>Day {day.day + 1}</h4>
                <span className={cn({ 'text-gray-300': t.exam === null })}>
                  {t.exam ? day.pushupCount : 'N/A'}
                </span>
                {'status' in day &&
                  (day.status === 'done' ? (
                    <CheckCircle2 className='absolute bottom-1 right-2 w-4 text-green-500'></CheckCircle2>
                  ) : day.status === 'failed' ? (
                    <XCircle className='absolute bottom-1 right-2 w-4 text-red-500'></XCircle>
                  ) : (
                    <></>
                  ))}
              </div>
            ))}
          </Fragment>
        ))}
      </div>
      <div
        className={cn('rounded text-center p-4 outline-none', {
          'bg-gray-100 text-gray-400': currentDay < totalDays,
          'bg-gray-100 text-gray-400 outline-1 outline-blue-600 outline-offset-[-1px]':
            currentDay == totalDays &&
            examResult('final', examResults) === null,
          'bg-green-100 text-black-400 outline-1 outline-green-600 outline-offset-[-1px]':
            currentDay == totalDays && examResult('final', examResults)
        })}
      >
        The big day
      </div>
    </div>
  )
}
