
import React, { useState, useRef, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

const WasteClassifier = () => {
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadModel = async () => {
    setLoading(true);
    try {
      const model = await mobilenet.load({
        version: 2,
        alpha: 1.0,
        modelUrl: 'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v2_100_224/classification/4/model.json',
      });
      setModel(model);
    } catch (error) {
      console.error('Error loading model:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraOpen(true);
        if (!model) {
          loadModel();
        }
      } catch (error) {
        console.error('Error opening camera:', error);
      }
    }
  };

  const classifyImage = async () => {
    if (model && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const predictions = await model.classify(imageData);
        mapPredictionsToWasteCategory(predictions);
      }
    }
  };

  const mapPredictionsToWasteCategory = (predictions: { className: string; probability: number }[]) => {
    const plasticKeywords = ['plastic bag', 'wrapper', 'packet'];
    const metalKeywords = ['tin can', 'aluminum can', 'can'];
    const paperKeywords = ['paper', 'notebook', 'cardboard'];
    const glassKeywords = ['glass bottle', 'wine bottle'];

    for (const prediction of predictions) {
      const className = prediction.className.toLowerCase();
      if (plasticKeywords.some(keyword => className.includes(keyword))) {
        setResult('Plastic Waste');
        return;
      }
      if (metalKeywords.some(keyword => className.includes(keyword))) {
        setResult('Metal Waste');
        return;
      }
      if (paperKeywords.some(keyword => className.includes(keyword))) {
        setResult('Paper Waste');
        return;
      }
      if (glassKeywords.some(keyword => className.includes(keyword))) {
        setResult('Glass Waste');
        return;
      }
    }
    setResult('Other/Unknown');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      {!cameraOpen ? (
        <button onClick={openCamera} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
          Scan
        </button>
      ) : (
        <div>
          <video ref={videoRef} autoPlay style={{ width: '100%', maxWidth: '500px', borderRadius: '10px' }} />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <button onClick={classifyImage} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', marginTop: '10px' }}>
            Scan the Image
          </button>
        </div>
      )}
      {loading && <p>Loading model...</p>}
      {result && <p>Prediction: {result}</p>}
    </div>
  );
};

export default WasteClassifier;
