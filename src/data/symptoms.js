const symptomCategories = [
  {
    name: "General",
    symptoms: [
      "Fatigue",
      "High Fever",
      "Mild Fever",
      "Chills",
      "Shivering",
      "Sweating",
      "Weight Loss",
      "Weight Gain",
      "Lethargy",
      "Restlessness",
      "Malaise",
      "Dehydration",
      "Obesity",
      "Family History"
    ]
  },
  {
    name: "Head & Neurological",
    symptoms: [
      "Headache",
      "Dizziness",
      "Blurred And Distorted Vision",
      "Visual Disturbances",
      "Lack Of Concentration",
      "Spinning Movements",
      "Loss Of Balance",
      "Unsteadiness",
      "Weakness Of One Body Side",
      "Altered Sensorium",
      "Slurred Speech",
      "Loss Of Smell",
      "Coma"
    ]
  },
  {
    name: "Respiratory",
    symptoms: [
      "Cough",
      "Breathlessness",
      "Phlegm",
      "Throat Irritation",
      "Sinus Pressure",
      "Runny Nose",
      "Congestion",
      "Continuous Sneezing",
      "Mucoid Sputum",
      "Rusty Sputum",
      "Blood In Sputum"
    ]
  },
  {
    name: "Cardiovascular",
    symptoms: [
      "Chest Pain",
      "Fast Heart Rate",
      "Palpitations",
      "Swollen Blood Vessels",
      "Prominent Veins On Calf",
      "Swollen Legs"
    ]
  },
  {
    name: "Digestive",
    symptoms: [
      "Stomach Pain",
      "Acidity",
      "Ulcers On Tongue",
      "Vomiting",
      "Nausea",
      "Indigestion",
      "Loss Of Appetite",
      "Constipation",
      "Abdominal Pain",
      "Diarrhoea",
      "Passage Of Gases",
      "Internal Itching",
      "Belly Pain",
      "Swelling Of Stomach",
      "Distention Of Abdomen",
      "Stomach Bleeding"
    ]
  },
  {
    name: "Skin",
    symptoms: [
      "Itching",
      "Skin Rash",
      "Nodal Skin Eruptions",
      "Dischromic Patches",
      "Yellowish Skin",
      "Skin Peeling",
      "Silver Like Dusting",
      "Pus Filled Pimples",
      "Blackheads",
      "Scurring",
      "Blister",
      "Red Sore Around Nose",
      "Yellow Crust Ooze",
      "Red Spots Over Body"
    ]
  },
  {
    name: "Musculoskeletal",
    symptoms: [
      "Joint Pain",
      "Back Pain",
      "Neck Pain",
      "Knee Pain",
      "Hip Joint Pain",
      "Muscle Weakness",
      "Muscle Wasting",
      "Muscle Pain",
      "Stiff Neck",
      "Swelling Joints",
      "Movement Stiffness",
      "Painful Walking",
      "Weakness In Limbs",
      "Cramps"
    ]
  },
  {
    name: "Urinary",
    symptoms: [
      "Burning Micturition",
      "Spotting Urination",
      "Dark Urine",
      "Yellow Urine",
      "Bladder Discomfort",
      "Foul Smell Of Urine",
      "Continuous Feel Of Urine",
      "Polyuria"
    ]
  },
  {
    name: "Eyes",
    symptoms: [
      "Pain Behind The Eyes",
      "Redness Of Eyes",
      "Watering From Eyes",
      "Yellowing Of Eyes",
      "Sunken Eyes",
      "Puffy Face And Eyes"
    ]
  },
  {
    name: "Endocrine & Metabolic",
    symptoms: [
      "Irregular Sugar Level",
      "Excessive Hunger",
      "Increased Appetite",
      "Enlarged Thyroid",
      "Cold Hands And Feets",
      "Brittle Nails",
      "Swollen Extremeties",
      "Abnormal Menstruation"
    ]
  },
  {
    name: "Mental Health",
    symptoms: [
      "Anxiety",
      "Depression",
      "Mood Swings",
      "Irritability"
    ]
  },
  {
    name: "Liver",
    symptoms: [
      "Acute Liver Failure",
      "Fluid Overload",
      "History Of Alcohol Consumption"
    ]
  },
  {
    name: "Other & Risk Factors",
    symptoms: [
      "Extra Marital Contacts",
      "Receiving Blood Transfusion",
      "Receiving Unsterile Injections",
      "Toxic Look Typhos",
      "Patches In Throat",
      "Drying And Tingling Lips",
      "Bruising",
      "Irritation In Anus",
      "Pain In Anal Region",
      "Bloody Stool",
      "Pain During Bowel Movements",
      "Swelled Lymph Nodes",
      "Prognosis"
    ]
  }
];
const allSymptoms = symptomCategories.flatMap((c) => c.symptoms);
function symptomToDatasetKey(displayName) {
  return displayName.toLowerCase().replace(/\s+/g, "_").replace("typhos", "(typhos)").replace("foul_smell_of_urine", "foul_smell_ofurine");
}
export {
  allSymptoms,
  symptomCategories,
  symptomToDatasetKey
};
