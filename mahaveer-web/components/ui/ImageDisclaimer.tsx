export function ImageDisclaimer({ className = "" }: { className?: string }) {
  return (
    <p className={`text-[11px] leading-relaxed text-neutral-400 ${className}`}>
      <span className="font-medium text-neutral-500 not-italic">Please Note:</span>{" "}
      <span className="italic">Images are indicative. Actual paper colour, texture, and finish may vary slightly due to screen display and photography.</span>
    </p>
  );
}
