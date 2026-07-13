# ✊ Charlottesville Kitchen - Revolutionary Mutual Aid Website

A modern, accessible website for Charlottesville Kitchen, a leftist mutual aid
organization focused on building revolutionary community through solidarity,
direct action, and collective liberation.

## 🚩 About This Project

This website serves as a digital hub for socialist organizing and mutual aid in
the Charlottesville area. Built with revolutionary principles in mind, it
provides:

-   **Community Resources**: Comprehensive food resources and mutual aid
    networks
-   **Political Education**: Socialist theory and organizing materials
-   **Direct Action**: Tools for community organizing and solidarity work
-   **Workers' Solidarity**: Platform for collective action and support

## 🏗️ Project Structure

This is a full-stack monorepo with socialist-themed design:

```
cville-kitchen-website/
├── frontend/                 # Next.js 14 with socialist color scheme
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── resources/   # Community resource listings (markdown-driven)
│   │   │   ├── education/   # Political education materials
│   │   │   ├── about/       # Organization mission
│   │   │   └── contact/     # Contact and organizing
│   │   ├── components/      # Revolutionary-themed components
│   │   ├── lib/            # Markdown processing utilities
│   │   └── resources/      # Community resource data (markdown)
│   ├── tailwind.config.js  # Socialist color palette
│   └── next.config.js      # Docker-optimized build
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   └── middleware/     # Security middleware
│   └── package.json
├── Dockerfile              # Multi-stage production build
├── docker-compose.yml      # Container orchestration
├── nginx.conf             # Reverse proxy configuration
├── deploy.sh              # Production deployment script
└── README.md
```

## 🚀 Getting Started

### Prerequisites

-   Node.js 18+ and npm 8+
-   Git
-   Docker & Docker Compose (for production deployment)

### Local Development

1. **Clone the repository**

    ```bash
    git clone https://github.com/evanWh1te/cville-kitchen-website.git
    cd cville-kitchen-website
    ```

2. **Install dependencies**

    ```bash
    # Frontend
    cd frontend && npm install

    # Backend
    cd ../backend && npm install
    ```

3. **Start development servers**

    ```bash
    # From frontend directory
    npm run dev  # Runs on http://localhost:3000

    # From backend directory (in separate terminal)
    npm run dev  # Runs on http://localhost:3001
    ```

### Production Deployment (Digital Ocean)

1. **Install Docker on your droplet**

    ```bash
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    ```

2. **Install and configure nginx**

    ```bash
    sudo apt update && sudo apt install nginx
    sudo cp nginx.conf /etc/nginx/sites-available/cville-kitchen
    sudo ln -s /etc/nginx/sites-available/cville-kitchen /etc/nginx/sites-enabled/
    sudo rm /etc/nginx/sites-enabled/default
    sudo nginx -t && sudo systemctl reload nginx
    ```

3. **Deploy the application**
    ```bash
    ./deploy.sh
    ```

## 📦 Available Scripts

### Frontend Scripts (cd frontend/)

-   `npm run dev` - Start Next.js development server
-   `npm run build` - Build for production (standalone Docker build)
-   `npm run start` - Start production server
-   `npm run lint` - Run ESLint
-   `npm run type-check` - TypeScript type checking

### Backend Scripts (cd backend/)

-   `npm run dev` - Start Express server with nodemon
-   `npm run build` - Compile TypeScript to JavaScript
-   `npm run start` - Start production server
-   `npm run lint` - Run ESLint on backend code

### Docker/Deployment Scripts

-   `./deploy.sh` - Full production deployment script
-   `docker-compose build` - Build Docker images
-   `docker-compose up -d` - Start containers in background
-   `docker-compose logs -f` - View container logs

## 🎨 Socialist Design System

### Revolutionary Color Palette

-   **Primary Red** (`#dc2626`) - Classic socialist/communist red
-   **Secondary Gold** (`#eab308`) - Soviet-inspired gold/yellow
-   **Revolutionary Red** (`#e11d48`) - Deep action red
-   **Solidarity Brown** (`#78716c`) - Working class earth tones
-   **Accent Grays** - Industrial worker aesthetics

### Pages & Features

-   **Homepage** - Revolutionary hero with gradient backgrounds and solidarity
    symbolism
-   **Community Resources** - Dynamic markdown-driven resource listings
-   **Political Education** - Socialist theory and organizing materials
-   **About** - Revolutionary mission and anti-capitalist values
-   **Contact** - Organizing and solidarity contact forms

### Components

-   `Header` - Socialist-themed navigation with solidarity fist (✊)
-   `Hero` - Revolutionary messaging with leftist color gradients
-   `Footer` - "Workers of the world, unite!" messaging
-   **Logo Design** - Stylized "Charlottesville Kitchen" with thin/bold contrast

### Key Features

-   **Dynamic Content** - Markdown-powered resource pages
-   **Accessibility First** - WCAG compliant for community access
-   **Mobile Responsive** - Optimized for organizing on-the-go
-   **Socialist Aesthetics** - Consistent revolutionary branding

## 🔧 Backend Features

-   **Express.js** with TypeScript
-   **Security Hardened** - Helmet, CORS, rate limiting for activist protection
-   **Input Validation** - express-validator for secure form processing
-   **Error Handling** - Custom middleware for robust operation
-   **Request Logging** - Morgan for monitoring and security

### API Endpoints

-   `GET /health` - Health check for monitoring
-   `POST /api/contact` - Secure contact form processing

### Security Features

-   **Rate Limiting** - Protects against DoS attacks
-   **CORS Protection** - Secure cross-origin requests
-   **Input Sanitization** - Prevents injection attacks
-   **Security Headers** - Helmet.js protection

## 🎯 Tech Stack

### Frontend

-   **Next.js 14** - React framework with App Router
-   **React 18** - Modern component architecture
-   **TypeScript** - Type safety for reliable organizing tools
-   **Tailwind CSS** - Revolutionary design system
-   **Remark/Markdown** - Dynamic content management
-   **Heroicons** - Consistent iconography

### Backend

-   **Express.js** - Node.js web framework
-   **TypeScript** - Server-side type safety
-   **Security Stack** - Helmet, CORS, rate limiting
-   **Validation** - express-validator for secure inputs
-   **Logging** - Morgan for request monitoring

### Deployment & DevOps

-   **Docker** - Multi-stage containerization
-   **nginx** - Reverse proxy and static serving
-   **Digital Ocean** - Production hosting
-   **Docker Compose** - Container orchestration

### Development Tools

-   **ESLint** - Code quality enforcement
-   **Prettier** - Code formatting
-   **Nodemon** - Development hot reloading

## 🌱 Development Guide

### Adding Community Resources

1. Edit `frontend/src/resources/foodResources.md` with new resources
2. Content automatically appears on `/resources` page
3. Markdown supports full formatting, links, and structure

### Adding New Pages

1. Create page: `frontend/src/app/[page-name]/page.tsx`
2. Update navigation: `frontend/src/components/Header.tsx`
3. Add API endpoints: `backend/src/routes/` (if needed)

### Socialist Design Guidelines

-   **Colors**: Use revolutionary palette (primary red, secondary gold)
-   **Typography**: Bold headers, accessible body text
-   **Symbols**: Incorporate solidarity imagery (✊, etc.)
-   **Messaging**: Anti-capitalist, pro-worker language
-   **Accessibility**: Ensure community access for all

### Code Standards

-   **TypeScript** - Mandatory for type safety
-   **ESLint** - Enforce code quality
-   **Revolutionary Naming** - Use meaningful, activist-oriented naming
-   **Security First** - Protect organizers and community data

## 📚 Revolutionary Principles

### Mutual Aid as Revolutionary Practice

This platform embodies leftist organizing principles:

-   **Solidarity over Charity** - Building power, not dependency
-   **Direct Action** - Community solutions without state/corporate mediation
-   **Anti-Capitalist** - Rejecting profit-driven resource distribution
-   **Collective Care** - Supporting the most vulnerable community members
-   **Workers' Power** - Centering working-class struggle and liberation

### Digital Security for Activists

-   **Rate Limiting** - Protects against coordinated attacks
-   **Input Sanitization** - Prevents infiltration attempts
-   **CORS Protection** - Secure cross-origin communication
-   **Docker Isolation** - Containerized security boundaries
-   **AGPL-3.0 License** - Ensures revolutionary tools remain free

### Community-Centered Design

-   **Accessibility First** - No barriers to community participation
-   **Mobile Optimized** - Organizing tools work anywhere
-   **Multi-language Ready** - Prepared for internationalization
-   **Resource Focused** - Practical tools over performative content

## ✊ Contributing to the Revolution

We welcome contributions from fellow organizers and activists!

### How to Contribute

1. **Fork the repository** - Make it yours, comrade
2. **Create a feature branch** - `git checkout -b feature/revolutionary-feature`
3. **Follow socialist principles** - Code for the people, not profit
4. **Test your changes** - Ensure reliability for the community
5. **Submit a Pull Request** - Share your contributions with the collective

### Contribution Areas

-   **Community Resources** - Add local mutual aid networks
-   **Political Education** - Expand socialist theory content
-   **Accessibility** - Improve community access
-   **Security** - Strengthen activist protections
-   **Translation** - Make tools available in multiple languages

### Code of Conduct

-   **Solidarity First** - Support fellow contributors
-   **Anti-Oppression** - Challenge all forms of domination
-   **Collective Decision Making** - Major changes discussed collectively
-   **Security Conscious** - Protect community members and activists

## 📄 License

This project is licensed under the **GNU Affero General Public License v3.0** -
see the [LICENSE](LICENSE) file for details.

**Why AGPL-3.0?** This copyleft license ensures that revolutionary organizing
tools remain free and accessible to all communities. Any modifications, even
when used over a network, must be shared back with the community. This prevents
corporate co-optation of mutual aid technologies.

## 🔗 Resources & Links

### Project Links

-   **Repository**:
    [GitHub](https://github.com/evanWh1te/cville-kitchen-website)
-   **Issues**:
    [Bug Reports & Feature Requests](https://github.com/evanWh1te/cville-kitchen-website/issues)
-   **Live Site**: _[Coming Soon - Post-Deployment]_

### Community Resources

-   **Charlottesville Access Project** - Resource compilation source
-   **Local Mutual Aid Networks** - Connected through the platform
-   **Socialist Organizations** - Building revolutionary community

### Technical Documentation

-   **Docker Hub** - Container images
-   **Deployment Guides** - Production setup instructions
-   **API Documentation** - Backend endpoint details

---

## 🚩 Join the Revolution

**This platform is built by organizers, for organizers.**

**Built with ✊ for revolutionary community organizing and collective
liberation.**
