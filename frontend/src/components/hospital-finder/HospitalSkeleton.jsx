import { Skeleton } from '@/components/ui/skeleton';
import * as React from 'react';
function HospitalSkeleton() {
  return /* @__PURE__ */ React.createElement('div', { className: 'bg-card rounded-xl p-4 border border-border space-y-3' }, /* @__PURE__ */ React.createElement(Skeleton, { className: 'h-5 w-3/4' }), /* @__PURE__ */ React.createElement(Skeleton, { className: 'h-4 w-full' }), /* @__PURE__ */ React.createElement('div', { className: 'flex gap-2' }, /* @__PURE__ */ React.createElement(Skeleton, { className: 'h-4 w-16' }), /* @__PURE__ */ React.createElement(Skeleton, { className: 'h-4 w-20' })), /* @__PURE__ */ React.createElement('div', { className: 'flex gap-2' }, /* @__PURE__ */ React.createElement(Skeleton, { className: 'h-8 w-full' }), /* @__PURE__ */ React.createElement(Skeleton, { className: 'h-8 w-full' })));
}
export {
  HospitalSkeleton as default,
};
