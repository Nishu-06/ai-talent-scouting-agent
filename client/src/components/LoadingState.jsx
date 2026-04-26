function LoadingState({ label = "Working on it..." }) {
  return (
    <div className="section-shell flex items-center gap-4">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand/30 border-t-brand" />
      <p className="text-sm text-slate-200">{label}</p>
    </div>
  );
}

export default LoadingState;

