// Reusable Textarea component

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const styles = {
  container: 'space-y-1',
  label: 'block text-sm font-medium text-gray-700',
  textarea: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
  error: 'text-sm text-red-600',
};

export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}
      <textarea className={`${styles.textarea} ${className}`} {...props} />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
