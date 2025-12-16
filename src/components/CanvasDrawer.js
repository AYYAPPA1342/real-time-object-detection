import React, { useRef, useEffect } from 'react';

const CanvasDrawer = ({ width, height, detections }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !detections) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear previous drawings
    ctx.clearRect(0, 0, width, height);

    // Draw each detection
    detections.forEach(detection => {
      const [x, y, boxWidth, boxHeight] = detection.bbox;
      const text = `${detection.class} (${Math.round(detection.score * 100)}%)`;

      // Draw bounding box
      ctx.strokeStyle = '#00FF00';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, boxWidth, boxHeight);

      // Draw label background
      ctx.fillStyle = '#00FF00';
      const textWidth = ctx.measureText(text).width;
      ctx.fillRect(x, y - 25, textWidth + 10, 25);

      // Draw label text
      ctx.fillStyle = '#000000';
      ctx.font = '18px Arial';
      ctx.fillText(text, x + 5, y - 7);
    });
  }, [detections, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        borderRadius: '10px'
      }}
    />
  );
};

export default CanvasDrawer;