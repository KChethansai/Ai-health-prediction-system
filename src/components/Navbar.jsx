import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/useAuth";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";
import { useTranslation } from "react-i18next";
import * as React from "react";
const navLinkKeys = [
  { to: "/", key: "home" },
  { to: "/predict", key: "predictor" },
  { to: "/scanner", key: "scanner" },
  { to: "/medicines", key: "medicines" },
  { to: "/hospitals", key: "hospitals" },
  { to: "/health-library", key: "library" }
];
function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navLinks = navLinkKeys.map((l) => ({ to: l.to, label: t(`nav.${l.key}`) }));
  return /* @__PURE__ */ React.createElement("nav", { className: "fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-xl border-b border-gray-100 transition-all duration-300" }, /* @__PURE__ */ React.createElement("div", { className: "container mx-auto flex items-center justify-between h-16 px-4" }, /* @__PURE__ */ React.createElement(Link, { to: "/", className: "flex items-center gap-2 font-display font-bold text-lg md:text-xl shrink-0" }, /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 rounded-full bg-[#0066cc] flex items-center justify-center" }, /* @__PURE__ */ React.createElement(Heart, { className: "w-4 h-4 text-white" })), /* @__PURE__ */ React.createElement("span", { className: "text-[#1d1d1f]" }, "MediPredict")), /* @__PURE__ */ React.createElement("div", { className: "hidden lg:flex items-center gap-1" }, navLinks.map((l) => /* @__PURE__ */ React.createElement(Link, { key: l.to, to: l.to }, /* @__PURE__ */ React.createElement(
    Button,
    {
      variant: "ghost",
      size: "sm",
      className: `text-sm relative ${location.pathname === l.to ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"}`
    },
    l.label,
    location.pathname === l.to && /* @__PURE__ */ React.createElement(motion.div, { layoutId: "nav-indicator", className: "absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" })
  ))), /* @__PURE__ */ React.createElement("div", { className: "w-px h-6 bg-border mx-1" }), /* @__PURE__ */ React.createElement(LanguageSelector, null), /* @__PURE__ */ React.createElement(ThemeToggle, null), user ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Link, { to: "/dashboard" }, /* @__PURE__ */ React.createElement(
    Button,
    {
      variant: "ghost",
      size: "sm",
      className: `text-sm gap-1.5 ${location.pathname === "/dashboard" ? "text-primary font-semibold" : "text-muted-foreground"}`
    },
    /* @__PURE__ */ React.createElement(User, { className: "w-3.5 h-3.5" }),
    " ",
    t("nav.dashboard")
  )), /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "sm", className: "text-sm gap-1.5 text-muted-foreground", onClick: () => logout() }, /* @__PURE__ */ React.createElement(LogOut, { className: "w-3.5 h-3.5" }), " ", t("nav.logout"))) : /* @__PURE__ */ React.createElement(Link, { to: "/auth" }, /* @__PURE__ */ React.createElement(Button, { size: "sm", className: "rounded-full bg-[#0066cc] text-sm ml-1 text-white hover:bg-[#0052a3]" }, t("nav.signIn")))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5 lg:hidden" }, /* @__PURE__ */ React.createElement(LanguageSelector, null), /* @__PURE__ */ React.createElement(ThemeToggle, null), /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "icon", className: "h-9 w-9", onClick: () => setOpen(!open) }, open ? /* @__PURE__ */ React.createElement(X, { className: "w-5 h-5" }) : /* @__PURE__ */ React.createElement(Menu, { className: "w-5 h-5" })))), /* @__PURE__ */ React.createElement(AnimatePresence, null, open && /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { height: 0, opacity: 0 },
      animate: { height: "auto", opacity: 1 },
      exit: { height: 0, opacity: 0 },
      transition: { duration: 0.2 },
      className: "lg:hidden overflow-hidden bg-background/95 backdrop-blur-xl border-t border-border"
    },
    /* @__PURE__ */ React.createElement("div", { className: "flex flex-col p-4 gap-1" }, navLinks.map((l) => /* @__PURE__ */ React.createElement(Link, { key: l.to, to: l.to, onClick: () => setOpen(false) }, /* @__PURE__ */ React.createElement(
      Button,
      {
        variant: location.pathname === l.to ? "secondary" : "ghost",
        className: `w-full justify-start ${location.pathname === l.to ? "font-semibold text-primary" : ""}`,
        size: "sm"
      },
      l.label
    ))), /* @__PURE__ */ React.createElement("div", { className: "h-px bg-border my-1" }), user ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Link, { to: "/dashboard", onClick: () => setOpen(false) }, /* @__PURE__ */ React.createElement(Button, { variant: location.pathname === "/dashboard" ? "secondary" : "ghost", className: "w-full justify-start gap-2", size: "sm" }, /* @__PURE__ */ React.createElement(User, { className: "w-4 h-4" }), " Dashboard")), /* @__PURE__ */ React.createElement(Button, { variant: "ghost", className: "w-full justify-start gap-2 text-destructive", size: "sm", onClick: () => {
      logout();
      setOpen(false);
    } }, /* @__PURE__ */ React.createElement(LogOut, { className: "w-4 h-4" }), " Logout")) : /* @__PURE__ */ React.createElement(Link, { to: "/auth", onClick: () => setOpen(false) }, /* @__PURE__ */ React.createElement(Button, { className: "w-full gradient-primary-bg text-primary-foreground", size: "sm" }, "Sign In")))
  )));
}
export {
  Navbar as default
};
