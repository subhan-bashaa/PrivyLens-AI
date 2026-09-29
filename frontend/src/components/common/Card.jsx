const Card = ({
  children,
  header,
  footer,
  padding = 'md',
  hover = false,
  className = '',
  ...props
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`
        bg-card rounded-xl border border-border shadow-sm
        ${hover ? 'hover:shadow-md hover:border-primary/20 transition-all duration-200' : ''}
        ${className}
      `}
      {...props}
    >
      {header && (
        <div className="px-6 py-4 border-b border-border">
          {typeof header === 'string' ? (
            <h3 className="font-semibold text-text-primary text-lg">{header}</h3>
          ) : (
            header
          )}
        </div>
      )}
      <div className={paddings[padding]}>{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t border-border bg-page-bg/50 rounded-b-xl">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
