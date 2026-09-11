import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Pill, ChevronRight, X, ArrowLeft, Bookmark, BookmarkCheck, GitCompare, AlertTriangle, TrendingUp, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { medicines, popularMedicineIds, knownInteractions } from "@/data/medicines";
import axios from "@/lib/axios";
import { useAuth } from "@/store/useAuth";
import toast from "react-hot-toast";
import * as React from "react";
const ITEMS_PER_PAGE = 24;
const classCategories = {
  "Pain Relief": ["Analgesic/Antipyretic", "NSAID", "NSAID/Antiplatelet", "COX-2 Selective NSAID", "Opioid Analgesic", "Opioid Analgesic Combination"],
  "Antibiotics": ["Antibiotic (Penicillin)", "Macrolide Antibiotic", "Fluoroquinolone Antibiotic", "Cephalosporin Antibiotic", "Tetracycline Antibiotic", "Nitroimidazole Antibiotic/Antiprotozoal", "Lincosamide Antibiotic", "Sulfonamide Antibiotic", "Nitrofuran Antibiotic"],
  "Antihistamines": ["Antihistamine", "First-Generation Antihistamine", "Antihistamine/Antivertigo", "Phenothiazine Antihistamine"],
  "Cardiovascular": ["ACE Inhibitor", "ARB (Angiotensin II Receptor Blocker)", "Beta Blocker", "Non-Selective Beta Blocker", "Alpha/Beta Blocker", "Alpha-1 Blocker", "Calcium Channel Blocker", "Statin", "Antiplatelet", "Anticoagulant", "Direct Oral Anticoagulant (DOAC)", "Low Molecular Weight Heparin", "Thiazide Diuretic", "Loop Diuretic", "Potassium-Sparing Diuretic", "Cardiac Glycoside", "Class III Antiarrhythmic", "Nitrate", "Direct Vasodilator", "Central Alpha-2 Agonist"],
  "Antidepressants": ["SSRI Antidepressant", "SNRI Antidepressant", "NDRI Antidepressant", "Serotonin Modulator", "Tricyclic Antidepressant", "Tetracyclic Antidepressant"],
  "Antidiabetic": ["Antidiabetic (Biguanide)", "Sulfonylurea", "DPP-4 Inhibitor", "SGLT2 Inhibitor", "GLP-1 Receptor Agonist", "Thiazolidinedione", "Long-Acting Insulin"],
  "GI / Acid Reducers": ["Proton Pump Inhibitor", "H2 Receptor Antagonist", "Antidiarrheal", "Mucosal Protectant", "Prokinetic/Antiemetic", "Osmotic Laxative", "Stimulant Laxative", "Stool Softener", "Aminosalicylate", "Prostaglandin E1 Analog", "5-HT3 Receptor Antagonist"],
  "Antifungals / Antivirals": ["Azole Antifungal", "Topical Antifungal", "Antiviral", "Neuraminidase Inhibitor Antiviral"],
  "Respiratory": ["Short-Acting Beta-2 Agonist", "Inhaled Corticosteroid", "Long-Acting Anticholinergic", "Leukotriene Receptor Antagonist"],
  "Psychiatric / Neuro": ["Benzodiazepine", "Non-Benzodiazepine Hypnotic", "Atypical Antipsychotic", "Typical Antipsychotic", "Mood Stabilizer", "Anxiolytic", "CNS Stimulant", "SNRI (Non-Stimulant ADHD)", "Anticonvulsant", "Anticonvulsant/Neuropathic Agent", "Cholinesterase Inhibitor", "NMDA Receptor Antagonist", "Anticholinergic"]
};
function fuzzyMatch(text, query) {
  const t = text.toLowerCase();
  const q = query.toLowerCase();
  if (t.includes(q)) return true;
  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++;
  }
  return qi === q.length;
}
function checkInteractions(selected) {
  const warnings = [];
  for (let i = 0; i < selected.length; i++) {
    for (let j = i + 1; j < selected.length; j++) {
      const a = selected[i].genericName;
      const b = selected[j].genericName;
      for (const [x, y, w] of knownInteractions) {
        if (a.includes(x) && b.includes(y) || a.includes(y) && b.includes(x)) {
          warnings.push({ a, b, warning: w });
        }
      }
      if (selected[i].interactions.some((int) => b.toLowerCase().includes(int.toLowerCase()) || int.toLowerCase().includes(b.toLowerCase()))) {
        if (!warnings.find((w) => w.a === a && w.b === b)) {
          warnings.push({ a, b, warning: `${a} lists ${b} as a known interaction` });
        }
      }
    }
  }
  return warnings;
}
function MedicineDatabasePage() {
  const [search, setSearch] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [savedIds, setSavedIds] = useState(/* @__PURE__ */ new Set());
  const [savedDocIds, setSavedDocIds] = useState({});
  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [interactionCheck, setInteractionCheck] = useState([]);
  const [page, setPage] = useState(1);
  const { user } = useAuth();
  useEffect(() => {
    if (user) loadSaved();
  }, [user]);
  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter]);
  const loadSaved = async () => {
    try {
      const { data } = await axios.get("/saved-medicines");
      setSavedIds(new Set(data.map((d) => d.medicineId)));
      setSavedDocIds(Object.fromEntries(data.map((d) => [d.medicineId, d._id])));
    } catch {
      // logged-out visitors simply see an empty saved list
    }
  };
  const toggleSave = async (m) => {
    if (!user) {
      toast.error("Sign in to save medicines");
      return;
    }
    if (savedIds.has(m.id)) {
      const docId = savedDocIds[m.id];
      if (docId) await axios.del(`/saved-medicines/${docId}`).catch(() => {
      });
      setSavedIds((prev) => {
        const n = new Set(prev);
        n.delete(m.id);
        return n;
      });
      toast.success("Removed from saved");
    } else {
      try {
        const { data } = await axios.post("/saved-medicines", { medicineId: m.id, medicineName: m.genericName, drugClass: m.drugClass });
        setSavedDocIds((prev) => ({ ...prev, [m.id]: data._id }));
        setSavedIds((prev) => new Set(prev).add(m.id));
        toast.success("Saved!");
      } catch {
        toast.error("Failed to save");
      }
    }
  };
  const toggleCompare = (m) => {
    setCompareList((prev) => prev.find((x) => x.id === m.id) ? prev.filter((x) => x.id !== m.id) : prev.length < 3 ? [...prev, m] : prev);
  };
  const toggleInteraction = (m) => {
    setInteractionCheck((prev) => prev.find((x) => x.id === m.id) ? prev.filter((x) => x.id !== m.id) : [...prev, m]);
  };
  const filtered = useMemo(() => medicines.filter((m) => {
    const matchSearch = !search || fuzzyMatch(m.genericName, search) || fuzzyMatch(m.brandName, search) || fuzzyMatch(m.drugClass, search) || m.description && fuzzyMatch(m.description, search);
    const matchClass = categoryFilter === "all" || classCategories[categoryFilter]?.includes(m.drugClass);
    return matchSearch && matchClass;
  }), [search, categoryFilter]);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const interactionWarnings = useMemo(() => checkInteractions(interactionCheck), [interactionCheck]);
  const popularMedicines = medicines.filter((m) => popularMedicineIds.includes(m.id));
  if (showCompare && compareList.length >= 2) {
    return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen bg-background" }, /* @__PURE__ */ React.createElement(Navbar, null), /* @__PURE__ */ React.createElement("div", { className: "pt-24 section-padding" }, /* @__PURE__ */ React.createElement("div", { className: "container mx-auto" }, /* @__PURE__ */ React.createElement(Button, { variant: "ghost", className: "gap-2 mb-6", onClick: () => setShowCompare(false) }, /* @__PURE__ */ React.createElement(ArrowLeft, { className: "w-4 h-4" }), " Back"), /* @__PURE__ */ React.createElement("h2", { className: "font-display text-2xl font-bold mb-6" }, "Medicine Comparison"), /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React.createElement("table", { className: "w-full" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { className: "border-b border-border" }, /* @__PURE__ */ React.createElement("th", { className: "text-left p-3 text-sm font-medium text-muted-foreground" }, "Property"), compareList.map((m) => /* @__PURE__ */ React.createElement("th", { key: m.id, className: "text-left p-3 font-display font-semibold" }, m.genericName)))), /* @__PURE__ */ React.createElement("tbody", { className: "text-sm" }, [
      { label: "Brand", key: "brandName" },
      { label: "Drug Class", key: "drugClass" },
      { label: "Dosage", key: "dosage" },
      { label: "Pregnancy Safety", key: "pregnancySafety" },
      { label: "Manufacturer", key: "manufacturer" }
    ].map((row) => /* @__PURE__ */ React.createElement("tr", { key: row.key, className: "border-b border-border" }, /* @__PURE__ */ React.createElement("td", { className: "p-3 font-medium text-muted-foreground" }, row.label), compareList.map((m) => /* @__PURE__ */ React.createElement("td", { key: m.id, className: "p-3" }, m[row.key])))), /* @__PURE__ */ React.createElement("tr", { className: "border-b border-border" }, /* @__PURE__ */ React.createElement("td", { className: "p-3 font-medium text-muted-foreground" }, "Uses"), compareList.map((m) => /* @__PURE__ */ React.createElement("td", { key: m.id, className: "p-3" }, m.uses.join(", ")))), /* @__PURE__ */ React.createElement("tr", { className: "border-b border-border" }, /* @__PURE__ */ React.createElement("td", { className: "p-3 font-medium text-muted-foreground" }, "Side Effects"), compareList.map((m) => /* @__PURE__ */ React.createElement("td", { key: m.id, className: "p-3" }, m.sideEffects.join(", ")))), /* @__PURE__ */ React.createElement("tr", { className: "border-b border-border" }, /* @__PURE__ */ React.createElement("td", { className: "p-3 font-medium text-muted-foreground" }, "Warnings"), compareList.map((m) => /* @__PURE__ */ React.createElement("td", { key: m.id, className: "p-3" }, m.warnings.join(", "))))))))), /* @__PURE__ */ React.createElement(Footer, null));
  }
  if (selectedMedicine) {
    const m = selectedMedicine;
    return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen bg-background" }, /* @__PURE__ */ React.createElement(Navbar, null), /* @__PURE__ */ React.createElement("div", { className: "pt-24 section-padding" }, /* @__PURE__ */ React.createElement("div", { className: "container mx-auto max-w-4xl" }, /* @__PURE__ */ React.createElement(Button, { variant: "ghost", className: "gap-2 mb-6", onClick: () => setSelectedMedicine(null) }, /* @__PURE__ */ React.createElement(ArrowLeft, { className: "w-4 h-4" }), " Back to Database"), /* @__PURE__ */ React.createElement(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "glass-card rounded-xl p-8 mb-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between mb-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", { className: "font-display text-3xl font-bold" }, m.genericName), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground" }, m.brandName, " \u2022 ", m.drugClass)), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "icon", onClick: () => toggleSave(m) }, savedIds.has(m.id) ? /* @__PURE__ */ React.createElement(BookmarkCheck, { className: "w-4 h-4 text-primary" }) : /* @__PURE__ */ React.createElement(Bookmark, { className: "w-4 h-4" })), /* @__PURE__ */ React.createElement(Badge, { variant: "secondary", className: "text-sm" }, m.manufacturer))), m.description && /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground mb-6" }, m.description), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 mb-6" }, /* @__PURE__ */ React.createElement("div", { className: "bg-muted/50 rounded-lg p-3 text-center" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-muted-foreground" }, "Drug Class"), /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium mt-1" }, m.drugClass)), /* @__PURE__ */ React.createElement("div", { className: "bg-muted/50 rounded-lg p-3 text-center" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-muted-foreground" }, "Used For"), /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium mt-1" }, m.uses[0])), /* @__PURE__ */ React.createElement("div", { className: "bg-muted/50 rounded-lg p-3 text-center" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-muted-foreground" }, "Pregnancy"), /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium mt-1" }, m.pregnancySafety.split(" - ")[0])), /* @__PURE__ */ React.createElement("div", { className: "bg-muted/50 rounded-lg p-3 text-center" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-muted-foreground" }, "Dosage"), /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium mt-1" }, m.dosage.split(" ")[0]))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, /* @__PURE__ */ React.createElement(Section, { title: "Uses", items: m.uses, icon: "\u{1FA7A}" }), /* @__PURE__ */ React.createElement(Section, { title: "Dosage", text: m.dosage, icon: "\u{1F48A}" }), /* @__PURE__ */ React.createElement(Section, { title: "Side Effects", items: m.sideEffects, icon: "\u26A0\uFE0F" }), /* @__PURE__ */ React.createElement(Section, { title: "Warnings", items: m.warnings, icon: "\u{1F6A8}" }), /* @__PURE__ */ React.createElement(Section, { title: "Contraindications", items: m.contraindications, icon: "\u{1F6AB}" }), /* @__PURE__ */ React.createElement(Section, { title: "Drug Interactions", items: m.interactions, icon: "\u{1F504}" }), /* @__PURE__ */ React.createElement(Section, { title: "Pregnancy Safety", text: m.pregnancySafety, icon: "\u{1F930}" })))))), /* @__PURE__ */ React.createElement(Footer, null));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen bg-background" }, /* @__PURE__ */ React.createElement(Navbar, null), /* @__PURE__ */ React.createElement("div", { className: "pt-24 section-padding" }, /* @__PURE__ */ React.createElement("div", { className: "container mx-auto" }, /* @__PURE__ */ React.createElement(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "page-header" }, /* @__PURE__ */ React.createElement("h1", null, "Medicine ", /* @__PURE__ */ React.createElement("span", { className: "gradient-text" }, "Database")), /* @__PURE__ */ React.createElement("p", null, "Search and explore ", medicines.length, "+ medicines with detailed information, interactions, and comparisons")), !search && categoryFilter === "all" && page === 1 && /* @__PURE__ */ React.createElement("div", { className: "mb-8" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 mb-3" }, /* @__PURE__ */ React.createElement(TrendingUp, { className: "w-4 h-4 text-primary" }), /* @__PURE__ */ React.createElement("h2", { className: "font-display font-semibold text-sm" }, "Popular Medicines")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2" }, popularMedicines.map((m) => /* @__PURE__ */ React.createElement(Button, { key: m.id, variant: "outline", size: "sm", className: "gap-1.5", onClick: () => setSelectedMedicine(m) }, /* @__PURE__ */ React.createElement(Pill, { className: "w-3 h-3 text-primary" }), m.genericName)))), /* @__PURE__ */ React.createElement("div", { className: "max-w-3xl mx-auto mb-4 flex flex-col sm:flex-row gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "relative flex-1" }, /* @__PURE__ */ React.createElement(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }), /* @__PURE__ */ React.createElement(Input, { placeholder: "Search by name, brand, or drug class...", value: search, onChange: (e) => setSearch(e.target.value), className: "pl-10" }), search && /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "icon", className: "absolute right-1 top-1/2 -translate-y-1/2", onClick: () => setSearch("") }, /* @__PURE__ */ React.createElement(X, { className: "w-4 h-4" }))), /* @__PURE__ */ React.createElement(Select, { value: categoryFilter, onValueChange: setCategoryFilter }, /* @__PURE__ */ React.createElement(SelectTrigger, { className: "w-full sm:w-52" }, /* @__PURE__ */ React.createElement(SelectValue, { placeholder: "Category" })), /* @__PURE__ */ React.createElement(SelectContent, null, /* @__PURE__ */ React.createElement(SelectItem, { value: "all" }, "All Categories"), Object.keys(classCategories).map((c) => /* @__PURE__ */ React.createElement(SelectItem, { key: c, value: c }, c))))), interactionCheck.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "mb-4 max-w-3xl mx-auto" }, /* @__PURE__ */ React.createElement("div", { className: "glass-card rounded-xl p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-2" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(AlertTriangle, { className: "w-4 h-4 text-destructive" }), /* @__PURE__ */ React.createElement("span", { className: "text-sm font-medium" }, "Interaction Checker (", interactionCheck.length, " selected)")), /* @__PURE__ */ React.createElement(Button, { size: "sm", variant: "ghost", onClick: () => setInteractionCheck([]) }, "Clear")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-1 mb-2" }, interactionCheck.map((m) => /* @__PURE__ */ React.createElement(Badge, { key: m.id, variant: "secondary", className: "cursor-pointer", onClick: () => toggleInteraction(m) }, m.genericName, " \xD7"))), interactionWarnings.length > 0 ? /* @__PURE__ */ React.createElement("div", { className: "space-y-2 mt-3" }, interactionWarnings.map((w, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm" }, /* @__PURE__ */ React.createElement("span", { className: "font-medium text-destructive" }, "\u26A0 Potential interaction:"), " ", w.a, " + ", w.b, " \u2014 ", w.warning, ". Consult a healthcare professional."))) : interactionCheck.length >= 2 ? /* @__PURE__ */ React.createElement("p", { className: "text-sm text-muted-foreground mt-2" }, "\u2705 No known interactions found between selected medicines.") : /* @__PURE__ */ React.createElement("p", { className: "text-xs text-muted-foreground" }, "Select 2+ medicines to check for interactions"))), compareList.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "mb-6 glass-card rounded-xl p-4 flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 flex-wrap" }, /* @__PURE__ */ React.createElement(GitCompare, { className: "w-4 h-4 text-primary" }), /* @__PURE__ */ React.createElement("span", { className: "text-sm font-medium" }, "Comparing ", compareList.length), compareList.map((m) => /* @__PURE__ */ React.createElement(Badge, { key: m.id, variant: "secondary" }, m.genericName))), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement(Button, { size: "sm", disabled: compareList.length < 2, onClick: () => setShowCompare(true) }, "Compare"), /* @__PURE__ */ React.createElement(Button, { size: "sm", variant: "ghost", onClick: () => setCompareList([]) }, "Clear"))), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-muted-foreground mb-4" }, "Showing ", paged.length, " of ", filtered.length, " medicines", search && ` matching "${search}"`), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" }, paged.map((m, i) => /* @__PURE__ */ React.createElement(
    motion.div,
    {
      key: m.id,
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: i * 0.02 },
      className: "glass-card rounded-xl p-5 cursor-pointer group"
    },
    /* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between", onClick: () => setSelectedMedicine(m) }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0" }, /* @__PURE__ */ React.createElement(Pill, { className: "w-5 h-5 text-primary" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-display font-semibold" }, m.genericName), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-muted-foreground" }, m.brandName))), /* @__PURE__ */ React.createElement(ChevronRight, { className: "w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" })),
    m.description && /* @__PURE__ */ React.createElement("p", { className: "text-xs text-muted-foreground mt-2 line-clamp-2" }, m.description),
    /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mt-3" }, /* @__PURE__ */ React.createElement(Badge, { variant: "secondary", className: "text-xs" }, m.drugClass), /* @__PURE__ */ React.createElement("div", { className: "flex gap-1" }, /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "icon", className: "h-7 w-7", title: "Check interactions", onClick: (e) => {
      e.stopPropagation();
      toggleInteraction(m);
    } }, /* @__PURE__ */ React.createElement(AlertTriangle, { className: `w-3.5 h-3.5 ${interactionCheck.find((x) => x.id === m.id) ? "text-destructive" : ""}` })), /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "icon", className: "h-7 w-7", onClick: (e) => {
      e.stopPropagation();
      toggleCompare(m);
    } }, /* @__PURE__ */ React.createElement(GitCompare, { className: `w-3.5 h-3.5 ${compareList.find((x) => x.id === m.id) ? "text-primary" : ""}` })), /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "icon", className: "h-7 w-7", onClick: (e) => {
      e.stopPropagation();
      toggleSave(m);
    } }, savedIds.has(m.id) ? /* @__PURE__ */ React.createElement(BookmarkCheck, { className: "w-3.5 h-3.5 text-primary" }) : /* @__PURE__ */ React.createElement(Bookmark, { className: "w-3.5 h-3.5" }))))
  ))), filtered.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "empty-state" }, /* @__PURE__ */ React.createElement(Pill, { className: "empty-state-icon" }), /* @__PURE__ */ React.createElement("p", null, 'No medicines found matching "', search, '"'), /* @__PURE__ */ React.createElement("p", { className: "empty-state-hint" }, "Try a different search term or clear the filters")), totalPages > 1 && /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center gap-2 mt-8" }, /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "sm", disabled: page === 1, onClick: () => setPage((p) => p - 1) }, /* @__PURE__ */ React.createElement(ChevronLeft, { className: "w-4 h-4" })), Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2).reduce((acc, p, i, arr) => {
    if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
    acc.push(p);
    return acc;
  }, []).map(
    (p, i) => p === "..." ? /* @__PURE__ */ React.createElement("span", { key: `dots-${i}`, className: "px-2 text-muted-foreground" }, "\u2026") : /* @__PURE__ */ React.createElement(Button, { key: p, variant: page === p ? "default" : "outline", size: "sm", className: "w-9", onClick: () => setPage(p) }, p)
  ), /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "sm", disabled: page === totalPages, onClick: () => setPage((p) => p + 1) }, /* @__PURE__ */ React.createElement(ChevronRight, { className: "w-4 h-4" }))))), /* @__PURE__ */ React.createElement(Footer, null));
}
function Section({ title, items, text, icon }) {
  return /* @__PURE__ */ React.createElement("div", { className: "bg-muted/50 rounded-lg p-4" }, /* @__PURE__ */ React.createElement("h3", { className: "font-display font-semibold text-sm mb-2" }, icon, " ", title), text && /* @__PURE__ */ React.createElement("p", { className: "text-sm text-muted-foreground" }, text), items && /* @__PURE__ */ React.createElement("ul", { className: "text-sm text-muted-foreground space-y-1" }, items.map((item) => /* @__PURE__ */ React.createElement("li", { key: item }, "\u2022 ", item))));
}
export {
  MedicineDatabasePage as default
};
