import { type PushupLevel, type ExamPhase } from './types'
export interface DayWorkout {
  restTime: number
  sets: Record<PushupLevel, number[]>
}
export interface WeekWorkout {
  requiredExam: ExamPhase
  days: DayWorkout[]
}

const WEEK_1: WeekWorkout = {
  requiredExam: 'day0',
  days: [
    {
      restTime: 60,
      sets: {
        low: [2, 3, 2, 2, 3],
        mid: [6, 6, 4, 4, 5],
        high: [10, 12, 7, 7, 9]
      }
    },
    {
      restTime: 60,
      sets: {
        low: [3, 4, 2, 3, 4],
        mid: [6, 8, 6, 6, 7],
        high: [10, 12, 8, 8, 12]
      }
    },
    {
      restTime: 60,
      sets: {
        low: [4, 5, 4, 4, 5],
        mid: [8, 10, 7, 7, 10],
        high: [11, 15, 9, 9, 13]
      }
    }
  ]
}

const WEEK_2 = {
  requiredExam: 'day0',
  days: [
    {
      restTime: 60,
      sets: {
        low: [4, 6, 4, 4, 6],
        mid: [9, 11, 8, 8, 11],
        high: [14, 14, 10, 10, 15]
      }
    },
    {
      restTime: 90,
      sets: {
        low: [5, 6, 4, 4, 7],
        mid: [10, 12, 9, 9, 13],
        high: [14, 16, 12, 12, 17]
      }
    },
    {
      restTime: 120,
      sets: {
        low: [5, 7, 5, 5, 8],
        mid: [12, 13, 10, 10, 15],
        high: [16, 17, 14, 14, 20]
      }
    }
  ]
}

const WEEK_3: WeekWorkout = {
  requiredExam: 'day6',
  days: [
    {
      restTime: 60,
      sets: {
        low: [10, 12, 7, 7, 9],
        mid: [12, 17, 13, 13, 17],
        high: [14, 18, 14, 14, 20]
      }
    },
    {
      restTime: 90,
      sets: {
        low: [10, 12, 8, 8, 12],
        mid: [14, 19, 14, 14, 19],
        high: [20, 25, 15, 15, 25]
      }
    },
    {
      restTime: 120,
      sets: {
        low: [11, 13, 9, 9, 13],
        mid: [16, 21, 15, 15, 21],
        high: [22, 30, 20, 20, 28]
      }
    }
  ]
}

const WEEK_4 = {
  requiredExam: 'day6',
  days: [
    {
      restTime: 60,
      sets: {
        low: [12, 14, 11, 10, 16],
        mid: [18, 22, 16, 16, 25],
        high: [21, 25, 21, 21, 32]
      }
    },
    {
      restTime: 90,
      sets: {
        low: [14, 16, 12, 12, 18],
        mid: [20, 25, 20, 20, 28],
        high: [25, 29, 25, 25, 36]
      }
    },
    {
      restTime: 120,
      sets: {
        low: [16, 18, 13, 13, 20],
        mid: [23, 28, 23, 23, 33],
        high: [29, 33, 29, 29, 40]
      }
    }
  ]
}

const WEEK_5: WeekWorkout = {
  requiredExam: 'day12',
  days: [
    {
      restTime: 60,
      sets: {
        low: [17, 19, 15, 15, 20],
        mid: [28, 35, 25, 22, 35],
        high: [36, 40, 30, 24, 40]
      }
    },
    {
      restTime: 45,
      sets: {
        low: [10, 10, 13, 13, 10, 10, 9, 25],
        mid: [18, 18, 20, 20, 14, 14, 16, 40],
        high: [19, 19, 22, 22, 18, 18, 22, 45]
      }
    },
    {
      restTime: 45,
      sets: {
        low: [13, 13, 15, 15, 12, 12, 10, 30],
        mid: [18, 18, 20, 20, 17, 17, 20, 45],
        high: [20, 20, 24, 24, 20, 20, 22, 50]
      }
    }
  ]
}

const WEEK_6: WeekWorkout = {
  requiredExam: 'day15',
  days: [
    {
      restTime: 60,
      sets: {
        low: [25, 30, 20, 15, 40],
        mid: [40, 50, 25, 25, 50],
        high: [45, 55, 35, 30, 55]
      }
    },
    {
      restTime: 45,
      sets: {
        low: [14, 14, 15, 15, 14, 14, 10, 10, 44],
        mid: [20, 20, 23, 23, 20, 20, 18, 18, 53],
        high: [22, 22, 30, 30, 24, 24, 18, 18, 58]
      }
    },
    {
      restTime: 45,
      sets: {
        low: [13, 13, 17, 17, 16, 16, 14, 14, 50],
        mid: [22, 22, 30, 30, 25, 25, 18, 18, 55],
        high: [26, 26, 33, 33, 26, 26, 22, 22, 60]
      }
    }
  ]
}

export const workoutPlan: WeekWorkout[] = [
  WEEK_1,
  WEEK_2,
  WEEK_3,
  WEEK_4,
  WEEK_5,
  WEEK_6
]
