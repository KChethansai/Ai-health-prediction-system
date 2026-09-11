import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Bell, Loader2, Trash2 } from 'lucide-react';
import axios from '@/api/axios';
import { buttonClass, cardClass, errorClass, formGroup, inputClass, labelClass, sectionTitleClass } from '@/styles/common';
import * as React from 'react';
function MedicineReminders() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { reminderTime: '08:00' },
  });
  const load = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/reminders');
      setReminders(data);
    } catch {
      toast.error('Failed to load reminders');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const add = async (v) => {
    try {
      const { data } = await axios.post('/reminders', {
        medicineName: v.medicineName,
        dosage: v.dosage || null,
        reminderTime: v.reminderTime,
      });
      setReminders((r) => [...r, data]);
      reset({ medicineName: '', dosage: '', reminderTime: '08:00' });
      toast.success('Reminder added');
    } catch {
      toast.error('Failed to add reminder');
    }
  };
  const toggle = async (r) => {
    try {
      const { data } = await axios.patch(`/reminders/${r._id}`, { isActive: !r.isActive });
      setReminders((list) => list.map((x) => x._id === r._id ? data : x));
    } catch {
      toast.error('Failed to update reminder');
    }
  };
  const remove = async (id) => {
    try {
      await axios.del(`/reminders/${id}`);
      setReminders((r) => r.filter((x) => x._id !== id));
      toast.success('Reminder removed');
    } catch {
      toast.error('Failed to remove reminder');
    }
  };
  return /* @__PURE__ */ React.createElement('div', { className: 'space-y-6' }, /* @__PURE__ */ React.createElement('div', { className: cardClass }, /* @__PURE__ */ React.createElement('h3', { className: `${sectionTitleClass} mb-4` }, 'Add Reminder'), /* @__PURE__ */ React.createElement('form', { onSubmit: handleSubmit(add), className: 'grid grid-cols-1 gap-4 sm:grid-cols-3' }, /* @__PURE__ */ React.createElement('div', { className: formGroup }, /* @__PURE__ */ React.createElement('label', { className: labelClass }, 'Medicine'), /* @__PURE__ */ React.createElement('input', { className: inputClass, placeholder: 'e.g. Metformin', ...register('medicineName', { required: 'Required' }) }), errors.medicineName && /* @__PURE__ */ React.createElement('p', { className: errorClass }, errors.medicineName.message)), /* @__PURE__ */ React.createElement('div', { className: formGroup }, /* @__PURE__ */ React.createElement('label', { className: labelClass }, 'Dosage'), /* @__PURE__ */ React.createElement('input', { className: inputClass, placeholder: 'e.g. 500mg', ...register('dosage') })), /* @__PURE__ */ React.createElement('div', { className: formGroup }, /* @__PURE__ */ React.createElement('label', { className: labelClass }, 'Time'), /* @__PURE__ */ React.createElement('input', { type: 'time', className: inputClass, ...register('reminderTime', { required: true }) })), /* @__PURE__ */ React.createElement('button', { type: 'submit', className: `${buttonClass} flex items-center justify-center gap-2 sm:col-span-3`, disabled: isSubmitting }, isSubmitting ? /* @__PURE__ */ React.createElement(Loader2, { className: 'h-4 w-4 animate-spin' }) : /* @__PURE__ */ React.createElement(Bell, { className: 'h-4 w-4' }), 'Add Reminder'))), /* @__PURE__ */ React.createElement('div', { className: cardClass }, /* @__PURE__ */ React.createElement('h3', { className: `${sectionTitleClass} mb-4` }, 'Active Reminders'), loading ? /* @__PURE__ */ React.createElement('div', { className: 'flex justify-center py-8' }, /* @__PURE__ */ React.createElement(Loader2, { className: 'h-6 w-6 animate-spin text-[#0066cc]' })) : reminders.length === 0 ? /* @__PURE__ */ React.createElement('p', { className: 'py-6 text-center text-sm text-gray-500' }, 'No reminders set.') : /* @__PURE__ */ React.createElement('div', { className: 'space-y-2' }, reminders.map((r) => /* @__PURE__ */ React.createElement('div', { key: r._id, className: 'flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3' }, /* @__PURE__ */ React.createElement('div', null, /* @__PURE__ */ React.createElement('span', { className: 'text-sm font-medium' }, r.medicineName), r.dosage && /* @__PURE__ */ React.createElement('span', { className: 'ml-2 text-xs text-gray-500' }, r.dosage), /* @__PURE__ */ React.createElement('p', { className: 'text-xs text-gray-500' }, r.reminderTime)), /* @__PURE__ */ React.createElement('div', { className: 'flex items-center gap-3' }, /* @__PURE__ */ React.createElement(
    'button',
    {
      onClick: () => toggle(r),
      className: `rounded-full px-3 py-1 text-xs font-medium ${r.isActive ? 'bg-[#0066cc]/10 text-[#0066cc]' : 'bg-gray-200 text-gray-500'}`,
    },
    r.isActive ? 'On' : 'Off',
  ), /* @__PURE__ */ React.createElement('button', { onClick: () => remove(r._id), 'aria-label': 'Delete reminder' }, /* @__PURE__ */ React.createElement(Trash2, { className: 'h-4 w-4 text-red-500' }))))))));
}
var MedicineReminders_default = MedicineReminders;
export {
  MedicineReminders_default as default,
};
