import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import axios from '@/api/axios';
import { buttonClass, cardClass, errorClass, formGroup, inputClass, labelClass, sectionTitleClass } from '@/styles/common';
import * as React from 'react';
function SymptomTracker() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { severity: 'Moderate' },
  });
  const load = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/symptom-logs');
      setLogs(data);
    } catch {
      toast.error('Failed to load symptom logs');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const add = async (v) => {
    try {
      const { data } = await axios.post('/symptom-logs', { symptom: v.symptom, severity: v.severity, notes: v.notes || null });
      setLogs((l) => [data, ...l]);
      reset({ symptom: '', severity: 'Moderate', notes: '' });
      toast.success('Symptom logged');
    } catch {
      toast.error('Failed to log symptom');
    }
  };
  const remove = async (id) => {
    try {
      await axios.del(`/symptom-logs/${id}`);
      setLogs((l) => l.filter((x) => x._id !== id));
    } catch {
      toast.error('Failed to remove log');
    }
  };
  return /* @__PURE__ */ React.createElement('div', { className: 'space-y-6' }, /* @__PURE__ */ React.createElement('div', { className: cardClass }, /* @__PURE__ */ React.createElement('h3', { className: `${sectionTitleClass} mb-4` }, 'Log Symptom'), /* @__PURE__ */ React.createElement('form', { onSubmit: handleSubmit(add), className: 'grid grid-cols-1 gap-4 sm:grid-cols-3' }, /* @__PURE__ */ React.createElement('div', { className: formGroup }, /* @__PURE__ */ React.createElement('label', { className: labelClass }, 'Symptom'), /* @__PURE__ */ React.createElement('input', { className: inputClass, placeholder: 'e.g. Headache', ...register('symptom', { required: 'Required' }) }), errors.symptom && /* @__PURE__ */ React.createElement('p', { className: errorClass }, 'Required')), /* @__PURE__ */ React.createElement('div', { className: formGroup }, /* @__PURE__ */ React.createElement('label', { className: labelClass }, 'Severity'), /* @__PURE__ */ React.createElement('select', { className: inputClass, ...register('severity') }, ['Mild', 'Moderate', 'Severe'].map((s) => /* @__PURE__ */ React.createElement('option', { key: s, value: s }, s)))), /* @__PURE__ */ React.createElement('div', { className: formGroup }, /* @__PURE__ */ React.createElement('label', { className: labelClass }, 'Notes'), /* @__PURE__ */ React.createElement('input', { className: inputClass, placeholder: 'Optional', ...register('notes') })), /* @__PURE__ */ React.createElement('button', { type: 'submit', className: `${buttonClass} flex items-center justify-center gap-2 sm:col-span-3`, disabled: isSubmitting }, isSubmitting ? /* @__PURE__ */ React.createElement(Loader2, { className: 'h-4 w-4 animate-spin' }) : /* @__PURE__ */ React.createElement(Plus, { className: 'h-4 w-4' }), 'Log Symptom'))), /* @__PURE__ */ React.createElement('div', { className: cardClass }, /* @__PURE__ */ React.createElement('h3', { className: `${sectionTitleClass} mb-4` }, 'Recent Logs'), loading ? /* @__PURE__ */ React.createElement('div', { className: 'flex justify-center py-8' }, /* @__PURE__ */ React.createElement(Loader2, { className: 'h-6 w-6 animate-spin text-[#0066cc]' })) : logs.length === 0 ? /* @__PURE__ */ React.createElement('p', { className: 'py-6 text-center text-sm text-gray-500' }, 'No symptoms logged yet.') : /* @__PURE__ */ React.createElement('div', { className: 'space-y-2' }, logs.slice(0, 20).map((l) => /* @__PURE__ */ React.createElement('div', { key: l._id, className: 'flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3' }, /* @__PURE__ */ React.createElement('div', null, /* @__PURE__ */ React.createElement('span', { className: 'text-sm font-medium' }, l.symptom), /* @__PURE__ */ React.createElement('span', { className: 'ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs' }, l.severity), l.notes && /* @__PURE__ */ React.createElement('p', { className: 'text-xs text-gray-500' }, l.notes)), /* @__PURE__ */ React.createElement('div', { className: 'flex items-center gap-3' }, /* @__PURE__ */ React.createElement('span', { className: 'text-xs text-gray-500' }, l.loggedDate), /* @__PURE__ */ React.createElement('button', { onClick: () => remove(l._id), 'aria-label': 'Delete log' }, /* @__PURE__ */ React.createElement(Trash2, { className: 'h-4 w-4 text-red-500' }))))))));
}
var SymptomTracker_default = SymptomTracker;
export {
  SymptomTracker_default as default,
};
