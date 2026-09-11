import { motion } from 'framer-motion';
import { MapPin, Phone, Navigation, Globe, AlertTriangle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as React from 'react';
function OpenStatusBadge({ openingHours }) {
  if (!openingHours) return null;
  const is24 = openingHours.toLowerCase().includes('24') || openingHours === '24/7';
  return /* @__PURE__ */ React.createElement('span', { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${is24 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}` }, /* @__PURE__ */ React.createElement('span', { className: `w-1.5 h-1.5 rounded-full ${is24 ? 'bg-green-400' : 'bg-muted-foreground'}` }), is24 ? 'Open 24h' : openingHours);
}
function HospitalCard({
  hospital: h,
  index,
  isSelected,
  isEmergencyMode,
  onSelect,
  onDirections,
  onGoogleMaps,
  onViewDetails,
}) {
  const highlight = isEmergencyMode && h.emergency && index === 0;
  return /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      transition: { delay: index * 0.03 },
      className: `bg-card rounded-xl p-4 border cursor-pointer transition-all hover:shadow-md ${highlight ? 'border-destructive ring-2 ring-destructive/30 shadow-md' : isSelected ? 'border-primary ring-1 ring-primary/20' : 'border-border'}`,
      onClick: () => onSelect(h),
      role: 'article',
      'aria-label': `${h.name} - ${h.distance} km away`,
    },
    highlight && /* @__PURE__ */ React.createElement('div', { className: 'text-[11px] font-semibold text-destructive mb-2 flex items-center gap-1' }, '\u2B50 Nearest Emergency Hospital'),
    /* @__PURE__ */ React.createElement('div', { className: 'flex items-start justify-between mb-2' }, /* @__PURE__ */ React.createElement('h3', { className: 'font-display font-semibold text-sm leading-tight pr-2' }, h.name), /* @__PURE__ */ React.createElement('div', { className: 'flex gap-1 shrink-0 flex-wrap justify-end' }, h.emergency && /* @__PURE__ */ React.createElement('span', { className: 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-destructive text-destructive-foreground' }, /* @__PURE__ */ React.createElement(AlertTriangle, { className: 'w-3 h-3' }), ' ER'), /* @__PURE__ */ React.createElement('span', { className: 'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-secondary text-secondary-foreground' }, h.type), /* @__PURE__ */ React.createElement(OpenStatusBadge, { openingHours: h.openingHours }))),
    h.emergency && /* @__PURE__ */ React.createElement('p', { className: 'text-[11px] text-destructive font-medium mb-2 flex items-center gap-1' }, '\u{1F691} Emergency Services Available'),
    /* @__PURE__ */ React.createElement('p', { className: 'text-xs text-muted-foreground mb-2 line-clamp-2' }, h.address),
    /* @__PURE__ */ React.createElement('div', { className: 'flex items-center gap-3 text-xs text-muted-foreground mb-3' }, /* @__PURE__ */ React.createElement('span', { className: 'flex items-center gap-1 font-medium' }, /* @__PURE__ */ React.createElement(MapPin, { className: 'w-3 h-3' }), h.distance, ' km')),
    /* @__PURE__ */ React.createElement('div', { className: 'space-y-1 mb-3' }, h.phone ? /* @__PURE__ */ React.createElement('div', { className: 'flex items-center gap-1.5 text-xs' }, /* @__PURE__ */ React.createElement(Phone, { className: 'w-3 h-3 text-primary' }), /* @__PURE__ */ React.createElement('span', null, h.phone)) : /* @__PURE__ */ React.createElement('div', { className: 'flex items-center gap-1.5 text-xs text-muted-foreground' }, /* @__PURE__ */ React.createElement(Phone, { className: 'w-3 h-3' }), /* @__PURE__ */ React.createElement('span', null, 'Contact not available')), h.website && /* @__PURE__ */ React.createElement('div', { className: 'flex items-center gap-1.5 text-xs' }, /* @__PURE__ */ React.createElement(Globe, { className: 'w-3 h-3 text-primary' }), /* @__PURE__ */ React.createElement('a', { href: h.website, target: '_blank', rel: 'noopener noreferrer', className: 'text-primary hover:underline truncate max-w-[180px]', onClick: (e) => e.stopPropagation() }, h.website.replace(/^https?:\/\//, '').replace(/\/$/, ''))), h.operator && /* @__PURE__ */ React.createElement('div', { className: 'text-xs text-muted-foreground' }, 'Operated by: ', h.operator)),
    /* @__PURE__ */ React.createElement('div', { className: 'flex gap-2 flex-wrap' }, h.phone && /* @__PURE__ */ React.createElement('a', { href: `tel:${h.phone}`, onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement(Button, { variant: 'outline', size: 'sm', className: 'gap-1 text-xs', 'aria-label': `Call ${h.name}` }, /* @__PURE__ */ React.createElement(Phone, { className: 'w-3 h-3' }), ' Call')), /* @__PURE__ */ React.createElement(
      Button,
      {
        variant: highlight ? 'destructive' : 'default',
        size: 'sm',
        className: 'gap-1 text-xs flex-1',
        'aria-label': `Get directions to ${h.name}`,
        onClick: (e) => {
          e.stopPropagation();
          onDirections(h);
        },
      },
      /* @__PURE__ */ React.createElement(Navigation, { className: 'w-3 h-3' }),
      ' Directions',
    ), /* @__PURE__ */ React.createElement(Button, { variant: 'outline', size: 'sm', className: 'gap-1 text-xs', 'aria-label': `View on maps ${h.name}`, onClick: (e) => {
      e.stopPropagation();
      onGoogleMaps(h);
    } }, /* @__PURE__ */ React.createElement(MapPin, { className: 'w-3 h-3' }), ' Map'), /* @__PURE__ */ React.createElement(Button, { variant: 'ghost', size: 'sm', className: 'gap-1 text-xs', 'aria-label': `View details for ${h.name}`, onClick: (e) => {
      e.stopPropagation();
      onViewDetails(h);
    } }, /* @__PURE__ */ React.createElement(Eye, { className: 'w-3 h-3' }))),
  );
}
export {
  HospitalCard as default,
};
