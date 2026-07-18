export default function Timer({
  timeRemaining,
  isActive,
}: {
  timeRemaining: number;
  isActive: boolean;
}) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const time = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isLowTime = timeRemaining < 30;

  return (
    <div
      className={`rounded-md px-4 py-1 font-mono text-lg font-bold transition-colors ${
        isActive
          ? isLowTime
            ? 'animate-pulse bg-red-600 text-white'
            : 'bg-green-700 text-white'
          : 'bg-neutral-800 text-neutral-400'
      }`}
    >
      {time}
    </div>
  );
}
