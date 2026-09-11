import { Suspense, lazy, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Activity, Download, FileHeart, Loader2, Pill, Trash2 } from 'lucide-react';
import axios from '@/api/axios';
import { useAuth } from '@/store/useAuth';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HealthProfileForm from '@/components/HealthProfileForm';
import { generatePDF } from '@/lib/reportGenerator';
import { getDietPlan } from '@/data/dietPlans';
import { buttonGhostClass, cardClass, pageWrapClass, sectionTitleClass } from '@/styles/common';
import * as React from 'react';
const SymptomTracker = lazy(() => import('@/components/SymptomTracker'));
const MedicineReminders = lazy(() => import('@/components/MedicineReminders'));
const HealthGoals = lazy(() => import('@/components/HealthGoals'));
function bmiOf(hp) {
  if (!hp?.weightKg || !hp?.heightCm) return null;
  const m = hp.heightCm / 100;
  return Math.round(hp.weightKg / (m * m) * 10) / 10;
}
function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [checks, setChecks] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [saved, setSaved] = useState([]);
  const [hp, setHp] = useState(null);
  const load = async () => {
    setLoading(true);
    try {
      const [c, p, s] = await Promise.all([
        axios.get('/symptom-checks'),
        axios.get('/prescriptions'),
        axios.get('/saved-medicines'),
      ]);
      setChecks(c.data);
      setPrescriptions(p.data);
      setSaved(s.data);
    } catch {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const del = async (url, id, apply) => {
    try {
      await axios.del(`${url}/${id}`);
      apply();
      toast.success('Deleted');
    } catch {
      toast.error('Delete failed');
    }
  };
  const bmi = bmiOf(hp);
  const diet = getDietPlan(hp?.conditions || []);
  if (loading) {
    return /* @__PURE__ */ React.createElement('div', { className: `${pageWrapClass} flex items-center justify-center` }, /* @__PURE__ */ React.createElement(Loader2, { className: 'h-8 w-8 animate-spin text-[#0066cc]' }));
  }
  return /* @__PURE__ */ React.createElement('div', { className: pageWrapClass }, /* @__PURE__ */ React.createElement(Navbar, null), /* @__PURE__ */ React.createElement('div', { className: 'container mx-auto max-w-6xl px-4 pb-20 pt-24' }, /* @__PURE__ */ React.createElement('h1', { className: 'mb-1 font-display text-3xl font-bold' }, 'Hello, ', user?.fullName || 'there'), /* @__PURE__ */ React.createElement('p', { className: 'mb-8 text-sm text-gray-500' }, 'Your health overview'), /* @__PURE__ */ React.createElement('div', { className: 'mb-6 grid grid-cols-2 gap-4 md:grid-cols-4' }, [
    { label: 'BMI', value: bmi ?? '\u2014' },
    { label: 'Symptom checks', value: checks.length },
    { label: 'Prescriptions', value: prescriptions.length },
    { label: 'Saved medicines', value: saved.length },
  ].map((s) => /* @__PURE__ */ React.createElement('div', { key: s.label, className: `${cardClass} text-center` }, /* @__PURE__ */ React.createElement('div', { className: 'font-display text-2xl font-bold text-[#0066cc]' }, s.value), /* @__PURE__ */ React.createElement('div', { className: 'mt-1 text-xs text-gray-500' }, s.label)))), /* @__PURE__ */ React.createElement('div', { className: 'grid grid-cols-1 gap-6 lg:grid-cols-2' }, /* @__PURE__ */ React.createElement('div', { className: cardClass }, /* @__PURE__ */ React.createElement('h2', { className: `${sectionTitleClass} mb-4` }, 'Health Profile'), /* @__PURE__ */ React.createElement(HealthProfileForm, { onSaved: setHp })), /* @__PURE__ */ React.createElement('div', { className: cardClass }, /* @__PURE__ */ React.createElement('h2', { className: `${sectionTitleClass} mb-2` }, 'Diet Plan'), /* @__PURE__ */ React.createElement('p', { className: 'mb-3 text-xs text-gray-500' }, 'Optimized for: ', hp?.conditions?.join(', ') || 'general wellness'), ['breakfast', 'lunch', 'dinner', 'snacks'].map((meal) => /* @__PURE__ */ React.createElement('div', { key: meal, className: 'mb-2' }, /* @__PURE__ */ React.createElement('p', { className: 'text-sm font-medium capitalize' }, meal), /* @__PURE__ */ React.createElement('p', { className: 'text-sm text-gray-500' }, diet.plan[meal].join(' \xB7 ')))))), /* @__PURE__ */ React.createElement('div', { className: `${cardClass} mt-6` }, /* @__PURE__ */ React.createElement('h2', { className: `${sectionTitleClass} mb-4` }, 'Symptom Checks'), checks.length === 0 ? /* @__PURE__ */ React.createElement('p', { className: 'text-sm text-gray-500' }, 'No checks yet. ', /* @__PURE__ */ React.createElement(Link, { to: '/predict', className: 'text-[#0066cc]' }, 'Run one \u2192')) : /* @__PURE__ */ React.createElement('div', { className: 'space-y-3' }, checks.slice(0, 10).map((c) => /* @__PURE__ */ React.createElement('div', { key: c._id, className: 'flex items-start justify-between rounded-xl bg-gray-50 px-4 py-3' }, /* @__PURE__ */ React.createElement('div', null, /* @__PURE__ */ React.createElement('p', { className: 'flex items-center gap-2 text-sm font-medium' }, /* @__PURE__ */ React.createElement(Activity, { className: 'h-4 w-4 text-[#0066cc]' }), c.symptoms.join(', ')), /* @__PURE__ */ React.createElement('p', { className: 'mt-1 text-xs text-gray-500' }, '\u2192 ', c.result?.predictions?.[0]?.disease, ' (', c.result?.predictions?.[0]?.probability, '%)')), /* @__PURE__ */ React.createElement('div', { className: 'flex gap-1' }, /* @__PURE__ */ React.createElement('button', { 'aria-label': 'Download report', onClick: () => generatePDF({ id: c._id, symptoms: c.symptoms, predictions: c.result?.predictions || [], created_at: c.createdAt }) }, /* @__PURE__ */ React.createElement(Download, { className: 'h-4 w-4 text-gray-500' })), /* @__PURE__ */ React.createElement('button', { 'aria-label': 'Delete check', onClick: () => del('/symptom-checks', c._id, () => setChecks((l) => l.filter((x) => x._id !== c._id))) }, /* @__PURE__ */ React.createElement(Trash2, { className: 'h-4 w-4 text-red-500' }))))))), /* @__PURE__ */ React.createElement('div', { className: 'mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2' }, /* @__PURE__ */ React.createElement('div', { className: cardClass }, /* @__PURE__ */ React.createElement('h2', { className: `${sectionTitleClass} mb-4` }, 'Prescriptions'), prescriptions.length === 0 ? /* @__PURE__ */ React.createElement('p', { className: 'text-sm text-gray-500' }, 'None scanned. ', /* @__PURE__ */ React.createElement(Link, { to: '/scanner', className: 'text-[#0066cc]' }, 'Scan one \u2192')) : /* @__PURE__ */ React.createElement('div', { className: 'space-y-3' }, prescriptions.map((p) => /* @__PURE__ */ React.createElement('div', { key: p._id, className: 'flex items-start justify-between rounded-xl bg-gray-50 px-4 py-3' }, /* @__PURE__ */ React.createElement('p', { className: 'flex items-center gap-2 text-sm' }, /* @__PURE__ */ React.createElement(FileHeart, { className: 'h-4 w-4 text-[#0066cc]' }), (p.medicines || []).map((m) => m.name).join(', ') || 'Empty'), /* @__PURE__ */ React.createElement('button', { 'aria-label': 'Delete prescription', onClick: () => del('/prescriptions', p._id, () => setPrescriptions((l) => l.filter((x) => x._id !== p._id))) }, /* @__PURE__ */ React.createElement(Trash2, { className: 'h-4 w-4 text-red-500' })))))), /* @__PURE__ */ React.createElement('div', { className: cardClass }, /* @__PURE__ */ React.createElement('h2', { className: `${sectionTitleClass} mb-4` }, 'Saved Medicines'), saved.length === 0 ? /* @__PURE__ */ React.createElement('p', { className: 'text-sm text-gray-500' }, 'None saved. ', /* @__PURE__ */ React.createElement(Link, { to: '/medicines', className: 'text-[#0066cc]' }, 'Browse \u2192')) : /* @__PURE__ */ React.createElement('div', { className: 'space-y-3' }, saved.map((m) => /* @__PURE__ */ React.createElement('div', { key: m._id, className: 'flex items-start justify-between rounded-xl bg-gray-50 px-4 py-3' }, /* @__PURE__ */ React.createElement('p', { className: 'flex items-center gap-2 text-sm' }, /* @__PURE__ */ React.createElement(Pill, { className: 'h-4 w-4 text-[#0066cc]' }), m.medicineName), /* @__PURE__ */ React.createElement('button', { 'aria-label': 'Remove saved medicine', onClick: () => del('/saved-medicines', m._id, () => setSaved((l) => l.filter((x) => x._id !== m._id))) }, /* @__PURE__ */ React.createElement(Trash2, { className: 'h-4 w-4 text-red-500' }))))))), /* @__PURE__ */ React.createElement('div', { className: 'mt-6' }, /* @__PURE__ */ React.createElement(Suspense, { fallback: /* @__PURE__ */ React.createElement('div', { className: 'flex justify-center py-8' }, /* @__PURE__ */ React.createElement(Loader2, { className: 'h-6 w-6 animate-spin' })) }, /* @__PURE__ */ React.createElement(SymptomTracker, null))), /* @__PURE__ */ React.createElement('div', { className: 'mt-6' }, /* @__PURE__ */ React.createElement(Suspense, { fallback: /* @__PURE__ */ React.createElement('div', { className: 'flex justify-center py-8' }, /* @__PURE__ */ React.createElement(Loader2, { className: 'h-6 w-6 animate-spin' })) }, /* @__PURE__ */ React.createElement(MedicineReminders, null))), /* @__PURE__ */ React.createElement('div', { className: 'mt-6' }, /* @__PURE__ */ React.createElement(Suspense, { fallback: /* @__PURE__ */ React.createElement('div', { className: 'flex justify-center py-8' }, /* @__PURE__ */ React.createElement(Loader2, { className: 'h-6 w-6 animate-spin' })) }, /* @__PURE__ */ React.createElement(HealthGoals, null))), /* @__PURE__ */ React.createElement('div', { className: 'mt-6 flex gap-3' }, /* @__PURE__ */ React.createElement(Link, { to: '/predict', className: buttonGhostClass }, 'Symptom Checker'), /* @__PURE__ */ React.createElement(Link, { to: '/metrics', className: buttonGhostClass }, 'Health Metrics'))), /* @__PURE__ */ React.createElement(Footer, null));
}
var Dashboard_default = Dashboard;
export {
  Dashboard_default as default,
};
