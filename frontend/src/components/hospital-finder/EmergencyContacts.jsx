import { Phone, Siren, Shield, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as React from 'react';
const contacts = [
  { label: 'Ambulance', number: '108', icon: Siren, color: 'text-destructive' },
  { label: 'Police', number: '100', icon: Shield, color: 'text-primary' },
  { label: 'Fire', number: '101', icon: Flame, color: 'text-orange-500' },
];
function EmergencyContacts() {
  return /* @__PURE__ */ React.createElement('div', { className: 'bg-destructive/5 border border-destructive/20 rounded-xl p-4 mb-6' }, /* @__PURE__ */ React.createElement('div', { className: 'flex items-center gap-2 mb-3' }, /* @__PURE__ */ React.createElement(Phone, { className: 'w-5 h-5 text-destructive' }), /* @__PURE__ */ React.createElement('h2', { className: 'font-display font-bold text-sm text-destructive' }, 'Emergency Services')), /* @__PURE__ */ React.createElement('div', { className: 'flex flex-wrap gap-2' }, contacts.map((c) => /* @__PURE__ */ React.createElement('a', { key: c.number, href: `tel:${c.number}` }, /* @__PURE__ */ React.createElement(Button, { variant: 'outline', size: 'sm', className: 'gap-2 border-destructive/30 hover:bg-destructive/10' }, /* @__PURE__ */ React.createElement(c.icon, { className: `w-4 h-4 ${c.color}` }), 'Call ', c.label, ' (', c.number, ')')))));
}
export {
  EmergencyContacts as default,
};
