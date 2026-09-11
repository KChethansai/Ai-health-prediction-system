const symptomRelations = {
  'High Fever': ['Chills', 'Sweating', 'Fatigue', 'Headache', 'Shivering', 'Dehydration'],
  'Mild Fever': ['Fatigue', 'Headache', 'Malaise', 'Chills'],
  'Cough': ['Breathlessness', 'Phlegm', 'Throat Irritation', 'Chest Pain', 'Fatigue', 'High Fever'],
  'Headache': ['Dizziness', 'Nausea', 'Blurred And Distorted Vision', 'Fatigue', 'Neck Pain'],
  'Fatigue': ['Lethargy', 'Weakness In Limbs', 'Muscle Weakness', 'Weight Loss', 'Malaise'],
  'Itching': ['Skin Rash', 'Nodal Skin Eruptions', 'Dischromic Patches', 'Red Spots Over Body'],
  'Skin Rash': ['Itching', 'Nodal Skin Eruptions', 'Pus Filled Pimples', 'Blister', 'Skin Peeling'],
  'Vomiting': ['Nausea', 'Stomach Pain', 'Dehydration', 'Diarrhoea', 'Loss Of Appetite'],
  'Nausea': ['Vomiting', 'Loss Of Appetite', 'Stomach Pain', 'Dizziness', 'Headache'],
  'Joint Pain': ['Muscle Pain', 'Swelling Joints', 'Movement Stiffness', 'Back Pain', 'Knee Pain'],
  'Chest Pain': ['Breathlessness', 'Fast Heart Rate', 'Palpitations', 'Sweating', 'Anxiety'],
  'Breathlessness': ['Cough', 'Chest Pain', 'Fast Heart Rate', 'Fatigue', 'Phlegm'],
  'Stomach Pain': ['Nausea', 'Vomiting', 'Acidity', 'Indigestion', 'Loss Of Appetite', 'Constipation'],
  'Back Pain': ['Neck Pain', 'Joint Pain', 'Muscle Pain', 'Stiff Neck', 'Movement Stiffness'],
  'Dizziness': ['Headache', 'Nausea', 'Blurred And Distorted Vision', 'Loss Of Balance', 'Fatigue'],
  'Anxiety': ['Depression', 'Mood Swings', 'Irritability', 'Restlessness', 'Fatigue'],
  'Weight Loss': ['Fatigue', 'Loss Of Appetite', 'Lethargy', 'Dehydration', 'Muscle Wasting'],
  'Burning Micturition': ['Dark Urine', 'Bladder Discomfort', 'Foul Smell Of Urine', 'Continuous Feel Of Urine'],
  'Constipation': ['Stomach Pain', 'Abdominal Pain', 'Passage Of Gases', 'Distention Of Abdomen'],
  'Diarrhoea': ['Stomach Pain', 'Dehydration', 'Nausea', 'Vomiting', 'Abdominal Pain'],
  'Chills': ['High Fever', 'Shivering', 'Sweating', 'Fatigue', 'Headache'],
  'Muscle Pain': ['Joint Pain', 'Fatigue', 'Back Pain', 'Weakness In Limbs', 'Cramps'],
  'Depression': ['Anxiety', 'Mood Swings', 'Fatigue', 'Loss Of Appetite', 'Restlessness'],
  'Acidity': ['Stomach Pain', 'Indigestion', 'Nausea', 'Ulcers On Tongue', 'Chest Pain'],
  'Swelling Joints': ['Joint Pain', 'Movement Stiffness', 'Painful Walking', 'Muscle Weakness'],
};
function getRelatedSymptoms(selectedSymptoms) {
  const related = /* @__PURE__ */ new Set();
  selectedSymptoms.forEach((s) => {
    const relatives = symptomRelations[s];
    if (relatives) {
      relatives.forEach((r) => {
        if (!selectedSymptoms.includes(r)) related.add(r);
      });
    }
  });
  return Array.from(related).slice(0, 8);
}
export {
  getRelatedSymptoms,
  symptomRelations,
};
