export class Worker {
  static model = false;
  static counter = 0;
  static load = async () => {
    Worker.model = true;
  }

  predict = async () => {
    if (!Worker.model) await Worker.load();
    
    if (Worker.model) {
      Worker.counter++;
    }
    return Worker.counter;
  } 
}