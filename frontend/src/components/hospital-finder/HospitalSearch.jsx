import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import * as React from 'react';
function HospitalSearch({ value, onChange }) {
  return /* @__PURE__ */ React.createElement('div', { className: 'relative w-full max-w-sm' }, /* @__PURE__ */ React.createElement(Search, { className: 'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' }), /* @__PURE__ */ React.createElement(
    Input,
    {
      value,
      onChange: (e) => onChange(e.target.value),
      placeholder: 'Search hospitals, clinics, specialties...',
      className: 'pl-9 pr-8 h-9 text-sm rounded-lg',
    },
  ), value && /* @__PURE__ */ React.createElement(
    Button,
    {
      variant: 'ghost',
      size: 'icon',
      className: 'absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6',
      onClick: () => onChange(''),
    },
    /* @__PURE__ */ React.createElement(X, { className: 'w-3 h-3' }),
  ));
}
export {
  HospitalSearch as default,
};
