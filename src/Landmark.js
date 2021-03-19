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

  //  Load posenet
  const runFacemesh = async () => {
    modelRef.current = await facemesh.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.8
    });
    //
    setInterval(() => {
      detect();
    }, 100);

    // requestAnimationFrame(detect);
  };

  const detect = async () => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      // Make Detections
      const predictions = await modelRef.current.estimateFaces(video);
      // setPredictions(predictions);

      // const ctx = canvasRef.current.getContext("2d");

      context.current.clearRect(0, 0, webcamRef.current.video.videoWidth, webcamRef.current.video.videoHeight);
      context.current.fillStyle = "#000000";
      // context.current.fillRect(Math.random() * 100, Math.random() * 100, 20, 20);


      for (let i = 0; i < predictions[0].scaledMesh.length; i++) {
        const x = predictions[0].scaledMesh[i][0];
        const y = predictions[0].scaledMesh[i][1];
        // context.current.fillStyle = "white";
        context.current.fillRect(x, y, 2, 2);
        // context.current.beginPath();
        // context.current.arc(x, y, 1, 0, 3 * Math.PI);

        // context.current.fill();
      }

      // drawMesh(predictions, context.current);   
      // console.log(face);
    }

    // requestAnimationFrame(detect);
  };

  // useEffect(() => {
  //     // Get canvas context
      
      
  // }, [predictions])

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

  console.log('rerendering');

  return (
    <div className="App">
      <header className="App-header">
        <h1>This is model of facial landmark detection</h1>
        <Webcam
          ref={webcamRef}
          style={{
            // position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            // left: 0,
            // right: 0,
            textAlign: "center",
            // zindex: 9,
            width: 640,
            height: 480
          }}
        />
        {/* {(() => console.log('rerendered landmark'))()} */}
        <canvas
        ref={canvasRef}
        style={{
          // position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          // left: 0,
          // right: 0,
          // textAlign: "center",
          // zindex: 9,
          width: 640,
          height: 480
        }}
      />
      </header>
    </div>
  );
}

export default Landmark;
