// Reusable Card component for content containers

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const styles = {
  card: 'bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-100',
};

export function Card({ children, className = '' }: CardProps) {
  return <div className={`${styles.card} ${className}`}>{children}</div>;
}
