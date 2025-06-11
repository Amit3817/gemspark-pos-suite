import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from 'react-i18next';
import { fetchMetalRates, formatMetalRate, MetalRates } from '@/services/metalRatesApi';
import { RefreshCw } from 'lucide-react';

export default function MetalRatesDisplay() {
  const [rates, setRates] = useState<MetalRates | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  const loadRates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newRates = await fetchMetalRates();
      setRates(newRates);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('metalRates.error'));
      toast({
        title: t('modal.error'),
        description: t('metalRates.error'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRates();
    // Refresh rates every 30 minutes
    const interval = setInterval(loadRates, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-red-600">{error}</p>
            <Button variant="outline" size="sm" onClick={loadRates}>
              {t('metalRates.retry')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">{t('metalRates.title')}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadRates}
            disabled={isLoading}
            className="hover:bg-gray-100"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? t('metalRates.updating') : t('metalRates.refresh')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg">
            <div className="text-sm text-yellow-800 font-medium mb-1">{t('metalRates.goldRate')}</div>
            <div className="text-2xl font-bold text-yellow-900">
              {rates ? formatMetalRate(rates.goldRatePerGram) : t('modal.loading')}
              <span className="text-sm font-normal ml-1">/{t('metalRates.perGram')}</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg">
            <div className="text-sm text-gray-800 font-medium mb-1">{t('metalRates.silverRate')}</div>
            <div className="text-2xl font-bold text-gray-900">
              {rates ? formatMetalRate(rates.silverRatePerGram) : t('modal.loading')}
              <span className="text-sm font-normal ml-1">/{t('metalRates.perGram')}</span>
            </div>
          </div>
        </div>
        {rates && (
          <p className="text-xs text-muted-foreground mt-3 text-right">
            {t('metalRates.lastUpdated')}: {rates.lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
} 