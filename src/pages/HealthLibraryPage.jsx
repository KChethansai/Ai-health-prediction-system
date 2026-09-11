import { useState } from "react";
import { motion } from "framer-motion";
import { Search, BookOpen, ChevronRight, ArrowLeft, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { pageWrapClass, cardClass } from "@/styles/common";
import { healthArticles, articleCategories } from "@/data/healthLibrary";
import * as React from "react";
function HealthLibraryPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const filtered = healthArticles.filter((a) => {
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === "All" || a.category === activeCategory;
    return matchSearch && matchCategory;
  });
  if (selectedArticle) {
    return /* @__PURE__ */ React.createElement("div", { className: pageWrapClass }, /* @__PURE__ */ React.createElement(Navbar, null), /* @__PURE__ */ React.createElement("div", { className: "pt-24 section-padding" }, /* @__PURE__ */ React.createElement("div", { className: "container mx-auto max-w-3xl" }, /* @__PURE__ */ React.createElement(Button, { variant: "ghost", className: "gap-2 mb-6", onClick: () => setSelectedArticle(null) }, /* @__PURE__ */ React.createElement(ArrowLeft, { className: "w-4 h-4" }), " Back to Library"), /* @__PURE__ */ React.createElement(motion.article, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }, /* @__PURE__ */ React.createElement("div", { className: `${cardClass} p-8` }, /* @__PURE__ */ React.createElement("div", { className: "text-5xl mb-4" }, selectedArticle.icon), /* @__PURE__ */ React.createElement(Badge, { variant: "secondary", className: "mb-3" }, selectedArticle.category), /* @__PURE__ */ React.createElement("h1", { className: "font-display text-3xl font-bold mb-3" }, selectedArticle.title), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground mb-6" }, selectedArticle.description), /* @__PURE__ */ React.createElement("div", { className: "prose prose-sm dark:prose-invert max-w-none" }, /* @__PURE__ */ React.createElement("p", { className: "text-foreground leading-relaxed" }, selectedArticle.content)), /* @__PURE__ */ React.createElement("div", { className: "mt-8 p-4 rounded-xl bg-primary/5 border border-primary/20" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-muted-foreground" }, "\u2695\uFE0F This information is for educational purposes only and should not replace professional medical advice. Always consult a healthcare provider for diagnosis and treatment.")))))), /* @__PURE__ */ React.createElement(Footer, null));
  }
  return /* @__PURE__ */ React.createElement("div", { className: pageWrapClass }, /* @__PURE__ */ React.createElement(Navbar, null), /* @__PURE__ */ React.createElement("div", { className: "pt-24 section-padding" }, /* @__PURE__ */ React.createElement("div", { className: "container mx-auto" }, /* @__PURE__ */ React.createElement(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "page-header" }, /* @__PURE__ */ React.createElement("div", { className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase mb-4" }, /* @__PURE__ */ React.createElement(BookOpen, { className: "w-3.5 h-3.5" }), " Health Knowledge Base"), /* @__PURE__ */ React.createElement("h1", null, "Health ", /* @__PURE__ */ React.createElement("span", { className: "text-[#0066cc]" }, "Library")), /* @__PURE__ */ React.createElement("p", null, "Expert health articles on diseases, nutrition, exercise, sleep, and wellness")), /* @__PURE__ */ React.createElement("div", { className: "max-w-2xl mx-auto mb-6" }, /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }), /* @__PURE__ */ React.createElement(Input, { placeholder: "Search articles...", value: search, onChange: (e) => setSearch(e.target.value), className: "pl-10" }), search && /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "icon", className: "absolute right-1 top-1/2 -translate-y-1/2", onClick: () => setSearch("") }, /* @__PURE__ */ React.createElement(X, { className: "w-4 h-4" })))), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2 justify-center mb-8" }, /* @__PURE__ */ React.createElement(Button, { variant: activeCategory === "All" ? "default" : "outline", size: "sm", onClick: () => setActiveCategory("All") }, "All"), articleCategories.map((c) => /* @__PURE__ */ React.createElement(Button, { key: c, variant: activeCategory === c ? "default" : "outline", size: "sm", onClick: () => setActiveCategory(c) }, c))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" }, filtered.map((a, i) => /* @__PURE__ */ React.createElement(
    motion.div,
    {
      key: a.id,
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: i * 0.05 },
      className: `${cardClass} cursor-pointer group`,
      onClick: () => setSelectedArticle(a)
    },
    /* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between mb-3" }, /* @__PURE__ */ React.createElement("span", { className: "text-4xl" }, a.icon), /* @__PURE__ */ React.createElement(ChevronRight, { className: "w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" })),
    /* @__PURE__ */ React.createElement(Badge, { variant: "secondary", className: "text-xs mb-2" }, a.category),
    /* @__PURE__ */ React.createElement("h3", { className: "font-display font-semibold text-base mb-2" }, a.title),
    /* @__PURE__ */ React.createElement("p", { className: "text-sm text-muted-foreground line-clamp-2" }, a.description)
  ))), filtered.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "empty-state" }, /* @__PURE__ */ React.createElement(BookOpen, { className: "empty-state-icon" }), /* @__PURE__ */ React.createElement("p", null, "No articles found matching your search"), /* @__PURE__ */ React.createElement("p", { className: "empty-state-hint" }, "Try different keywords or browse all categories")))), /* @__PURE__ */ React.createElement(Footer, null));
}
export {
  HealthLibraryPage as default
};
