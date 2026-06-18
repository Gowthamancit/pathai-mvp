export default function ProgressBar({ 
  percent, 
  color = 'teal',
  label 
}: { 
  percent: number
  color?: 'teal' | 'gold' | 'red'
  label?: string 
}) {
  const colorClass = {
    teal: 'bg-teal-500',
    gold: 'bg-amber-400',
    red: 'bg-red-400'
  }[color]

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">{label}</span>
          <span className="font-semibold text-gray-800">{percent}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className={`${colorClass} h-3 rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
        />
      </div>
    </div>
  )
}
