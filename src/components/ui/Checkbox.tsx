// Reusable Checkbox component

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const styles = {
  container: 'flex items-center gap-2',
  checkbox: 'w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500',
  label: 'text-sm text-gray-700',
};

export function Checkbox({ label, className = '', ...props }: CheckboxProps) {
  return (
    <label className={styles.container}>
      <input
        type="checkbox"
        className={`${styles.checkbox} ${className}`}
        {...props}
      />
      <span className={styles.label}>{label}</span>
    </label>
  );
}
