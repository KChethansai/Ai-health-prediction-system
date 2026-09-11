import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ArrowLeft, ArrowRight, HeartPulse, Loader2 } from "lucide-react";
import axios from "@/lib/axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  contribChipClass,
  confidenceBarClass,
  confidenceFillClass,
  darkButtonClass,
  darkCardClass,
  darkInputClass,
  darkWrapClass
} from "@/styles/common";
import * as React from "react";
const STEPS = ["Vitals", "Blood & Sugar", "Review"];
const FIELDS = {
  Vitals: [
    { name: "age", label: "Age (years)", placeholder: "e.g. 45" },
    { name: "heightCm", label: "Height (cm)", placeholder: "e.g. 170" },
    { name: "weightKg", label: "Weight (kg)", placeholder: "e.g. 72" }
  ],
  "Blood & Sugar": [
    { name: "systolicBp", label: "Systolic BP (mmHg)", placeholder: "e.g. 120" },
    { name: "diastolicBp", label: "Diastolic BP (mmHg)", placeholder: "e.g. 80" },
    { name: "glucose", label: "Glucose (mg/dL)", placeholder: "e.g. 95" }
  ]
};
function MetricsPage() {
  const [step, setStep] = useState(0);
  const [risks, setRisks] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, getValues } = useForm();
  const submit = async (v) => {
    const payload = Object.fromEntries(Object.entries(v).filter(([, x]) => x !== void 0 && x !== null && x !== ""));
    if (Object.keys(payload).length === 0) {
      toast.error("Enter at least one measurement");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post("/predict/metrics", payload);
      setRisks(data.riskResult.risks);
    } catch (e) {
      toast.error(e.response?.data?.error || "Risk analysis failed");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: darkWrapClass }, /* @__PURE__ */ React.createElement(Navbar, null), /* @__PURE__ */ React.createElement("div", { className: "container mx-auto max-w-3xl px-4 pb-20 pt-24" }, /* @__PURE__ */ React.createElement("h1", { className: "mb-2 font-display text-3xl font-bold" }, "Health Metrics"), /* @__PURE__ */ React.createElement("p", { className: "mb-8 text-sm text-gray-400" }, "Step through your measurements for diabetes, heart and stroke risk."), /* @__PURE__ */ React.createElement("div", { className: "mb-6 flex gap-2" }, STEPS.map((s, i) => /* @__PURE__ */ React.createElement("div", { key: s, className: `flex-1 rounded-full py-1.5 text-center text-xs font-medium ${i <= step ? "bg-[#ff4d67] text-white" : "bg-white/10 text-gray-500"}` }, s))), /* @__PURE__ */ React.createElement("form", { onSubmit: handleSubmit(submit) }, step < 2 && /* @__PURE__ */ React.createElement("div", { className: darkCardClass }, /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, FIELDS[STEPS[step]].map((f) => /* @__PURE__ */ React.createElement("div", { key: f.name }, /* @__PURE__ */ React.createElement("label", { className: "mb-1.5 block text-sm font-medium text-gray-200" }, f.label), /* @__PURE__ */ React.createElement("input", { type: "number", step: "any", className: darkInputClass, placeholder: f.placeholder, ...register(f.name, { valueAsNumber: true }) })))), /* @__PURE__ */ React.createElement("div", { className: "mt-6 flex justify-between" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "rounded-full border border-white/15 px-6 py-2.5 text-sm", disabled: step === 0, onClick: () => setStep(step - 1) }, "Back"), /* @__PURE__ */ React.createElement("button", { type: "button", className: `${darkButtonClass} flex items-center gap-2`, onClick: () => setStep(step + 1) }, "Next ", /* @__PURE__ */ React.createElement(ArrowRight, { className: "h-4 w-4" })))), step === 2 && !risks && /* @__PURE__ */ React.createElement("div", { className: darkCardClass }, /* @__PURE__ */ React.createElement("h2", { className: "mb-4 font-display text-lg font-semibold" }, "Review"), /* @__PURE__ */ React.createElement("dl", { className: "mb-6 space-y-2 text-sm" }, Object.entries(getValues()).filter(([, v]) => v !== void 0).map(([k, v]) => /* @__PURE__ */ React.createElement("div", { key: k, className: "flex justify-between border-b border-white/5 pb-2" }, /* @__PURE__ */ React.createElement("dt", { className: "text-gray-400" }, k), /* @__PURE__ */ React.createElement("dd", { className: "font-medium" }, String(v))))), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "flex items-center gap-2 rounded-full border border-white/15 px-6 py-2.5 text-sm", onClick: () => setStep(1) }, /* @__PURE__ */ React.createElement(ArrowLeft, { className: "h-4 w-4" }), " Back"), /* @__PURE__ */ React.createElement("button", { type: "submit", className: `${darkButtonClass} flex items-center gap-2`, disabled: loading }, loading ? /* @__PURE__ */ React.createElement(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ React.createElement(HeartPulse, { className: "h-4 w-4" }), "Analyze Risk")))), risks && /* @__PURE__ */ React.createElement("div", { className: `${darkCardClass} mt-6` }, /* @__PURE__ */ React.createElement("h2", { className: "mb-4 font-display text-lg font-semibold" }, "Risk Results"), /* @__PURE__ */ React.createElement("div", { className: "space-y-5" }, Object.entries(risks).map(([name, r]) => /* @__PURE__ */ React.createElement("div", { key: name }, /* @__PURE__ */ React.createElement("div", { className: "mb-1 flex items-center justify-between text-sm" }, /* @__PURE__ */ React.createElement("span", { className: "font-medium capitalize" }, name), /* @__PURE__ */ React.createElement("span", { className: "text-[#ff8fa3]" }, r.probability, "% \xB7 ", r.level)), /* @__PURE__ */ React.createElement("div", { className: confidenceBarClass }, /* @__PURE__ */ React.createElement("div", { className: confidenceFillClass, style: { width: `${r.probability}%` } })), r.topFeatures?.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "mt-2 flex flex-wrap gap-1.5" }, r.topFeatures.map((f) => /* @__PURE__ */ React.createElement("span", { key: f.feature, className: contribChipClass, title: `weight ${f.weight}` }, f.feature)))))), /* @__PURE__ */ React.createElement("button", { className: "mt-6 rounded-full border border-white/15 px-6 py-2.5 text-sm", onClick: () => {
    setRisks(null);
    setStep(0);
  } }, "New Analysis"))), /* @__PURE__ */ React.createElement(Footer, null));
}
var MetricsPage_default = MetricsPage;
export {
  MetricsPage_default as default
};
