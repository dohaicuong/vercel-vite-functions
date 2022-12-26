import fetch from 'cross-fetch'

const {
  CLOUDFLARE_ACCOUNT_ID,
  CLOUDFLARE_STREAM_TOKEN,
} = process.env

type Stream = {
  url: string
  streamKey: string
}

type StreamCreatePayload = {
  result: {
    uid: string
    rtmps: Stream
    rtmpsPlayback: Stream
    srt: Stream
    srtPlayback: Stream
    webRTC: {
      url: string
    }
    webRTCPlayback: {
      url: string
    }
    created: string
    modified: string
  }
  success: boolean
}

export const createCFStreamSession = async (): Promise<StreamCreatePayload> => {
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${CLOUDFLARE_STREAM_TOKEN}`
    }
  })
  
  const data = await res.json()

  return data
}
