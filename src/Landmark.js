import React, { useEffect, useRef, useState } from "react";
import * as Comlink from 'comlink';
import Webcam from "react-webcam";

// eslint-disable-next-line import/no-webpack-loader-syntax
import WorkerLoader from 'comlink-loader!./worker';

import { drawMesh } from "./utilities";
import "./Landmark.css";

function Landmark() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const context = useRef(null);
  // const modelRef = useRef(null);

  const [predictions, setPredictions] = useState([]);
  const [webcamLoaded, setWebcamLoaded] = useState(false);
  const [workerLoaded, setWorkerLoaded] = useState(false);

  const workerRef = useRef(null);

  const runFacemesh = async () => {
    requestAnimationFrame(detect);
  };

  const detect = async () => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video
      const predictions = await workerRef.current.predict(Comlink.proxy(video));
      setPredictions(predictions)
    }

    // console.log(await workerRef.current.predict());

    requestAnimationFrame(detect);
  };

  useEffect(() => {
    if (webcamLoaded && workerLoaded) {
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
  }, [webcamLoaded, workerLoaded]);

  useEffect(() => {
    (async () => {
      const { Worker } = new WorkerLoader();
      workerRef.current = await new Worker();
      await Worker.load();
      setWorkerLoaded(true);
    })();

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
