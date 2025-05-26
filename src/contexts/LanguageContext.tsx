
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
    'products.inStock': 'in stock',
    'products.noProducts': 'No products found matching your search.',
    
    // Product Categories
    'products.categories.all': 'All Categories',
    'products.categories.rings': 'Rings',
    'products.categories.necklaces': 'Necklaces',
    'products.categories.earrings': 'Earrings',
    'products.categories.bracelets': 'Bracelets',
    'products.categories.pendants': 'Pendants',
    
    // Product Items
    'products.items.diamondRing': 'Diamond Solitaire Ring',
    'products.items.pearlNecklace': 'Pearl Necklace Set',
    'products.items.emeraldEarrings': 'Emerald Earrings',
    'products.items.silverBracelet': 'Silver Bracelet',
    'products.items.rubyPendant': 'Ruby Pendant',
    'products.items.weddingBand': 'Wedding Band Set',
    'products.items.goldChain': 'Gold Chain',
    'products.items.sapphireEarrings': 'Sapphire Earrings',
    
    // Metals
    'products.metals.18kGold': '18K Gold',
    'products.metals.22kGold': '22K Gold',
    'products.metals.silver': 'Silver',
    'products.metals.sterlingSilver': 'Sterling Silver',
    'products.metals.platinum': 'Platinum',
    
    // Gemstones
    'products.gemstones.diamond': 'Diamond',
    'products.gemstones.pearl': 'Pearl',
    'products.gemstones.emerald': 'Emerald',
    'products.gemstones.ruby': 'Ruby',
    'products.gemstones.sapphire': 'Sapphire',
    
    // Product Fields
    'products.fields.category': 'Category',
    'products.fields.metal': 'Metal',
    'products.fields.gemstone': 'Gemstone',
    'products.fields.weight': 'Weight',
    
    // Stock Status
    'products.stockStatus.low': 'Low Stock',
    'products.stockStatus.medium': 'Medium',
    'products.stockStatus.inStock': 'In Stock',
    
    // Actions
    'products.actions.edit': 'Edit',
    'products.actions.addToSale': 'Add to Sale',
    
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
    'products.inStock': 'स्टॉक में',
    'products.noProducts': 'आपकी खोज से मेल खाने वाले कोई उत्पाद नहीं मिले।',
    
    // Product Categories
    'products.categories.all': 'सभी श्रेणियां',
    'products.categories.rings': 'अंगूठियां',
    'products.categories.necklaces': 'हार',
    'products.categories.earrings': 'कान के कुंडल',
    'products.categories.bracelets': 'कंगन',
    'products.categories.pendants': 'लॉकेट',
    
    // Product Items
    'products.items.diamondRing': 'हीरे की सॉलिटेयर अंगूठी',
    'products.items.pearlNecklace': 'मोती का हार सेट',
    'products.items.emeraldEarrings': 'पन्ना कुंडल',
    'products.items.silverBracelet': 'चांदी का कंगन',
    'products.items.rubyPendant': 'माणिक लॉकेट',
    'products.items.weddingBand': 'शादी की अंगूठी सेट',
    'products.items.goldChain': 'सोने की चेन',
    'products.items.sapphireEarrings': 'नीलम कुंडल',
    
    // Metals
    'products.metals.18kGold': '18 कैरेट सोना',
    'products.metals.22kGold': '22 कैरेट सोना',
    'products.metals.silver': 'चांदी',
    'products.metals.sterlingSilver': 'स्टर्लिंग सिल्वर',
    'products.metals.platinum': 'प्लेटिनम',
    
    // Gemstones
    'products.gemstones.diamond': 'हीरा',
    'products.gemstones.pearl': 'मोती',
    'products.gemstones.emerald': 'पन्ना',
    'products.gemstones.ruby': 'माणिक',
    'products.gemstones.sapphire': 'नीलम',
    
    // Product Fields
    'products.fields.category': 'श्रेणी',
    'products.fields.metal': 'धातु',
    'products.fields.gemstone': 'रत्न',
    'products.fields.weight': 'वजन',
    
    // Stock Status
    'products.stockStatus.low': 'कम स्टॉक',
    'products.stockStatus.medium': 'मध्यम',
    'products.stockStatus.inStock': 'स्टॉक में',
    
    // Actions
    'products.actions.edit': 'संपादित करें',
    'products.actions.addToSale': 'बिक्री में जोड़ें',
    
    // Common
    'common.none': 'कोई नहीं'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('english');

  const t = (key: string): string => {
    const translation = translations[language][key as keyof typeof translations.english];
    return translation || key;
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
