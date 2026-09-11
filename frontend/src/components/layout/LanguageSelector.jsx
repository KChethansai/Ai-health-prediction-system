import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import * as React from 'react';
const languages = [
  { code: 'en', label: 'English', flag: '\u{1F1FA}\u{1F1F8}' },
  { code: 'hi', label: '\u0939\u093F\u0928\u094D\u0926\u0940', flag: '\u{1F1EE}\u{1F1F3}' },
  { code: 'es', label: 'Espa\xF1ol', flag: '\u{1F1EA}\u{1F1F8}' },
  { code: 'fr', label: 'Fran\xE7ais', flag: '\u{1F1EB}\u{1F1F7}' },
];
function LanguageSelector() {
  const { i18n } = useTranslation();
  const current = languages.find((l) => l.code === i18n.language) || languages[0];
  return /* @__PURE__ */ React.createElement(DropdownMenu, null, /* @__PURE__ */ React.createElement(DropdownMenuTrigger, { asChild: true }, /* @__PURE__ */ React.createElement(Button, { variant: 'ghost', size: 'icon', className: 'h-9 w-9', title: 'Language' }, /* @__PURE__ */ React.createElement(Globe, { className: 'w-4 h-4' }))), /* @__PURE__ */ React.createElement(DropdownMenuContent, { align: 'end', className: 'min-w-[140px]' }, languages.map((lang) => /* @__PURE__ */ React.createElement(
    DropdownMenuItem,
    {
      key: lang.code,
      onClick: () => i18n.changeLanguage(lang.code),
      className: `gap-2 text-sm ${lang.code === current.code ? 'font-semibold text-primary' : ''}`,
    },
    /* @__PURE__ */ React.createElement('span', null, lang.flag),
    lang.label,
  ))));
}
export {
  LanguageSelector as default,
};
