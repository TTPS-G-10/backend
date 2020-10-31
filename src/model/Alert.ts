import { Hospital } from "./Hospital";

export class Alert {
  date: Date;
  patientName: string;
  text: string;
  watched: boolean;

  constructor(patientName: string, text: string) {
    this.patientName = patient;
    this.date = new Date();
    this.text = text;
    this.watched = false;
  }
}
