import { useEffect, useRef } from 'react'
import { WHIPClient } from '@eyevinn/whip-web-client'
import { getUserMedia } from './useUserMedia'

import { assign, createMachine } from 'xstate'
import { useMachine } from '@xstate/react'
import { trpc } from '../providers/trpc'

export const useStreaming = () => {
  const videoIngestRef = useRef<HTMLVideoElement>(null)
  const [state, send, service] = useMachine(userStreamingMachine)
  const { mutateAsync: createSession } = trpc.stream_session.create_session.useMutation()

  const onGetMediaStream = () => send('GET_MEDIA')
  const onStartStreaming = async () => send('GET_STREAM_SESSION')
  const onStopStreaming = async () => send('STOP')

  useEffect(() => {
    const subscription = service.subscribe(async state => {
      if (state.matches('get_media')) {
        const payload = await getUserMedia()
        if (payload.name === 'GET_MEDIA_STREAM_FAILED') {
          return send('GET_MEDIA_ERROR', { error: payload.error })
        }
        
        videoIngestRef.current!.srcObject = payload.stream
        send('GOT_MEDIA', { stream: payload.stream })
      }

      if (state.matches('get_stream_session')) {
        const data = await createSession({ name: 'Streaming Dota' })
        send('GOT_STREAM_SESSION', { streamUrl: data.streamUrl })
      }

      if (state.matches('got_stream_session')) {
        send('READY_TO_STREAM')
      }

      if (state.matches('ready_to_stream')) {
        const client = new WHIPClient({
          endpoint: state.context.streamUrl,
          opts: { debug: true, iceServers: [{ urls: 'stun:stun.l.google.com:19320' }] }
        })
        await client.setIceServersFromEndpoint()
        await client.ingest(state.context.stream)
        send('STREAMING', { client })
      }

      if (state.matches('stopping')) {
        state.context.client.destroy()
        send('STOPPED')
      }
    })

    return subscription.unsubscribe
  }, [service])

  return [videoIngestRef, state, onGetMediaStream, onStartStreaming, onStopStreaming] as const
}

type StreamingMachineContext = {
  stream?: MediaStream
  streamUrl?: string
  client?: WHIPClient
}

type StreamingMachineEvent =
  | { type: 'GET_MEDIA' }
  | { type: 'GET_MEDIA_ERROR', error: unknown }
  | { type: 'GOT_MEDIA', stream: MediaStream }
  | { type: 'GET_STREAM_SESSION'}
  | { type: 'GOT_STREAM_SESSION', streamUrl: string }
  | { type: 'READY_TO_STREAM' }
  | { type: 'STREAMING', client: WHIPClient }
  | { type: 'STOP' }
  | { type: 'STOPPED' }

type StreamingMachineState =
  | { value: 'idle', context: {} }
  | { value: 'get_media', context: {} }
  | {
      value: 'got_media',
      context: {
        stream: MediaStream
      }
    }
  | {
      value: 'get_stream_session',
      context: {
        stream: MediaStream
      }
    }
  | {
      value: 'got_stream_session',
      context: {
        stream: MediaStream
        streamUrl: string
      }
    }
  | {
    value: 'ready_to_stream',
    context: {
      stream: MediaStream
      streamUrl: string
    }
  }
  | {
      value: 'streaming',
      context: {
        stream: MediaStream
        streamUrl: string
        client: WHIPClient
      }
    }
  | {
      value: 'stopping',
      context: {
        stream: MediaStream
        streamUrl: string
        client: WHIPClient
      }
    }

const userStreamingMachine = createMachine<StreamingMachineContext, StreamingMachineEvent, StreamingMachineState>({
  id: 'userStreaming',
  initial: 'idle',
  states: {
    idle: {
      on: { GET_MEDIA: 'get_media' }
    },
    get_media: {
      on: {
        GET_MEDIA_ERROR: 'idle',
        GOT_MEDIA: {
          target: 'got_media',
          actions: assign((_context, event) => ({ stream: event.stream }))
        }
      }
    },
    got_media: {
      on: { GET_STREAM_SESSION: 'get_stream_session' }
    },
    get_stream_session: {
      on: {
        GOT_STREAM_SESSION: {
          target: 'got_stream_session',
          actions: assign((context, event) => {
            return {
              ...context,
              streamUrl: event.streamUrl
            }
          })
        }
      }
    },
    got_stream_session: {
      on: { READY_TO_STREAM: 'ready_to_stream' }
    },
    ready_to_stream: {
      on: {
        STREAMING: {
          target: 'streaming',
          actions: assign((context, event) => {
            return {
              ...context,
              client: event.client
            }
          })
        }
      }
    },
    streaming: {
      on: { STOP: 'stopping' }
    },
    stopping: {
      on: {
        STOPPED: {
          target: 'idle',
          actions: assign(() => ({}))
        }
      }
    }
  }
})
