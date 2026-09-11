import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Loader2, Target, Trash2 } from "lucide-react";
import axios from "@/lib/axios";
import { buttonClass, cardClass, errorClass, formGroup, inputClass, labelClass, sectionTitleClass } from "@/styles/common";
import * as React from "react";
function HealthGoals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const load = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/goals");
      setGoals(data);
    } catch {
      toast.error("Failed to load goals");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const add = async (v) => {
    try {
      const { data } = await axios.post("/goals", {
        title: v.title,
        targetValue: v.targetValue ? parseFloat(v.targetValue) : null,
        unit: v.unit || null
      });
      setGoals((g) => [data, ...g]);
      reset({ title: "", targetValue: "", unit: "" });
      toast.success("Goal added");
    } catch {
      toast.error("Failed to add goal");
    }
  };
  const progress = async (g, value) => {
    const n = parseFloat(value);
    if (isNaN(n)) return;
    try {
      const status = g.targetValue && n >= g.targetValue ? "completed" : "active";
      const { data } = await axios.patch(`/goals/${g._id}`, { currentValue: n, status });
      setGoals((list) => list.map((x) => x._id === g._id ? data : x));
      if (status === "completed") toast.success("Goal completed!");
    } catch {
      toast.error("Failed to update goal");
    }
  };
  const remove = async (id) => {
    try {
      await axios.del(`/goals/${id}`);
      setGoals((g) => g.filter((x) => x._id !== id));
    } catch {
      toast.error("Failed to remove goal");
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: cardClass }, /* @__PURE__ */ React.createElement("h3", { className: `${sectionTitleClass} mb-4` }, "Set Health Goal"), /* @__PURE__ */ React.createElement("form", { onSubmit: handleSubmit(add), className: "grid grid-cols-1 gap-4 sm:grid-cols-3" }, /* @__PURE__ */ React.createElement("div", { className: formGroup }, /* @__PURE__ */ React.createElement("label", { className: labelClass }, "Goal"), /* @__PURE__ */ React.createElement("input", { className: inputClass, placeholder: "e.g. Daily steps", ...register("title", { required: true }) }), errors.title && /* @__PURE__ */ React.createElement("p", { className: errorClass }, "Required")), /* @__PURE__ */ React.createElement("div", { className: formGroup }, /* @__PURE__ */ React.createElement("label", { className: labelClass }, "Target"), /* @__PURE__ */ React.createElement("input", { type: "number", className: inputClass, placeholder: "10000", ...register("targetValue") })), /* @__PURE__ */ React.createElement("div", { className: formGroup }, /* @__PURE__ */ React.createElement("label", { className: labelClass }, "Unit"), /* @__PURE__ */ React.createElement("input", { className: inputClass, placeholder: "steps", ...register("unit") })), /* @__PURE__ */ React.createElement("button", { type: "submit", className: `${buttonClass} flex items-center justify-center gap-2 sm:col-span-3`, disabled: isSubmitting }, isSubmitting ? /* @__PURE__ */ React.createElement(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ React.createElement(Target, { className: "h-4 w-4" }), "Add Goal"))), /* @__PURE__ */ React.createElement("div", { className: cardClass }, /* @__PURE__ */ React.createElement("h3", { className: `${sectionTitleClass} mb-4` }, "My Goals"), loading ? /* @__PURE__ */ React.createElement("div", { className: "flex justify-center py-8" }, /* @__PURE__ */ React.createElement(Loader2, { className: "h-6 w-6 animate-spin text-[#0066cc]" })) : goals.length === 0 ? /* @__PURE__ */ React.createElement("p", { className: "py-6 text-center text-sm text-gray-500" }, "No goals set.") : /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, goals.map((g) => {
    const pct = g.targetValue && g.currentValue != null ? Math.min(Math.round(g.currentValue / g.targetValue * 100), 100) : 0;
    return /* @__PURE__ */ React.createElement("div", { key: g._id, className: "rounded-xl bg-gray-50 px-4 py-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("span", { className: "text-sm font-medium" }, g.title), /* @__PURE__ */ React.createElement("button", { onClick: () => remove(g._id), "aria-label": "Delete goal" }, /* @__PURE__ */ React.createElement(Trash2, { className: "h-4 w-4 text-red-500" }))), g.targetValue && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "mt-2 h-2 overflow-hidden rounded-full bg-gray-200" }, /* @__PURE__ */ React.createElement("div", { className: "h-full rounded-full bg-[#0066cc]", style: { width: `${pct}%` } })), /* @__PURE__ */ React.createElement("div", { className: "mt-1 flex items-center justify-between text-xs text-gray-500" }, /* @__PURE__ */ React.createElement("span", null, g.currentValue ?? 0, " / ", g.targetValue, " ", g.unit || ""), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "number",
        placeholder: "Update",
        className: "w-24 rounded-lg border border-gray-200 px-2 py-1 text-xs",
        onKeyDown: (e) => {
          if (e.key === "Enter") progress(g, e.target.value);
        }
      }
    ))));
  }))));
}
var HealthGoals_default = HealthGoals;
export {
  HealthGoals_default as default
};
