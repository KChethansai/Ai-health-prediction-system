import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Globe, Navigation, AlertTriangle, Building2, Clock, Stethoscope, Pill, Siren, HeartPulse } from 'lucide-react';
import * as React from 'react';
function inferServices(h) {
  const services = [];
  if (h.emergency) services.push({ icon: Siren, label: 'Emergency / ER' });
  const is24 = (h.openingHours || '').toLowerCase().includes('24');
  if (is24) services.push({ icon: HeartPulse, label: 'ICU / Critical Care (likely)' });
  if (h.type === 'Hospital') services.push({ icon: Pill, label: 'Pharmacy (likely)' });
  if (h.emergency || is24) services.push({ icon: Siren, label: 'Ambulance Services' });
  services.push({ icon: Stethoscope, label: 'General Consultation' });
  const seen = /* @__PURE__ */ new Set();
  return services.filter((s) => {
    if (seen.has(s.label)) return false;
    seen.add(s.label);
    return true;
  });
}
function HospitalDetailModal({ hospital, open, onClose, onDirections }) {
  if (!hospital) return null;
  const h = hospital;
  const services = inferServices(h);
  return /* @__PURE__ */ React.createElement(Dialog, { open, onOpenChange: onClose }, /* @__PURE__ */ React.createElement(DialogContent, { className: 'max-w-md max-h-[85vh] overflow-y-auto' }, /* @__PURE__ */ React.createElement(DialogHeader, null, /* @__PURE__ */ React.createElement(DialogTitle, { className: 'font-display flex items-center gap-2' }, /* @__PURE__ */ React.createElement(Building2, { className: 'w-5 h-5 text-primary' }), h.name)), /* @__PURE__ */ React.createElement('div', { className: 'space-y-4' }, /* @__PURE__ */ React.createElement('div', { className: 'flex flex-wrap gap-2' }, /* @__PURE__ */ React.createElement(Badge, { variant: 'secondary' }, h.type), h.emergency && /* @__PURE__ */ React.createElement(Badge, { variant: 'destructive', className: 'gap-1' }, /* @__PURE__ */ React.createElement(AlertTriangle, { className: 'w-3 h-3' }), ' Emergency'), h.openingHours && /* @__PURE__ */ React.createElement(Badge, { variant: 'outline', className: 'gap-1' }, /* @__PURE__ */ React.createElement(Clock, { className: 'w-3 h-3' }), ' ', h.openingHours)), h.emergency && /* @__PURE__ */ React.createElement('p', { className: 'text-sm text-destructive font-medium flex items-center gap-1.5' }, '\u{1F691} Emergency Services Available'), /* @__PURE__ */ React.createElement('div', { className: 'space-y-3 text-sm' }, /* @__PURE__ */ React.createElement('div', { className: 'flex items-start gap-2' }, /* @__PURE__ */ React.createElement(MapPin, { className: 'w-4 h-4 text-primary mt-0.5 shrink-0' }), /* @__PURE__ */ React.createElement('div', null, /* @__PURE__ */ React.createElement('p', { className: 'text-muted-foreground text-xs' }, 'Address'), /* @__PURE__ */ React.createElement('p', null, h.address))), /* @__PURE__ */ React.createElement('div', { className: 'flex items-start gap-2' }, /* @__PURE__ */ React.createElement(Navigation, { className: 'w-4 h-4 text-primary mt-0.5 shrink-0' }), /* @__PURE__ */ React.createElement('div', null, /* @__PURE__ */ React.createElement('p', { className: 'text-muted-foreground text-xs' }, 'Distance'), /* @__PURE__ */ React.createElement('p', null, h.distance, ' km away'))), h.phone && /* @__PURE__ */ React.createElement('div', { className: 'flex items-start gap-2' }, /* @__PURE__ */ React.createElement(Phone, { className: 'w-4 h-4 text-primary mt-0.5 shrink-0' }), /* @__PURE__ */ React.createElement('div', null, /* @__PURE__ */ React.createElement('p', { className: 'text-muted-foreground text-xs' }, 'Phone'), /* @__PURE__ */ React.createElement('a', { href: `tel:${h.phone}`, className: 'text-primary hover:underline' }, h.phone))), h.website && /* @__PURE__ */ React.createElement('div', { className: 'flex items-start gap-2' }, /* @__PURE__ */ React.createElement(Globe, { className: 'w-4 h-4 text-primary mt-0.5 shrink-0' }), /* @__PURE__ */ React.createElement('div', null, /* @__PURE__ */ React.createElement('p', { className: 'text-muted-foreground text-xs' }, 'Website'), /* @__PURE__ */ React.createElement('a', { href: h.website, target: '_blank', rel: 'noopener noreferrer', className: 'text-primary hover:underline break-all' }, h.website.replace(/^https?:\/\//, '').replace(/\/$/, '')))), h.operator && /* @__PURE__ */ React.createElement('div', { className: 'flex items-start gap-2' }, /* @__PURE__ */ React.createElement(Building2, { className: 'w-4 h-4 text-muted-foreground mt-0.5 shrink-0' }), /* @__PURE__ */ React.createElement('div', null, /* @__PURE__ */ React.createElement('p', { className: 'text-muted-foreground text-xs' }, 'Operator'), /* @__PURE__ */ React.createElement('p', null, h.operator)))), /* @__PURE__ */ React.createElement('div', null, /* @__PURE__ */ React.createElement('h4', { className: 'font-display font-semibold text-sm mb-2' }, 'Available Services'), /* @__PURE__ */ React.createElement('div', { className: 'grid grid-cols-1 gap-1.5' }, services.map((s) => /* @__PURE__ */ React.createElement('div', { key: s.label, className: 'flex items-center gap-2 text-xs text-muted-foreground' }, /* @__PURE__ */ React.createElement(s.icon, { className: 'w-3.5 h-3.5 text-primary' }), /* @__PURE__ */ React.createElement('span', null, s.label))))), /* @__PURE__ */ React.createElement('div', { className: 'flex gap-2 pt-2' }, h.phone && /* @__PURE__ */ React.createElement('a', { href: `tel:${h.phone}`, className: 'flex-1' }, /* @__PURE__ */ React.createElement(Button, { variant: 'outline', className: 'w-full gap-2' }, /* @__PURE__ */ React.createElement(Phone, { className: 'w-4 h-4' }), ' Call')), /* @__PURE__ */ React.createElement(Button, { className: 'flex-1 gap-2', onClick: () => onDirections(h) }, /* @__PURE__ */ React.createElement(Navigation, { className: 'w-4 h-4' }), ' Directions')), /* @__PURE__ */ React.createElement(
    'a',
    {
      href: `https://www.openstreetmap.org/?mlat=${h.lat}&mlon=${h.lng}#map=18/${h.lat}/${h.lng}`,
      target: '_blank',
      rel: 'noopener noreferrer',
      className: 'block',
    },
    /* @__PURE__ */ React.createElement(Button, { variant: 'outline', className: 'w-full gap-2' }, /* @__PURE__ */ React.createElement(MapPin, { className: 'w-4 h-4' }), ' Open in OpenStreetMap'),
  ), h.website && /* @__PURE__ */ React.createElement('a', { href: h.website, target: '_blank', rel: 'noopener noreferrer', className: 'block' }, /* @__PURE__ */ React.createElement(Button, { variant: 'secondary', className: 'w-full gap-2' }, /* @__PURE__ */ React.createElement(Globe, { className: 'w-4 h-4' }), ' Visit Website')))));
}
export {
  HospitalDetailModal as default,
};
