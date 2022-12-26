import { Button, Grid, List, ListItemButton, ListItemText, Paper, Typography } from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import { trpc } from '../providers/trpc'
import { WebRTCPlayer } from '@eyevinn/webrtc-player'
import { Link } from 'react-router-dom'

export const StreamListPage = () => {
  const { data: sessions } = trpc.stream_session.browse_session.useQuery()
  const [selectSessionId, setSelectedSessionId] = useState<string>()
  const selectedSessionPlaybackUrl = useMemo(() => sessions?.find(session => session.id === selectSessionId)?.playbackUrl, [selectSessionId])

  return (
    <Grid container spacing={2}>
      <Grid item xs>
        <div style={{ display: 'flex' }}>
          <Typography>
            Watch stream
          </Typography>
          <div style={{ flexGrow: 1 }} />
          <Button component={Link} to='streaming'>
            Or streaming
          </Button>
        </div>
        <Paper>
          <List>
            {sessions?.map(session => (
              <ListItemButton
                key={session.id}
                selected={session.id === selectSessionId}
                onClick={() => setSelectedSessionId(session.id)}
              >
                <ListItemText primary={session.name} />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      </Grid>
      <Grid item xs>
       <Player url={selectedSessionPlaybackUrl} />
      </Grid>
    </Grid>
  )
}

type PlayerProps = {
  url?: string
}

const Player: React.FC<PlayerProps> = ({ url }) => {
  const egressVideoRef = useRef<HTMLVideoElement>(null)
  
  const [player, setPlayer] = useState<WebRTCPlayer>()
  useEffect(() => {
    if (egressVideoRef.current) {
      const _player = new WebRTCPlayer({ 
        video: egressVideoRef.current, 
        type: 'whep',
        statsTypeFilter: '^candidate-*|^inbound-rtp'     
      })
      setPlayer(_player)
    }
  }, [])

  useEffect(
    () => {
      console.log({ player, url })

      const start = async (player: WebRTCPlayer, url: string) => {
        await player.load(new URL(url))
      }

      if (url && player) start(player, url)
    },
    [url]
  )

  return <video ref={egressVideoRef} autoPlay playsInline />
}
