import { Button, CircularProgress, Container, Paper, Stack, styled } from '@mui/material'
import { useStreaming } from '../hooks/useStreaming'

export const StreamPage = () => {
  const [videoIngestRef, state, onGetMediaStream, onStartStreaming, onStopStreaming] = useStreaming()

  return (
    <StyledContainer maxWidth='lg'>
      <Stack sx={{ width: '100%' }} spacing={2}>
        {state.matches('idle') && (
          <Button onClick={onGetMediaStream} variant='contained'>
            Get video
          </Button>
        )}
        {state.matches('got_media') && (
          <Button onClick={onStartStreaming} variant='contained'>
            Start streaming
          </Button>
        )}
        {state.matches('streaming') && (
          <Button onClick={onStopStreaming} variant='contained' color='error'>
            Stop streaming
          </Button>
        )}
        <StyledPaper elevation={2} sx={{ p: 2 }}>
          {!state.matches('streaming') && !state.matches('idle') && <Loading />}
          <video
            ref={videoIngestRef}
            autoPlay
            playsInline
            style={{ width: '100%' }}
          />
        </StyledPaper>
      </Stack>
    </StyledContainer>
  )
}

const Loading = () => (
  <>
    <Backdrop />
    <CircularProgress sx={{ position: 'absolute' }} />
  </>
)

const Backdrop = styled('div')(({ theme }) => `
  position: absolute;
  width: 98%;
  height: 97%;
  background: ${theme.palette.grey['900']};
  opacity: 0.7;
`)

const StyledPaper = styled(Paper)`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`

const StyledContainer = styled(Container)`
  height: 100vh;
  display: flex;
  align-items: center;
`
