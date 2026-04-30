export function RecordingPlaceholder() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Background image */}
      <img
        src="/recording-placeholder.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Subtle dark overlay for text legibility */}
      <div className="absolute inset-0 bg-black/30" />

    </div>
  );
}
