export type ExamPhase = 'day0' | 'day6' | 'day12' | 'day15' | 'final'
export type PushupLevel = 'low' | 'mid' | 'high' | 'fail'

export interface ExamResult {
  pushupRange: string
  level: PushupLevel
  dateEpochMs: number
  phase: ExamPhase
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
        label: '<16',
        level: 'fail'
      },
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
        label: '<31',
        level: 'fail'
      },
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
  },
  day15: {
    title: 'Week 5 test',
    question: "Let's measure your progress. How many pushups can you do?",
    options: [
      {
        label: '<46',
        level: 'fail'
      },
      {
        label: '46-50',
        level: 'low'
      },
      {
        label: '51-60',
        level: 'mid'
      },
      {
        label: '61+',
        level: 'high'
      }
    ]
  },
  final: {
    title: 'Final test',
    question:"Final gogogo",
    options: [
      {
        label: '<100',
        level: 'fail'
      },
      {
        label: '100',
        level: 'high'
      }
    ]
  }
}
