import { Injectable } from '@angular/core';
import * as tf from '@tensorflow/tfjs';


@Injectable({
  providedIn: 'root'
})
export class TicketIaService {

  constructor() { }
private model: tf.LayersModel | null = null;
  private readonly MODEL_URL = 'https://storage.googleapis.com/tm-model/_QiOJeXv5/model.json';

  async loadModel() {
    if (!this.model) {
      await tf.setBackend('webgl'); // o 'cpu' si tienes problemas
      await tf.ready();
      this.model = await tf.loadLayersModel(this.MODEL_URL);
      console.log('Modelo cargado correctamente');
    }
  }

  async predict(imageElement: HTMLImageElement): Promise<{ label: string, confidence: number }> {
    if (!this.model) {
      await this.loadModel();
    }

    // Preprocesar la imagen
    const tensor = tf.browser.fromPixels(imageElement)
      .resizeNearestNeighbor([224, 224])
      .toFloat()
      .div(tf.scalar(255.0))
      .expandDims();

    const prediction = this.model!.predict(tensor) as tf.Tensor;
    const values = await prediction.data();
    console.log("predicciones", values);


    const labels = ['TicketScan', 'FotoTicket', 'digitalTicket', 'noTicket']; // Ajusta si usaste otros nombres

    const maxIndex = values.indexOf(Math.max(...values));
    return {
      label: labels[maxIndex],
      confidence: values[maxIndex]
    };
  }

}
