import React, { useEffect, useRef, useState } from 'react'
import videojs from 'video.js'
import '../../node_modules/videojs-youtube/dist/Youtube.min.js'
import '../../node_modules/video.js/dist/video-js.min.css'
import './VideoJs.css'

const VideoPlayer = ({ options, sources }) => {
  const [timejsx, settimejsx] = useState()
  const videoRef = useRef(null)
  const playerRef = useRef(null)
  const theindex = useRef(0)
  const pertinentInfo = useRef([])
  const currentTimeRef = useRef(0)
  const duration = useRef(0)

  useEffect(() => {
    let player = playerRef.current

    if (!player) {
      if (!videoRef.current) return
      playerRef.current = videojs(videoRef.current, options)
      playerRef.current.src(sources[theindex.current])
    } else {
      player.on('ended', function () {
        theindex.current++
        player.src(sources[theindex.current])
      })

      playerRef.current.autoplay(true)

      //// Getting Pertinent Information ////
      playerRef.current.on(
        'play',
        () =>
          (pertinentInfo.current = ['Video is now playing'].concat(
            pertinentInfo.current
          ))
      )

      playerRef.current.on(
        'pause',
        () =>
          (pertinentInfo.current = ['Video is now paused'].concat(
            pertinentInfo.current
          ))
      )

      playerRef.current.on(
        'ended',
        () =>
          (pertinentInfo.current = ['Video has ended'].concat(
            pertinentInfo.current
          ))
      )

      playerRef.current.on(
        'loadeddata',
        () =>
          (pertinentInfo.current = [
            'The player has downloaded data at the current playback position',
          ].concat(pertinentInfo.current))
      )

      playerRef.current.on(
        'loadeddata',
        () => (duration.current = playerRef.current.cache_.duration)
      )

      playerRef.current.on(
        'timeupdate',
        () => (
          (currentTimeRef.current = playerRef.current.currentTime()),
          settimejsx(playerRef.current.currentTime())
        )
      )

      playerRef.current.on(
        'useractive',
        () =>
          (pertinentInfo.current = [
            'The user is active, e.g. moves the mouse over the player',
          ].concat(pertinentInfo.current))
      )

      playerRef.current.on(
        'userinactive',
        () =>
          (pertinentInfo.current = [
            'The user is inactive, e.g. a short delay after the last mouse move or control interaction',
          ].concat(pertinentInfo.current))
      )

      ////////////////////////////////////
    }

    //// Grabs the duration after metadata has been loaded ///
    if (playerRef.current.readyState() < 1) {
      playerRef.current.one('loadedmetadata', onLoadedMetadata)
    } else {
      onLoadedMetadata()
    }
    function onLoadedMetadata() {
      duration.current = playerRef.current.cache_.duration
    }

    //// Disposes of the player //
    return () => {
      if (player) {
        player.dispose()
        playerRef.current = null
      }
    }
  }, [options, videoRef, playerRef])

  ////// Button Functionality /////

  /// The Player State ///
  const [thePlayerState, setThePlayerState] = useState({
    isPlaying: false,
    progress: 0,
    speed: 1,
    isMuted: false,
  })
  /// Play/Pause ///
  const togglePlay = () => {
    setThePlayerState({
      ...thePlayerState,
      isPlaying: !thePlayerState.isPlaying,
    })
  }

  useEffect(() => {
    thePlayerState.isPlaying
      ? playerRef.current.play()
      : playerRef.current.pause()
  }, [thePlayerState.isPlaying, playerRef.current])

  /// ProgressBar / Time ///
  useEffect(() => {
    const progress = (currentTimeRef.current / duration.current) * 100
    setThePlayerState({
      ...thePlayerState,
      progress,
    })
  }, [currentTimeRef.current])

  const handleVideoProgress = (event) => {
    var manualChange = Number(event.target.value)

    playerRef.current.currentTime(
      (playerRef.current.duration() / 100) * manualChange
    )
    setThePlayerState({
      ...thePlayerState,
      progress: manualChange,
    })
  }
  /// Video Speed ///
  const handleVideoSpeed = (event) => {
    const speed = Number(event.target.value)
    playerRef.current.playbackRate(speed)
    setThePlayerState({
      ...thePlayerState,
      speed,
    })
  }

  /// Mute ///
  const toggleMute = () => {
    pertinentInfo.current = ['The volume has been changed'].concat(
      pertinentInfo.current
    )
    setThePlayerState({
      ...thePlayerState,
      isMuted: !thePlayerState.isMuted,
    })
  }

  useEffect(() => {
    thePlayerState.isMuted
      ? playerRef.current.muted(true)
      : playerRef.current.muted(false)
  }, [thePlayerState.isMuted])

  ///////////////////////////////////////////

  return (
    <>
      <div className='container'>
        <div className='video-container'>
          <video ref={videoRef} className='video-js vjs-fill' />
          <div className='controls'>
            <div className='playbutton'>
              <button onClick={togglePlay}>
                {!thePlayerState.isPlaying ? (
                  <i className='bx bx-play'></i>
                ) : (
                  <i className='bx bx-pause'></i>
                )}
              </button>
            </div>

            <div className='display-time'>
              {duration.current < 0.01 || timejsx < 0.01
                ? '00:00 / 00:00'
                : Math.floor(timejsx / 60) +
                  ':' +
                  ('0' + Math.floor(timejsx % 60)).slice(-2) +
                  ' / ' +
                  Math.floor(duration.current / 60) +
                  ':' +
                  ('0' + Math.floor(duration.current % 60)).slice(-2)}
            </div>

            <input
              type='range'
              min='0'
              max='100'
              value={thePlayerState.progress}
              onChange={(e) => handleVideoProgress(e)}
            />
            <select
              className='playbackspeed'
              value={thePlayerState.speed}
              onChange={(e) => handleVideoSpeed(e)}
            >
              <option value='0.50'>0.50x</option>
              <option value='1'>1x</option>
              <option value='1.25'>1.25x</option>
              <option value='2'>2x</option>
            </select>
            <button className='mute-button' onClick={toggleMute}>
              {!thePlayerState.isMuted ? (
                <i className='bx bxs-volume-full'></i>
              ) : (
                <i className='bx bxs-volume-mute'></i>
              )}
            </button>
          </div>
        </div>
        <div className='pertinentinformation'>
          {pertinentInfo.current.map((item) => (
            <li key={item.index}>{item}</li>
          ))}
        </div>
      </div>
    </>
  )
}

export default VideoPlayer
