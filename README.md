# 🚀 FINTRACK — AI-Powered Personal Finance & Transaction Manager

> **A modern, interview-grade Full-Stack FinTech platform built with Java 17+, Spring Boot, JdbcTemplate, PostgreSQL, JWT Authentication, Gemini Generative AI, and React (Vite).**

---

## 📌 1. Project Overview & Problem Statement

Managing personal cash flow, budgeting, and recurring transactions often becomes cumbersome when users must manually log every receipt. **FinTrack** solves this by combining:
1. **Multi-App UPI & Banking Hub**: Connect and authenticate with all major payment apps (**Google Pay, PhonePe, Paytm, CRED, Amazon Pay, BHIM UPI, WhatsApp Pay**) with 2-step SMS OTP verification, plus instant direct UPI merchant transfers.
2. **Real-time Financial Telemetry**: Live balance calculations, income vs. expense breakdowns, monthly cash flow trends, and category budget limits.
3. **Multi-Dimensional AI Financial Advisor**: Powered by the Gemini API and contextual financial reasoning to answer complex questions regarding career transitions, car/home purchase affordability, 50/30/20 budget allocations, and emergency runway.
4. **Admin Oversight**: Comprehensive system telemetry and global transaction ledgers.

---

## 🛠️ 2. Technology Stack

| Layer | Technology | Purpose / Rationale |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, React Router 6 | Lightning-fast SPA with reactive state management |
| **Styling** | Vanilla CSS (Modern Fintech Design) | Crisp White & Vibrant Orange (#FF6B00) palette, glass cards, responsive grid |
| **Charts** | Chart.js & React-Chartjs-2 | Interactive Income vs Expense, Monthly Trends, Category Doughnut charts |
| **Backend** | Java 17+, Spring Boot 3.2.x, Maven | Enterprise-grade RESTful API architecture |
| **Database** | PostgreSQL 17.x, Spring `JdbcTemplate` | Raw SQL queries with `RowMapper` for maximum transparency (No Hibernate/JPA magic) |
| **Authentication**| Custom JWT (`io.jsonwebtoken`) + BCrypt | Stateless token-based security via custom `HandlerInterceptor` (No Spring Security bloat) |
| **AI / GenAI** | Google Gemini 1.5 Flash REST API | Prompt-engineered contextual financial intelligence with deep reasoning engine |

---

## 📱 3. Multi-App UPI & Account Aggregator Hub (`/upi-banking`)

FinTrack provides a full simulation of the modern Indian & Global digital payments ecosystem:
- **Connected Apps Matrix**: Manage connections for **Google Pay, PhonePe, Paytm, CRED, Amazon Pay, BHIM UPI, and WhatsApp Pay**.
- **Interactive 2-Step SMS OTP Authentication**: Connecting new payment apps requires entering mobile credentials and confirming with a 4-digit SMS OTP code.
- **Instant UPI Transfer**: Transfer funds to any VPA (`merchant@okhdfcbank`, `swiggy@icici`, `landlord@upi`). Automatically creates a categorized transaction in PostgreSQL and updates the balance in real time.
- **QR Code Scanner Simulator**: Interactive simulation for scanning merchant payment codes.

---

## 🤖 4. Gemini AI & Financial Intelligence Architecture

When a user chats with FinTrack AI, the backend executes the following pipeline:
1. **User Identity & Data Isolation**: Identifies `userId` from the verified JWT.
2. **Context Aggregation**: Queries the user's live balance, top spending categories, monthly burn rate, and recent transactions.
3. **Prompt Engineering**: Injects the financial snapshot into a system prompt instructing the model to apply standard wealth management principles.
4. **Multi-Dimensional Financial Reasoning Engine**:
   - **Career Transitions & Job Resignation**: Parses target duration (e.g. 3 months, 6 months) and calculates exact survival runway against standard and lean burn rates.
   - **Car Affordability**: Applies the **20/4/10 Rule** (20% down payment, 4-year tenure, max 10% monthly income on EMI) while safeguarding a **3-month emergency fund**.
   - **Home Purchase & Loans**: Applies **35% Debt-to-Income (DTI)** rules to calculate maximum safe mortgage borrow limits.
   - **50/30/20 Budgeting**: Calculates ideal Needs ($50%), Wants ($30%), and Savings ($20%) allocation against actual spending.
   - **FIRE & Retirement Planning**: Calculates 25x annual expense targets (4% Safe Withdrawal Rule) with compounding projections.

---

## 🚀 5. Quick Setup & Run Instructions

### Prerequisites:
- Java 17 or higher
- PostgreSQL 14+ running on port 5432
- Node.js 18+ and npm

### A. Run Backend (Spring Boot):
```bash
cd backend
mvn spring-boot:run
```
*Backend runs on `http://localhost:8080`* (Auto-seeds admin, demo users, categories, and 45+ transactions on first run).

### B. Run Frontend (React + Vite):
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 🔑 6. Demo Credentials

| Role | Email | Password | Features |
| :--- | :--- | :--- | :--- |
| **Demo User** | `john@example.com` | `User@123` | Personal Dashboard, Multi-App UPI Hub, Transactions, AI Assistant |
| **Demo Admin** | `admin@fintrack.com`| `Admin@123`| Admin Telemetry, User Directory, Global Ledger |

---

## 📡 7. REST API Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Login and receive JWT token | No |
| `GET` | `/api/auth/me` | Retrieve authenticated user profile | Yes (Bearer) |
| `GET` | `/api/transactions` | Query user transactions (search/filters/sort/page) | Yes (Bearer) |
| `POST` | `/api/transactions` | Create new income/expense transaction | Yes (Bearer) |
| `GET` | `/api/transactions/{id}` | Get transaction details by ID | Yes (Bearer) |
| `PUT` | `/api/transactions/{id}` | Update existing transaction | Yes (Bearer) |
| `DELETE`| `/api/transactions/{id}` | Delete transaction | Yes (Bearer) |
| `GET` | `/api/transactions/summary` | Get balance, income, expense, count, largest | Yes (Bearer) |
| `GET` | `/api/transactions/category-summary` | Category expense distribution & percentages | Yes (Bearer) |
| `GET` | `/api/transactions/monthly-summary` | Historical monthly cash flow trends | Yes (Bearer) |
| `GET` | `/api/upi/apps` | Fetch all supported UPI apps & connection status | Yes (Bearer) |
| `POST` | `/api/upi/apps/connect` | Connect a new UPI app via OTP verification | Yes (Bearer) |
| `POST` | `/api/upi/apps/disconnect` | Disconnect a linked UPI app | Yes (Bearer) |
| `POST` | `/api/upi/pay` | Execute instant UPI transfer | Yes (Bearer) |
| `POST` | `/api/upi/sync` | 1-Click sync all connected apps | Yes (Bearer) |
| `GET` | `/api/upi/accounts` | Fetch linked bank accounts & VPAs | Yes (Bearer) |
| `POST` | `/api/ai/chat` | Chat with FinTrack AI (Gemini / Reasoning Engine) | Yes (Bearer) |
| `GET` | `/api/ai/insights` | Automated AI financial insights for dashboard | Yes (Bearer) |
| `GET` | `/api/admin/stats` | System-wide statistics and volume metrics | Yes (Admin) |
| `GET` | `/api/admin/users` | Retrieve all registered users | Yes (Admin) |
| `GET` | `/api/admin/transactions` | Global platform transactions ledger | Yes (Admin) |
