import { workoutPlan } from './workoutPlan'

// types.ts
export type ExamPhase = 'day0' | 'day6' | 'day12'
export type PushupLevel = 'low' | 'mid' | 'high'

export interface ExamResult {
  pushupRange: string
  level: PushupLevel
  date: string
}

export interface ExamOption {
  label: string
  level: PushupLevel
}
export interface ExamConfig {
  title: string
  question: string
  options: ExamOption[]
}

export interface DayProgress {
  day: number
  date: string
  success: boolean
  totalPushups: number
}
/*
export interface ExamProgress {
  day: ExamPhase
  date: string
  result: ExamResult
}*/

export interface SetStatus {
  timerActive: boolean
  isResting: boolean
  startTime?: number
}

export interface AppState {
  currentDay: number
  examResults: Partial<Record<ExamPhase, ExamResult>>
  progress: DayProgress[]
  // examProgress ??
}

export const STORAGE_KEY = 'pushupChallenge'
export const TOTAL_DAYS = 18

// constants.ts
export const EXAM_CONFIGS: Record<ExamPhase, ExamConfig> = {
  day0: {
    title: 'Initial Pushup Test',
    question: 'How many pushups can you do in one set?',
    options: [
      {
        label: '0-5',
        level: 'low'
      },
      {
        label: '6-14',
        level: 'mid'
      },
      {
        label: '15-29',
        level: 'high'
      }
    ]
  },
  day6: {
    title: 'Week 2 test',
    question: 'How many pushups can you do in one set now?',
    options: [
      {
        label: '16-20',
        level: 'low'
      },
      {
        label: '21-25',
        level: 'mid'
      },
      {
        label: '26+',
        level: 'high'
      }
    ]
  },
  day12: {
    title: 'Week 4 test',
    question: "Let's measure your progress. How many pushups can you do?",
    options: [
      {
        label: '31-35',
        level: 'low'
      },
      {
        label: '36-40',
        level: 'mid'
      },
      {
        label: '40+',
        level: 'high'
      }
    ]
  }
}
