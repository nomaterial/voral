interface UploadFieldProps {
  label: string
  onFileSelect: (file: File) => void
}

export default function UploadField({ label, onFileSelect }: UploadFieldProps) {
  return (
    <label className="block mb-4">
      <span className="text-gray-700">{label}</span>
      <input
        type="file"
        accept="audio/*"
        className="mt-1 block w-full rounded border-gray-300"
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) onFileSelect(file)
        }}
      />
    </label>
  )
}
