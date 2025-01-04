// types.ts
export type ExamDay = 0 | 6 | 12
export type ExamPhase = 'day0' | 'day6' | 'day12' | 'completed'
export type PushupLevel = 'low' | 'mid' | 'high'
export const PushupRatios: Record<PushupLevel, number> = {
  low: 1,
  mid: 1.6,
  high: 2
}
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

export interface ExamProgress {
  day: ExamDay
  date: string
  result: ExamResult
}

export interface SetStatus {
  timerActive: boolean
  isResting: boolean
  startTime?: number
}

export interface AppState {
  currentDay: number
  examPhase: ExamPhase
  examResults: Partial<Record<ExamDay, ExamResult>>
  progress: (DayProgress | ExamProgress)[]
}

export const STORAGE_KEY = 'pushupChallenge'
export const TOTAL_DAYS = 18

// constants.ts
export const EXAM_CONFIGS: Record<ExamDay, ExamConfig> = {
  0: {
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
  6: {
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
  12: {
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

export const getCurrentExamResult = (
  currentDay: number,
  examResults: Partial<Record<ExamDay, ExamResult>>
): { examDay: ExamDay; result: ExamResult | undefined } => {
  if (currentDay <= 6) {
    return { examDay: 0, result: examResults[0] }
  } else if (currentDay <= 12) {
    return { examDay: 6, result: examResults[6] }
  } else {
    return { examDay: 12, result: examResults[12] }
  }
}

export const isExamDay = (day: number): day is ExamDay => {
  return day === 0 || day === 6 || day === 12
}
