# Expense Tracker - Implementation Plan

## Overview
A React Native expense tracking app with mock data, featuring home dashboard, transactions, categories, and analytics.

---

## Phase 1: Project Setup & Foundation

### 1.1 Fix Navigation Setup
- [ ] Resolve react-native-screens compatibility
- [ ] Set up bottom tab navigation (4 tabs)
- [ ] Configure stack navigation for modals

### 1.2 Project Structure
```
expense-tracker/
├── App.tsx
├── screens/
│   ├── HomeScreen.tsx
│   ├── TransactionScreen.tsx
│   ├── AnalyticsScreen.tsx
│   ├── AccountScreen.tsx
│   └── SelectCategoryScreen.tsx
├── components/
│   ├── common/
│   │   ├── Header.tsx
│   │   ├── Card.tsx
│   │   ├── IconButton.tsx
│   │   └── SearchBar.tsx
│   ├── home/
│   │   ├── SpendingSummary.tsx
│   │   ├── WalletCard.tsx
│   │   └── TransactionItem.tsx
│   ├── categories/
│   │   └── CategoryGrid.tsx
│   └── analytics/
│       ├── BarChart.tsx
│       ├── SummaryCards.tsx
│       └── HistoryItem.tsx
├── data/
│   ├── mockTransactions.ts
│   ├── mockCategories.ts
│   └── mockAnalytics.ts
├── types/
│   └── index.ts
├── theme/
│   ├── colors.ts
│   └── typography.ts
└── utils/
    └── formatters.ts
```

### 1.3 Theme & Design Tokens
- [ ] Define color palette (purple gradient, whites, grays)
- [ ] Typography scale (font sizes, weights)
- [ ] Spacing system (padding, margins)
- [ ] Shadow styles

---

## Phase 2: Mock Data Layer

### 2.1 Type Definitions (`types/index.ts`)
```typescript
interface Transaction {
  id: string;
  title: string;
  category: CategoryType;
  amount: number;
  date: Date;
  icon: string;
  iconBgColor: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}
```

### 2.2 Mock Data Files
- [ ] `mockTransactions.ts` - 10-15 sample transactions
- [ ] `mockCategories.ts` - 16 categories from design
- [ ] `mockAnalytics.ts` - 6 months of income/expense data

---

## Phase 3: Home Screen

### 3.1 Header Component
- [ ] Settings icon (left)
- [ ] Date display with calendar icon (center)
- [ ] Notification bell (right)

### 3.2 Spending Summary
- [ ] "This Month Spend" label
- [ ] Large amount display ($313.31)
- [ ] Comparison indicator (↓ 67% below last month)
- [ ] Purple gradient background

### 3.3 Wallet Card
- [ ] White card with shadow
- [ ] Wallet icon
- [ ] "Spending Wallet" label
- [ ] Balance amount
- [ ] Arrow chevron

### 3.4 Recent Transactions
- [ ] Section header with "See All" link
- [ ] Transaction list (4 items visible)
- [ ] Each item: icon, title, date, amount
- [ ] Negative amounts in orange/red

### 3.5 Floating Action Button
- [ ] Purple circular button
- [ ] Plus icon
- [ ] Positioned bottom center
- [ ] Opens add transaction flow

---

## Phase 4: Bottom Tab Navigation

### 4.1 Tab Bar
- [ ] 4 tabs: Home, Transaction, Analytics, Account
- [ ] Custom icons for each tab
- [ ] Active state highlighting
- [ ] FAB integrated in center

### 4.2 Tab Screens (Placeholder)
- [ ] TransactionScreen - list of all transactions
- [ ] AnalyticsScreen - charts and history
- [ ] AccountScreen - user settings

---

## Phase 5: Select Category Screen

### 5.1 Header
- [ ] Back button
- [ ] "Select Category" title

### 5.2 Search Bar
- [ ] Search icon
- [ ] Placeholder text
- [ ] Filter categories on input

### 5.3 Category Grid
- [ ] 4 columns layout
- [ ] 16 categories:
  - Add, Groceries, Travel, Car
  - Home, Insurances, Education, Marketing
  - Shopping, Internet, Water, Rent
  - Gym, Subscription, Vacation, Other
- [ ] Icon + label for each
- [ ] Tap to select

---

## Phase 6: Analytics Screen

### 6.1 Header
- [ ] "Analytics" title
- [ ] Monthly dropdown selector

### 6.2 Bar Chart
- [ ] 6 months of data (Feb-Jul)
- [ ] Dual bars (Income green, Expense orange)
- [ ] Y-axis labels ($0-$314)
- [ ] X-axis month labels
- [ ] Legend (Income/Expense dots)

### 6.3 Summary Cards
- [ ] Income card with piggy bank icon ($12,800)
- [ ] Expenses card with wallet icon ($10,200)
- [ ] Side by side layout

### 6.4 History Section
- [ ] "History" header
- [ ] Date-grouped transactions
- [ ] Income (green) and Expense (red) amounts

---

## Phase 7: Polish & Refinements

### 7.1 Animations
- [ ] Tab transitions
- [ ] Card press feedback
- [ ] FAB animation
- [ ] List item animations

### 7.2 Empty States
- [ ] No transactions message
- [ ] No search results

### 7.3 Error Handling
- [ ] Graceful fallbacks

---

## Dependencies Needed

```json
{
  "@react-navigation/native": "^7.x",
  "@react-navigation/bottom-tabs": "^7.x",
  "@react-navigation/native-stack": "^7.x",
  "expo-linear-gradient": "~15.x",
  "react-native-safe-area-context": "~5.x",
  "@expo/vector-icons": "^15.x",
  "react-native-svg": "^15.x" // for charts
}
```

---

## Implementation Order

1. **Week 1: Foundation**
   - Fix navigation issues
   - Set up theme/colors
   - Create mock data
   - Basic screen structure

2. **Week 2: Home Screen**
   - Header component
   - Spending summary with gradient
   - Wallet card
   - Transaction list

3. **Week 3: Categories & Transactions**
   - Category selection screen
   - Transaction list screen
   - Add transaction flow (modal)

4. **Week 4: Analytics**
   - Bar chart component
   - Summary cards
   - History list

5. **Week 5: Polish**
   - Animations
   - Testing
   - Bug fixes

---

## Color Palette (from design)

```typescript
const colors = {
  // Gradients
  gradientStart: '#C7B8FF',
  gradientMid: '#E8E3FF',
  gradientEnd: '#F5F3FF',

  // Primary
  primary: '#7C3AED',
  primaryDark: '#1E1B4B',

  // Text
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',

  // Status
  expense: '#F97316',
  income: '#22C55E',

  // Background
  background: '#F5F3FF',
  cardBg: '#FFFFFF',

  // Category colors
  categoryGroceries: '#A855F7',
  categoryTravel: '#F97316',
  categoryCar: '#6366F1',
  // ... etc
};
```

---

## Notes

- All data is mock for v1
- Backend integration planned for v2
- Focus on pixel-perfect UI matching the design
- Ensure smooth 60fps animations
