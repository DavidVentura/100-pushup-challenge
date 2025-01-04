import { CheckCircle2, XCircle } from 'lucide-react';
import { type DayProgress, type ExamProgress } from '../types';

interface ResultsTableProps {
  progress: (DayProgress | ExamProgress)[];
}

export const ResultsTable = ({ progress }: ResultsTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left p-2">Date</th>
            <th className="text-left p-2">Day</th>
            <th className="text-right p-2">Pushups</th>
            <th className="text-center p-2">Result</th>
          </tr>
        </thead>
        <tbody>
          {progress.map((entry, idx) => {
            if ('result' in entry) {
              // Exam entry
              return (
                <tr key={idx} className="border-t">
                  <td className="p-2">{entry.date}</td>
                  <td className="p-2">
                    Day {entry.day} Exam ({entry.result.level})
                  </td>
                  <td className="p-2 text-right">{entry.result.pushupRange}</td>
                  <td className="p-2 text-center">
                    <CheckCircle2 className="w-4 h-4 text-purple-500 inline" />
                  </td>
                </tr>
              );
            } else {
              // Regular day entry
              return (
                <tr key={idx} className="border-t">
                  <td className="p-2">{entry.date}</td>
                  <td className="p-2">Day {entry.day}</td>
                  <td className="p-2 text-right">{entry.totalPushups}</td>
                  <td className="p-2 text-center">
                    {entry.success ? 
                      <CheckCircle2 className="w-4 h-4 text-green-500 inline" /> : 
                      <XCircle className="w-4 h-4 text-red-500 inline" />
                    }
                  </td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>
    </div>
  );
};