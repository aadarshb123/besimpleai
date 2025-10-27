// Reusable Card component for content containers

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const styles = {
  card: 'bg-white rounded-lg shadow p-6',
};

export function Card({ children, className = '' }: CardProps) {
  return <div className={`${styles.card} ${className}`}>{children}</div>;
}
