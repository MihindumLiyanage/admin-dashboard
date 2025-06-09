# Admin Dashboard

A modern admin dashboard built with Next.js 15, React 19, and IBM Carbon Design System.

## 🚀 Quick Start

```bash
# Clone and setup
git clone <https://github.com/MihindumLiyanage/admin-dashboard.git>
cd admin-dashboard
npm install

# Configuration Setup
# All environment-related constants are managed in:
# src/constants/config.ts
# Edit BASE_URL or other constants directly in that file

# Start development
npm run dev
# Open http://localhost:3000
```

## 📋 What's Included

### Core Features
- **Authentication System** - Login, logout, password recovery
- **Dashboard Home** - Overview with key metrics and charts
- **Submissions Management** - Create and manage broker, financial, and insured forms
- **Activity Tracking** - Monitor user activities and system events
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Theme Support** - Light and dark mode with user preferences

### Tech Stack
- **Frontend**: Next.js 15 + React 19 + TypeScript
- **UI Library**: IBM Carbon Design System
- **Styling**: SCSS Modules + Carbon Components
- **Forms**: React Hook Form + Yup validation
- **HTTP Client**: Axios with interceptors
- **Charts**: Carbon Charts + D3.js

## 📁 Project Structure

```
src/
├── app/                     # Next.js pages (App Router)
│   ├── (auth)/              # Authentication pages
│   │   ├── login/           # Login page
│   │   └── forgot-password/ # Password recovery
│   └── (dashboard)/         # Main dashboard pages
│       ├── home/            # Dashboard overview
│       ├── submissions/     # Submissions management
│       └── activity/        # Activity tracking
├── components/              # Reusable UI components
│   ├── common/              # Shared components (Toast, etc.)
│   ├── layouts/             # Header, Sidebar components
│   ├── shared/              # Reusable UI (Tables, Forms)
│   └── submissions/         # Form components (Broker, Financial, Insured)
├── contexts/                # React Context providers
│   ├── AuthContext.tsx      # Authentication state
│   ├── ThemeContext.tsx     # Theme switching
│   └── SidebarContext.tsx   # Sidebar state
├── services/                # API services
│   ├── authService.ts       # Authentication API
│   ├── httpService.ts       # HTTP client setup
│   └── submissionService.ts # Submissions API
├── types/                   # TypeScript definitions
├── constants/               # App constants (states, options, etc.)
├── styles/                  # SCSS stylesheets
├── utils/                   # Helper functions
└── data/                    # Static data and configurations
```

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint and Stylelint
npm run format       # Format code with Prettier
```

### Key Components

#### Authentication
- **Login/Logout**: Secure authentication with form validation
- **Password Recovery**: Self-service password reset
- **Protected Routes**: Authentication required for dashboard pages

#### Forms
- **BrokerForm**: Broker information and licensing
- **FinancialForm**: Financial data and calculations
- **InsuredForm**: Insured person details
- **Validation**: Real-time validation with Yup schemas

#### Layout
- **Header**: Navigation with user menu and search
- **Sidebar**: Collapsible navigation menu
- **Responsive**: Adapts to all screen sizes

### State Management
- **AuthContext**: User authentication state
- **ThemeContext**: Light/dark mode switching
- **SidebarContext**: Navigation menu state
- **React Hook Form**: Form state and validation

## 🎨 Styling

### Carbon Design System
```scss
// Using Carbon components
@use '@carbon/react';

// Custom theming
:root {
  --brand-primary: #0f62fe;
  --background: #f4f4f4;
}

[data-theme='dark'] {
  --background: #161616;
}
```

### SCSS Modules
```scss
// Component-specific styles
.header {
  display: flex;
  padding: 1rem 2rem;
  background: var(--background);
}
```

## 🔐 Security Features

- **Form Validation**: Client-side validation with Yup
- **HTTP Interceptors**: Automatic token handling
- **Protected Routes**: Authentication guards
- **CSRF Protection**: Security headers and validation
- **Input Sanitization**: XSS prevention

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: Mobile (320px), Tablet (768px), Desktop (1024px)
- **Touch Friendly**: Large touch targets and gestures
- **Progressive Web App**: Offline capabilities

## 🔍 Troubleshooting

### Common Issues

**Port already in use**
```bash
npx kill-port 3000
```

**Module not found**
```bash
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors**
```bash
npm run type-check
```

**Build failures**
```bash
npm run lint:fix
npm run format
```

## 📚 Key Dependencies

### Production
- `next@15.3.2` - React framework
- `react@19.0.0` - UI library
- `@carbon/react@1.83.0` - UI components
- `axios@1.9.0` - HTTP client
- `react-hook-form@7.56.4` - Form handling
- `yup@1.6.1` - Validation schemas

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/new-feature`)
3. **Commit** your changes (`git commit -m 'Add new feature'`)
4. **Push** to the branch (`git push origin feature/new-feature`)
5. **Open** a Pull Request

### Code Standards
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly

## 📞 Support

- **Issues**: Create a GitHub issue
- **Documentation**: Check inline code comments
- **Questions**: Contact the development team

---

**Built with Next.js, React, and Carbon Design System**