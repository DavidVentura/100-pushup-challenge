import { CheckCircle2, XCircle } from 'lucide-react'
import {
  EXAM_CONFIGS,
  type DayProgress,
  type ExamPhase,
  type ExamResult
} from '../types'
import { formatDate } from '@/utils'

interface ResultsTableProps {
  progress: DayProgress[]
  examResults: ExamResult[]
}

interface ExamResultWithTitle extends ExamResult {
  label: string
}
export const ResultsTable = ({ progress, examResults }: ResultsTableProps) => {
  const examEntries: ExamResultWithTitle[] = examResults.map((e) => {
    return {
      label: EXAM_CONFIGS[e.phase].title,
      ...e
    }
  })

  const allProgress: (DayProgress | ExamResultWithTitle)[] = [
    ...examEntries,
    ...progress
  ].sort((a, b) => a.dateEpochMs - b.dateEpochMs)
  return (
    <div className='overflow-x-auto'>
      <table className='w-full'>
        <thead>
          <tr>
            <th className='text-left p-2'>Date</th>
            <th className='text-left p-2'>Day</th>
            <th className='text-right p-2'>Pushups</th>
            <th className='text-center p-2'>Result</th>
          </tr>
        </thead>
        <tbody>
          {allProgress.map((entry, idx) => {
            if ('pushupRange' in entry) {
              // Exam entry
              return (
                <tr key={idx} className={`border-t`}>
                  <td className='p-2'>
                    {formatDate(new Date(entry.dateEpochMs))}
                  </td>
                  <td className='p-2'>{entry.label}</td>
                  <td className='p-2 text-right'>{entry.pushupRange}</td>
                  <td className='p-2 text-center'>
                    {entry.level == 'fail' ? (
                      <XCircle className='w-4 h-4 text-red-500 inline' />
                    ) : (
                      <CheckCircle2 className='w-4 h-4 text-purple-500 inline' />
                    )}
                  </td>
                </tr>
              )
            } else {
              // Regular day entry
              return (
                <tr key={idx} className={`border-t`}>
                  <td className='p-2'>
                    {formatDate(new Date(entry.dateEpochMs))}
                  </td>
                  <td className='p-2'>Day {entry.day + 1}</td>
                  <td className='p-2 text-right'>{entry.totalPushups}</td>
                  <td className='p-2 text-center'>
                    {entry.success ? (
                      <CheckCircle2 className='w-4 h-4 text-green-500 inline' />
                    ) : (
                      <XCircle className='w-4 h-4 text-red-500 inline' />
                    )}
                  </td>
                </tr>
              )
            }
          })}
        </tbody>
      </table>
    </div>
  )
}
