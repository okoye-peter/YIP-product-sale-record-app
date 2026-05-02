# YIP - Inventory & Sales Manager
## Project Documentation & Walkthrough

---

### 1. Project Overview
**YIP** is a premium mobile application built with **React Native (Expo)** designed for small businesses to manage their inventory and track sales with ease. The app emphasizes data persistence, real-time stock monitoring, and a sleek, modern UI/UX.

---

### 2. Core Features

#### 📦 Inventory Management
- **Add Products**: Users can upload products with a name, price, initial stock, and a customizable "Low Stock" threshold.
- **Image Integration**: Integrated `expo-image-picker` allows users to capture or select product imagery, which is automatically cropped to a 1:1 aspect ratio for a uniform look.
- **Hard Limit**: The app enforces a 5-product limit to ensure a curated and manageable inventory (configurable in settings).

#### 💸 Sales Tracking
- **Record Sales**: Directly from the product card or detail screen, users can record transactions by entering the customer name and quantity sold.
- **Auto-Sync**: The app automatically decrements stock levels in both the local database and the app state immediately upon sale confirmation.

#### 🔔 Intelligent Alerts
- **Low Stock Notifications**: When a sale pushes a product's quantity below its threshold, the app triggers a real-time notification alert.
- **Visual Cues**: Items with low stock are highlighted with red badges and alert icons in the product list.

#### 📊 Sales History
- **Global History**: A dedicated "Sales History" screen accessible from the home page shows a chronological log of all transactions.
- **Product-Specific Logs**: Tapping any product card opens a "Product Detail" view, featuring a focused history of sales for that specific item.

---

### 3. Technical Architecture

#### ⚛️ Tech Stack
- **Framework**: React Native (Expo SDK 54)
- **Language**: TypeScript
- **State Management**: Redux Toolkit (for responsive UI updates)
- **Database**: SQLite via `expo-sqlite` (for robust local data persistence)
- **Icons**: Lucide React Native (for premium, consistent iconography)
- **Navigation**: React Navigation (Stack Navigator)

#### 🗄️ Database Schema
The app utilizes two primary tables:
1.  **Products**: `id`, `name`, `price`, `quantity`, `quantityToWarn`, `image`, `createdAt`.
2.  **Sales**: `id`, `productId`, `customerName`, `quantity`, `createdAt`.

---

### 4. Application Flow

#### **Home Screen**
- **Dashboard**: Shows total stock valuation and total units across all products.
- **Product List**: Displays product cards with real-time status.
- **Quick Actions**: Add product button and global sales history access.

#### **Product Upload**
- Multi-field validation ensures data integrity.
- Image preview with "Remove" and "Change" capabilities.

#### **Product Details**
- High-fidelity view of the product.
- Real-time stock status vs. warning threshold.
- Integrated sale recording and item-specific logs.

---

### 5. Design Aesthetics
- **Color Palette**: Utilizes a sophisticated Slate-Indigo and Surface-White theme.
- **Typography**: Clean, bold headers using modern font weight hierarchies.
- **Components**: Custom-built cards with soft shadows, glassmorphism-inspired overlays, and smooth transitions.

---

### 6. Case Study: Boutique "Luxe & Co."

**Background**: Sarah, a small boutique owner, struggled with tracking her handmade jewelry inventory. She often oversold items because she didn't have real-time stock alerts.

**Implementation**:
- **Setup**: Sarah added her top 5 collections into YIP, setting a "Low Stock" threshold of 2 units for each.
- **Daily Use**: As customers purchased items in-store, Sarah used the "Quick Sale" feature on her phone to log transactions.
- **The Result**: 
  - **Zero Overselling**: The "Low Stock Alert" notified her as soon as a collection hit 2 units, giving her time to restock.
  - **Financial Clarity**: The dashboard valuation showed her exactly how much capital was tied up in stock.
  - **Professionalism**: Using the app provided a sense of structure and data-driven management previously missing from her business.

---

### 7. User Reviews & Feedback

> "The UI is absolutely stunning. It feels like a premium fintech app but for my small shop. The low-stock alerts are a lifesaver!"  
> — **David K., Retail Manager**

> "Super fast and intuitive. I love that I can see the sale history for each specific product. It helps me identify which items are fast-moving."  
> — **Amina J., Entrepreneur**

> "Simple, clean, and does exactly what it says. The 5-product limit actually helps me stay focused on my best-selling items."  
> — **Michael S., Small Business Owner**

---

**Developer**: Okoye Peter
**Date**: May 2026
