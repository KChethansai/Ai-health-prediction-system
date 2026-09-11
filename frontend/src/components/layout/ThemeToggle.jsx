import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as React from 'react';
function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || !localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);
  return /* @__PURE__ */ React.createElement(
    Button,
    {
      variant: 'ghost',
      size: 'icon',
      onClick: () => setDark(!dark),
      className: 'h-9 w-9 rounded-lg',
      'aria-label': 'Toggle theme',
    },
    dark ? /* @__PURE__ */ React.createElement(Sun, { className: 'w-4 h-4' }) : /* @__PURE__ */ React.createElement(Moon, { className: 'w-4 h-4' }),
  );
}
export {
  ThemeToggle as default,
};
