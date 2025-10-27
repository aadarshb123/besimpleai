// Component for creating/editing judges (presentation + form logic)

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { LLM_PROVIDERS, MODEL_OPTIONS } from '@/utils/constants';
import { CreateJudgeInput, LLMProvider } from '@/lib/types';

interface JudgeFormProps {
  onSubmit: (input: CreateJudgeInput) => Promise<void>;
}

const styles = {
  title: 'text-lg font-semibold mb-4',
  form: 'space-y-4',
};

export function JudgeForm({ onSubmit }: JudgeFormProps) {
  const [formData, setFormData] = useState<CreateJudgeInput>({
    name: '',
    systemPrompt: '',
    provider: 'openai',
    modelName: 'gpt-4-turbo-preview',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleProviderChange = (provider: LLMProvider) => {
    // Update provider and reset model to first option for that provider
    const firstModel = MODEL_OPTIONS[provider][0].value;
    setFormData({ ...formData, provider, modelName: firstModel });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Simple validation
    if (!formData.name.trim()) {
      setError('Judge name is required');
      return;
    }
    if (!formData.systemPrompt.trim()) {
      setError('System prompt is required');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      setSuccess('Judge created successfully!');
      // Reset form
      setFormData({
        name: '',
        systemPrompt: '',
        provider: 'openai',
        modelName: 'gpt-4-turbo-preview',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create judge');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <h2 className={styles.title}>Create AI Judge</h2>

      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}

      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Judge Name"
          placeholder="e.g., Accuracy Judge"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          disabled={isSubmitting}
        />

        <Textarea
          label="System Prompt / Rubric"
          placeholder="Enter the evaluation criteria and instructions for this judge..."
          rows={6}
          value={formData.systemPrompt}
          onChange={e => setFormData({ ...formData, systemPrompt: e.target.value })}
          disabled={isSubmitting}
        />

        <Select
          label="Provider"
          options={LLM_PROVIDERS}
          value={formData.provider}
          onChange={e => handleProviderChange(e.target.value as LLMProvider)}
          disabled={isSubmitting}
        />

        <Select
          label="Model"
          options={MODEL_OPTIONS[formData.provider]}
          value={formData.modelName}
          onChange={e => setFormData({ ...formData, modelName: e.target.value })}
          disabled={isSubmitting}
        />

        <Button type="submit" isLoading={isSubmitting}>
          Create Judge
        </Button>
      </form>
    </Card>
  );
}
