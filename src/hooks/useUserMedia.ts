import { useEffect, useState } from 'react'

type UseUserMedia = {
  enable?: boolean
  onReady?: (stream: MediaStream) => void
}

export const useUserMedia = ({ enable, onReady }: UseUserMedia = { enable: true }) => {
  const [stream, setStream] = useState<MediaStream>()

  useEffect(() => {
    const start = async () => {
      const payload = await getUserMedia()
      if (payload.name === 'GET_MEDIA_STREAM_FAILED') return console.log(payload)

      setStream(payload.stream)
      onReady?.(payload.stream)
    }

    if (enable) start()

    return () => {
      stream?.getTracks().forEach(track => track.stop())
    }
  }, [enable])

  return stream
}

type GetUserMediaPayload =
  | { name: 'GET_MEDIA_STREAM_SUCCESS', stream: MediaStream }
  | { name: 'GET_MEDIA_STREAM_FAILED', error: unknown }

export const getUserMedia = async (): Promise<GetUserMediaPayload> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })
    return {
      name: 'GET_MEDIA_STREAM_SUCCESS',
      stream,
    }
  }
  catch(error) {
    return {
      name: 'GET_MEDIA_STREAM_FAILED',
      error,
    }
  }
}
