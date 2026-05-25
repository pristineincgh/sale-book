# SaleBook

SaleBook is a simple mobile-first stock and sales tracking application designed for small retail businesses.

The application helps users:

- Track stock batches
- Record sales
- Monitor profits
- Track customer debts
- View business reports
- Identify missing money

The MVP is focused on simplicity and usability for non-technical users.

---

## Monorepo Structure

```text
sale-book/
├── backend/     → NestJS API
├── frontend/    → Next.js PWA
└── README.md
```

---

## Tech Stack

### Backend

- NestJS
- Prisma ORM
- PostgreSQL
- JWT Authentication

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- PWA Support

---

## Features

### Authentication

- User signup
- Login with name + PIN
- JWT authentication
- Logout

### Stock Batch Management

- Create stock batches
- Track supplied stock
- Track remaining stock
- Auto-calculate revenue and profit
- Batch completion tracking

### Sales Tracking

- Record sales
- Paid / Partial / Owing sales
- Automatic stock reduction
- Revenue tracking

### Debt Tracking

- Track customers owing money
- Record debt repayments
- Outstanding debt reporting

### Reports Generation

- Daily reports
- Batch reports
- Summary reports
- Outstanding debts report

---

## API Modules

### Auth

- `/auth/login`
- `/auth/me`
- `/auth/logout`

### Users

- `/users`

### Stock Batches

- `/stock-batches`

### Sales

- `/sales`

### Debt Payments

- `/debt-payments`

### Reports

- `/reports`

---

## Backend Setup

Navigate to backend:

```bash
cd sale-book-backend
```

Install dependencies:

```bash
npm install
```

Create `.env`:

```env
# Server
PORT=8000
NODE_ENV=development

# Database
DATABASE_URL="postgres://..."

# CORS
CORS_ORIGIN=http://localhost:4200
CORS_METHODS=GET,PUT,PATCH,POST,DELETE
ALLOWED_HEADERS=Content-Type, Authorization

# JWT Secrets
JWT_ACCESS_SECRET="your_secret"

# Token TTL
ACCESS_TOKEN_TTL="7d"
```

Run Prisma migrations:

```bash
npx prisma migrate dev
```

Start development server:

```bash
npm run start:dev
```

Backend runs on:

```text
http://localhost:8000
```

---

## Frontend Setup

Navigate to frontend:

```bash
cd sale-book-frontend
```

Install dependencies:

```bash
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

Start development server:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:4200
```

---

## Core Business Flow

```text
Create Stock Batch
        ↓
Record Sales
        ↓
Track Owing Customers
        ↓
Record Debt Payments
        ↓
Generate Reports
```

---

## Database Models

- User
- StockBatch
- Sale
- DebtPayment

---

## Future Improvements

- Offline support
- Mobile money integration
- Notifications
- Expense tracking
- Supplier management
- Multi-user businesses
- Export reports
- API key integrations

---

## License

Private/Internal Project
