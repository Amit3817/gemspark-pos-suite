
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLanguage(language === 'english' ? 'hindi' : 'english')}
      className="text-xs"
    >
      {language === 'english' ? 'हिं' : 'EN'}
    </Button>
  );
}
