import { Button } from "@mui/material"
import { useStreaming } from "../../hooks/useStreaming"

export const StreamPage = () => {
  const [state, videoIngestRef, onGetMediaStream, onStartStreaming] = useStreaming()

  return (
    <>
      <video
        ref={videoIngestRef}
        autoPlay
        playsInline
      />
      {state.matches('idle') && (
        <Button onClick={onGetMediaStream}>
          Start
        </Button>
      )}
      {state.matches('got_media') && (
        <Button onClick={onStartStreaming}>
          Start streaming
        </Button>
      )}
    </>
  )
}
