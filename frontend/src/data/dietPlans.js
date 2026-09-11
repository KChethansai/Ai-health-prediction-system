const basePlan = {
  breakfast: ['Oatmeal with fresh fruits and nuts', 'Whole grain toast with eggs', 'Greek yogurt with berries'],
  lunch: ['Grilled chicken salad with mixed greens', 'Brown rice with vegetables and lean protein', 'Whole wheat wrap with veggies'],
  dinner: ['Baked fish with steamed vegetables', 'Lentil soup with whole grain bread', 'Stir-fried tofu with brown rice'],
  snacks: ['Mixed nuts and seeds', 'Fresh fruit slices', 'Hummus with carrot sticks'],
};
const dietPlans = [
  {
    condition: 'Diabetes',
    plan: {
      breakfast: ['Oatmeal with nuts and berries (no sugar)', 'Scrambled eggs with vegetables', 'Whole grain toast with avocado'],
      lunch: ['Grilled chicken with quinoa and greens', 'Whole grain roti with mixed vegetables', 'Lentil soup with salad'],
      dinner: ['Baked fish with steamed broccoli', 'Grilled vegetables with cottage cheese', 'Chicken stir-fry with brown rice'],
      snacks: ['Almonds (10-12 pieces)', 'Cucumber and carrot sticks', 'Sugar-free yogurt'],
    },
    tips: ['Monitor blood sugar levels regularly', 'Avoid high-sugar foods and refined carbs', 'Eat meals at consistent times', 'Include high-fiber foods'],
  },
  {
    condition: 'Hypertension',
    plan: {
      breakfast: ['Oatmeal with banana and flaxseeds', 'Whole grain cereal with low-fat milk', 'Fruit smoothie with spinach'],
      lunch: ['Grilled salmon with vegetables', 'Brown rice with dal and salad', 'Quinoa bowl with roasted vegetables'],
      dinner: ['Baked chicken breast with sweet potato', 'Vegetable curry with brown rice', 'Lentil stew with whole grain bread'],
      snacks: ['Unsalted nuts', 'Fresh berries', 'Low-fat yogurt with seeds'],
    },
    tips: ['Reduce sodium intake to less than 2300mg/day', 'Eat potassium-rich foods (bananas, spinach)', 'Limit alcohol and caffeine', 'Exercise 30 minutes daily'],
  },
  {
    condition: 'Heart Disease',
    plan: {
      breakfast: ['Oatmeal with walnuts', 'Whole grain toast with almond butter', 'Fruit and vegetable smoothie'],
      lunch: ['Grilled fish with Mediterranean salad', 'Whole wheat pasta with vegetables', 'Bean and vegetable soup'],
      dinner: ['Baked salmon with asparagus', 'Grilled chicken with quinoa', 'Vegetable stir-fry with tofu'],
      snacks: ['Walnuts and almonds', 'Apple slices with peanut butter', 'Dark chocolate (small piece)'],
    },
    tips: ['Include omega-3 fatty acids (fish, flaxseeds)', 'Limit saturated and trans fats', 'Eat plenty of fruits and vegetables', 'Choose whole grains over refined'],
  },
  {
    condition: 'Thyroid',
    plan: {
      breakfast: ['Eggs with whole grain toast', 'Greek yogurt with berries', 'Smoothie with banana and seeds'],
      lunch: ['Grilled chicken with sweet potato', 'Fish with brown rice and vegetables', 'Lentil soup with salad'],
      dinner: ['Baked salmon with quinoa', 'Turkey with steamed vegetables', 'Tofu stir-fry with brown rice'],
      snacks: ['Brazil nuts (2-3)', 'Fresh fruits', 'Seaweed snacks'],
    },
    tips: ['Include selenium-rich foods (Brazil nuts, eggs)', 'Get adequate iodine from seafood', 'Avoid excessive soy products', 'Take thyroid medication on an empty stomach'],
  },
  {
    condition: 'Obesity',
    plan: {
      breakfast: ['Egg white omelette with vegetables', 'Greek yogurt with chia seeds', 'Smoothie with protein powder'],
      lunch: ['Large mixed salad with grilled chicken', 'Vegetable soup with lean protein', 'Whole grain wrap with turkey'],
      dinner: ['Grilled fish with roasted vegetables', 'Chicken breast with steamed broccoli', 'Lentil curry (light)'],
      snacks: ['Celery with almond butter', 'Green apple slices', 'Low-fat cottage cheese'],
    },
    tips: ['Practice portion control', 'Drink water before meals', 'Increase fiber intake', 'Avoid processed and fried foods', 'Exercise at least 45 minutes daily'],
  },
  {
    condition: 'Asthma',
    plan: {
      breakfast: ['Warm oatmeal with honey and ginger', 'Fruits rich in vitamin C', 'Whole grain toast with eggs'],
      lunch: ['Grilled fish with leafy greens', 'Vegetable soup with turmeric', 'Brown rice with vegetables'],
      dinner: ['Baked chicken with sweet potato', 'Steamed vegetables with quinoa', 'Light fish curry with rice'],
      snacks: ['Oranges and kiwi', 'Ginger tea with honey', 'Mixed nuts'],
    },
    tips: ['Include anti-inflammatory foods (ginger, turmeric)', 'Eat vitamin C-rich fruits', 'Avoid sulfite-containing foods', 'Stay hydrated'],
  },
];
function getDietPlan(conditions) {
  const normalizedConditions = conditions.map((c) => c.toLowerCase());
  const matched = dietPlans.find((d) => normalizedConditions.some((c) => c.includes(d.condition.toLowerCase())));
  if (matched) return matched;
  return { condition: 'General Health', plan: basePlan, tips: ['Eat a balanced diet', 'Stay hydrated with 8 glasses of water daily', 'Include fruits and vegetables in every meal', 'Limit processed foods and sugar'] };
}
function getDiseaseDietTips(disease) {
  const d = disease.toLowerCase();
  const tipsMap = {
    'fungal infection': {
      tips: ['Keep affected area clean and dry', 'Wear loose-fitting clothing', 'Use antifungal powder', 'Avoid sharing personal items'],
      precautions: ['Avoid scratching infected areas', 'Keep nails short and clean', 'Wash hands frequently', 'Change socks and underwear daily'],
      lifestyle: ['Maintain good personal hygiene', 'Shower after exercise', 'Dry skin thoroughly after bathing', 'Wear breathable fabrics'],
    },
    'allergy': {
      tips: ['Identify and avoid allergens', 'Keep windows closed during high pollen days', 'Use air purifiers at home', 'Take antihistamines as prescribed'],
      precautions: ['Carry emergency medication if severe', 'Read food labels carefully', 'Inform others about your allergies', 'Wear a medical alert bracelet'],
      lifestyle: ['Clean home regularly', 'Use hypoallergenic bedding', 'Wash clothes after outdoor activities', 'Monitor pollen counts'],
    },
    'common cold': {
      tips: ['Drink plenty of warm fluids', 'Get adequate rest', 'Use saline nasal drops', 'Gargle with warm salt water'],
      precautions: ['Avoid close contact with others', 'Cover mouth when coughing', 'Wash hands frequently', 'Dispose of tissues properly'],
      lifestyle: ['Boost immunity with vitamin C', 'Exercise regularly when healthy', 'Get enough sleep', 'Manage stress levels'],
    },
    'diabetes': {
      tips: ['Monitor blood sugar levels regularly', 'Take medication as prescribed', 'Eat at regular intervals', 'Count carbohydrates'],
      precautions: ['Carry glucose tablets for emergencies', 'Check feet daily for injuries', 'Stay hydrated', 'Avoid skipping meals'],
      lifestyle: ['Exercise 30 minutes daily', 'Maintain healthy weight', 'Reduce stress', 'Get regular eye and kidney checkups'],
    },
    'hypertension': {
      tips: ['Reduce sodium intake', 'Eat potassium-rich foods', 'Monitor blood pressure regularly', 'Take medication consistently'],
      precautions: ['Limit alcohol consumption', 'Reduce caffeine intake', 'Avoid smoking', 'Report dizziness to your doctor'],
      lifestyle: ['Exercise regularly', 'Practice stress management', 'Maintain healthy weight', 'Get adequate sleep'],
    },
    'migraine': {
      tips: ['Identify and avoid triggers', 'Stay in a dark, quiet room during attacks', 'Apply cold compress to forehead', 'Stay hydrated'],
      precautions: ["Don't skip meals", 'Limit screen time', 'Avoid strong smells', 'Keep a headache diary'],
      lifestyle: ['Maintain regular sleep schedule', 'Practice relaxation techniques', 'Exercise moderately', 'Manage stress'],
    },
    'pneumonia': {
      tips: ['Complete the full course of antibiotics', 'Rest and stay hydrated', 'Use a humidifier', 'Take deep breathing exercises'],
      precautions: ['Avoid smoking and secondhand smoke', 'Get pneumonia vaccine', 'Wash hands frequently', 'Avoid close contact when infectious'],
      lifestyle: ['Strengthen immune system', 'Get flu vaccine annually', 'Practice good respiratory hygiene', 'Eat nutritious foods'],
    },
    'heart attack': {
      tips: ['Take prescribed medications regularly', 'Follow a heart-healthy diet', 'Attend cardiac rehabilitation', 'Monitor blood pressure and cholesterol'],
      precautions: ['Know the warning signs', 'Keep emergency numbers handy', 'Avoid extreme physical exertion initially', "Don't ignore chest discomfort"],
      lifestyle: ['Quit smoking completely', 'Exercise as recommended by doctor', 'Manage stress with meditation', 'Maintain healthy weight'],
    },
  };
  for (const [key, value] of Object.entries(tipsMap)) {
    if (d.includes(key)) return value;
  }
  return {
    tips: ["Follow your doctor's recommendations", 'Take prescribed medications regularly', 'Stay hydrated and eat balanced meals', 'Get adequate rest'],
    precautions: ["Don't self-medicate", 'Report any new or worsening symptoms', 'Keep follow-up appointments', 'Inform your doctor about all medications'],
    lifestyle: ['Maintain a balanced diet', 'Exercise regularly', 'Get 7-9 hours of sleep', 'Practice stress management'],
  };
}
export {
  dietPlans,
  getDietPlan,
  getDiseaseDietTips,
};
