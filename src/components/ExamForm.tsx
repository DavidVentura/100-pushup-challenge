import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  type ExamPhase, 
  type PushupLevel, 
  type ExamResult,
  EXAM_CONFIGS,
} from '../types';
import {   formatDate } from '../utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface ExamFormProps {
  examPhase: ExamPhase;
  onSubmit: (result: ExamResult) => void;
}

export const ExamForm = ({ examPhase, onSubmit }: ExamFormProps) => {
  const [selectedOption, setSelectedOption] = React.useState<string>('');
  
  if (examPhase === 'completed') return null;
  
  const examDay = examPhase === 'day0' ? 0 : examPhase === 'day6' ? 6 : 12;
  const config = EXAM_CONFIGS[examDay];

  const handleSubmit = () => {
    const level: PushupLevel = selectedOption as PushupLevel ; //TODO
    const pushupRange = config.options.find((opt) => opt.level === level)?.label!;
    const result: ExamResult = {
      pushupRange,
      level,
      date: formatDate(new Date())
    };
    
    onSubmit(result);
    setSelectedOption('');
  };
  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>{config.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p>{config.question}</p>
          
          <RadioGroup
            value={selectedOption}
            onValueChange={setSelectedOption}
            className="space-y-4"
          >
            {config.options.map((option, index) => (
              <div key={option.level} className="flex items-center space-x-2">
                <RadioGroupItem data-label={option.label} value={option.level.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option.label} pushups</Label>
              </div>
            ))}
          </RadioGroup>

          <Button 
            onClick={handleSubmit}
            disabled={!selectedOption}
          >
            Submit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};