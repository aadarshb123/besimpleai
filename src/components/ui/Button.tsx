// Reusable Button component with consistent styling

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

const styles = {
  base: 'px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md min-w-[80px]',
  variants: {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 !bg-[#eda436]',
    secondary: 'bg-white text-gray-700 border-2 border-gray-300 hover:border-primary-400 hover:bg-primary-50',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
  },
};

export function Button({
  variant = 'primary',
  isLoading = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${styles.base} ${styles.variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
}
