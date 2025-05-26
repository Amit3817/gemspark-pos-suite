
import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'english' | 'hindi';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations = {
  english: {
    // Header
    'header.title': 'GemSpark POS',
    'header.subtitle': 'Jewelry Store Management',
    'header.welcome': 'Welcome, Admin',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.products': 'Products',
    'nav.billing': 'Billing',
    'nav.inventory': 'Inventory',
    'nav.customers': 'Customers',
    'nav.reports': 'Reports',
    'nav.settings': 'Settings',
    
    // Product Catalog
    'products.title': 'Product Catalog',
    'products.addNew': 'Add New Product',
    'products.search': 'Search products, categories, metals...',
    'products.filterCategory': 'Filter by Category',
    'products.filterMetal': 'Filter by Metal',
    'products.category': 'Category',
    'products.metal': 'Metal',
    'products.gemstone': 'Gemstone',
    'products.weight': 'Weight',
    'products.inStock': 'in stock',
    'products.edit': 'Edit',
    'products.addToSale': 'Add to Sale',
    'products.noProducts': 'No products found matching your search.',
    'products.lowStock': 'Low Stock',
    'products.medium': 'Medium',
    'products.inStockBadge': 'In Stock',
    
    // Common
    'common.none': 'None'
  },
  hindi: {
    // Header
    'header.title': 'जेमस्पार्क पीओएस',
    'header.subtitle': 'आभूषण स्टोर प्रबंधन',
    'header.welcome': 'स्वागत है, एडमिन',
    
    // Navigation
    'nav.dashboard': 'डैशबोर्ड',
    'nav.products': 'उत्पाद',
    'nav.billing': 'बिलिंग',
    'nav.inventory': 'इन्वेंटरी',
    'nav.customers': 'ग्राहक',
    'nav.reports': 'रिपोर्ट',
    'nav.settings': 'सेटिंग्स',
    
    // Product Catalog
    'products.title': 'उत्पाद कैटलॉग',
    'products.addNew': 'नया उत्पाद जोड़ें',
    'products.search': 'उत्पाद, श्रेणी, धातु खोजें...',
    'products.filterCategory': 'श्रेणी के अनुसार फ़िल्टर करें',
    'products.filterMetal': 'धातु के अनुसार फ़िल्टर करें',
    'products.category': 'श्रेणी',
    'products.metal': 'धातु',
    'products.gemstone': 'रत्न',
    'products.weight': 'वजन',
    'products.inStock': 'स्टॉक में',
    'products.edit': 'संपादित करें',
    'products.addToSale': 'बिक्री में जोड़ें',
    'products.noProducts': 'आपकी खोज से मेल खाने वाले कोई उत्पाद नहीं मिले।',
    'products.lowStock': 'कम स्टॉक',
    'products.medium': 'मध्यम',
    'products.inStockBadge': 'स्टॉक में',
    
    // Common
    'common.none': 'कोई नहीं'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('english');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.english] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
