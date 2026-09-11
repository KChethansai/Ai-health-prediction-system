import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/store/useAuth";
import * as React from "react";
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen flex items-center justify-center bg-white" }, /* @__PURE__ */ React.createElement(Loader2, { className: "w-8 h-8 animate-spin text-[#0066cc]" }));
  }
  if (!user) return /* @__PURE__ */ React.createElement(Navigate, { to: "/auth", replace: true });
  return /* @__PURE__ */ React.createElement(React.Fragment, null, children);
}
var ProtectedRoute_default = ProtectedRoute;
export {
  ProtectedRoute_default as default
};
