const EMERGENCY_SYMPTOMS = [
  'chest_pain',
  'chest pain',
  'breathing_difficulty',
  'breathlessness',
  'severe breathing difficulty',
  'loss_of_consciousness',
  'loss of consciousness',
  'fainting',
  'severe_bleeding',
  'severe bleeding',
  'high_fever',
  'high fever',
  'seizures',
  'convulsions',
  'paralysis',
  'sudden weakness',
  'severe_headache',
  'severe headache',
  'blurred_vision',
  'sudden vision loss',
];
const EMERGENCY_DISEASES = [
  'heart attack',
  'myocardial infarction',
  'stroke',
  'cerebrovascular accident',
  'pneumonia',
  'severe infection',
  'meningitis',
  'sepsis',
  'pulmonary embolism',
  'anaphylaxis',
];
function isEmergencyCondition(symptoms, diseases) {
  const lowerSymptoms = symptoms.map((s) => s.toLowerCase().replace(/_/g, ' '));
  const lowerDiseases = diseases.map((d) => d.toLowerCase());
  const hasEmergencySymptom = lowerSymptoms.some(
    (s) => EMERGENCY_SYMPTOMS.some((es) => s.includes(es.replace(/_/g, ' ')) || es.replace(/_/g, ' ').includes(s)),
  );
  const hasEmergencyDisease = lowerDiseases.some(
    (d) => EMERGENCY_DISEASES.some((ed) => d.includes(ed) || ed.includes(d)),
  );
  return hasEmergencySymptom || hasEmergencyDisease;
}
function computeHospitalScore(h) {
  let score = h.distance;
  if (h.emergency) score -= 2;
  const oh = (h.openingHours || '').toLowerCase();
  if (oh.includes('24') || oh === '24/7') score -= 1;
  if (h.phone) score -= 0.5;
  return score;
}
export {
  EMERGENCY_DISEASES,
  EMERGENCY_SYMPTOMS,
  computeHospitalScore,
  isEmergencyCondition,
};
