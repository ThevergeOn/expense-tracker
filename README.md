# Expense Tracker

A modern, full-featured expense tracking mobile application built with React Native and Expo.

[![Build APK](https://github.com/ThevergeOn/expense-tracker/actions/workflows/build-apk.yml/badge.svg)](https://github.com/ThevergeOn/expense-tracker/actions/workflows/build-apk.yml)

## Download APK

### Latest Release
Download the latest APK from the [Releases](https://github.com/ThevergeOn/expense-tracker/releases) page.

### Installation on Android
1. Download the `.apk` file from releases
2. On your Android device, go to **Settings > Security**
3. Enable **Install from unknown sources** (or allow your browser)
4. Open the downloaded APK file
5. Tap **Install**

## Features

### Transaction Management
- **Add Transactions** - Record income and expenses with category, amount, date, and description
- **Edit & Delete** - Modify or remove existing transactions
- **Filter by Type** - View all, income only, or expenses only
- **Search** - Find transactions quickly

### Analytics & Statistics
- **Pie Chart** - Visual breakdown of expenses/income by category
- **Period Selection** - View data by day, week, month, or year
- **Date Navigation** - Browse through different time periods
- **Income/Expense Toggle** - Switch between income and expense views
- **Category Breakdown** - See spending percentages by category

### Account Management
- **Profile Settings** - Update name, email, and phone
- **Currency Selection** - Choose from multiple currencies (USD, EUR, GBP, etc.)
- **Language Settings** - Multi-language support
- **Payment Methods** - Manage payment options

### User Experience
- **Skeleton Loading** - Smooth loading states throughout the app
- **Pull to Refresh** - Refresh data with pull gesture
- **Dark Theme** - Modern dark UI design
- **Responsive Layout** - Works on various screen sizes

## Tech Stack

- **Framework**: React Native with Expo SDK 54
- **Language**: TypeScript
- **Navigation**: Custom tab-based navigation
- **State Management**: React Hooks & Context API
- **Charts**: react-native-svg
- **Icons**: @expo/vector-icons (Ionicons)
- **Date Picker**: @react-native-community/datetimepicker
- **HTTP Client**: Fetch API with custom wrapper

## Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd expense-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API URL**

   Update the API base URL in `services/api.ts`:
   ```typescript
   const API_BASE_URL = "https://your-backend-url.com/api";
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on device/simulator**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app for physical device

## Project Structure

```
expense-tracker/
├── App.tsx                 # Main app entry point
├── components/
│   ├── Skeleton.tsx        # Loading skeleton components
│   ├── TabBar.tsx          # Bottom navigation
│   ├── DatePickerModal.tsx # Date selection modal
│   ├── account/            # Account screen components
│   └── transaction/        # Transaction modals & forms
├── context/
│   └── CurrencyContext.tsx # Global currency state
├── hooks/
│   ├── useTransactions.ts  # Transaction CRUD operations
│   ├── useCategories.ts    # Category management
│   ├── useAnalytics.ts     # Analytics data fetching
│   └── useAccount.ts       # Account settings
├── screens/
│   ├── HomeScreen.tsx      # Dashboard with recent transactions
│   ├── TransactionScreen.tsx # Transaction list & management
│   ├── AnalyticsScreen.tsx # Statistics with pie chart
│   ├── AccountScreen.tsx   # User settings
│   ├── AddTransactionScreen.tsx
│   └── SelectCategoryScreen.tsx
├── services/
│   ├── api.ts              # HTTP client wrapper
│   ├── transactionService.ts
│   ├── categoryService.ts
│   ├── analyticsService.ts
│   └── accountService.ts
├── theme/
│   └── index.ts            # Colors, typography, spacing
├── types/
│   └── index.ts            # TypeScript interfaces
└── utils/
    └── formatters.ts       # Date & currency formatters
```

## API Endpoints

The app expects the following backend endpoints:

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/transactions` | Get all transactions |
| GET | `/transactions?type=income\|expense` | Filter by type |
| POST | `/transactions` | Create transaction |
| PUT | `/transactions/:id` | Update transaction |
| DELETE | `/transactions/:id` | Delete transaction |
| DELETE | `/transactions` | Delete all transactions |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/categories` | Get all categories |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/analytics/monthly` | Get monthly summary |
| GET | `/analytics?period=daily\|weekly\|monthly\|yearly&date=YYYY-MM-DD` | Get period analytics |
| GET | `/analytics/categories?period=...&date=...` | Get category breakdown |

### Account
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profile` | Get user profile |
| PUT | `/profile` | Update profile |
| GET | `/currencies` | Get available currencies |
| GET | `/languages` | Get available languages |
| GET | `/payment-methods` | Get payment methods |
| GET | `/app-info` | Get app information |

## Usage Guide

### Adding a Transaction

1. Tap the **+** button on the tab bar
2. Select **Expense** or **Income**
3. Enter the amount
4. Select a category
5. Add description (optional)
6. Choose date
7. Tap **Save Transaction**

### Viewing Analytics

1. Navigate to the **Analytics** tab
2. Use **D/W/M/Y** buttons to change period
3. Use **< >** arrows to navigate dates
4. Toggle between **Income** and **Expense** views
5. View pie chart and category breakdown

### Changing Currency

1. Go to **Account** tab
2. Tap **Currency**
3. Select your preferred currency
4. Currency symbol updates throughout the app

### Managing Transactions

1. Go to **Transactions** tab
2. Tap a transaction to view details
3. Use **Edit** to modify
4. Use **Delete** to remove
5. Use trash icon in header to delete all

## Categories

The app supports the following default categories:

| Category | Icon | Use For |
|----------|------|---------|
| Groceries | cart | Food shopping |
| Travel | airplane | Transportation, trips |
| Car | car | Vehicle expenses |
| Home | home | Housing, utilities |
| Shopping | bag-handle | General purchases |
| Education | book | Learning, courses |
| Entertainment | film | Movies, games |
| Health | medkit | Medical expenses |
| Gym | barbell | Fitness |
| Internet | wifi | Connectivity |
| Salary | cash | Income from work |
| Investment | trending-up | Investment returns |

## Customization

### Theme Colors

Edit `theme/index.ts` to customize:

```typescript
export const colors = {
  primary: "#F97316",      // Main accent color
  income: "#22C55E",       // Income amounts
  expense: "#EF4444",      // Expense amounts
  background: "#F8FAFC",   // App background
  cardBg: "#FFFFFF",       // Card backgrounds
  // ...
};
```

### Adding New Categories

Add categories in your backend or update the default categories in `TransactionFormModal.tsx`.

## Building APK

### Prerequisites
- EAS CLI installed (`npm install -g eas-cli`)
- Expo account (free at [expo.dev](https://expo.dev))

### Build Locally

1. **Login to Expo**
   ```bash
   eas login
   ```

2. **Build APK locally**
   ```bash
   eas build --platform android --profile preview --local
   ```

3. **Or build on EAS servers**
   ```bash
   eas build --platform android --profile preview
   ```

### Automatic Builds

APK is automatically built when you:
- Push a tag starting with `v` (e.g., `v1.0.0`)
- Manually trigger the workflow from GitHub Actions

To create a release:
```bash
git tag v1.0.0
git push origin v1.0.0
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please open a GitHub issue.
