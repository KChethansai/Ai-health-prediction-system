import { lazy, Suspense, useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as HotToaster } from 'react-hot-toast';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from '@/store/useAuth';
import ProtectedRoute from '@/components/routing/ProtectedRoute';
import { Loader2 } from 'lucide-react';
import * as React from 'react';
const Landing = lazy(() => import('./pages/Landing'));
const Auth = lazy(() => import('./pages/auth/Auth'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Predictor = lazy(() => import('./pages/Predictor'));
const Metrics = lazy(() => import('./pages/Metrics'));
const Scanner = lazy(() => import('./pages/Scanner'));
const Medicines = lazy(() => import('./pages/Medicines'));
const Hospitals = lazy(() => import('./pages/Hospitals'));
const Library = lazy(() => import('./pages/Library'));
const NotFound = lazy(() => import('./pages/NotFound'));
const queryClient = new QueryClient();
function PageLoader() {
  return /* @__PURE__ */ React.createElement('div', { className: 'min-h-screen flex items-center justify-center bg-background' }, /* @__PURE__ */ React.createElement(Loader2, { className: 'w-8 h-8 animate-spin text-primary' }));
}
function SessionBootstrap({ children }) {
  const me = useAuth((s) => s.me);
  useEffect(() => {
    me();
  }, [me]);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, children);
}
const App = () => /* @__PURE__ */ React.createElement(QueryClientProvider, { client: queryClient }, /* @__PURE__ */ React.createElement(TooltipProvider, null, /* @__PURE__ */ React.createElement(Toaster, null), /* @__PURE__ */ React.createElement(HotToaster, { position: 'top-center' }), /* @__PURE__ */ React.createElement(BrowserRouter, null, /* @__PURE__ */ React.createElement(SessionBootstrap, null, /* @__PURE__ */ React.createElement(Suspense, { fallback: /* @__PURE__ */ React.createElement(PageLoader, null) }, /* @__PURE__ */ React.createElement(Routes, null, /* @__PURE__ */ React.createElement(Route, { path: '/', element: /* @__PURE__ */ React.createElement(Landing, null) }), /* @__PURE__ */ React.createElement(Route, { path: '/auth', element: /* @__PURE__ */ React.createElement(Auth, null) }), /* @__PURE__ */ React.createElement(Route, { path: '/dashboard', element: /* @__PURE__ */ React.createElement(ProtectedRoute, null, /* @__PURE__ */ React.createElement(Dashboard, null)) }), /* @__PURE__ */ React.createElement(Route, { path: '/predict', element: /* @__PURE__ */ React.createElement(ProtectedRoute, null, /* @__PURE__ */ React.createElement(Predictor, null)) }), /* @__PURE__ */ React.createElement(Route, { path: '/metrics', element: /* @__PURE__ */ React.createElement(ProtectedRoute, null, /* @__PURE__ */ React.createElement(Metrics, null)) }), /* @__PURE__ */ React.createElement(Route, { path: '/scanner', element: /* @__PURE__ */ React.createElement(ProtectedRoute, null, /* @__PURE__ */ React.createElement(Scanner, null)) }), /* @__PURE__ */ React.createElement(Route, { path: '/medicines', element: /* @__PURE__ */ React.createElement(Medicines, null) }), /* @__PURE__ */ React.createElement(Route, { path: '/hospitals', element: /* @__PURE__ */ React.createElement(Hospitals, null) }), /* @__PURE__ */ React.createElement(Route, { path: '/health-library', element: /* @__PURE__ */ React.createElement(Library, null) }), /* @__PURE__ */ React.createElement(Route, { path: '*', element: /* @__PURE__ */ React.createElement(NotFound, null) })))))));
var App_default = App;
export {
  App_default as default,
};
