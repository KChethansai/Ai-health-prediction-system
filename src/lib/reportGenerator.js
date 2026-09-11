import jsPDF from "jspdf";
function generatePDF(record) {
  const doc = new jsPDF();
  const preds = Array.isArray(record.predictions) ? record.predictions : record.predictions?.predictions || [];
  doc.setFontSize(22);
  doc.setTextColor(33, 97, 201);
  doc.text("MediPredict", 20, 25);
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text("AI Health Prediction Report", 20, 33);
  doc.setDrawColor(33, 97, 201);
  doc.setLineWidth(0.5);
  doc.line(20, 37, 190, 37);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Date: ${new Date(record.created_at).toLocaleString()}`, 20, 45);
  doc.text(`Report ID: ${record.id.slice(0, 8)}`, 120, 45);
  doc.setFontSize(14);
  doc.setTextColor(33, 97, 201);
  doc.text("Selected Symptoms", 20, 58);
  doc.setFontSize(10);
  doc.setTextColor(60);
  const symptomsText = record.symptoms.join(", ");
  const splitSymptoms = doc.splitTextToSize(symptomsText, 170);
  doc.text(splitSymptoms, 20, 66);
  let y = 66 + splitSymptoms.length * 6 + 10;
  doc.setFontSize(14);
  doc.setTextColor(33, 97, 201);
  doc.text("Disease Predictions", 20, y);
  y += 10;
  preds.forEach((p, i) => {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.text(`${i + 1}. ${p.disease} (${p.probability}%)`, 20, y);
    y += 7;
    doc.setFontSize(9);
    doc.setTextColor(80);
    if (p.description) {
      const desc = doc.splitTextToSize(p.description, 160);
      doc.text(desc, 25, y);
      y += desc.length * 5 + 3;
    }
    if (p.treatment) {
      doc.setTextColor(33, 97, 201);
      doc.text("Treatment: ", 25, y);
      doc.setTextColor(80);
      const treat = doc.splitTextToSize(p.treatment, 140);
      doc.text(treat, 50, y);
      y += treat.length * 5 + 3;
    }
    if (p.medicines?.length) {
      doc.setTextColor(33, 97, 201);
      doc.text("Medicines: ", 25, y);
      doc.setTextColor(80);
      doc.text(p.medicines.join(", "), 50, y);
      y += 7;
    }
    y += 5;
  });
  if (y > 260) {
    doc.addPage();
    y = 20;
  }
  y += 10;
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text("Disclaimer: This report is AI-generated and for informational purposes only.", 20, y);
  doc.text("Always consult a healthcare professional for diagnosis and treatment.", 20, y + 5);
  doc.save(`MediPredict-Report-${record.id.slice(0, 8)}.pdf`);
}
export {
  generatePDF
};
