import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const LANGUAGES = {
  english: 'हिंदी',
  hindi: 'English'
} as const;

type Language = keyof typeof LANGUAGES;

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const currentLanguage = language;

  const toggleLanguage = () => {
    const newLang: Language = currentLanguage === 'english' ? 'hindi' : 'english';
    setLanguage(newLang);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className={cn(
        "min-w-[4rem] h-8 px-2 font-medium",
        "border border-input bg-background",
        "hover:bg-primary hover:text-primary-foreground",
        "transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      )}
      aria-label={`Switch to ${LANGUAGES[currentLanguage]} language`}
    >
      {LANGUAGES[currentLanguage]}
    </Button>
  );
}
