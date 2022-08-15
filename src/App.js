import React from 'react'
import VideoPlayer from './components/VideoJs'

const App = () => {
  const options = {
    controls: false,
    autoplay: false,
    responsive: true,
    'data-setup': '{"techOrder": ["html5", "youtube", "other supported tech"]}',
    youtube: {
      ytControls: 0,
    },
  }
  let sources = [
    {
      src: 'http://www.youtube.com/watch?v=7CVtTOpgSyY',
      type: 'video/youtube',
    },

    {
      type: 'application/x-mpegURL',
      src: 'http://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8',
    },
    { type: 'video/mp4', src: '//vjs.zencdn.net/v/oceans.mp4' },
  ]

  return <VideoPlayer options={options} sources={sources} />
}

export default App
