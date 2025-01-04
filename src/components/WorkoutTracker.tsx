// components/WorkoutTracker.tsx
import { Button } from '@/components/ui/button'
import { Timer } from 'lucide-react'
import { type ExamResult, type SetStatus } from '../types'
import { useState, useEffect } from 'react'
import type { DayWorkout } from '@/workoutPlan'

interface WorkoutTrackerProps {
  workout: DayWorkout
  result: ExamResult
  onFailSet: (setIndex: number) => void
  onFinishDay: () => void
}

export const WorkoutTracker = ({
  workout,
  result,

  onFinishDay,
  onFailSet
}: WorkoutTrackerProps) => {
  const [setStatus, setSetStatus] = useState<SetStatus>({
    timerActive: false,
    isResting: false
  })
  const [timeLeft, setTimeLeft] = useState(0)
  const [activeSet, setActiveSet] = useState(0)
  const sets = workout.sets[result.level] || [] // For FAILED state
  const isLastSet = activeSet === sets.length - 1

  const handleAnotherMinute = () => {
    setTimeLeft(60_000)
  }

  const handleStartSet = () => {
    setSetStatus({
      timerActive: true,
      isResting: false,
      startTime: Date.now()
    })
  }

  const handleNextSet = () => {
    console.log('next set')
    setActiveSet((prev) => prev + 1)
    setSetStatus({
      timerActive: false,
      isResting: false
    })
  }

  const handleFailSet = () => {
    setActiveSet(0)
    setSetStatus({
      timerActive: false,
      isResting: false
    })
    onFailSet(activeSet)
  }

  const handleFinishSet = () => {
    setSetStatus({
      timerActive: false,
      isResting: false
    })

    if (isLastSet) {
      setActiveSet(0)

      onFinishDay()
    } else {
      setTimeLeft(workout.restTime * 100)
      setSetStatus({
        timerActive: true,
        isResting: true
      })
    }
  }

  // Rest timer
  useEffect(() => {
    let timer: number
    if (setStatus.isResting && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 100))
      }, 100)
    }
    return () => clearInterval(timer)
  }, [setStatus.isResting, timeLeft])

  useEffect(() => {
    let timer: number
    if (setStatus.timerActive && !setStatus.isResting) {
      timer = window.setInterval(() => {
        // Force re-render to update elapsed time
        setForceUpdate((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [setStatus.timerActive, setStatus.isResting])

  // Add at the top with other state:
  const [forceUpdate, setForceUpdate] = useState(0)

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-5 gap-4'>
        {sets.map((reps, idx) => {
          const isActive = activeSet === idx
          return (
            <div
              key={idx}
              className={`p-4 rounded text-center ${
                isActive
                  ? 'bg-blue-100 border-2 border-blue-500'
                  : 'bg-gray-100'
              }`}
            >
              <div className='text-sm text-gray-600'>Set {idx + 1}</div>
              <div className='font-medium'>{reps}</div>
            </div>
          )
        })}
      </div>

      <div className='space-y-4'>
        {setStatus.timerActive && !setStatus.isResting && (
          <div className='text-center space-y-2'>
            <div className='text-xl font-bold'>
              <Timer className='inline-block mr-2' />
              Set in Progress:{' '}
              {Math.floor((Date.now() - (setStatus.startTime || 0)) / 1000)}s
            </div>
            <div className='flex justify-center space-x-4'>
              <Button variant='default' onClick={handleFinishSet}>
                Finished
              </Button>
              <Button variant='destructive' onClick={handleFailSet}>
                Failed
              </Button>
            </div>
          </div>
        )}

        {!setStatus.timerActive && !setStatus.isResting && (
          <div className='text-center'>
            <Button onClick={handleStartSet}>Start Set</Button>
          </div>
        )}

        {setStatus.isResting && (
          <div className='text-center space-y-2'>
            {timeLeft > 0 && (
              <>
                <div className='text-xl font-bold'>
                  Rest Time: {Math.ceil(timeLeft / 1000)}s
                </div>
                <Button
                  variant='default'
                  onClick={() => {
                    handleNextSet()
                    handleStartSet()
                  }}
                >
                  Start next set
                </Button>
              </>
            )}
            {timeLeft === 0 && (
              <div className='flex justify-center space-x-4'>
                <Button variant='outline' onClick={handleAnotherMinute}>
                  Another Minute
                </Button>
                <Button
                  variant='default'
                  onClick={() => {
                    handleNextSet()
                    handleStartSet()
                  }}
                >
                  Start next set
                </Button>
              </div>
            )}
          </div>
        )}

        <Button
          variant='default'
          onClick={() => {
            handleNextSet()
            handleStartSet()
          }}
        >
          hack next Set
        </Button>
      </div>
    </div>
  )
}
