# Wealth Optimizer

A modern, full-featured personal finance and wealth management web application designed to help users track investments, monitor savings goals, manage debts, and gain financial insights through an intuitive dashboard. 

**Live Demo:** [https://wealth-optimizer-seven.vercel.app](https://wealth-optimizer-seven.vercel.app)

---

## Key Features

* **Interactive Financial Dashboard:** Provides a centralized, real-time overview of net worth, income streams, expenses, and asset allocations.
* **Investment Portfolio Tracking:** Tracks distribution across various assets and visualizes portfolio growth over time.
* **Smart Goal Setting & Milestones:** Empowers users to set financial targets, track progress, and map out timelines.
* **Debt & Expense Manager:** Monitors liabilities and daily spending habits to optimize cash flow management.
* **AI Financial Coach (In Progress):** Interactive module to simulate financial scenarios and receive automated guidance.

---

## Tech Stack & Architecture

* **Frontend:** React, Vite (for lightning-fast builds and HMR)
* **Styling & UI:** Modern CSS / Responsive Component Architecture
* **State Management & Logic:** React Context API, custom calculation engines, and localized data storage utilities
* **Deployment & CI/CD:** Hosted and continuously deployed via Vercel

---

## Project Structure

```text
wealth-optimizer/
├── public/               # Static assets and icons
├── src/
│   ├── components/       # Modular UI components (Dashboard, Goals, Investments, Coach, etc.)
│   ├── context/          # Global React context providers (WealthContext)
│   ├── engine/           # Calculation engines, AI coach logic, and helper utilities
│   ├── utils/            # Local storage and data management functions
│   ├── App.jsx           # Root application component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global stylesheets
├── package.json          # Project dependencies and npm scripts
└── vite.config.js        # Vite build configuration
