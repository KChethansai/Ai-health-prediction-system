import { cn } from "@/lib/utils";
import * as React from "react";
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ React.createElement("div", { className: cn("animate-pulse rounded-md bg-muted", className), ...props });
}
export {
  Skeleton
};
