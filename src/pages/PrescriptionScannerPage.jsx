import { useState } from "react";
import toast from "react-hot-toast";
import { Check, Loader2, Pencil, Plus, ScanLine, Trash2, Upload, X } from "lucide-react";
import axios from "@/lib/axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { darkButtonClass, darkCardClass, darkInputClass, darkWrapClass } from "@/styles/common";
import * as React from "react";
function PrescriptionScannerPage() {
  const [preview, setPreview] = useState(null);
  const [imageB64, setImageB64] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scan, setScan] = useState(null);
  const [meds, setMeds] = useState([]);
  const [confirming, setConfirming] = useState(false);
  const onFile = (f) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      setPreview(dataUrl);
      setImageB64(dataUrl);
      setScan(null);
    };
    reader.readAsDataURL(f);
  };
  const runScan = async () => {
    if (!imageB64) {
      toast.error("Upload a prescription image first");
      return;
    }
    setScanning(true);
    try {
      const { data } = await axios.post("/prescriptions/scan", { imageBase64: imageB64 });
      setScan(data);
      setMeds(data.prescription.medicines.map((m) => ({
        name: m.name,
        dosage: m.dosage || "",
        frequency: m.frequency || "",
        times: m.times || []
      })));
      if (data.prescription.medicines.length === 0) toast("No medicines recognized \u2014 add them manually below");
    } catch (e) {
      toast.error(e.response?.data?.error || "Scan failed");
    } finally {
      setScanning(false);
    }
  };
  const patchMed = (i, k, v) => setMeds((list) => list.map((m, j) => j === i ? { ...m, [k]: k === "times" ? v.split(",").map((t) => t.trim()).filter(Boolean) : v } : m));
  const confirm = async () => {
    if (!scan) return;
    if (meds.some((m) => !m.name.trim() || m.times.length === 0)) {
      toast.error("Every medicine needs a name and at least one time");
      return;
    }
    setConfirming(true);
    try {
      await axios.patch(`/prescriptions/${scan.prescription._id}`, {
        medicines: meds,
        reminderSchedule: meds.map((m) => ({ medicineName: m.name, dosage: m.dosage || null, times: m.times }))
      });
      await Promise.all(scan.reminders.map((r) => axios.del(`/reminders/${r._id}`).catch(() => {
      })));
      const created = await Promise.all(
        meds.flatMap(
          (m) => m.times.map(
            (t) => axios.post("/reminders", {
              medicineName: m.name,
              dosage: [m.dosage, m.frequency].filter(Boolean).join(" ") || null,
              reminderTime: t
            })
          )
        )
      );
      setScan({ ...scan, reminders: created.map((r) => r.data) });
      toast.success(`Schedule confirmed \u2014 ${created.length} reminders set`);
    } catch {
      toast.error("Failed to confirm schedule");
    } finally {
      setConfirming(false);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: darkWrapClass }, /* @__PURE__ */ React.createElement(Navbar, null), /* @__PURE__ */ React.createElement("div", { className: "container mx-auto max-w-4xl px-4 pb-20 pt-24" }, /* @__PURE__ */ React.createElement("h1", { className: "mb-2 font-display text-3xl font-bold" }, "Prescription Scanner"), /* @__PURE__ */ React.createElement("p", { className: "mb-8 text-sm text-gray-400" }, "Upload a printed prescription \u2014 review and edit before confirming reminders."), /* @__PURE__ */ React.createElement("div", { className: darkCardClass }, /* @__PURE__ */ React.createElement("label", { className: "flex cursor-pointer flex-col items-center gap-3 rounded-xl border border-dashed border-white/20 px-6 py-10 text-center" }, /* @__PURE__ */ React.createElement(Upload, { className: "h-8 w-8 text-[#ff4d67]" }), /* @__PURE__ */ React.createElement("span", { className: "text-sm text-gray-300" }, preview ? "Choose a different image" : "Upload prescription image"), /* @__PURE__ */ React.createElement("input", { type: "file", accept: "image/*", className: "hidden", onChange: (e) => onFile(e.target.files?.[0]) })), preview && /* @__PURE__ */ React.createElement("img", { src: preview, alt: "prescription", className: "mx-auto mt-4 max-h-64 rounded-xl" }), /* @__PURE__ */ React.createElement("button", { className: `${darkButtonClass} mt-4 flex w-full items-center justify-center gap-2`, onClick: runScan, disabled: scanning || !imageB64 }, scanning ? /* @__PURE__ */ React.createElement(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ React.createElement(ScanLine, { className: "h-4 w-4" }), "Scan Prescription")), scan && /* @__PURE__ */ React.createElement("div", { className: `${darkCardClass} mt-6` }, /* @__PURE__ */ React.createElement("div", { className: "mb-4 flex items-center justify-between" }, /* @__PURE__ */ React.createElement("h2", { className: "font-display text-lg font-semibold" }, "OCR Preview"), /* @__PURE__ */ React.createElement("span", { className: "rounded-full bg-white/10 px-3 py-1 text-xs" }, "confidence: ", scan.confidence)), scan.rawText && /* @__PURE__ */ React.createElement("pre", { className: "mb-4 max-h-32 overflow-y-auto whitespace-pre-wrap rounded-xl bg-black/40 p-4 text-xs text-gray-400" }, scan.rawText), /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, meds.map((m, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "rounded-xl bg-white/5 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "mb-2 grid grid-cols-1 gap-2 sm:grid-cols-3" }, /* @__PURE__ */ React.createElement("input", { className: darkInputClass, value: m.name, placeholder: "Medicine name", onChange: (e) => patchMed(i, "name", e.target.value) }), /* @__PURE__ */ React.createElement("input", { className: darkInputClass, value: m.dosage, placeholder: "Dosage (e.g. 500mg)", onChange: (e) => patchMed(i, "dosage", e.target.value) }), /* @__PURE__ */ React.createElement("input", { className: darkInputClass, value: m.times.join(", "), placeholder: "Times (08:00, 20:00)", onChange: (e) => patchMed(i, "times", e.target.value) })), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1 text-xs text-gray-500" }, /* @__PURE__ */ React.createElement(Pencil, { className: "h-3 w-3" }), " editable before confirming"), /* @__PURE__ */ React.createElement("button", { className: "text-gray-500 hover:text-red-400", onClick: () => setMeds((l) => l.filter((_, j) => j !== i)), "aria-label": "Remove medicine" }, /* @__PURE__ */ React.createElement(Trash2, { className: "h-4 w-4" })))))), /* @__PURE__ */ React.createElement("div", { className: "mt-4 flex flex-col gap-2 sm:flex-row" }, /* @__PURE__ */ React.createElement("button", { className: "flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-2.5 text-sm", onClick: () => setMeds([...meds, { name: "", dosage: "", frequency: "", times: ["08:00"] }]) }, /* @__PURE__ */ React.createElement(Plus, { className: "h-4 w-4" }), " Add medicine"), /* @__PURE__ */ React.createElement("button", { className: `${darkButtonClass} flex flex-1 items-center justify-center gap-2`, onClick: confirm, disabled: confirming }, confirming ? /* @__PURE__ */ React.createElement(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ React.createElement(Check, { className: "h-4 w-4" }), "Confirm Reminders (", meds.reduce((n, m) => n + m.times.length, 0), ")"), scan.reminders.length > 0 && /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1 self-center text-xs text-gray-500" }, /* @__PURE__ */ React.createElement(X, { className: "h-3 w-3" }), " replaces ", scan.reminders.length, " auto-created")))), /* @__PURE__ */ React.createElement(Footer, null));
}
var PrescriptionScannerPage_default = PrescriptionScannerPage;
export {
  PrescriptionScannerPage_default as default
};
