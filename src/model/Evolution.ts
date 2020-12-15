export interface Evolution {
  // Mandatory
  temperature: number;
  systolicBloodPressure: number;
  diastolicBloodPressure: number;
  heartRate: number;
  breathingFrequency: number;
  // Optionals
  ventilatoryMechanics?: number;
  requiresSupplementalOxygen?: number;
  nasalOxygenCannula?: number;
  litersPerMinute?: number;
  maskWithReservoir?: number;
  maskValue?: number;
  oxygenSaturation?: number;
  pafi?: number;
  pafiValue?: number;
  proneVigil?: number;
  cough?: number;
  dyspnoea?: number;
  respiratorySymptoms?: number;
  drowsiness?: number;
  anosmia?: number;
  disagreement?: number;
  chestXRay?: number;
  chestXRayPathological?: number;
  chestXRayDescription?: string;
  chestCt?: number;
  chestCtPathological?: number;
  chestCtDescription?: string;
  electrocardiogram?: number;
  electrocardiogramPathological?: number;
  electrocardiogramDescription?: string;
  cReactiveProteinCovid?: number;
  cReactiveProteinCovidPathological?: number;
  creactiveProteinCovidDescription?: string;
  observation?: string;
  arm?: number;
  armDescription?: string;
  tracheostomy?: number;
  vasopressors?: number;
  vasopressorsDescription?: string;
  type?: string;
}
