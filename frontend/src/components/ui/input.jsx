import * as React from 'react';
import { cn } from '@/lib/utils';
const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ React.createElement(
      'input',
      {
        type,
        className: cn(
          'flex h-11 w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-colors duration-200',
          className,
        ),
        ref,
        ...props,
      },
    );
  },
);
Input.displayName = 'Input';
export {
  Input,
};
