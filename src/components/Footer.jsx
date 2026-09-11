import { Heart, Activity, Pill, MapPin, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import * as React from "react";
const footerLinks = {
  Product: [
    { label: "Disease Predictor", to: "/predict", icon: Activity },
    { label: "Medicine Database", to: "/medicines", icon: Pill },
    { label: "Hospital Finder", to: "/hospitals", icon: MapPin },
    { label: "Health Library", to: "/health-library", icon: BookOpen }
  ],
  Account: [
    { label: "Sign In", to: "/auth" },
    { label: "Dashboard", to: "/dashboard" }
  ]
};
const APP_VERSION = "1.0.1";
function Footer() {
  return /* @__PURE__ */ React.createElement("footer", { className: "bg-card/80 border-t border-border backdrop-blur-sm" }, /* @__PURE__ */ React.createElement("div", { className: "container mx-auto px-4 py-12 md:py-16" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 font-display font-bold text-lg mb-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 rounded-lg gradient-primary-bg flex items-center justify-center" }, /* @__PURE__ */ React.createElement(Heart, { className: "w-4 h-4 text-primary-foreground" })), "MediPredict"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-muted-foreground leading-relaxed max-w-xs" }, "AI-powered health predictions, medicine information, and personalized wellness guidance \u2014 all in one platform."), /* @__PURE__ */ React.createElement("div", { className: "mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-muted-foreground/50" }, /* @__PURE__ */ React.createElement("span", null, "v", APP_VERSION), /* @__PURE__ */ React.createElement("span", null, "Ensemble ML v5.0 \u2022 95.1% Accuracy"), /* @__PURE__ */ React.createElement("span", null, "132 Symptoms \u2022 41 Diseases \u2022 150+ Medicines"))), Object.entries(footerLinks).map(([heading, links]) => /* @__PURE__ */ React.createElement("div", { key: heading }, /* @__PURE__ */ React.createElement("h4", { className: "font-display font-semibold text-sm mb-4 text-foreground" }, heading), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-2.5" }, links.map((l) => /* @__PURE__ */ React.createElement(
    Link,
    {
      key: l.label,
      to: l.to,
      className: "text-sm text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2"
    },
    "icon" in l && l.icon && /* @__PURE__ */ React.createElement(l.icon, { className: "w-3.5 h-3.5" }),
    l.label
  )))))), /* @__PURE__ */ React.createElement("div", { className: "border-t border-border mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-muted-foreground" }, "\xA9 ", (/* @__PURE__ */ new Date()).getFullYear(), " MediPredict. All rights reserved."), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-muted-foreground/60" }, "For informational purposes only \u2014 not a substitute for professional medical advice."))));
}
export {
  Footer as default
};
