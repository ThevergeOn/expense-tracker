export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export interface Language {
  code: string;
  name: string;
}

export interface PaymentMethod {
  id: string;
  type: "visa" | "mastercard" | "amex" | "discover";
  last4: string;
  expiry: string;
  isDefault?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface HelpOption {
  id: string;
  icon: string;
  color: string;
  title: string;
  subtitle: string;
  action: "chat" | "email" | "phone" | "faq";
}

export interface SocialLink {
  id: string;
  icon: string;
  label: string;
  url: string;
}

export interface AppInfo {
  name: string;
  version: string;
  description: string;
  copyright: string;
  features: string[];
}

// Currencies
export const currencies: Currency[] = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CAD", symbol: "$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "$", name: "Australian Dollar" },
  { code: "CHF", symbol: "Fr", name: "Swiss Franc" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "KRW", symbol: "₩", name: "South Korean Won" },
];

// Languages
export const languages: Language[] = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "pt", name: "Portuguese" },
  { code: "it", name: "Italian" },
  { code: "ru", name: "Russian" },
];

// Payment Methods
export const paymentMethods: PaymentMethod[] = [
  { id: "1", type: "visa", last4: "4242", expiry: "12/25", isDefault: true },
  { id: "2", type: "mastercard", last4: "8888", expiry: "06/26" },
  { id: "3", type: "amex", last4: "1234", expiry: "03/27" },
];

// Default User Profile
export const defaultUserProfile: UserProfile = {
  name: "John Doe",
  email: "john.doe@email.com",
  phone: "+1 234 567 8900",
};

// Help Options
export const helpOptions: HelpOption[] = [
  {
    id: "chat",
    icon: "chatbubble-outline",
    color: "#3B82F6",
    title: "Live Chat",
    subtitle: "Chat with our support team",
    action: "chat",
  },
  {
    id: "email",
    icon: "mail-outline",
    color: "#22C55E",
    title: "Email Support",
    subtitle: "support@expensetracker.com",
    action: "email",
  },
  {
    id: "phone",
    icon: "call-outline",
    color: "#F97316",
    title: "Phone Support",
    subtitle: "+1 (800) 123-4567",
    action: "phone",
  },
  {
    id: "faq",
    icon: "book-outline",
    color: "#A855F7",
    title: "FAQ",
    subtitle: "Frequently asked questions",
    action: "faq",
  },
];

// Social Links
export const socialLinks: SocialLink[] = [
  { id: "website", icon: "globe-outline", label: "Website", url: "https://expensetracker.com" },
  { id: "twitter", icon: "logo-twitter", label: "Twitter", url: "https://twitter.com/expensetracker" },
  { id: "instagram", icon: "logo-instagram", label: "Instagram", url: "https://instagram.com/expensetracker" },
  { id: "facebook", icon: "logo-facebook", label: "Facebook", url: "https://facebook.com/expensetracker" },
  { id: "linkedin", icon: "logo-linkedin", label: "LinkedIn", url: "https://linkedin.com/company/expensetracker" },
];

// App Info
export const appInfo: AppInfo = {
  name: "Expense Tracker",
  version: "1.0.0",
  description: "Your personal finance companion. Track expenses, manage budgets, and achieve your financial goals with ease.",
  copyright: "© 2024 Expense Tracker. All rights reserved.",
  features: [
    "Track income and expenses",
    "Categorize transactions",
    "View detailed analytics",
    "Set and manage budgets",
    "Export financial reports",
    "Multi-currency support",
  ],
};

// Support Contact Info
export const supportContact = {
  email: "support@expensetracker.com",
  phone: "+1 (800) 123-4567",
  legalEmail: "legal@expensetracker.com",
  privacyEmail: "privacy@expensetracker.com",
};

// Terms of Service Content
export const termsContent = {
  lastUpdated: "January 1, 2024",
  sections: [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using this application, you accept and agree to be bound by the terms and conditions of this agreement. If you do not agree to these terms, please do not use our services.",
    },
    {
      title: "2. Use of Service",
      content: "You agree to use the service only for lawful purposes and in accordance with these Terms. You are responsible for ensuring that your use of the app complies with all applicable laws and regulations.",
    },
    {
      title: "3. User Accounts",
      content: "You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.",
    },
    {
      title: "4. Data and Privacy",
      content: "Your use of the service is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices regarding your personal data.",
    },
    {
      title: "5. Financial Information",
      content: "The app helps you track expenses and manage finances. We do not provide financial advice. Always consult with a qualified financial advisor for important financial decisions.",
    },
    {
      title: "6. Intellectual Property",
      content: "The app and its original content, features, and functionality are owned by Expense Tracker and are protected by international copyright, trademark, and other intellectual property laws.",
    },
    {
      title: "7. Modifications",
      content: "We reserve the right to modify these terms at any time. We will notify users of any changes by updating the 'Last updated' date. Continued use of the service after changes constitutes acceptance of the new terms.",
    },
    {
      title: "8. Termination",
      content: "We may terminate or suspend your account and access to the service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.",
    },
    {
      title: "9. Contact Us",
      content: "If you have any questions about these Terms, please contact us at legal@expensetracker.com.",
    },
  ],
};

// Privacy Policy Content
export const privacyContent = {
  lastUpdated: "January 1, 2024",
  introduction: "Your privacy is important to us. This policy explains how we collect, use, and protect your information when you use our Expense Tracker application.",
  sections: [
    {
      title: "Information We Collect",
      items: [
        "Personal information (name, email address)",
        "Financial data (transactions, categories, budgets)",
        "Device information (device type, operating system)",
        "Usage data (how you interact with the app)",
      ],
    },
    {
      title: "How We Use Your Information",
      items: [
        "To provide and improve our services",
        "To personalize your experience",
        "To communicate with you about updates and features",
        "To analyze usage patterns and improve the app",
        "To ensure security and prevent fraud",
      ],
    },
    {
      title: "Your Rights",
      items: [
        "Access your personal data",
        "Correct inaccurate data",
        "Delete your account and data",
        "Export your data",
        "Opt out of marketing communications",
      ],
    },
  ],
  dataStorage: "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Your data is encrypted both in transit and at rest.",
  dataSharing: "We do not sell your personal information to third parties. We may share data with trusted service providers who assist us in operating our app, subject to confidentiality agreements.",
  cookies: "We use cookies and similar technologies to enhance your experience, analyze usage, and assist in our marketing efforts. You can control cookie preferences through your device settings.",
  children: "Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13.",
  changes: "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the 'Last updated' date.",
};
