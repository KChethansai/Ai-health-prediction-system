import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Activity, Loader2, Search, X } from "lucide-react";
import axios from "@/lib/axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { allSymptoms } from "@/data/symptoms";
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
function DiseasePredictorPage() {
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const { register, watch } = useForm({ defaultValues: { search: "", severity: "Moderate" } });
  const search = watch("search");
  const severity = watch("severity");
  useEffect(() => {
    axios.get("/symptom-checks").then(({ data }) => setHistory(data)).catch(() => {
    });
  }, []);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return allSymptoms.filter((s) => s.toLowerCase().includes(q) && !selected.includes(s)).slice(0, 8);
  }, [search, selected]);
  const toggle = (s) => setSelected((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  const submit = async () => {
    if (selected.length < 2) {
      toast.error("Select at least 2 symptoms");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post("/predict/symptoms", { symptoms: selected, severity });
      setResult(data.result.predictions);
      setHistory((h) => [data, ...h]);
    } catch (e) {
      toast.error(e.response?.data?.error || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: darkWrapClass }, /* @__PURE__ */ React.createElement(Navbar, null), /* @__PURE__ */ React.createElement("div", { className: "container mx-auto max-w-4xl px-4 pb-20 pt-24" }, /* @__PURE__ */ React.createElement("h1", { className: "mb-2 font-display text-3xl font-bold" }, "Symptom Checker"), /* @__PURE__ */ React.createElement("p", { className: "mb-8 text-sm text-gray-400" }, "Select symptoms \u2014 the diagnostic model ranks likely conditions."), /* @__PURE__ */ React.createElement("div", { className: darkCardClass }, /* @__PURE__ */ React.createElement("div", { className: "relative mb-4" }, /* @__PURE__ */ React.createElement(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" }), /* @__PURE__ */ React.createElement("input", { className: `${darkInputClass} pl-10`, placeholder: "Search symptoms\u2026", ...register("search") }), filtered.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "absolute left-0 right-0 top-full z-10 mt-1 max-h-48 overflow-y-auto rounded-xl border border-white/10 bg-[#111]" }, filtered.map((s) => /* @__PURE__ */ React.createElement("button", { key: s, type: "button", className: "w-full px-4 py-2 text-left text-sm hover:bg-white/5", onClick: () => toggle(s) }, s)))), /* @__PURE__ */ React.createElement("div", { className: "mb-4 flex flex-wrap gap-2" }, selected.map((s) => /* @__PURE__ */ React.createElement("button", { key: s, type: "button", onClick: () => toggle(s), className: "flex items-center gap-1 rounded-full bg-[#ff4d67]/15 px-3 py-1 text-xs font-medium text-[#ff8fa3]" }, s, " ", /* @__PURE__ */ React.createElement(X, { className: "h-3 w-3" }))), selected.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-500" }, "No symptoms selected yet.")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-3 sm:flex-row" }, /* @__PURE__ */ React.createElement("select", { className: `${darkInputClass} sm:w-48`, ...register("severity") }, ["Mild", "Moderate", "Severe"].map((s) => /* @__PURE__ */ React.createElement("option", { key: s, value: s }, s))), /* @__PURE__ */ React.createElement("button", { className: `${darkButtonClass} flex items-center justify-center gap-2`, onClick: submit, disabled: loading }, loading ? /* @__PURE__ */ React.createElement(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ React.createElement(Activity, { className: "h-4 w-4" }), "Analyze Symptoms"))), result && /* @__PURE__ */ React.createElement("div", { className: `${darkCardClass} mt-6` }, /* @__PURE__ */ React.createElement("h2", { className: "mb-4 font-display text-lg font-semibold" }, "Top Predictions"), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, result.map((p) => /* @__PURE__ */ React.createElement("div", { key: p.disease }, /* @__PURE__ */ React.createElement("div", { className: "mb-1 flex items-center justify-between text-sm" }, /* @__PURE__ */ React.createElement("span", { className: "font-medium" }, p.disease), /* @__PURE__ */ React.createElement("span", { className: "text-[#ff8fa3]" }, p.probability, "%")), /* @__PURE__ */ React.createElement("div", { className: confidenceBarClass }, /* @__PURE__ */ React.createElement("div", { className: confidenceFillClass, style: { width: `${p.probability}%` } })), p.contributingSymptoms?.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "mt-2 flex flex-wrap gap-1.5" }, p.contributingSymptoms.map((c) => /* @__PURE__ */ React.createElement("span", { key: c.symptom, className: contribChipClass, title: `weight ${c.weight}` }, c.symptom))))))), history.length > 0 && /* @__PURE__ */ React.createElement("div", { className: `${darkCardClass} mt-6` }, /* @__PURE__ */ React.createElement("h2", { className: "mb-4 font-display text-lg font-semibold" }, "Recent Checks"), /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, history.slice(0, 5).map((h) => /* @__PURE__ */ React.createElement("div", { key: h._id, className: "rounded-xl bg-white/5 px-4 py-3 text-sm" }, /* @__PURE__ */ React.createElement("p", { className: "text-gray-300" }, h.symptoms.join(", ")), /* @__PURE__ */ React.createElement("p", { className: "mt-1 text-xs text-gray-500" }, "\u2192 ", h.result.predictions?.[0]?.disease, " (", h.result.predictions?.[0]?.probability, "%)")))))), /* @__PURE__ */ React.createElement(Footer, null));
}
var DiseasePredictorPage_default = DiseasePredictorPage;
export {
  DiseasePredictorPage_default as default
};
