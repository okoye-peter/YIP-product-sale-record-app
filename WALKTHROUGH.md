# Product Upload & Inventory Manager - Case Study Walkthrough

## 1. Project Overview
This mobile application was developed as a technical assessment for the Product Management/Engineering role. The goal was to create a streamlined product catalog manager with persistence, sales tracking, and a hard limit of 5 products, emphasizing clean code, modern UI/UX, and robust state management.

### Tech Stack
- **Framework**: React Native (Expo SDK)
- **Language**: TypeScript
- **Persistence**: SQLite (expo-sqlite)
- **State Management**: Redux Toolkit
- **Icons**: Lucide React Native
- **Styling**: StyleSheet (Vanilla React Native)
- **Media**: Expo Image Picker
- **Local Storage**: Native File System via SQLite

---

## 2. Architectural Approach

### Persistence (SQLite)
To ensure data is not lost when the app is closed, I integrated **SQLite**. 
- **Database Schema**: A `products` table stores all product details, including quantity and warning thresholds.
- **Initialization**: The app initializes the database on startup and syncs the Redux store with the stored data.

### Sales & Inventory Management
- **Sales Tracking**: A "Record Sale" feature was added to the product list. Each sale decrements the quantity and updates the database in real-time.
- **Intelligent Warnings**: The app proactively monitors inventory levels. If a sale pushes the stock below the user-defined threshold, a notification alert is triggered immediately.

### Inventory & Low Stock Alerts
- **Dynamic Fields**: Each product now tracks `Quantity` and a customizable `Quantity to Warn` threshold.
- **Intelligent Alerts**: The app automatically compares current stock against the threshold upon creation. If stock is low, a native `Alert` is triggered to notify the user immediately.
- **Visual Indicators**: Products with low stock are flagged in the list with a red alert icon and a highlighted quantity badge for quick visual identification.

### ImagePicker Deprecation
- **AddProductModal.tsx**: Updated `ImagePicker.launchImageLibraryAsync` to use `['images']` instead of the deprecated `MediaTypeOptions.Images`. Using a string array is the recommended and most compatible way in the new API.

### UI/UX Design Strategy
- **Premium Aesthetics**: Used a Slate-Indigo color palette (`#6366f1`).
- **Feedback Loops**:
    - **Empty State**: A helpful graphic and text when no products exist.
    - **Visual Progress**: A badge in the header shows `X/5` progress.
    - **Validation**: Real-time error messages for missing fields (Name, Price, Quantity, Warning Limit).
    - **Limit Notifications**: Native `Alert` components used for both the 5-product limit and low-stock warnings.

---

## 3. Key Features Implementation

### ImagePicker API (AddProductModal.tsx)
```diff
- mediaTypes: ImagePicker.MediaTypeOptions.Images,
+ mediaTypes: ['images'],
```

### Product Upload Flow
1. **Photo Selection**: Integrated `expo-image-picker` with permission handling. Users can pick an image from their gallery, which is then cropped to a 1:1 aspect ratio for consistency.
2. **Inventory Input**: Validated fields for Name, Price, Initial Quantity, and Low-Stock Threshold.
3. **Safety Checks**: 
    - **Capacity**: Before adding, the app checks if the 5-product limit is reached.
    - **Inventory Health**: After adding, if `quantity <= quantityToWarn`, an alert informs the user that stock for that item is low.

### Smooth UX
- **FAB (Floating Action Button)**: Provides a quick, thumb-friendly way to add products.
- **Interactive Cards**: Cards feature subtle shadows and clear "Delete" actions.
- **Keyboard Handling**: Used `KeyboardAvoidingView` to ensure the form remains accessible when the keyboard is active.

---

## 4. How to Run
1. Clone the repository.
2. Install dependencies: `npm install`.
3. Start the project: `npx expo start`.
4. Open on iOS/Android via the Expo Go app.

---

## 5. Future Enhancements
- **Persistence**: Add `redux-persist` to save products locally.
- **Animations**: Use `react-native-reanimated` for card entry/exit transitions.
- **Search**: Implement a search bar for larger catalogs.

---

**Author**: Okoye Peter
**Date**: May 1, 2026
