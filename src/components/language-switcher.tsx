"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";
import { GB, PT } from "country-flag-icons/react/3x2";


export function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {language === 'en' ? <GB className="h-6 w-6" /> : <PT className="h-6 w-6" />}
          <span className="sr-only">{t('toggle_language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage("en")} className="flex items-center gap-2">
            <GB className="h-4 w-4" />
            <span>English</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("pt")} className="flex items-center gap-2">
            <PT className="h-4 w-4" />
            <span>Português</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
