# Lab Management System - Frontend Web App

This is the frontend client repository for the **Lab Management System**, built with Next.js (App Router), React, TypeScript, and Tailwind CSS. It provides an intuitive, user-friendly, and responsive interface for managing laboratory inventory, registering syringe orders, managing user credentials, printing labels, and scanning QR codes to instantly look up item logs.

### Backend Repository
The backend API for this project is built using Express, Prisma, and PostgreSQL, and can be found here:
🔗 **[Lab-Management-postgreSQL Backend Repository](https://github.com/mamun-jsx/Lab-Management-postgreSQL)**

---

## Key Features

- **Role-Based Authentication & Session Management**:
  - Secure login using credentials (Employee ID and Password).
  - JWT token stored in HTTP-Only cookies to protect server side actions and dashboard layouts.
  - Role-based permissions (ADMIN has write/delete access to inventory and users, USER has standard read/write views).
  - Demo administrator (`EMP-1`) and user (`EMP-2`) profiles with update/delete protection.

- **Inventory Logs & Syringe Management**:
  - **Dynamic Order Entry Form**: Form to add new syringe shipments with strict client-side validation checks (ensuring no empty submissions and valid date/quantity formatting).
  - **Responsive Data Tables**: View detailed item lists featuring material description, GTIN (Content Code), batch/lot, unit quantities, and production/expiry dates.
  - **Live Client-Side Filtering**: Instant fuzzy search across GTINs, batch numbers, and material descriptions.

- **High-Fidelity Label Print System**:
  - Dedicated printable invoice layouts containing barcode details, production info, and GTIN codes.
  - Dynamically fetched scanable QR codes pointing to unique item detail endpoints.
  - Print button that triggers clean, borderless browser printing for warehouse scanning sheets.

- **Item Lookups & Public Scanner Page**:
  - Mobile-responsive landing page at `/product/[id]` loaded dynamically from scanning QR code labels.
  - Fully accessible detail sheet showing manufacturing credentials, batch lot details, and order tracking numbers.

- **User Accounts Control Panel**:
  - Admin view to manage laboratory employee accounts.
  - Create new laboratory operators with specific Employee IDs, emails, roles, and password fields.
  - Interactive table to view, edit, or delete active staff accounts.

- **Polished & Premium User Experience**:
  - Modern typography and color palette with smooth gradients.
  - Micro-animations, responsive hover states, loading skeletons, and interactive dialogs.
  - Integrated with `react-hot-toast` for rich and non-intrusive feedback messages.

---

## Tech Stack

- **Framework**: Next.js (App Router, v15/16)
- **UI & Logic**: React (v19) & TypeScript
- **State & Forms**: `react-hook-form`
- **Notifications**: `react-hot-toast`
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with modern UI layouts
- **Package Manager**: pnpm

---

## Local Setup & Installation

Follow these steps to set up and run the frontend application locally:

### 1. Prerequisites
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) package manager (`npm install -g pnpm`)

### 2. Clone the Repository
```bash
git clone https://github.com/mamun-jsx/Lab-Management-Nextjs.git
cd Lab-Management-Nextjs
```

### 3. Install Dependencies
Using pnpm:
```bash
pnpm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory:
```bash
touch .env
```
Add the following configuration variable pointing to your backend server URL:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4001
```

### 5. Run the Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for Production
To compile and build the production bundle:
```bash
pnpm build
pnpm start
```

---

## Page Architecture

All pages are defined within `src/app/`:

- `/` - Public user login.
- `(dashboard)/dashboard` - Inventory summary metrics and links.
- `(dashboard)/items` - List, search, delete, and trigger updates for inventory logs.
- `(dashboard)/add-items` - Form to create new syringe records.
- `(dashboard)/print/[id]` - Dedicated print stylesheet layout for labels.
- `(dashboard)/users` - Admin user dashboard list & editor.
- `(dashboard)/create-users` - Admin registration panel to add new laboratory staff.
- `/product/[id]` - Public landing page accessible from barcode scans displaying syringe specifics.

---

## License

This project is private and proprietary.
