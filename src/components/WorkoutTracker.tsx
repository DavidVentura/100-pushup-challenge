import { Button } from '@/components/ui/button'
import { Timer } from 'lucide-react'
import { type ExamResult, type SetStatus } from '../types'
import { useState, useEffect, createContext, useContext } from 'react'
import type { DayWorkout } from '@/workoutPlan'

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
      endTime: number
    }
  | { state: 'rest-over' }
  | TWorking
  | {
      state: 'starting'
    }
)
const INITIAL_STATE: TState = {
  state: 'starting',
  currentSet: 0,
  sets: []
}

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
  endTime,
  onRested,
  onSkipRest
}: {
  endTime: number
  onRested: () => void
  onSkipRest: () => void
}) => {
  const [forceUpdate, setForceUpdate] = useState(0)
  useEffect(() => {
    let timer = window.setInterval(() => {
      setForceUpdate((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const timeLeft = endTime - new Date().getTime()
  // FIXME: Cannot update a component (`WorkoutTracker`) while rendering a different component (`Resting`)
  if (timeLeft <= 0) setTimeout(() => onRested(), 0)

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
  const [workoutState, setWorkoutState] = useState<TState>({
    ...INITIAL_STATE,
    sets: workout.sets[result.level]!
  })

  const isDev = window.location.hostname === 'localhost'

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-5 gap-4'>
        {workoutState.sets.map((reps, idx) => {
          const isActive = workoutState.currentSet === idx
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
        <div className='text-center space-y-2'>
          {workoutState.state == 'resting' && (
            <Resting
              endTime={workoutState.endTime}
              onRested={() =>
                setWorkoutState((prev) => ({
                  ...prev,
                  state: 'rest-over'
                }))
              }
              onSkipRest={() =>
                setWorkoutState((prev) => ({
                  ...prev,
                  state: 'working-out',
                  startTime: new Date().getTime()
                }))
              }
            ></Resting>
          )}
          {workoutState.state == 'rest-over' && (
            <RestOver
              onContinue={() =>
                setWorkoutState((prev) => ({
                  ...prev,
                  state: 'working-out',
                  startTime: new Date().getTime()
                }))
              }
              onRestMore={() =>
                setWorkoutState((prev) => {
                  console.log('rest more')
                  return {
                    ...prev,
                    state: 'resting',
                    endTime: new Date().getTime() + 60_000
                  }
                })
              }
            ></RestOver>
          )}
          {workoutState.state == 'working-out' && (
            <InProgress
              startTime={workoutState.startTime}
              onFail={() => {
                onFailSet(workoutState.currentSet)
                setWorkoutState({
                  ...INITIAL_STATE,
                  sets: workout.sets[result.level]!
                })
              }}
              onSuccess={() => {
                if (workoutState.currentSet == workoutState.sets.length - 1) {
                  onFinishDay()
                  setWorkoutState({
                    ...INITIAL_STATE,
                    sets: workout.sets[result.level]!
                  })
                } else {
                  setWorkoutState((prev) => ({
                    ...prev,
                    state: 'resting',
                    currentSet: prev.currentSet + 1,
                    endTime: new Date().getTime() + workout.restTime * 1_000
                  }))
                }
              }}
            ></InProgress>
          )}
          {workoutState.state == 'starting' && (
            <div className='text-center'>
              <Button
                onClick={() =>
                  setWorkoutState((prev) => ({
                    ...prev,
                    state: 'working-out',
                    startTime: new Date().getTime()
                  }))
                }
              >
                Start Set
              </Button>
            </div>
          )}
        </div>

        {isDev && (
          <Button
            variant='default'
            onClick={() => {
              setWorkoutState((prev) => {
                return {
                  ...prev,
                  currentSet: Math.min(
                    prev.sets.length - 1,
                    prev.currentSet + 1
                  )
                }
              })
            }}
          >
            hack next Set
          </Button>
        )}
      </div>
    </div>
  )
}
