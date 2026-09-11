import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as React from "react";
const NotFound = () => {
  const location = useLocation();
  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen bg-background flex items-center justify-center section-padding relative overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 gradient-bg opacity-[0.03]" }), /* @__PURE__ */ React.createElement("div", { className: "absolute top-20 right-20 w-72 h-72 bg-primary/8 rounded-full blur-[100px] animate-pulse-glow" }), /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-20 left-20 w-96 h-96 bg-accent/8 rounded-full blur-[120px] animate-pulse-glow" }), /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6 },
      className: "relative z-10 text-center max-w-md"
    },
    /* @__PURE__ */ React.createElement(Link, { to: "/", className: "inline-flex items-center gap-2 font-display font-bold text-lg mb-8" }, /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 rounded-lg gradient-primary-bg flex items-center justify-center" }, /* @__PURE__ */ React.createElement(Heart, { className: "w-4 h-4 text-primary-foreground" })), "MediPredict"),
    /* @__PURE__ */ React.createElement("div", { className: "font-display text-8xl font-extrabold gradient-text mb-4" }, "404"),
    /* @__PURE__ */ React.createElement("h1", { className: "font-display text-2xl font-bold mb-3" }, "Page Not Found"),
    /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground mb-8 leading-relaxed" }, "The page you're looking for doesn't exist or has been moved. Let's get you back on track."),
    /* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row gap-3 justify-center" }, /* @__PURE__ */ React.createElement(Link, { to: "/" }, /* @__PURE__ */ React.createElement(Button, { className: "btn-primary gap-2 w-full sm:w-auto" }, /* @__PURE__ */ React.createElement(Home, { className: "w-4 h-4" }), " Go Home")), /* @__PURE__ */ React.createElement(Link, { to: "/predict" }, /* @__PURE__ */ React.createElement(Button, { variant: "outline", className: "gap-2 w-full sm:w-auto" }, /* @__PURE__ */ React.createElement(Search, { className: "w-4 h-4" }), " Health Predictor")))
  ));
};
var NotFound_default = NotFound;
export {
  NotFound_default as default
};
