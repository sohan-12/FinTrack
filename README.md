# ⚡ FinTrack — AI-Powered Personal Wealth & Financial Management Platform

[![Java](https://img.shields.io/badge/Java-17%2B-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.5-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Cloud-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
[![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

> **FinTrack** is a modern, full-stack personal finance and wealth intelligence platform. Built with **Spring Boot 3, Pure Spring JDBC (Raw SQL), React 18, Neon Serverless PostgreSQL, Google Gemini AI, and Google OAuth 2.0**, FinTrack enables users to track income/expenses, monitor UPI app activity, manage bank cards, generate AI-driven financial advice, and enforce enterprise-grade security.

---

## 🌐 Live Deployment & Links

| Service | Environment | URL |
| :--- | :--- | :--- |
| **Live Web App** | Render (All-in-One) | [https://fintrack-fpo4.onrender.com](https://fintrack-fpo4.onrender.com) |
| **Local Frontend** | Vite Dev Server | `http://localhost:5173` |
| **Local Backend API**| Spring Boot Server | `http://localhost:8080` |
| **Cloud Database** | Neon Serverless PostgreSQL | `ep-delicate-hat-ax0144hv-pooler.c-4.us-east-2.aws.neon.tech` |
| **Official Email Sender**| FinTrack Official Auth | `fintrack.official.app@gmail.com` |

---

## 🏗️ System Architecture

```mermaid
graph TD
    Client["📱 Desktop / Mobile Client (React 18 + Vite + Vanilla CSS)"]
    
    subgraph Spring_Boot_Backend ["⚡ Spring Boot 3 Backend Server (Port 8080)"]
        Router["Spring MVC REST Controllers"]
        AuthFilter["JWT & Role Security Interceptor"]
        EmailSvc["📧 EmailService (Google Webhook / HTTPS)"]
        AISvc["🤖 Gemini AI Service"]
        Services["Business Services (Transaction, UPI, Admin)"]
        Jdbc["Spring JdbcTemplate (Pure SQL, Zero ORM overhead)"]
    end

    subgraph External_Services ["🌐 External Cloud Infrastructure"]
        NeonDB[("🐘 Neon Cloud Serverless PostgreSQL")]
        GoogleOAuth["🔑 Google OAuth 2.0"]
        GeminiAPI["🧠 Google Gemini 1.5 Flash API"]
        GoogleScript["✉️ Google Apps Script Webhook (Port 443 HTTPS)"]
    end

    Client -->|HTTPS / REST API| Router
    Router --> AuthFilter
    AuthFilter --> Services
    Services --> EmailSvc
    Services --> AISvc
    Services --> Jdbc
    
    EmailSvc -->|Port 443 HTTPS| GoogleScript
    AISvc -->|REST API| GeminiAPI
    Client -.->|OAuth Token Flow| GoogleOAuth
    Jdbc -->|HikariCP Connection Pool| NeonDB
```

---

## 🚀 Key Features (Phase 1 Implemented)

### 1. 🔐 Enterprise Authentication & 2-Step Email Verification
- **Email + Password Registration**: Enforces a strict 3-rule security password policy:
  - Minimum 8 characters long
  - Must start with an Uppercase letter (`A-Z`)
  - Must contain at least one special character (`!@#$%^&*`)
- **Real 6-Digit Email OTP Verification**: Dispatches real verification emails directly from **`fintrack.official.app@gmail.com`** via **Google Apps Script Webhook (Port 443 HTTPS)** to any user inbox worldwide with a 10-minute validity window.
- **Manual Code Entry**: Clean verification interface requiring the user to check their email and manually type their 6-digit security code.
- **Strict Google OAuth 2.0 Registration-First Flow**:
  - Automatically verifies if the Google email address exists in the Neon database.
  - Unregistered users are safely blocked with a clear warning: *"No FinTrack account found for '...'. Please register your account first."*
- **Stateless JWT Tokens**: HMAC-SHA256 signed JSON Web Tokens for session handling.

### 2. 🤖 Google Gemini AI Financial Intelligence
- **AI Financial Advisor Chatbot (`/api/ai/chat`)**: Context-aware advisor evaluating total savings, spending velocity, budget health, and emergency runway.
- **Smart Transaction Categorization (`/api/ai/categorize`)**: Analyzes transaction notes and merchant names to automatically categorize expenses into Food, Utilities, Shopping, Investment, etc.
- **Deterministic Rule Fallback**: Fully functional offline rule-based heuristic advisor ensuring 100% uptime when external AI endpoints are unavailable.

### 3. 💳 UPI Hub & Bank Card Aggregator Module *(Architectural Prototype)*
- **Unified Multi-App Overview**: Visual dashboard monitoring **Google Pay, PhonePe, Paytm, CRED, Amazon Pay, BHIM UPI, and WhatsApp Pay**.
- **Clean Unlinked Card State**: Displays a clean `No Bank Linked` and `XXXX XXXX XXXX XXXX` masked state for newly registered accounts.
- **Interactive Card Management Modal**: Allows users to link bank cards with custom Bank Name, Cardholder Name, 16-digit Number, Expiry, CVV, and Card Type (Debit/Credit/Forex).
- **Multi-App Transaction Synchronization**: Instantly aggregates transactions into the unified financial statement.

> [!NOTE]
> **Fintech Compliance & Architecture Design**:
> The current UPI & Card Linking module is an architectural simulation built according to industry standards (**RBI Account Aggregator** and **PCI-DSS CoFT Tokenization**). In real-world fintech systems, third-party apps cannot directly scrape private UPI app databases or store raw 16-digit card numbers due to strict central banking regulations. See the [Fintech System Design & Compliance Architecture](#-fintech-system-design--compliance-architecture) section below for complete production specifications.

### 4. 📊 Financial Analytics & Transaction Management
- **Summary Metrics**: Real-time Total Income, Total Expenses, Net Savings, and Savings Rate percentage.
- **Interactive Data Visualizations**: Recharts-powered monthly income vs. expense bar charts and category distribution donut charts.
- **Advanced Filtering & Pagination**: Filter by Type, Category, Date range, Min/Max amount, keyword search, and multi-column sorting.
- **CSV Data Export**: Instant 1-click download of all transaction history.

### 5. 📱 Full Responsive Design & Fintech Aesthetics
- Clean dark/light contrast with orange fintech accents (`#FF6B00`).
- Touch-friendly 44px minimum action buttons with micro-elevation transitions.
- Responsive slide-out navigation drawer with mobile hamburger menu supporting screen sizes down to 320px.

### 6. 🛡️ Role-Based Admin Management Console (`/admin`)
- Administrative dashboard with system-wide analytics, user counts, and total transaction volume.
- Individual user financial portfolio inspection and account deletion tools.

---

## 🏛️ Fintech System Design & Compliance Architecture

A core strength of FinTrack is its architectural alignment with modern banking and financial regulations (RBI, NPCI, and PCI-DSS).

```mermaid
graph TD
    User["👤 FinTrack User"]
    
    subgraph Client_App ["📱 FinTrack Client (Web / Android / iOS)"]
        UI["FinTrack Dashboard & Analytics"]
        Splitter["Transaction Splitting & Categorization"]
    end
    
    subgraph Compliance_Security ["🔐 Compliance & Payment Rails"]
        AA["🏦 RBI Account Aggregator (AA) Gateway<br/>(Setu / Decentro / Finvu)"]
        PG["💳 PCI-DSS Payment Aggregator (PA/PG)<br/>(Razorpay / Cashfree / Stripe)"]
        DeviceSync["📲 Mobile Notification / SMS Listener<br/>(Android Background Service)"]
    end
    
    subgraph Banks_UPI ["🏛️ Banking & UPI Ecosystem"]
        BankAccounts["Linked Bank Accounts (HDFC, SBI, ICICI, etc.)"]
        UPIApps["UPI Ecosystem (GPay, PhonePe, Paytm, CRED)"]
    end
    
    subgraph Backend_Intelligence ["⚡ FinTrack Backend & AI Engine"]
        Server["Spring Boot 3 REST Services"]
        AI["🤖 Google Gemini AI Engine"]
        DB[("🐘 Neon PostgreSQL DB")]
    end
    
    User -->|1-Time OTP Consent| AA
    AA -->|Digitally Signed Transaction Feeds| Server
    User -->|Card Entry / Checkout| PG
    PG -->|Card-on-File Token (CoFT)| Server
    DeviceSync -.->|Real-Time Push Notification Webhooks| Server
    
    BankAccounts -->|Deducts Payments| UPIApps
    BankAccounts -->|Provides Account Feeds| AA
    
    Server -->|Raw Narration| AI
    AI -->|Smart Category & Merchant Extraction| Splitter
    Splitter --> UI
    Server --> DB
```

### 1. 🔄 How Live UPI Sync Works in Production (The 3 Industry Approaches)

| Approach | Regulatory Status | How It Works | Best For |
| :--- | :--- | :--- | :--- |
| **🥇 RBI Account Aggregator (AA) Framework** | **100% Legal & Official (RBI Regulated)** | User provides 1-time OTP consent. FinTrack connects via an FIU Gateway (e.g. Setu, Decentro) to receive digitally signed transaction feeds directly from all linked bank accounts (HDFC, SBI, ICICI, Axis). | Web, iOS, & Android (Zero device permissions required) |
| **🥈 Mobile Notification & SMS Listener** | **Device Permission Based** | An Android service (`NotificationListenerService`) captures incoming push alerts from GPay, PhonePe, Paytm, and bank SMS in real-time, extracts amount & merchant, and syncs via API. | Android Companion Apps (Instant, zero-cost sync) |
| **🥉 AI Statement & E-Alert Ingestion** | **Zero-Permission Alternative** | Users upload monthly PDF/CSV bank statements or connect Gmail via OAuth to extract automated e-receipts using Gemini AI multi-modal parsing. | Desktop & Manual Sync Users |

---

### 2. 💳 Bank Card Security & PCI-DSS Tokenization
* **Why raw card data is never stored**: Under RBI regulations and global **PCI-DSS Level 1** standards, storing raw 16-digit card numbers, expiry dates, or CVVs on custom application servers is strictly prohibited.
* **Production Implementation (CoFT)**: FinTrack integrates with a certified Payment Aggregator SDK (Razorpay / Cashfree / Stripe). Sensitive card details are encrypted directly in the gateway's secure vault, and FinTrack only stores a secure cryptographic network token (`tok_visa_8921...`, `last4`, `brand`, `bank_name`).

---

### 3. 🧠 Smart Transaction Division & Categorization Pipeline
When raw bank/UPI transaction feeds hit FinTrack:
1. **Source Attribution**: Regex & packet headers tag the originating app (e.g., `UPI/PHONEPE` ➔ **PhonePe**, `com.google.android.apps.nbu.paisa.user` ➔ **Google Pay**, `PAYTM` ➔ **Paytm**).
2. **AI Category Deduction**: The `GeminiAIService` analyzes merchant names (e.g., *Swiggy* ➔ **Food & Dining**, *Uber* ➔ **Transit**, *Zepto* ➔ **Groceries**, *BESCOM* ➔ **Utilities**).
3. **Transaction Splitting**:
   * **Multi-Category Split**: Dividing a single supermarket invoice (e.g., ₹3,000) into Groceries (₹2,000) + Electronics (₹1,000).
   * **Group Expense Split**: Splitting group bills across friends with automated receivable/payable tracking (Splitwise model).

---

## 🎯 Technical Interview Guide & Design Highlights

When discussing FinTrack in technical interviews, highlight these key architectural strengths:

* **⚡ Pure SQL Performance over ORM**: Explain why FinTrack uses `Spring JdbcTemplate` instead of heavy ORMs (like Hibernate/JPA) — eliminating N+1 query problems, reducing memory footprints, and giving 100% deterministic control over PostgreSQL query plans.
* **🛡️ Security & Zero Trust Auth**: Explain the 3-rule password validation regex, stateless HMAC-SHA256 JWT tokens, and the 2-step email OTP verification flow routed via secure HTTPS webhooks to prevent SMTP port blocks on cloud hosts.
* **🤖 Production vs. Simulation Tradeoffs**: Explain the deliberate decision to build a compliant architectural prototype for the UPI Hub rather than storing non-compliant card data in development, demonstrating deep understanding of **PCI-DSS, RBI Account Aggregator (AA), and CoFT Tokenization**.
* **🧠 Resilient AI Architecture**: Discuss the dual-engine financial advisory pattern: dynamic LLM processing via Google Gemini 1.5 Flash with an instant heuristic rule-based fallback ensuring 100% uptime when external AI endpoints time out.

---

## 🔮 Phase 2 Roadmap & Future Integrations

```
Phase 2A: AI Statement Ingestion (PDF / CSV) ────▶ 1-Click Upload for GPay / PhonePe / Bank Statements
Phase 2B: RBI Card Tokenization (CoFT)       ────▶ Real Card Vaulting via Razorpay / Cashfree Sandbox
Phase 2C: RBI Account Aggregator (AA)        ────▶ Official Real-Time Bank & UPI Sync via Setu / OneMoney
Phase 2D: Android SMS Parsing Engine         ────▶ Background Transaction Detection from Bank SMS
Phase 2E: Native Mobile App Deployment       ────▶ CapacitorJS Cross-Platform Build for Android & iOS
```

### 📄 Phase 2A: AI Bank & UPI Statement Ingestion (PDF / CSV)
- **Problem**: Users frequently download transaction statements from PhonePe, Google Pay, Paytm, or net banking.
- **Solution**: Drag-and-drop bank statement PDF/CSV upload where **Gemini AI Multi-Modal** automatically parses every row (Date, Merchant, UPI ID, Category, Amount) and writes them directly to PostgreSQL.

### 🔒 Phase 2B: RBI Card-on-File Tokenization (CoFT) Sandbox
- **Regulatory Standard**: In compliance with RBI and PCI-DSS regulations, raw 16-digit card numbers are never stored on application servers.
- **Implementation**: Integration with **Razorpay / Cashfree / Stripe Card Tokenization API** to vault cards with simulated 3D-Secure bank OTPs, saving only secure network tokens (`token_id`, `last4`, `bank_name`).

### 🏦 Phase 2C: RBI Account Aggregator (AA) Framework
- **Regulatory Standard**: The official legal data-sharing framework licensed by the Reserve Bank of India (NBFC-AA).
- **Implementation**: Integration with **Setu AA (Pine Labs) / OneMoney Sandbox** to enable users to link their HDFC, SBI, ICICI, or Axis bank accounts with official OTP consent for automated real-time transaction synchronization.

### 📲 Phase 2D: Android Transactional SMS Parser
- **Implementation**: A lightweight companion Android client reading transactional bank SMS (e.g., *"Debited Rs. 450 via UPI to Swiggy on 14-Aug"*) to automatically record expenses in real-time.

### 📱 Phase 2E: CapacitorJS Mobile App Conversion
- **Implementation**: Package the existing React 18 frontend into native Android (`.apk`) and iOS (`.ipa`) applications using **CapacitorJS**, enabling hardware haptics, biometric fingerprint login, and local notifications.

---

## 💻 Tech Stack Details

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite 5, React Router v6 | High-performance single page application |
| **Icons & Charts** | Lucide React, Recharts | Data visualizations and vector iconography |
| **Styling** | Vanilla CSS Design System | Custom tokens, responsive glassmorphism, fluid typography |
| **Backend** | Java 17, Spring Boot 3.2.5 | Enterprise REST API service |
| **Database Access** | Spring JdbcTemplate | Pure raw SQL queries for maximum speed & zero ORM overhead |
| **Database** | Neon Serverless PostgreSQL | Cloud PostgreSQL with connection pooling |
| **Security** | Spring Security, jBCrypt, JJWT | BCrypt hashing, stateless HMAC-SHA256 JWT tokens |
| **Email Delivery** | Google Apps Script Webhook (HTTPS) | Cloud-resilient email dispatch from `fintrack.official.app@gmail.com` |
| **AI Engine** | Google Gemini 1.5 Flash API | Multi-turn conversational AI financial advisor |
| **Deployment** | Render Docker / Web Service | All-in-One fullstack containerized deployment |

---

## 🛠️ Local Development Setup

### 1. Prerequisites
- **Java JDK 17+**
- **Node.js 18+ & npm**
- **Maven 3.9+**
- **Git**

---

### 2. Clone the Repository
```bash
git clone https://github.com/sohan-12/FinTrack.git
cd FinTrack
```

---

### 3. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create your `.env` file (see `.env.example`):
   ```env
   DB_URL=jdbc:postgresql://ep-delicate-hat-ax0144hv-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require
   DB_USERNAME=neondb_owner
   DB_PASSWORD=your_neon_db_password
   JWT_SECRET=your_base64_jwt_secret_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   MAIL_USERNAME=fintrack.official.app@gmail.com
   GMAIL_WEBHOOK_URL=https://script.google.com/macros/s/your_google_apps_script_id/exec
   ```
3. Run the Spring Boot application:
   ```bash
   mvn compile spring-boot:run
   ```
   *The backend will start at `http://localhost:8080`.*

---

### 4. Frontend Setup
1. Open a new terminal in the `frontend` folder:
   ```bash
   cd frontend
   npm install
   ```
2. Create `frontend/.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   VITE_GOOGLE_CLIENT_ID=898658444271-bn57r25ekp761se1kvo3jsnneh0jgohd.apps.googleusercontent.com
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will start at `http://localhost:5173`.*

---

### 5. Build for Production (All-in-One)
```bash
# Build React frontend
cd frontend
npm run build

# Copy build to Spring Boot static resources (PowerShell)
Remove-Item -Recurse -Force -Path '..\backend\src\main\resources\static\*'
Copy-Item -Recurse -Path 'dist\*' -Destination '..\backend\src\main\resources\static\'

# Run complete All-in-One application on port 8080
cd ..\backend
mvn compile spring-boot:run
```

---

## 🔌 Connecting pgAdmin 4 to Neon Cloud PostgreSQL

To inspect and manage live users and transactions directly in **pgAdmin 4**:

1. Open **pgAdmin 4** $\rightarrow$ Right-click **Servers** $\rightarrow$ **Register** $\rightarrow$ **Server...**
2. **General Tab**:
   - **Name**: `FinTrack Neon Cloud`
3. **Connection Tab**:
   - **Host**: `ep-delicate-hat-ax0144hv-pooler.c-4.us-east-2.aws.neon.tech`
   - **Port**: `5432`
   - **Maintenance database**: `neondb`
   - **Username**: `neondb_owner`
   - **Password**: `your_neon_db_password`
   - Check ☑️ **Save password?**
4. **SSL Tab**:
   - **SSL mode**: `Require`
5. Click **Save** $\rightarrow$ Navigate to **neondb $\rightarrow$ Schemas $\rightarrow$ public $\rightarrow$ Tables $\rightarrow$ users**.

---

## 📡 REST API Reference Catalog

### Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/send-otp` | Generates & sends 6-digit verification code to email | No |
| `POST` | `/api/auth/register` | Verifies OTP, hashes password & registers user | No |
| `POST` | `/api/auth/login` | Email & password login, returns JWT token | No |
| `POST` | `/api/auth/google` | Google OAuth login (requires registered user) | No |
| `GET` | `/api/auth/me` | Fetches current authenticated user profile | Bearer Token |
| `PUT` | `/api/auth/password` | Updates account password (enforces 3-rule policy)| Bearer Token |

### Transaction Endpoints (`/api/transactions`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/transactions` | Filtered, sorted, paginated transactions | Bearer Token |
| `POST` | `/api/transactions` | Creates new income or expense transaction | Bearer Token |
| `PUT` | `/api/transactions/{id}` | Updates existing transaction | Bearer Token |
| `DELETE`| `/api/transactions/{id}` | Deletes transaction | Bearer Token |
| `GET` | `/api/transactions/summary` | Financial summary (income, expenses, net savings)| Bearer Token |
| `GET` | `/api/transactions/export` | Generates downloadable CSV statement | Bearer Token |

### AI Financial Advisor (`/api/ai`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/ai/chat` | Conversational financial advisor chat | Bearer Token |
| `POST` | `/api/ai/categorize` | Smart expense category deduction | Bearer Token |

### UPI & Banking Hub (`/api/upi`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/upi/apps` | Fetches all supported UPI apps & connection state| Bearer Token |
| `POST` | `/api/upi/connect` | Connects UPI application with 4-digit SMS OTP | Bearer Token |
| `POST` | `/api/upi/disconnect`| Disconnects UPI application | Bearer Token |
| `POST` | `/api/upi/sync` | Syncs latest external UPI transactions | Bearer Token |

### Admin Console (`/api/admin`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | System-wide performance & user metrics | Admin Token |
| `GET` | `/api/admin/users` | Lists all registered accounts | Admin Token |
| `GET` | `/api/admin/users/{id}/portfolio` | Inspects specific user portfolio & transactions | Admin Token |
| `DELETE`| `/api/admin/users/{id}` | Deletes user and associated records | Admin Token |

---

## 📄 License
This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️ by Sohan Kumar Sahu & the FinTrack Team.</sub>
</div>
