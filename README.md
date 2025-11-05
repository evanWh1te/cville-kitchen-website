# Das Kitchen - Mutual Aid Organization Website

A modern, accessible website for Das Kitchen, a mutual aid organization focused
on building community resilience through solidarity and collective care.

## 🏗️ Project Structure

This is a monorepo containing:

-   **Frontend**: Next.js 14 with TypeScript, Tailwind CSS, and App Router
-   **Backend**: Express.js API with TypeScript, CORS, and security middleware
-   **Shared**: Configuration files, documentation, and development scripts

```
das-kitchen/
├── frontend/           # Next.js frontend application
│   ├── src/
│   │   ├── app/        # App Router pages and layouts
│   │   └── components/ # Reusable React components
│   ├── package.json
│   └── tailwind.config.js
├── backend/            # Express.js API server
│   ├── src/
│   │   ├── routes/     # API endpoints
│   │   └── middleware/ # Express middleware
│   ├── package.json
│   └── tsconfig.json
├── package.json        # Root package.json with workspace scripts
└── README.md
```

## 🚀 Getting Started

### Prerequisites

-   Node.js 18+ and npm 8+
-   Git

### Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd das-kitchen
    ```

2. **Install dependencies**

    ```bash
    npm run install:all
    ```

3. **Set up environment variables**

    ```bash
    # Frontend
    cp frontend/.env.local.example frontend/.env.local

    # Backend
    cp backend/.env.example backend/.env
    ```

4. **Start development servers**
    ```bash
    npm run dev
    ```

This will start both the frontend (http://localhost:3000) and backend
(http://localhost:3001) servers.

## 📦 Available Scripts

### Root Scripts

-   `npm run dev` - Start both frontend and backend in development mode
-   `npm run build` - Build both applications for production
-   `npm run start` - Start both applications in production mode
-   `npm run lint` - Lint both applications
-   `npm run type-check` - Type check both applications
-   `npm run clean` - Clean all build artifacts and node_modules

### Frontend Scripts (cd frontend/)

-   `npm run dev` - Start Next.js development server
-   `npm run build` - Build for production
-   `npm run start` - Start production server
-   `npm run lint` - Run ESLint
-   `npm run type-check` - TypeScript type checking

### Backend Scripts (cd backend/)

-   `npm run dev` - Start Express server with nodemon
-   `npm run build` - Compile TypeScript to JavaScript
-   `npm run start` - Start production server
-   `npm run lint` - Run ESLint on backend code

## 🎨 Frontend Features

-   **Next.js 14** with App Router and TypeScript
-   **Tailwind CSS** for styling with custom design system
-   **Responsive Design** optimized for mobile and desktop
-   **Accessibility** compliant with WCAG guidelines
-   **SEO Optimized** with proper meta tags and structured data

### Pages

-   **Homepage** - Hero section, features, and call-to-action
-   **About** - Organization mission, values, and impact
-   **Contact** - Contact form with validation and rate limiting

### Components

-   `Header` - Navigation with mobile menu
-   `Hero` - Landing page hero section
-   `Features` - Service highlights and impact metrics
-   `CallToAction` - Engagement prompts
-   `Footer` - Site footer with links and information

## 🔧 Backend Features

-   **Express.js** with TypeScript
-   **Security** with Helmet, CORS, and rate limiting
-   **Validation** with express-validator
-   **Error Handling** with custom middleware
-   **Logging** with Morgan

### API Endpoints

-   `GET /health` - Health check endpoint
-   `POST /api/contact` - Contact form submission

## 🎯 Tech Stack

### Frontend

-   Next.js 14
-   React 18
-   TypeScript
-   Tailwind CSS
-   Heroicons

### Backend

-   Express.js
-   TypeScript
-   CORS
-   Helmet (security)
-   express-validator
-   express-rate-limit
-   Morgan (logging)

### Development Tools

-   ESLint
-   Prettier
-   Nodemon
-   Concurrently

## 🌱 Development

### Adding New Pages

1. Create page component in `frontend/src/app/[page-name]/page.tsx`
2. Update navigation in `frontend/src/components/Header.tsx`
3. Add any necessary API endpoints in `backend/src/routes/`

### Styling Guidelines

-   Use Tailwind CSS utility classes
-   Follow the custom color palette (primary, secondary, accent)
-   Ensure responsive design with mobile-first approach
-   Maintain accessibility standards

### Code Style

-   TypeScript for type safety
-   ESLint for code quality
-   Prettier for formatting
-   Follow conventional commit messages

## 📚 Key Concepts

### Mutual Aid Focus

This website is designed specifically for mutual aid organizations with:

-   Community-centered messaging
-   Accessibility-first design
-   Clear calls-to-action for volunteer engagement
-   Resource sharing and support request features

### Security & Privacy

-   Rate limiting on API endpoints
-   Input validation and sanitization
-   CORS protection
-   Environment variable configuration
-   AGPL-3.0 license ensuring community access

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the GNU Affero General Public License v3.0 or
later - see the [LICENSE](LICENSE) file for details.

The AGPL-3.0 license ensures that this mutual aid website remains free and open
source, and that any network use or modifications are also made available to the
community.

## 🔗 Links

-   [Live Site](https://your-domain.com) (when deployed)
-   [Documentation](./docs/) (if additional docs exist)
-   [Issues](https://github.com/your-org/das-kitchen/issues)
-   [Contributing Guide](./CONTRIBUTING.md) (if exists)

---

**Built with ❤️ for community mutual aid and solidarity.**
