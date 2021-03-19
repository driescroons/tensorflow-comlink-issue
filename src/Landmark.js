import React, { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
import Webcam from "react-webcam";
import { drawMesh } from "./utilities";
import "./Landmark.css";

function Landmark() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const context = useRef(null);
  const modelRef = useRef(null);

  const [predictions, setPredictions] = useState([]);
  const [webcamLoaded, setWebcamLoaded] = useState(false);

  const runFacemesh = async () => {
    modelRef.current = await facemesh.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.8
    });

    requestAnimationFrame(detect);
  };

  const detect = async () => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const predictions = await modelRef.current.estimateFaces(video);
      setPredictions(predictions)
    }

    requestAnimationFrame(detect);
  };

  useEffect(() => {
    if (webcamLoaded) {
      context.current = canvasRef.current.getContext('2d');

      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      runFacemesh();
    }
  }, [webcamLoaded]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        typeof webcamRef.current !== "undefined" &&
        webcamRef.current !== null &&
        webcamRef.current.video.readyState === 4
      ) {
        setWebcamLoaded(true);
        clearInterval(interval);
      }
    }, 100);
  }, []);

  useEffect(() => {
    if (predictions.length > 0) {
      context.current.clearRect(0, 0, webcamRef.current.video.videoWidth, webcamRef.current.video.videoHeight);
      drawMesh(predictions, context.current);   
    }
  }, [predictions])

  return (
    <div className="App">
      <header className="App-header">
        <h1>This is model of facial landmark detection</h1>
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            // zindex: 9,
            width: 640,
            height: 480
          }}
        />
        <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          width: 640,
          height: 480
        }}
      />
      </header>
    </div>
  );
}

export default Landmark;
