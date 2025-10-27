// Alert component for messages (success, error, info)

interface AlertProps {
  type: 'success' | 'error' | 'info';
  message: string;
}

const styles = {
  base: 'p-4 rounded-lg mb-4',
  types: {
    success: 'bg-green-50 text-green-800 border border-green-200',
    error: 'bg-red-50 text-red-800 border border-red-200',
    info: 'bg-blue-50 text-blue-800 border border-blue-200',
  },
};

export function Alert({ type, message }: AlertProps) {
  return (
    <div className={`${styles.base} ${styles.types[type]}`}>
      {message}
    </div>
  );
}
