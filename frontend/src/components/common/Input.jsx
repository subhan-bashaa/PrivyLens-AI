import { forwardRef } from 'react';

const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      icon: Icon,
      iconRight: IconRight,
      className = '',
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-text-primary"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full rounded-lg border bg-card text-text-primary
              placeholder:text-text-tertiary
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
              disabled:opacity-50 disabled:cursor-not-allowed
              ${Icon ? 'pl-10' : 'pl-4'}
              ${IconRight ? 'pr-10' : 'pr-4'}
              py-2.5 text-base
              ${error ? 'border-danger focus:ring-danger/20 focus:border-danger' : 'border-border'}
            `}
            {...props}
          />
          {IconRight && (
            <IconRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          )}
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-text-tertiary">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
