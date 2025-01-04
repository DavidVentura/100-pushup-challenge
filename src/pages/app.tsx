import { useEffect, useState } from 'react';
import { 
  type AppState, 
  type ExamResult,
  type DayProgress,
  type ExamProgress,
  type SetStatus,
  type ExamDay,
  STORAGE_KEY,
  TOTAL_DAYS,
  isExamDay,
  getCurrentExamResult,
} from '../types';
import { ExamForm } from '../components/ExamForm';
import { ProgressGrid } from '../components/ProgressGrid';
import { WorkoutTracker } from '../components/WorkoutTracker';
import { ResultsTable } from '../components/ResultsTable';
import { calculatePushupSets, getNextExamPhase, formatDate } from '../utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const INITIAL_STATE: AppState = {
  currentDay: 0,
  examPhase: 'day0',
  examResults: {},
  progress: []
};

export default function App() {
  const getState = () => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : INITIAL_STATE;
  }
  const [state, setState] = useState<AppState>(getState());
  // THEN DAY6 is overwritten by exam

  const [activeTab, setActiveTab] = useState("workout");

  // Save state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

 
  // Handle exam completion
  const handleExamSubmit = (result: ExamResult) => {
    const examDay = state.currentDay as ExamDay;
    
    setState(prev => ({
      ...prev,
      examResults: {
        ...prev.examResults,
        [examDay]: result
      },
      examPhase: getNextExamPhase(prev.examPhase),
      currentDay: prev.currentDay + 1,
      progress: [
        ...prev.progress,
        {
          day: examDay,
          date: formatDate(new Date()),
          result
        } as ExamProgress
      ]
    }));
  };


  // Calculate current pushup sets
  const { result } = getCurrentExamResult(state.currentDay, state.examResults);
  const currentSets = result ? calculatePushupSets(state.currentDay, result) : [];
  // Determine if current day is an exam day
  const isExamToday = isExamDay(state.currentDay);

  const storeWorkout = (success: boolean, pushupsDone: number) => {
    setState(prev => ({
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
    }));
  }

  const handleDayComplete = () => {
    const currentSetPushups = currentSets.reduce((a, b) => a+b, 0);
    storeWorkout(true, currentSetPushups);

      setState(prev => ({
        ...prev,
        currentDay: prev.currentDay + 1
      }));
  };
  const handleFailSet = (activeSet: number) => {
    const completedPushups = currentSets.slice(0, activeSet).reduce((a, b) => a+b, 0);
    return storeWorkout(false, completedPushups)
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="workout">Workout</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="workout">
          {isExamToday ? (
        <ExamForm 
          examPhase={state.examPhase} 
          onSubmit={handleExamSubmit}
        />
      ) : (
        <>
          <h2>Day {state.currentDay} / {TOTAL_DAYS}</h2>

            <WorkoutTracker
              pushupSets={currentSets}
              onFinishDay={handleDayComplete}
              onFailSet={handleFailSet}
            />
            </>
      )}
          </TabsContent>

          <TabsContent value="progress">
            <ProgressGrid
              currentDay={state.currentDay}
              totalDays={TOTAL_DAYS}
              progress={state.progress}
              examResults={state.examResults}
            />
          </TabsContent>

          <TabsContent value="history">
            <ResultsTable 
              progress={state.progress}
            />
          </TabsContent>
        </Tabs>
    </div>
  );
}