// src/components/JobStatus/JobStatus.tsx
interface JobStatusProps {
  status: string
}

export default function JobStatus({ status }: JobStatusProps) {
  // Determine colors
  let bgClass = 'bg-gray-100 text-gray-800'
  if (status === 'done') bgClass = 'bg-green-100 text-green-800'
  else if (status === 'pending') bgClass = 'bg-yellow-100 text-yellow-800'
  else if (status === 'error') bgClass = 'bg-red-100 text-red-800'

  return (
    <span className={`px-2 py-1 rounded-full uppercase text-xs ${bgClass}`}>
      {status}
    </span>
  )
}
