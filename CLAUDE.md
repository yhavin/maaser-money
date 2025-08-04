# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ma'aser Money is a Vue.js web application for tracking ma'aser/tithe donations (10% of income donated to charity). The app allows users to track income, deductions, and donations, calculate owed amounts, and manage recurring income schedules.

## Development Commands

### Core Commands
- `npm run dev` - Start development server with Vite
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Firebase Deployment
The project uses Firebase Hosting. Build files are output to `dist/` directory which is configured in `firebase.json`.

## Architecture Overview

### Tech Stack
- **Frontend**: Vue 3 with Composition API
- **State Management**: Pinia with persistence plugin
- **Build Tool**: Vite
- **Routing**: Vue Router 4
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Styling**: PicoCSS framework
- **Hosting**: Firebase Hosting

### Project Structure

#### Key Directories
- `src/pages/` - Main application pages (Home, Splash, NotFound)
- `src/components/` - Reusable Vue components for forms, tables, and details
- `src/stores/` - Pinia stores for centralized state management with persistence
- `src/composables/` - Vue composables, primarily for recurring transaction logic
- `src/utils/` - Utility functions and constants
- `public/` - Static assets including PWA manifest and icons

#### Core Files
- `router.js` - Vue Router configuration with authentication guards
- `src/firebase.config.js` - Firebase initialization and service exports
- `src/main.js` - Application entry point with Pinia configuration
- `src/stores/transactions.js` - Main data store with persistent caching

### Authentication Flow
The app uses Firebase Auth with route guards. Unauthenticated users are redirected to `/auth` (Splash page), while authenticated users access the main app at `/` (Home page).

### Data Architecture

#### Pinia Store Architecture
The app uses centralized state management with persistent caching:

- **State**: Internal storage with descriptive names (`incomeItems`, `deductionItems`, `maaserItems`)
- **Getters**: Public API with clean names (`incomes`, `deductions`, `maasers`) that automatically handle date formatting
- **Actions**: Smart cache operations that minimize Firebase requests
- **Persistence**: Automatic localStorage caching with `pinia-plugin-persistedstate`

#### Caching Strategy
- **Cache Duration**: Infinite - never expires automatically until data changes
- **Smart Updates**: Individual items added/removed from cache without full refetch
- **Firebase Optimization**: Dramatic reduction in read requests (users can use app for days with only 1 initial fetch)
- **Date Handling**: Automatic conversion between Firestore timestamps and JavaScript dates for localStorage compatibility

#### Firestore Collections
The app uses several Firestore collections:
- `income` - User income transactions
- `deductions` - Business expenses and tax deductions  
- `maaser` - Donation/tithe transactions
- `schedules` - Recurring income schedules
- `users` - User profile information

#### Key Data Patterns
- All transactions are user-scoped using `uid` field
- Recurring schedules generate transactions automatically via composables
- Currency conversion is handled via external API (frankfurter.app)
- Transactions support tagging (e.g., tax deductible donations)
- Cache updates use `addToCache()` and `removeFromCache()` for individual item management

### Component Architecture

#### Form Components
- `IncomeForm.vue`, `DeductionForm.vue`, `MaaserForm.vue` - Transaction input forms
- Forms support recurring schedule creation
- Validation is handled at the parent component level

#### Detail Components  
- `IncomeDetail.vue`, `DeductionDetail.vue`, `MaaserDetail.vue` - Transaction details/editing
- Follow consistent patterns for CRUD operations

#### Table Components
- `TransactionsTable.vue` - Main transaction listing with search/filter
- `SchedulesTable.vue` - Recurring schedule management

#### Utility Components
- `Balance.vue` - Shows current ma'aser balance calculation
- `AddToHomeScreen.vue` - PWA installation prompt
- `FooterActions.vue` - CSV export and other actions

### Recurring Transactions System

The recurring system is implemented via composables in `src/composables/recurring/`:
- `useCreateSchedule.js` - Creates new recurring schedules
- `useRunRecurring.js` - Processes due recurring items
- `useRecurringDay.js`, `useRecurringWeek.js`, `useRecurringMonth.js` - Frequency-specific logic
- `useCreateRecurringItems.js` - Generates individual transactions from schedules

### Currency and Localization

- Multi-currency support via `currencyOptions` constant
- Currency conversion using frankfurter.app API
- Locale-specific formatting via `currencyLanguages` mapping
- Timezone handling for recurring schedules

### PWA Features

The app is configured as a Progressive Web App:
- Service worker registration
- App manifest in `public/manifest.json`
- iOS-specific startup images and icons
- Install prompts for supported platforms

## Development Guidelines

### Vue Patterns
- Uses Composition API consistently
- Props validation with `defineProps`
- Event emission with `defineEmits`
- Reactive data with `ref()` and `computed()`

### Firebase Integration
- All database operations use Firestore v9 modular SDK
- Authentication state is managed globally via router guards
- Data is cached persistently to minimize Firebase read requests
- Individual CRUD operations update cache directly without full refetch

### Styling Approach
- PicoCSS provides base styling
- Custom styles in `src/assets/styles.css`
- Component-scoped styles where needed
- Responsive design considerations for mobile usage

### Error Handling
- Form validation at component level
- Firebase errors are typically logged to console
- User-facing error states via reactive properties