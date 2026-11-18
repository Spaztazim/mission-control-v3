import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger';

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-surface hover:shadow-[0_0_20px_var(--primary)] hover:-translate-y-0.5',
  outline: 'border border-primary text-primary hover:bg-primary hover:text-surface',
  ghost: 'text-dim hover:text-foreground hover:bg-highlight',
  danger: 'bg-danger/20 text-danger border border-danger/30 hover:bg-danger hover:text-white',
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  const sizeStyles = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
