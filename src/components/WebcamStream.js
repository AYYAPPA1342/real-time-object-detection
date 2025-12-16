import React, { useRef, useEffect } from 'react';
import Webcam from 'react-webcam';

const WebcamStream = ({ onFrame, width, height }) => {
  const webcamRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (webcamRef.current && webcamRef.current.video.readyState === 4) {
        const video = webcamRef.current.video;
        onFrame(video);
      }
    }, 100); // Process frame every 100ms

    return () => clearInterval(interval);
  }, [onFrame]);

  return (
    <div style={{ position: 'relative', width, height }}>
      <Webcam
        ref={webcamRef}
        width={width}
        height={height}
        style={{
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
        }}
        videoConstraints={{
          facingMode: 'user'
        }}
        audio={false}
      />
    </div>
  );
};

export default WebcamStream;