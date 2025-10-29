// Component for data visualization charts

import { useMemo } from 'react';
import { Evaluation } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ResultsChartsProps {
  evaluations: Evaluation[];
}

const COLORS = {
  pass: '#5f8f4f',    // BeSimple AI green
  fail: '#dc2626',    // Red
  inconclusive: '#eda436', // BeSimple AI orange
};

const styles = {
  container: 'grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6',
  chartCard: 'p-6',
  title: 'text-lg font-semibold text-gray-900 mb-4',
  emptyState: 'text-center py-12 text-gray-500',
};

export function ResultsCharts({ evaluations }: ResultsChartsProps) {
  // Calculate pass rate by judge
  const judgeData = useMemo(() => {
    const judgeMap = new Map<string, { name: string; passed: number; failed: number; total: number }>();

    evaluations.forEach(evaluation => {
      const existing = judgeMap.get(evaluation.judgeId) || {
        name: evaluation.judgeName,
        passed: 0,
        failed: 0,
        total: 0,
      };

      existing.total++;
      if (evaluation.verdict === 'pass') {
        existing.passed++;
      } else if (evaluation.verdict === 'fail') {
        existing.failed++;
      }

      judgeMap.set(evaluation.judgeId, existing);
    });

    return Array.from(judgeMap.values()).map(judge => ({
      name: judge.name,
      'Pass Rate': Math.round((judge.passed / judge.total) * 100),
      'Total Evals': judge.total,
    }));
  }, [evaluations]);

  // Calculate verdict distribution
  const verdictData = useMemo(() => {
    const counts = {
      pass: 0,
      fail: 0,
      inconclusive: 0,
    };

    evaluations.forEach(evaluation => {
      counts[evaluation.verdict]++;
    });

    return [
      { name: 'Pass', value: counts.pass },
      { name: 'Fail', value: counts.fail },
      { name: 'Inconclusive', value: counts.inconclusive },
    ].filter(item => item.value > 0); // Only show non-zero values
  }, [evaluations]);

  if (evaluations.length === 0) {
    return (
      <Card className={styles.chartCard}>
        <h3 className={styles.title}>Performance Analytics</h3>
        <div className={styles.emptyState}>
          No evaluation data available for visualization.
        </div>
      </Card>
    );
  }

  return (
    <div className={styles.container}>
      {/* Pass Rate by Judge */}
      <Card className={styles.chartCard}>
        <h3 className={styles.title}>Pass Rate by Judge</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={judgeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis
              label={{ value: 'Pass Rate (%)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="Pass Rate" fill="#5f8f4f" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Verdict Distribution */}
      <Card className={styles.chartCard}>
        <h3 className={styles.title}>Verdict Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={verdictData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value, percent }) =>
                `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {verdictData.map((entry) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
