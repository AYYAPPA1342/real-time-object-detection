import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import WebcamStream from './WebcamStream';
import CanvasDrawer from './CanvasDrawer';

const ObjectDetector = () => {
  const [model, setModel] = useState(null);
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const videoWidth = 640;
  const videoHeight = 480;

  // Load the COCO-SSD model
  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
        setLoading(false);
      } catch (err) {
        setError('Failed to load AI model. Please refresh the page.');
        setLoading(false);
      }
    };

    loadModel();
  }, []);

  // Handle video frame processing
  const handleFrame = async (video) => {
    if (!model) return;

    try {
      const predictions = await model.detect(video);
      setDetections(predictions);
    } catch (err) {
      console.error('Detection error:', err);
    }
  };

  // Toggle camera
  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    if (!isCameraOn) {
      setDetections([]);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading AI model... This may take a moment</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="detector-container">
      <h1>Real-Time Object Detection</h1>
      <p className="subtitle">AI-powered object detection using TensorFlow.js</p>
      
      <div className="control-panel">
        <button onClick={toggleCamera} className="camera-btn">
          {isCameraOn ? 'Turn Off Camera' : 'Start Detection'}
        </button>
        <div className="stats">
          <span>Detected Objects: {detections.length}</span>
        </div>
      </div>

      {isCameraOn && (
        <div className="video-container">
          <WebcamStream
            onFrame={handleFrame}
            width={videoWidth}
            height={videoHeight}
          />
          <CanvasDrawer
            width={videoWidth}
            height={videoHeight}
            detections={detections}
          />
        </div>
      )}

      {detections.length > 0 && (
        <div className="detections-list">
          <h3>Detected Objects:</h3>
          <ul>
            {detections.map((det, index) => (
              <li key={index}>
                <span className="object-class">{det.class}</span>
                <span className="object-confidence">
                  {Math.round(det.score * 100)}% confidence
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="info-box">
        <h4>This AI can detect 80+ objects including:</h4>
        <p>Person, Car, Dog, Cat, Phone, Laptop, Cup, Chair, Bottle, etc.</p>
        <p className="tech-info">Powered by TensorFlow.js & COCO-SSD model</p>
      </div>
    </div>
  );
};

export default ObjectDetector;