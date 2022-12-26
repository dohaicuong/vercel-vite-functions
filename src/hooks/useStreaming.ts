import { useRef } from 'react'
import { WHIPClient } from "@eyevinn/whip-web-client"
import { useUserMedia } from './useUserMedia'

import { createMachine } from 'xstate'
import { useMachine } from '@xstate/react'
import { trpc } from '../providers/trpc'

export const useStreaming = () => {
  const [state, send] = useMachine(userStreamingMachine)
  const videoIngestRef = useRef<HTMLVideoElement>(null)
  const { mutateAsync: createSession } = trpc.stream_session.create_session.useMutation()

  const stream = useUserMedia({
    enable: !state.matches('idle'),
    onReady: stream => {
      send('GOT_MEDIA')
      videoIngestRef.current!.srcObject = stream
    }
  })

  const onGetMediaStream = () => send('GET_MEDIA')

  const onStartStreaming = async () => {
    if (!videoIngestRef.current || !stream) return

    const data = await createSession({ name: 'Streaming Dota' })
    send('GOT_STREAM_SESSION')

    const client = new WHIPClient({
      endpoint: data.streamUrl,
      opts: { debug: true, iceServers: [{ urls: 'stun:stun.l.google.com:19320' }] }
    })
    await client.setIceServersFromEndpoint()
    
    await client.ingest(stream)
  }

  return [state, videoIngestRef, onGetMediaStream, onStartStreaming] as const
}

const userStreamingMachine = createMachine({
  id: 'userStreaming',
  initial: 'idle',
  states: {
    idle: {
      on: { GET_MEDIA: 'get_media' }
    },
    get_media: {
      on: { GOT_MEDIA: 'got_media' }
    },
    got_media: {
      on: { GOT_STREAM_SESSION: 'got_stream_session' }
    },
    got_stream_session: {}
  },
})
