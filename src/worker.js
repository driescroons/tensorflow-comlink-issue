import * as tf from "@tensorflow/tfjs";
import * as landmarks from "@tensorflow-models/face-landmarks-detection";

export class Worker {
  static model;
  static load = async () => {
    Worker.model = await landmarks.load(
      landmarks.SupportedPackages.mediapipeFacemesh
  );
  }

  predict = async (video) => {
    if (!Worker.model) await Worker.load();
    
    const predictions = await Worker.model.estimateFaces({
      input: video
    });

    return predictions;
  } 
}