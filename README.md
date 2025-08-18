# Expense Tracker

A comprehensive expense tracking application built with Next.js, TypeScript, and modern web technologies.

## Features

- 📊 **Dashboard**: Overview of monthly totals and recent transactions
- 💳 **Cards Management**: Add and manage payment methods
- 💰 **Expense Tracking**: Track individual and shared expenses
- 🔄 **Subscriptions**: Manage recurring payments
- 🤝 **Loans**: Track borrowed and lent money
- 💸 **Transfers**: Record money transfers with friends
- 🔐 **Authentication**: Secure Google OAuth integration
- 📱 **Responsive Design**: Works on desktop and mobile

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Authentication**: NextAuth.js with Google provider
- **Database**: PostgreSQL with Prisma ORM
- **Forms**: React Hook Form with Zod validation
- **State Management**: React Context + TanStack Query
- **Actions**: zsa for type-safe server actions
- **Notifications**: Sonner for toast messages

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (or Supabase)
- Google OAuth credentials

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd expense-tracker
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/expense_tracker"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Supabase (optional)
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
expense-tracker/
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # Protected dashboard routes
│   │   ├── dashboard/     # Main dashboard
│   │   ├── cards/         # Cards management
│   │   ├── expenses/      # Expense tracking
│   │   ├── subscriptions/ # Subscription management
│   │   ├── loans/         # Loan tracking
│   │   └── transfers/     # Transfer management
│   ├── api/               # API routes
│   ├── login/             # Authentication
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── forms/             # Form components
│   ├── layout/            # Layout components
│   └── ui/                # UI components (Shadcn)
├── lib/                   # Utilities and configurations
│   ├── providers/         # Context providers
│   ├── auth.ts            # NextAuth configuration
│   ├── prisma.ts          # Prisma client
│   ├── types.ts           # Type definitions
│   └── utils.ts           # Utility functions
├── prisma/                # Database schema
└── styles/                # Global styles
```

## Database Schema

The application uses the following main entities:

- **Users**: User accounts and authentication
- **Cards**: Payment methods (credit, debit, cash)
- **Expenses**: Individual and shared expenses
- **Subscriptions**: Recurring payments
- **Loans**: Borrowed and lent money
- **Transfers**: Money transfers between users
- **SharedExpenses**: Expense splitting details

## Features Overview

### Dashboard
- Monthly financial overview
- Recent transaction history
- Quick action buttons
- Financial statistics

### Cards Management
- Add/edit/delete payment methods
- Color-coded card identification
- Card type categorization

### Expense Tracking
- Individual and shared expenses
- Category-based organization
- Advanced filtering and search
- Expense splitting with percentages or fixed amounts

### Subscriptions
- Recurring payment tracking
- Billing frequency management
- Active/inactive status
- Payment reminders

### Loans
- Track borrowed and lent money
- Interest rate calculations
- Payment progress tracking
- Due date management

### Transfers
- Record money transfers
- Track sent and received amounts
- Contact management
- Status tracking (pending, completed, failed)

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Database Commands

- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema to database
- `npx prisma studio` - Open Prisma Studio
- `npx prisma migrate dev` - Create and apply migrations

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy automatically

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on GitHub or contact the development team.
