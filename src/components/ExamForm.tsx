import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  type ExamPhase,
  type PushupLevel,
  type ExamResult,
  EXAM_CONFIGS,
  type ExamOption
} from '../types'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

interface ExamFormProps {
  examPhase: ExamPhase
  onSubmit: (result: ExamResult) => void
}

export const ExamForm = ({ examPhase, onSubmit }: ExamFormProps) => {
  const [selectedOption, setSelectedOption] =
    React.useState<PushupLevel | null>(null)
  const config = EXAM_CONFIGS[examPhase]

  const label = (examOpts: ExamOption): string => {
    return examOpts.min == null
      ? `<${examOpts.max}`
      : examOpts.max == null
        ? `>=${examOpts.min}`
        : `${examOpts.min}-${examOpts.max}`
  }
  const handleSubmit = () => {
    const level: PushupLevel = selectedOption!
    const examOpts = config.options.find((opt) => opt.level === level)!
    const pushupRange = label(examOpts)

    const result: ExamResult = {
      pushupRange,
      level,
      dateEpochMs: new Date().getTime(),
      phase: examPhase
    }

    onSubmit(result)
  }
  return (
    <Card className='w-full max-w-xl mx-auto'>
      <CardHeader>
        <CardTitle>{config.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          <p>{config.question}</p>

          <RadioGroup
            value={selectedOption || ''}
            onValueChange={(v) => setSelectedOption(v! as PushupLevel)}
            className='space-y-4'
          >
            {config.options.map((option, index) => (
              <div key={option.level} className='flex items-center space-x-2'>
                <RadioGroupItem
                  value={option.level.toString()}
                  id={`option-${index}`}
                />
                <Label htmlFor={`option-${index}`}>
                  {label(option)} pushups
                </Label>
              </div>
            ))}
          </RadioGroup>

          <Button
            onClick={handleSubmit}
            disabled={!selectedOption}
            className={
              selectedOption === 'fail' ? 'bg-red-500' : 'bg-green-500'
            }
          >
            Submit
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
