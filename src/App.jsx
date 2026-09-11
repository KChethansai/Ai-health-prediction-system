import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as HotToaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "@/store/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Loader2 } from "lucide-react";
import * as React from "react";
const LandingPage = lazy(() => import("./pages/LandingPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const DiseasePredictorPage = lazy(() => import("./pages/DiseasePredictorPage"));
const MetricsPage = lazy(() => import("./pages/MetricsPage"));
const PrescriptionScannerPage = lazy(() => import("./pages/PrescriptionScannerPage"));
const MedicineDatabasePage = lazy(() => import("./pages/MedicineDatabasePage"));
const HospitalFinderPage = lazy(() => import("./pages/HospitalFinderPage"));
const HealthLibraryPage = lazy(() => import("./pages/HealthLibraryPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const queryClient = new QueryClient();
function PageLoader() {
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen flex items-center justify-center bg-background" }, /* @__PURE__ */ React.createElement(Loader2, { className: "w-8 h-8 animate-spin text-primary" }));
}
function SessionBootstrap({ children }) {
  const me = useAuth((s) => s.me);
  useEffect(() => {
    me();
  }, [me]);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, children);
}
const App = () => /* @__PURE__ */ React.createElement(QueryClientProvider, { client: queryClient }, /* @__PURE__ */ React.createElement(TooltipProvider, null, /* @__PURE__ */ React.createElement(Toaster, null), /* @__PURE__ */ React.createElement(HotToaster, { position: "top-center" }), /* @__PURE__ */ React.createElement(BrowserRouter, null, /* @__PURE__ */ React.createElement(SessionBootstrap, null, /* @__PURE__ */ React.createElement(Suspense, { fallback: /* @__PURE__ */ React.createElement(PageLoader, null) }, /* @__PURE__ */ React.createElement(Routes, null, /* @__PURE__ */ React.createElement(Route, { path: "/", element: /* @__PURE__ */ React.createElement(LandingPage, null) }), /* @__PURE__ */ React.createElement(Route, { path: "/auth", element: /* @__PURE__ */ React.createElement(AuthPage, null) }), /* @__PURE__ */ React.createElement(Route, { path: "/dashboard", element: /* @__PURE__ */ React.createElement(ProtectedRoute, null, /* @__PURE__ */ React.createElement(DashboardPage, null)) }), /* @__PURE__ */ React.createElement(Route, { path: "/predict", element: /* @__PURE__ */ React.createElement(ProtectedRoute, null, /* @__PURE__ */ React.createElement(DiseasePredictorPage, null)) }), /* @__PURE__ */ React.createElement(Route, { path: "/metrics", element: /* @__PURE__ */ React.createElement(ProtectedRoute, null, /* @__PURE__ */ React.createElement(MetricsPage, null)) }), /* @__PURE__ */ React.createElement(Route, { path: "/scanner", element: /* @__PURE__ */ React.createElement(ProtectedRoute, null, /* @__PURE__ */ React.createElement(PrescriptionScannerPage, null)) }), /* @__PURE__ */ React.createElement(Route, { path: "/medicines", element: /* @__PURE__ */ React.createElement(MedicineDatabasePage, null) }), /* @__PURE__ */ React.createElement(Route, { path: "/hospitals", element: /* @__PURE__ */ React.createElement(HospitalFinderPage, null) }), /* @__PURE__ */ React.createElement(Route, { path: "/health-library", element: /* @__PURE__ */ React.createElement(HealthLibraryPage, null) }), /* @__PURE__ */ React.createElement(Route, { path: "*", element: /* @__PURE__ */ React.createElement(NotFound, null) })))))));
var App_default = App;
export {
  App_default as default
};
