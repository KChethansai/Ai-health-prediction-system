import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  HeartPulse,
  Hospital,
  MapPin,
  Pill,
  ScanLine,
  Shield,
  Siren,
  Stethoscope
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { buttonClass, buttonGhostClass, cardClass, pageWrapClass } from "@/styles/common";
import * as React from "react";
const features = [
  { icon: Activity, title: "AI Disease Predictor", desc: "Symptom-based ML predictions with confidence scores for 41 diseases.", to: "/predict" },
  { icon: HeartPulse, title: "Health Metrics", desc: "Diabetes, heart and stroke risk from vitals and labs in 3 steps.", to: "/metrics" },
  { icon: ScanLine, title: "Prescription Scanner", desc: "OCR extracts medicines and builds reminder schedules automatically.", to: "/scanner" },
  { icon: Pill, title: "Medicine Database", desc: "Explore medicines with dosages, side effects, and interactions.", to: "/medicines" },
  { icon: MapPin, title: "Hospital Finder", desc: "Locate nearby hospitals with emergency info and directions.", to: "/hospitals" },
  { icon: BookOpen, title: "Health Library", desc: "Expert articles on diseases, nutrition, exercise and wellness.", to: "/health-library" }
];
const steps = [
  { icon: Stethoscope, title: "Enter Data", desc: "Symptoms, vitals, or a prescription photo." },
  { icon: Brain, title: "AI Analysis", desc: "Trained models score patterns against real datasets." },
  { icon: BarChart3, title: "See Results", desc: "Ranked predictions with confidence and explanations." },
  { icon: Shield, title: "Take Action", desc: "Reminders, medicines, and nearby hospitals." }
];
const stats = [
  { value: "132+", label: "Symptoms Analyzed" },
  { value: "160+", label: "Medicines Available" },
  { value: "41", label: "Diseases Detectable" },
  { value: "3", label: "Risk Models" }
];
function LandingPage() {
  return /* @__PURE__ */ React.createElement("div", { className: pageWrapClass }, /* @__PURE__ */ React.createElement(Navbar, null), /* @__PURE__ */ React.createElement("section", { className: "px-4 pb-20 pt-28 md:pt-36" }, /* @__PURE__ */ React.createElement("div", { className: "container mx-auto max-w-3xl text-center" }, /* @__PURE__ */ React.createElement("div", { className: "mb-6 inline-flex items-center gap-2 rounded-full bg-[#0066cc]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#0066cc]" }, /* @__PURE__ */ React.createElement(Shield, { className: "h-3.5 w-3.5" }), " AI-Powered Healthcare Intelligence"), /* @__PURE__ */ React.createElement("h1", { className: "mb-6 font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl" }, "AI-Powered ", /* @__PURE__ */ React.createElement("span", { className: "text-[#0066cc]" }, "Health Assistant")), /* @__PURE__ */ React.createElement("p", { className: "mx-auto mb-10 max-w-2xl text-base text-gray-500 md:text-lg" }, "Predict diseases from symptoms, assess health risks, scan prescriptions, and find nearby hospitals \u2014 all in one platform."), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col justify-center gap-3 sm:flex-row" }, /* @__PURE__ */ React.createElement(Link, { to: "/predict", className: `${buttonClass} flex items-center justify-center gap-2 px-8 py-3 text-base` }, "Start Health Analysis ", /* @__PURE__ */ React.createElement(ArrowRight, { className: "h-4 w-4" })), /* @__PURE__ */ React.createElement("a", { href: "#features", className: `${buttonGhostClass} px-8 py-3 text-base` }, "Explore Features")))), /* @__PURE__ */ React.createElement("section", { id: "features", className: "bg-gray-50 px-4 py-16 md:py-24" }, /* @__PURE__ */ React.createElement("div", { className: "container mx-auto" }, /* @__PURE__ */ React.createElement("h2", { className: "mb-3 text-center font-display text-3xl font-bold" }, "Everything You Need for Smarter Health"), /* @__PURE__ */ React.createElement("p", { className: "mx-auto mb-12 max-w-lg text-center text-sm text-gray-500" }, "AI-driven tools for symptoms, risks, medicines, and care options."), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" }, features.map((f, i) => /* @__PURE__ */ React.createElement(motion.div, { key: f.title, initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay: i * 0.05 } }, /* @__PURE__ */ React.createElement(Link, { to: f.to, className: `${cardClass} group block h-full transition hover:shadow-md` }, /* @__PURE__ */ React.createElement("div", { className: "mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#0066cc]/10 text-[#0066cc]" }, /* @__PURE__ */ React.createElement(f.icon, { className: "h-5 w-5" })), /* @__PURE__ */ React.createElement("h3", { className: "mb-1.5 font-display text-base font-semibold" }, f.title), /* @__PURE__ */ React.createElement("p", { className: "text-sm leading-relaxed text-gray-500" }, f.desc))))))), /* @__PURE__ */ React.createElement("section", { className: "px-4 py-16 md:py-24" }, /* @__PURE__ */ React.createElement("div", { className: "container mx-auto" }, /* @__PURE__ */ React.createElement("h2", { className: "mb-12 text-center font-display text-3xl font-bold" }, "How It Works"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4" }, steps.map((s, i) => /* @__PURE__ */ React.createElement("div", { key: s.title, className: "text-center" }, /* @__PURE__ */ React.createElement("div", { className: "mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#0066cc] text-sm font-bold text-white" }, i + 1), /* @__PURE__ */ React.createElement(s.icon, { className: "mx-auto mb-3 h-5 w-5 text-[#0066cc]" }), /* @__PURE__ */ React.createElement("h3", { className: "mb-1 font-display text-sm font-semibold" }, s.title), /* @__PURE__ */ React.createElement("p", { className: "mx-auto max-w-[200px] text-xs leading-relaxed text-gray-500" }, s.desc)))))), /* @__PURE__ */ React.createElement("section", { className: "bg-gray-50 px-4 py-16" }, /* @__PURE__ */ React.createElement("div", { className: "container mx-auto grid max-w-4xl grid-cols-2 gap-4 lg:grid-cols-4" }, stats.map((s) => /* @__PURE__ */ React.createElement("div", { key: s.label, className: `${cardClass} text-center` }, /* @__PURE__ */ React.createElement("div", { className: "mb-1 font-display text-3xl font-extrabold text-[#0066cc]" }, s.value), /* @__PURE__ */ React.createElement("div", { className: "text-xs font-medium text-gray-500" }, s.label))))), /* @__PURE__ */ React.createElement("section", { className: "px-4 py-16" }, /* @__PURE__ */ React.createElement("div", { className: "container mx-auto grid max-w-4xl grid-cols-1 gap-5 md:grid-cols-3" }, [
    { icon: Hospital, title: "Emergency Hospitals", desc: "Locate the closest emergency facilities." },
    { icon: Siren, title: "Quick Access", desc: "One-tap emergency service dialing." },
    { icon: MapPin, title: "Nearby Facilities", desc: "Clinics and hospitals on a live map." }
  ].map((f) => /* @__PURE__ */ React.createElement("div", { key: f.title, className: `${cardClass} text-center` }, /* @__PURE__ */ React.createElement(f.icon, { className: "mx-auto mb-3 h-6 w-6 text-red-500" }), /* @__PURE__ */ React.createElement("h3", { className: "mb-1 font-display text-sm font-semibold" }, f.title), /* @__PURE__ */ React.createElement("p", { className: "text-xs leading-relaxed text-gray-500" }, f.desc)))), /* @__PURE__ */ React.createElement("div", { className: "container mx-auto mt-10 max-w-3xl" }, /* @__PURE__ */ React.createElement("div", { className: `${cardClass} text-center` }, /* @__PURE__ */ React.createElement("p", { className: "mb-4 text-sm leading-relaxed text-gray-500" }, "ML models trained on real public datasets provide educational health insights \u2014 not diagnoses."), /* @__PURE__ */ React.createElement("div", { className: "inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-xs font-medium text-red-600" }, /* @__PURE__ */ React.createElement(AlertTriangle, { className: "h-3.5 w-3.5" }), " This system does not replace professional medical advice.")))), /* @__PURE__ */ React.createElement("section", { className: "px-4 pb-20" }, /* @__PURE__ */ React.createElement("div", { className: "container mx-auto" }, /* @__PURE__ */ React.createElement("div", { className: "rounded-3xl bg-[#0066cc] p-10 text-center text-white md:p-14" }, /* @__PURE__ */ React.createElement("h2", { className: "mb-4 font-display text-3xl font-bold" }, "Ready to Take Control of Your Health?"), /* @__PURE__ */ React.createElement("p", { className: "mx-auto mb-8 max-w-lg text-sm opacity-90 md:text-base" }, "Start with the AI symptom checker or assess your health metrics."), /* @__PURE__ */ React.createElement(Link, { to: "/predict", className: "inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 font-medium text-[#0066cc]" }, "Get Started Free ", /* @__PURE__ */ React.createElement(ArrowRight, { className: "h-4 w-4" }))))), /* @__PURE__ */ React.createElement(Footer, null));
}
var LandingPage_default = LandingPage;
export {
  LandingPage_default as default
};
