export type ExamPhase = 'day0' | 'day6' | 'day12' | 'day15' | 'final'
export type PushupLevel = 'low' | 'mid' | 'high' | 'fail'

export interface ExamResult {
  pushupRange: string
  level: PushupLevel
  dateEpochMs: number
  phase: ExamPhase
}

export type ExamOption = {
  level: PushupLevel
} & (
  | { min: number; max: null }
  | { min: null; max: number }
  | { min: number; max: number }
)
export interface ExamConfig {
  title: string
  question: string
  options: ExamOption[]
}

export interface DayProgress {
  day: number
  dateEpochMs: number
  success: boolean
  totalPushups: number
  overridden: boolean
}

export interface SetStatus {
  timerActive: boolean
  isResting: boolean
  startTime?: number
}

export interface AppState {
  dataVersion: number
  currentDay: number
  examResults: ExamResult[]
  progress: DayProgress[]
}

export const STORAGE_KEY = 'pushupChallenge'
export const TOTAL_DAYS = 18
export const EXAM_CONFIGS: Record<ExamPhase, ExamConfig> = {
  day0: {
    title: 'Initial Pushup Test',
    question: 'How many pushups can you do in one set?',
    options: [
      {
        min: null,
        max: 5,
        level: 'low'
      },
      {
        min: 6,
        max: 14,
        level: 'mid'
      },
      {
        min: 15,
        max: 29,
        level: 'high'
      }
    ]
  },
  day6: {
    title: 'Week 2 test',
    question: 'How many pushups can you do in one set now?',
    options: [
      {
        max: 15,
        min: null,
        level: 'fail'
      },
      {
        min: 16,
        max: 20,
        level: 'low'
      },
      {
        min: 21,
        max: 25,
        level: 'mid'
      },
      {
        min: 26,
        max: null,
        level: 'high'
      }
    ]
  },
  day12: {
    title: 'Week 4 test',
    question: "Let's measure your progress. How many pushups can you do?",
    options: [
      {
        max: 30,
        min: null,
        level: 'fail'
      },
      {
        min: 31,
        max: 35,
        level: 'low'
      },
      {
        min: 36,
        max: 40,
        level: 'mid'
      },
      {
        min: 41,
        max: null,
        level: 'high'
      }
    ]
  },
  day15: {
    title: 'Week 5 test',
    question: "Let's measure your progress. How many pushups can you do?",
    options: [
      {
        max: 45,
        min: null,
        level: 'fail'
      },
      {
        min: 46,
        max: 50,
        level: 'low'
      },
      {
        min: 51,
        max: 60,
        level: 'mid'
      },
      {
        min: 61,
        max: null,
        level: 'high'
      }
    ]
  },
  final: {
    title: 'Final test',
    question: 'Final gogogo',
    options: [
      {
        max: 99,
        min: null,
        level: 'fail'
      },
      {
        min: 100,
        max: null,
        level: 'high'
      }
    ]
  }
}