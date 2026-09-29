const variants = {
  success: 'bg-success-light text-success-dark',
  warning: 'bg-warning-light text-warning-dark',
  danger: 'bg-danger-light text-danger-dark',
  info: 'bg-info-light text-info-dark',
  neutral: 'bg-border-light text-text-secondary',
  primary: 'bg-primary/10 text-primary',
  accent: 'bg-accent/10 text-accent-dark',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-sm',
};

const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {dot && (
        <span
          className={`
            w-1.5 h-1.5 rounded-full
            ${variant === 'success' ? 'bg-success' : ''}
            ${variant === 'warning' ? 'bg-warning' : ''}
            ${variant === 'danger' ? 'bg-danger' : ''}
            ${variant === 'info' ? 'bg-info' : ''}
            ${variant === 'neutral' ? 'bg-text-tertiary' : ''}
            ${variant === 'primary' ? 'bg-primary' : ''}
            ${variant === 'accent' ? 'bg-accent' : ''}
          `}
        />
      )}
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </span>
  );
};

export default Badge;
