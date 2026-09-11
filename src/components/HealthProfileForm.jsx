import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Loader2, Save } from "lucide-react";
import axios from "@/lib/axios";
import { buttonClass, errorClass, formGroup, inputClass, labelClass } from "@/styles/common";
import * as React from "react";
const CONDITION_OPTIONS = [
  "Diabetes",
  "Hypertension",
  "Thyroid",
  "Asthma",
  "Heart Disease",
  "Obesity",
  "Arthritis",
  "COPD",
  "Kidney Disease",
  "Liver Disease"
];
function HealthProfileForm({ onSaved }) {
  const [conditions, setConditions] = useState([]);
  const [fetching, setFetching] = useState(true);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  useEffect(() => {
    axios.get("/health-profile").then(({ data }) => {
      reset({ age: data.age ?? "", gender: data.gender ?? "", heightCm: data.heightCm ?? "", weightKg: data.weightKg ?? "" });
      setConditions(data.conditions || []);
    }).catch(() => {
    }).finally(() => setFetching(false));
  }, [reset]);
  const toggle = (c) => setConditions((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);
  const save = async (v) => {
    try {
      const payload = {
        age: v.age ? parseInt(v.age) : null,
        gender: v.gender || null,
        heightCm: v.heightCm ? parseFloat(v.heightCm) : null,
        weightKg: v.weightKg ? parseFloat(v.weightKg) : null,
        conditions
      };
      await axios.put("/health-profile", payload);
      toast.success("Profile saved");
      onSaved?.(payload);
    } catch {
      toast.error("Failed to save profile");
    }
  };
  if (fetching) return /* @__PURE__ */ React.createElement("div", { className: "flex justify-center py-8" }, /* @__PURE__ */ React.createElement(Loader2, { className: "h-6 w-6 animate-spin text-[#0066cc]" }));
  return /* @__PURE__ */ React.createElement("form", { onSubmit: handleSubmit(save), className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2" }, /* @__PURE__ */ React.createElement("div", { className: formGroup }, /* @__PURE__ */ React.createElement("label", { className: labelClass }, "Age"), /* @__PURE__ */ React.createElement("input", { type: "number", className: inputClass, placeholder: "25", ...register("age") }), errors.age && /* @__PURE__ */ React.createElement("p", { className: errorClass }, "Invalid")), /* @__PURE__ */ React.createElement("div", { className: formGroup }, /* @__PURE__ */ React.createElement("label", { className: labelClass }, "Gender"), /* @__PURE__ */ React.createElement("select", { className: inputClass, ...register("gender") }, /* @__PURE__ */ React.createElement("option", { value: "" }, "Select"), /* @__PURE__ */ React.createElement("option", { value: "male" }, "Male"), /* @__PURE__ */ React.createElement("option", { value: "female" }, "Female"), /* @__PURE__ */ React.createElement("option", { value: "other" }, "Other"))), /* @__PURE__ */ React.createElement("div", { className: formGroup }, /* @__PURE__ */ React.createElement("label", { className: labelClass }, "Height (cm)"), /* @__PURE__ */ React.createElement("input", { type: "number", className: inputClass, placeholder: "170", ...register("heightCm") })), /* @__PURE__ */ React.createElement("div", { className: formGroup }, /* @__PURE__ */ React.createElement("label", { className: labelClass }, "Weight (kg)"), /* @__PURE__ */ React.createElement("input", { type: "number", className: inputClass, placeholder: "70", ...register("weightKg") }))), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2" }, CONDITION_OPTIONS.map((c) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: c,
      type: "button",
      onClick: () => toggle(c),
      className: `rounded-full px-3 py-1.5 text-xs font-medium ${conditions.includes(c) ? "bg-[#0066cc] text-white" : "bg-gray-100 text-gray-600"}`
    },
    c
  ))), /* @__PURE__ */ React.createElement("button", { type: "submit", className: `${buttonClass} flex items-center gap-2`, disabled: isSubmitting }, isSubmitting ? /* @__PURE__ */ React.createElement(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ React.createElement(Save, { className: "h-4 w-4" }), "Save Profile"));
}
var HealthProfileForm_default = HealthProfileForm;
export {
  HealthProfileForm_default as default
};
