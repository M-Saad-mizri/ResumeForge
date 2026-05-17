interface AdPlaceholderProps {
  label?: string;
  className?: string;
}

const AdPlaceholder = ({ label = 'Advertisement space', className = '' }: AdPlaceholderProps) => {
  if (import.meta.env.PROD) {
    return (
      <div
        className={`min-h-20 w-full rounded-lg border border-dashed border-border bg-muted/30 ${className}`}
        aria-label={label}
      />
    );
  }

  return (
    <div
      className={`flex min-h-20 w-full items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 px-4 py-5 text-center text-xs text-muted-foreground ${className}`}
      aria-label={label}
    >
      {label}. Real Google AdSense code can replace this component after approval.
    </div>
  );
};

export default AdPlaceholder;

/*
  Future AdSense integration notes:
  1. Add the official Google AdSense script from your AdSense account to index.html or a dedicated provider.
  2. Replace this placeholder body with an <ins className="adsbygoogle"> slot using your real data-ad-client and data-ad-slot values.
  3. Keep ad placements away from auth forms, resume editing forms, export buttons, and other sensitive actions.
*/
