import { Loader2 } from 'lucide-react';

const LoadingState = ({
  message = 'Loading...',
  size = 'md',
  className = '',
}) => {
  const sizes = {
    sm: { spinner: 'w-5 h-5', text: 'text-sm', padding: 'py-8' },
    md: { spinner: 'w-8 h-8', text: 'text-base', padding: 'py-16' },
    lg: { spinner: 'w-12 h-12', text: 'text-lg', padding: 'py-24' },
  };

  const s = sizes[size];

  return (
    <div
      className={`
        flex flex-col items-center justify-center ${s.padding}
        animate-fade-in ${className}
      `}
    >
      <Loader2 className={`${s.spinner} text-primary animate-spin mb-3`} />
      {message && (
        <p className={`${s.text} text-text-tertiary font-medium`}>{message}</p>
      )}
    </div>
  );
};

export default LoadingState;
