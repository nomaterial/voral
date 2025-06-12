interface ResultPlayerProps {
  url: string
}

export default function ResultPlayer({ url }: ResultPlayerProps) {
  return (
    <audio
      controls
      src={url}
      className="mt-4 w-full rounded border"
    >
      Votre navigateur ne supporte pas l’élément audio.
    </audio>
  )
}
