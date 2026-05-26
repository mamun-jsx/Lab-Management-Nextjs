# Lab Management System - Frontend Web App

This is the frontend client repository for the **Lab Management System**, built with Next.js (App Router), React, TypeScript, and Tailwind CSS. It provides an intuitive user interface for managing laboratory inventory, recording syringe orders, listing items, printing labels, and scanning QR codes to view details.

### Backend Repository
The backend API for this project is built using Express, Prisma, and PostgreSQL, and can be found here:
🔗 **[Lab-Management-postgreSQL Backend Repository](https://github.com/mamun-jsx/Lab-Management-postgreSQL)**

---

## Features

- **Inventory Dashboard**: Overview of syringe orders and lab items.
- **Add Items**: Dynamic form to input detailed item logs (Batch lot, material descriptions, production/expiry dates, order numbers).
- **Interactive Data Table**: View, filter, and review all items in inventory.
- **QR Code Utility**: Retrieve dynamically generated QR codes from the API and display/download them for physical tracking.
- **Print Labels**: Clean, dedicated layout for printing QR code label batches.
- **Mobile-Responsive Scanner Landing**: Scan the QR code on any item to view its details instantly on the `/product/[id]` route.

---

## Tech Stack

- **Framework**: Next.js (App Router, v16)
- **UI & Logic**: React (v19) & TypeScript
- **Styling**: Tailwind CSS (v4) with PostCSS
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
> **Note:** For local development, point it to `http://localhost:4001` (or your backend port). For production, update it with your deployed API URL (e.g., `https://backend-lab-log.vercel.app`).

### 5. Run the Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the application in action.

### 6. Build for Production
To compile and build the production bundle:
```bash
pnpm build
pnpm start
```

---

## Page Architecture

All pages are defined within `src/app/`:

- `/` - Main landing / entry point.
- `(dashboard)/items` - List, view details, and download QR codes for items.
- `(dashboard)/add-items` - Form to create and add syringe logs.
- `(dashboard)/print` - Printable view layout for labels.
- `(dashboard)/users` - User logs/management.
- `product/[id]` - Publicly scanable landing page displaying information for a single product/syringe log.

---

## License

This project is private and proprietary.
