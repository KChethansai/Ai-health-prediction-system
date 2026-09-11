import { motion } from 'framer-motion';
import { AlertTriangle, Navigation, Siren } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as React from 'react';
function EmergencyAlert({ nearestEmergency, onNavigate }) {
  return /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, y: -10 },
      animate: { opacity: 1, y: 0 },
      className: 'bg-destructive/10 border-2 border-destructive/40 rounded-xl p-5 mb-6',
    },
    /* @__PURE__ */ React.createElement('div', { className: 'flex items-start gap-3 mb-3' }, /* @__PURE__ */ React.createElement('div', { className: 'w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center shrink-0' }, /* @__PURE__ */ React.createElement(AlertTriangle, { className: 'w-5 h-5 text-destructive' })), /* @__PURE__ */ React.createElement('div', null, /* @__PURE__ */ React.createElement('h2', { className: 'font-display font-bold text-base text-destructive' }, '\u26A0 Potential Medical Emergency Detected'), /* @__PURE__ */ React.createElement('p', { className: 'text-sm text-muted-foreground mt-1' }, 'Please seek immediate medical attention. Nearby emergency hospitals are shown below.'))),
    /* @__PURE__ */ React.createElement('div', { className: 'flex flex-wrap gap-2' }, /* @__PURE__ */ React.createElement('a', { href: 'tel:108' }, /* @__PURE__ */ React.createElement(Button, { variant: 'destructive', size: 'sm', className: 'gap-2' }, /* @__PURE__ */ React.createElement(Siren, { className: 'w-4 h-4' }), ' Call Ambulance (108)')), nearestEmergency && /* @__PURE__ */ React.createElement(
      Button,
      {
        size: 'sm',
        className: 'gap-2',
        onClick: () => onNavigate(nearestEmergency),
      },
      /* @__PURE__ */ React.createElement(Navigation, { className: 'w-4 h-4' }),
      'Navigate to ',
      nearestEmergency.name,
      ' (',
      nearestEmergency.distance,
      ' km)',
    )),
  );
}
export {
  EmergencyAlert as default,
};
