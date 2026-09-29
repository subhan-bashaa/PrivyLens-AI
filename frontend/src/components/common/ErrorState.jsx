import { AlertTriangle } from 'lucide-react';
import Button from './Button';

const ErrorState = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  retryLabel = 'Try Again',
  className = '',
}) => {
  return (
    <div
      className={`
        flex flex-col items-center justify-center py-16 px-6 text-center
        animate-fade-in ${className}
      `}
    >
      <div className="w-16 h-16 rounded-2xl bg-danger-light flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-danger" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-tertiary max-w-sm mb-6">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} size="md">
          {retryLabel}
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
