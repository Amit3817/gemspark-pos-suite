import axios from 'axios';

const GOLDAPI_BASE_URL = 'https://www.goldapi.io/api';
const GOLDAPI_KEY = process.env.NEXT_PUBLIC_GOLDAPI_KEY;

export interface MetalRates {
  goldRatePerGram: number;
  silverRatePerGram: number;
  lastUpdated: Date;
  currency: string;
}

let cachedRates: MetalRates | null = null;
let lastFetchTime: Date | null = null;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

export async function fetchMetalRates(): Promise<MetalRates> {
  // Return cached rates if they're still valid
  if (cachedRates && lastFetchTime && (new Date().getTime() - lastFetchTime.getTime() < CACHE_DURATION)) {
    return cachedRates;
  }

  if (!GOLDAPI_KEY) {
    throw new Error('GoldAPI key is not configured. Please add NEXT_PUBLIC_GOLDAPI_KEY to your environment variables.');
  }

  try {
    // Fetch both gold and silver rates
    const [goldResponse, silverResponse] = await Promise.all([
      axios.get(`${GOLDAPI_BASE_URL}/XAU/INR`, {
        headers: {
          'x-access-token': GOLDAPI_KEY,
          'Content-Type': 'application/json'
        }
      }),
      axios.get(`${GOLDAPI_BASE_URL}/XAG/INR`, {
        headers: {
          'x-access-token': GOLDAPI_KEY,
          'Content-Type': 'application/json'
        }
      })
    ]);

    // Convert rates to per gram (GoldAPI provides rates per troy ounce)
    const TROY_OUNCE_TO_GRAM = 31.1034768;
    const goldRatePerGram = goldResponse.data.price / TROY_OUNCE_TO_GRAM;
    const silverRatePerGram = silverResponse.data.price / TROY_OUNCE_TO_GRAM;

    // Create rates object
    const rates: MetalRates = {
      goldRatePerGram: Math.round(goldRatePerGram * 100) / 100, // Round to 2 decimal places
      silverRatePerGram: Math.round(silverRatePerGram * 100) / 100,
      lastUpdated: new Date(),
      currency: 'INR'
    };

    // Update cache
    cachedRates = rates;
    lastFetchTime = new Date();

    return rates;
  } catch (error) {
    console.error('Error fetching metal rates:', error);
    if (cachedRates) {
      // Return cached rates even if expired in case of API failure
      return cachedRates;
    }
    throw new Error('Failed to fetch metal rates. Please try again later.');
  }
}

// Helper function to format rates for display
export function formatMetalRate(rate: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(rate);
} 