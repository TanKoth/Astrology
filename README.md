# 🌟 Astrology Project

A comprehensive astrology application that provides detailed astrological calculations, predictions, and insights based on celestial movements and traditional astrological principles.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Astrological Calculations](#astrological-calculations)
- [Supported Astrological Systems](#supported-astrological-systems)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## 🌍 Overview

This Astrology project is a sophisticated application designed to provide accurate astrological calculations and interpretations. It combines traditional astrological wisdom with modern computational methods to deliver personalized horoscopes, birth chart analysis, and celestial event predictions.

### Key Capabilities

- **Birth Chart Generation**: Create detailed natal charts with precise planetary positions
- **Horoscope Predictions**: Daily, weekly, monthly, and yearly forecasts
- **Compatibility Analysis**: Relationship compatibility based on astrological principles
- **Transit Analysis**: Track current planetary movements and their effects
- **Historical Data**: Access to extensive astronomical and astrological databases
- **Multi-Cultural Support**: Various astrological traditions and calendar systems

## ✨ Features

### Core Features

- 🎯 **Precise Calculations**: Swiss Ephemeris integration for accurate planetary positions
- 📊 **Interactive Charts**: Beautiful, interactive birth charts and transit diagrams
- 🔮 **Predictive Analytics**: Advanced algorithms for horoscope generation
- 🌐 **Multi-Language Support**: Internationalization for global accessibility
- 📱 **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- 🎨 **Customizable Themes**: Multiple UI themes and chart styles

### Advanced Features

- **Progressions & Directions**: Secondary progressions and solar arc directions
- **Composite Charts**: Relationship analysis through composite and synastry charts
- **Electional Astrology**: Find auspicious times for important events
- **Mundane Astrology**: World events and geographical location analysis
- **Asteroid Integration**: Include asteroids and fixed stars in calculations
- **Custom Orb Settings**: Adjustable aspect orbs for personalized interpretations

## 📁 Project Structure

```
Astrology/
├── src/                          # Source code
│   ├── components/              # Reusable UI components
│   │   ├── Charts/             # Chart rendering components
│   │   ├── Forms/              # Input forms and validators
│   │   └── UI/                 # General UI components
│   ├── services/               # Business logic and API services
│   │   ├── calculations/       # Astrological calculation engines
│   │   ├── ephemeris/         # Ephemeris data handling
│   │   └── interpretations/   # Text interpretation generators
│   ├── utils/                  # Utility functions and helpers
│   ├── data/                   # Static data and configurations
│   │   ├── ephemeris/         # Ephemeris data files
│   │   ├── timezones/         # Timezone databases
│   │   └── interpretations/   # Interpretation text databases
│   └── assets/                 # Images, fonts, and static assets
├── tests/                      # Test suites
│   ├── unit/                  # Unit tests
│   ├── integration/           # Integration tests
│   └── e2e/                   # End-to-end tests
├── docs/                       # Documentation
│   ├── api/                   # API documentation
│   ├── user-guide/            # User manuals
│   └── development/           # Developer guides
├── config/                     # Configuration files
├── scripts/                    # Build and utility scripts
└── public/                     # Public assets and entry points
```

## 🚀 Installation

### Prerequisites

- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/astrology.git
   cd astrology
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Initialize the database**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Access the application**
   Open your browser and navigate to `http://localhost:3000`


## 🎯 Usage

### Basic Usage

1. **Create a Birth Chart**
   - Enter birth date, time, and location
   - Generate comprehensive natal chart
   - View planetary positions and aspects

2. **Get Daily Horoscope**
   - Select your zodiac sign
   - View personalized daily predictions
   - Access extended forecasts

3. **Compatibility Analysis**
   - Input two birth charts
   - Generate synastry and composite charts
   - Receive relationship insights


### Calculation Engine

The project uses sophisticated algorithms for:

- **Planetary Positions**: Swiss Ephemeris for sub-second accuracy
- **House Systems**: Placidus, Koch, Equal House, and more
- **Aspect Calculations**: Traditional and modern aspects with customizable orbs
- **Progression Methods**: Secondary progressions and solar arcs
- **Return Charts**: Solar, lunar, and planetary returns

### Supported Coordinate Systems

- **Sidereal Zodiac**: Vedic and traditional systems
- **Heliocentric**: Sun-centered calculations
- **Geocentric**: Earth-centered traditional approach

## 🌟 Supported Astrological Systems

### Vedic Astrology (Jyotish)
- Sidereal zodiac calculations
- Nakshatra (lunar mansion) analysis
- Dasha (planetary period) systems
- Divisional chart (Varga) support
  
## ⚙️ Configuration

### Environment Variables

```bash
# .env file
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/astrology
EPHEMERIS_PATH=/path/to/ephemeris/files
API_KEY=your-api-key
TIMEZONE_API_KEY=your-timezone-api-key
```

### Application Configuration

```javascript
// config/app.js
module.exports = {
  defaultHouseSystem: 'placidus',
  defaultZodiac: 'tropical',
  aspectOrbs: {
    conjunction: 8,
    opposition: 8,
    trine: 6,
    square: 6,
    sextile: 4
  },
  supportedLanguages: ['en', 'hi', 'mr']
};
```

## 🤝 Contributing

We welcome contributions to improve the Astrology project!

### Development Setup

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests for new functionality**
5. **Run the test suite**
   ```bash
   npm test
   ```
6. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
7. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
8. **Open a Pull Request**

### Code Style Guidelines

- Use ESLint and Prettier for code formatting
- Follow semantic commit message conventions
- Write comprehensive tests for new features
- Document all public APIs and functions

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

### Test Structure

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test API endpoints and service interactions
- **E2E Tests**: Test complete user workflows
- **Performance Tests**: Validate calculation speed and accuracy

## 🚀 Deployment

### Production Build

```bash
# Create production build
npm run build

# Start production server
npm start
```

### Docker Deployment

```bash
# Build production image
docker build -t astrology-app .

# Run container
docker run -p 3000:3000 astrology-app
```

### Cloud Deployment

The application supports deployment on:
- **Render**: Full-stack application 

## 🔧 Troubleshooting

### Performance Optimization

- Enable calculation result caching
- Implement lazy loading for chart components
- Optimize database queries

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Made with ❤️ for the astrology community*
