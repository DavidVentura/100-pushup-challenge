import { Button } from '@/components/ui/button'
import { Timer, Activity } from 'lucide-react'
import { type ExamResult } from '../types'
import { useState, useEffect, Fragment } from 'react'
import type { DayWorkout } from '@/workoutPlan'
import cn from 'classnames'

interface WorkoutTrackerProps {
  workout: DayWorkout
  result: ExamResult
  onFailSet: (setIndex: number) => void
  onFinishDay: () => void
}

type TWorking = {
  state: 'working-out'
  startTime: number
}
type TState = {
  currentSet: number
  sets: number[]
} & (
  | {
      state: 'resting'
      duration: number
    }
  | { state: 'rest-over' }
  | TWorking
  | {
      state: 'starting'
    }
)

const InProgress = ({
  startTime,
  onSuccess,
  onFail
}: {
  startTime: number
  onSuccess: () => void
  onFail: () => void
}) => {
  const [forceUpdate, setForceUpdate] = useState(0)
  useEffect(() => {
    let timer = window.setInterval(() => {
      setForceUpdate((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className='text-center space-y-2'>
      <div className='text-xl font-bold'>
        <Timer className='inline-block mr-2' />
        Set in Progress: {Math.floor((Date.now() - startTime) / 1000)}s
      </div>
      <div className='flex justify-center space-x-4'>
        <Button variant='default' onClick={onSuccess}>
          Finished
        </Button>
        <Button variant='destructive' onClick={onFail}>
          Failed
        </Button>
      </div>
    </div>
  )
}

const Resting = ({
  duration,
  onRested,
  onSkipRest
}: {
  duration: number
  onRested: () => void
  onSkipRest: () => void
}) => {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    let timer = window.setInterval(() => {
      setElapsed((prev) => prev + 1_000)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const timeLeft = duration - elapsed
  useEffect(() => {
    if (timeLeft <= 0) {
      onRested()
    }
  }, [elapsed])

  return (
    <>
      <div className='text-xl font-bold'>
        Rest Time: {Math.ceil(timeLeft / 1000)}s
      </div>
      <Button variant='default' onClick={onSkipRest}>
        Start next set
      </Button>
    </>
  )
}
const RestOver = ({
  onContinue,
  onRestMore
}: {
  onContinue: () => void
  onRestMore: () => void
}) => {
  return (
    <div className='flex justify-center space-x-4'>
      <Button variant='outline' onClick={onRestMore}>
        Another minute
      </Button>
      <Button variant='default' onClick={onContinue}>
        Start next set
      </Button>
    </div>
  )
}

export const WorkoutTracker = ({
  workout,
  result,

  onFinishDay,
  onFailSet
}: WorkoutTrackerProps) => {
  const INITIAL_STATE: TState = {
    state: 'starting',
    currentSet: -1,
    sets: workout.sets[result.level]!
  }
  const [workoutState, setWorkoutState] = useState<TState>(INITIAL_STATE)
  const isDev = window.location.hostname === 'localhost'
  const isLastSet = workoutState.currentSet == workoutState.sets.length - 1

  const toState = (state: TState['state'], restDuration?: number) => {
    switch (state) {
      case 'rest-over':
        setWorkoutState((prev) => ({
          ...prev,
          state
        }))
        break
      case 'resting':
        setWorkoutState((prev) => ({
          ...prev,
          state: 'resting',
          duration: restDuration || workout.restTime * 1_000
        }))
        break
      case 'starting':
        setWorkoutState(INITIAL_STATE)
        break
      case 'working-out':
        setWorkoutState((prev) => ({
          ...prev,
          currentSet: prev.currentSet + 1,
          state,
          startTime: new Date().getTime()
        }))
        break
    }
  }

  return (
    <div className='space-y-6'>
      <div className={cn('grid gap-1 grid-cols-6')}>
        {workoutState.sets.map((reps, idx) => {
          const isActive = workoutState.currentSet === idx
          return (
            <Fragment key={`workout-${idx}`}>
              <div
                key={idx}
                className={cn('p-4 rounded outline-none text-center', {
                  'bg-blue-100 outline-2 outline-blue-500 outline-offset-[-1px]':
                    isActive && workoutState.state === 'working-out',
                  'bg-gray-100':
                    !isActive || workoutState.state !== 'working-out'
                  // 'outline-2 outline-green-500 outline-offset-[-1px]': workoutState.currentSet > idx
                })}
              >
                <div className='text-sm text-gray-600'>Set {idx + 1}</div>
                <div className='font-medium'>
                  {idx == workoutState.sets.length - 1 ? `${reps}+` : reps}
                </div>
              </div>
              {idx < workoutState.sets.length - 1 && (
                // Rest icon
                <Activity
                  key={`rest-${idx}`}
                  className={cn(
                    'rounded-3xl h-12 w-12 p-4 place-self-center outline-none',
                    {
                      'bg-gray-100':
                        workoutState.currentSet != idx ||
                        !['resting', 'rest-over'].includes(workoutState.state),
                      'bg-blue-100 outline-2 outline-blue-500 outline-offset-[-1px]':
                        workoutState.currentSet == idx &&
                        ['resting', 'rest-over'].includes(workoutState.state)
                    }
                  )}
                ></Activity>
              )}
            </Fragment>
          )
        })}
      </div>

      <div className='space-y-4'>
        <div className='text-center space-y-2'>
          {workoutState.state == 'resting' && (
            <Resting
              duration={workoutState.duration}
              onRested={() => toState('rest-over')}
              onSkipRest={() => toState('working-out')}
            ></Resting>
          )}
          {workoutState.state == 'rest-over' && (
            <RestOver
              onContinue={() => toState('working-out')}
              onRestMore={() => toState('resting', 60_000)}
            ></RestOver>
          )}
          {workoutState.state == 'working-out' && (
            <InProgress
              startTime={workoutState.startTime}
              onFail={() => {
                onFailSet(workoutState.currentSet)
                toState('starting')
              }}
              onSuccess={() => {
                if (isLastSet) {
                  onFinishDay()
                  toState('starting')
                } else {
                  toState('resting')
                }
              }}
            ></InProgress>
          )}
          {workoutState.state == 'starting' && (
            <div className='text-center'>
              <Button onClick={() => toState('working-out')}>
                Start Workout
              </Button>
            </div>
          )}
        </div>

        {isDev && (
          <Button
            variant='default'
            onClick={() => {
              onFinishDay()
              toState('starting')
            }}
          >
            Finish day
          </Button>
        )}
      </div>
    </div>
  )
}
