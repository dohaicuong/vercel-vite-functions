import { useEffect, useState } from 'react'

export const useDisplayMedia = (enable: boolean = true) => {
  const [stream, setStream] = useState<MediaStream>()

  useEffect(() => {
    const start = async () => {
      const payload = await getDisplayMedia()
      if (payload.name === 'GET_MEDIA_STREAM_FAILED') return console.log(payload)

      setStream(payload.stream)
    }

    if (enable) start()
  }, [enable])

  return stream
}

type GetDisplayMediaPayload =
  | { name: 'GET_MEDIA_STREAM_SUCCESS', stream: MediaStream }
  | { name: 'GET_MEDIA_STREAM_FAILED', error: unknown }

const getDisplayMedia = async (): Promise<GetDisplayMediaPayload> => {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia()
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
