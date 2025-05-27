
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
    'nav.bills': 'Bills',
    'nav.inventory': 'Inventory',
    'nav.customers': 'Customers',
    'nav.reports': 'Reports',
    'nav.settings': 'Settings',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.overview': 'Store Overview',
    'dashboard.todaySales': "Today's Sales",
    'dashboard.totalProducts': 'Total Products',
    'dashboard.totalCustomers': 'Total Customers',
    'dashboard.lowStock': 'Low Stock Items',
    'dashboard.recentSales': 'Recent Sales',
    'dashboard.topProducts': 'Top Selling Products',
    
    // Customers
    'customers.title': 'Customer Management',
    'customers.addNew': 'Add New Customer',
    'customers.search': 'Search customers by name, phone, or email...',
    'customers.totalCustomers': 'Total Customers',
    'customers.vipCustomers': 'VIP Customers',
    'customers.newThisMonth': 'New This Month',
    'customers.exportList': 'Export Customer List',
    'customers.phone': 'Phone',
    'customers.email': 'Email',
    'customers.totalPurchases': 'Total Purchases',
    'customers.orders': 'Orders',
    'customers.lastVisit': 'Last Visit',
    'customers.viewHistory': 'View History',
    'customers.newSale': 'New Sale',
    'customers.noCustomers': 'No customers found matching your search.',
    'customers.status.vip': 'VIP',
    'customers.status.regular': 'Regular',
    'customers.status.new': 'New',
    
    // Bills
    'bills.title': 'Bills Management',
    'bills.search': 'Search by Bill ID, Phone, Name, or Date...',
    'bills.totalBills': 'Total Bills',
    'bills.totalRevenue': 'Total Revenue',
    'bills.averageBill': 'Average Bill Value',
    'bills.billId': 'Bill ID',
    'bills.customerName': 'Customer Name',
    'bills.phone': 'Phone',
    'bills.amount': 'Amount',
    'bills.date': 'Date',
    'bills.items': 'Items',
    'bills.paymentMethod': 'Payment Method',
    'bills.status': 'Status',
    'bills.viewDetails': 'View Details',
    'bills.printBill': 'Print Bill',
    'bills.noBills': 'No bills found matching your search.',
    'bills.status.paid': 'Paid',
    'bills.status.pending': 'Pending',
    'bills.payment.cash': 'Cash',
    'bills.payment.card': 'Card',
    'bills.payment.upi': 'UPI',
    
    // Inventory
    'inventory.title': 'Inventory Management',
    'inventory.addNew': 'Add New Item',
    'inventory.search': 'Search inventory items...',
    'inventory.totalItems': 'Total Items',
    'inventory.lowStockItems': 'Low Stock Items',
    'inventory.totalValue': 'Total Value',
    'inventory.category': 'Category',
    'inventory.quantity': 'Quantity',
    'inventory.reorderLevel': 'Reorder Level',
    'inventory.supplier': 'Supplier',
    'inventory.editItem': 'Edit Item',
    'inventory.restock': 'Restock',
    'inventory.noItems': 'No inventory items found.',
    
    // Reports
    'reports.title': 'Reports & Analytics',
    'reports.salesReport': 'Sales Report',
    'reports.inventoryReport': 'Inventory Report',
    'reports.customerReport': 'Customer Report',
    'reports.generateReport': 'Generate Report',
    'reports.selectPeriod': 'Select Period',
    'reports.today': 'Today',
    'reports.thisWeek': 'This Week',
    'reports.thisMonth': 'This Month',
    'reports.thisYear': 'This Year',
    'reports.custom': 'Custom Range',
    
    // Settings
    'settings.title': 'Settings',
    'settings.general': 'General Settings',
    'settings.storeName': 'Store Name',
    'settings.storeAddress': 'Store Address',
    'settings.storePhone': 'Store Phone',
    'settings.currency': 'Currency',
    'settings.taxSettings': 'Tax Settings',
    'settings.defaultTax': 'Default Tax Rate',
    'settings.backup': 'Backup & Restore',
    'settings.exportData': 'Export Data',
    'settings.importData': 'Import Data',
    'settings.save': 'Save Settings',
    
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
    'common.none': 'None',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export'
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
    'nav.bills': 'बिल',
    'nav.inventory': 'इन्वेंटरी',
    'nav.customers': 'ग्राहक',
    'nav.reports': 'रिपोर्ट',
    'nav.settings': 'सेटिंग्स',
    
    // Dashboard
    'dashboard.title': 'डैशबोर्ड',
    'dashboard.overview': 'स्टोर अवलोकन',
    'dashboard.todaySales': 'आज की बिक्री',
    'dashboard.totalProducts': 'कुल उत्पाद',
    'dashboard.totalCustomers': 'कुल ग्राहक',
    'dashboard.lowStock': 'कम स्टॉक आइटम',
    'dashboard.recentSales': 'हालिया बिक्री',
    'dashboard.topProducts': 'सबसे अधिक बिकने वाले उत्पाद',
    
    // Customers
    'customers.title': 'ग्राहक प्रबंधन',
    'customers.addNew': 'नया ग्राहक जोड़ें',
    'customers.search': 'नाम, फोन या ईमेल द्वारा ग्राहक खोजें...',
    'customers.totalCustomers': 'कुल ग्राहक',
    'customers.vipCustomers': 'वीआईपी ग्राहक',
    'customers.newThisMonth': 'इस महीने नए',
    'customers.exportList': 'ग्राहक सूची निर्यात करें',
    'customers.phone': 'फोन',
    'customers.email': 'ईमेल',
    'customers.totalPurchases': 'कुल खरीदारी',
    'customers.orders': 'ऑर्डर',
    'customers.lastVisit': 'अंतिम यात्रा',
    'customers.viewHistory': 'इतिहास देखें',
    'customers.newSale': 'नई बिक्री',
    'customers.noCustomers': 'आपकी खोज से मेल खाने वाले कोई ग्राहक नहीं मिले।',
    'customers.status.vip': 'वीआईपी',
    'customers.status.regular': 'नियमित',
    'customers.status.new': 'नया',
    
    // Bills
    'bills.title': 'बिल प्रबंधन',
    'bills.search': 'बिल आईडी, फोन, नाम या दिनांक द्वारा खोजें...',
    'bills.totalBills': 'कुल बिल',
    'bills.totalRevenue': 'कुल राजस्व',
    'bills.averageBill': 'औसत बिल मूल्य',
    'bills.billId': 'बिल आईडी',
    'bills.customerName': 'ग्राहक का नाम',
    'bills.phone': 'फोन',
    'bills.amount': 'राशि',
    'bills.date': 'दिनांक',
    'bills.items': 'आइटम',
    'bills.paymentMethod': 'भुगतान विधि',
    'bills.status': 'स्थिति',
    'bills.viewDetails': 'विवरण देखें',
    'bills.printBill': 'बिल प्रिंट करें',
    'bills.noBills': 'आपकी खोज से मेल खाने वाले कोई बिल नहीं मिले।',
    'bills.status.paid': 'भुगतान किया गया',
    'bills.status.pending': 'लंबित',
    'bills.payment.cash': 'नकद',
    'bills.payment.card': 'कार्ड',
    'bills.payment.upi': 'यूपीआई',
    
    // Inventory
    'inventory.title': 'इन्वेंटरी प्रबंधन',
    'inventory.addNew': 'नया आइटम जोड़ें',
    'inventory.search': 'इन्वेंटरी आइटम खोजें...',
    'inventory.totalItems': 'कुल आइटम',
    'inventory.lowStockItems': 'कम स्टॉक आइटम',
    'inventory.totalValue': 'कुल मूल्य',
    'inventory.category': 'श्रेणी',
    'inventory.quantity': 'मात्रा',
    'inventory.reorderLevel': 'पुनः ऑर्डर स्तर',
    'inventory.supplier': 'आपूर्तिकर्ता',
    'inventory.editItem': 'आइटम संपादित करें',
    'inventory.restock': 'पुनः स्टॉक',
    'inventory.noItems': 'कोई इन्वेंटरी आइटम नहीं मिले।',
    
    // Reports
    'reports.title': 'रिपोर्ट और विश्लेषण',
    'reports.salesReport': 'बिक्री रिपोर्ट',
    'reports.inventoryReport': 'इन्वेंटरी रिपोर्ट',
    'reports.customerReport': 'ग्राहक रिपोर्ट',
    'reports.generateReport': 'रिपोर्ट बनाएं',
    'reports.selectPeriod': 'अवधि चुनें',
    'reports.today': 'आज',
    'reports.thisWeek': 'इस सप्ताह',
    'reports.thisMonth': 'इस महीने',
    'reports.thisYear': 'इस वर्ष',
    'reports.custom': 'कस्टम रेंज',
    
    // Settings
    'settings.title': 'सेटिंग्स',
    'settings.general': 'सामान्य सेटिंग्स',
    'settings.storeName': 'स्टोर का नाम',
    'settings.storeAddress': 'स्टोर का पता',
    'settings.storePhone': 'स्टोर फोन',
    'settings.currency': 'मुद्रा',
    'settings.taxSettings': 'कर सेटिंग्स',
    'settings.defaultTax': 'डिफ़ॉल्ट कर दर',
    'settings.backup': 'बैकअप और पुनर्स्थापना',
    'settings.exportData': 'डेटा निर्यात करें',
    'settings.importData': 'डेटा आयात करें',
    'settings.save': 'सेटिंग्स सहेजें',
    
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
    'common.none': 'कोई नहीं',
    'common.save': 'सहेजें',
    'common.cancel': 'रद्द करें',
    'common.delete': 'हटाएं',
    'common.edit': 'संपादित करें',
    'common.view': 'देखें',
    'common.search': 'खोजें',
    'common.filter': 'फिल्टर',
    'common.export': 'निर्यात'
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
