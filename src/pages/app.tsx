import { useEffect, useState } from 'react'
import {
  type AppState,
  type ExamResult,
  type DayProgress,
  STORAGE_KEY,
  TOTAL_DAYS,
  type ExamPhase
} from '../types'
import { ExamForm } from '../components/ExamForm'
import { ProgressGrid } from '../components/ProgressGrid'
import { WorkoutTracker } from '../components/WorkoutTracker'
import { ResultsTable } from '../components/ResultsTable'
import {
  calculatePushupSets,
  requiredExam,
  completedExam,
  formatDate,
  examResult,
  getWorkout
} from '../utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const INITIAL_STATE: AppState = {
  currentDay: 0,
  examResults: {},
  progress: []
}

export default function App() {
  const getState = () => {
    const savedState = localStorage.getItem(STORAGE_KEY)
    return savedState ? JSON.parse(savedState) : INITIAL_STATE
  }
  const [state, setState] = useState<AppState>(getState())

  const [activeTab, setActiveTab] = useState('workout')

  // Save state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  // Handle exam completion
  const handleExamSubmit = (phase: ExamPhase, result: ExamResult) => {
    setState((prev) => ({
      ...prev,
      examResults: {
        ...prev.examResults,
        [phase]: result
      }
    }))
  }

  // Calculate current pushup sets
  const exam = requiredExam(state.currentDay)
  const result = examResult(exam, state.examResults)!
  const workout = getWorkout(state.currentDay)

  const storeWorkout = (success: boolean, pushupsDone: number) => {
    setState((prev) => ({
      ...prev,
      progress: [
        ...prev.progress,
        {
          day: prev.currentDay,
          date: formatDate(new Date()),
          success,
          totalPushups: pushupsDone
        } as DayProgress
      ]
    }))
  }

  const handleDayComplete = () => {
    const currentSetPushups = currentSets.reduce((a, b) => a + b, 0)
    storeWorkout(true, currentSetPushups)

    setState((prev) => ({
      ...prev,
      currentDay: prev.currentDay + 1
    }))
  }
  const handleFailSet = (activeSet: number) => {
    const completedPushups = currentSets
      .slice(0, activeSet)
      .reduce((a, b) => a + b, 0)
    return storeWorkout(false, completedPushups)
  }

  return (
    <div className='container mx-auto p-4 space-y-6 w-full max-w-3xl '>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value='workout'>Workout</TabsTrigger>
          <TabsTrigger value='progress'>Progress</TabsTrigger>
          <TabsTrigger value='history'>History</TabsTrigger>
        </TabsList>

        <TabsContent value='workout'>
          {!completedExam(exam, state.examResults) ? (
            <ExamForm
              examPhase={exam}
              onSubmit={(res) => handleExamSubmit(exam, res)}
            />
          ) : (
            <>
              <h2>
                Day {state.currentDay} / {TOTAL_DAYS}
              </h2>

              <WorkoutTracker
                workout={workout}
                result={result}
                onFinishDay={handleDayComplete}
                onFailSet={handleFailSet}
              />
            </>
          )}
        </TabsContent>

        <TabsContent value='progress'>
          <ProgressGrid
            currentDay={state.currentDay}
            totalDays={TOTAL_DAYS}
            progress={state.progress}
            examResults={state.examResults}
          />
        </TabsContent>

        <TabsContent value='history'>
          <ResultsTable
            progress={state.progress}
            examResults={state.examResults}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
