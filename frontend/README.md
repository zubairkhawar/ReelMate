# ReelMate Frontend

A modern, responsive landing page for ReelMate - an AI-powered UGC video generation platform for e-commerce brands.

## Features

- 🎨 **Modern Design**: Clean, minimalistic UI with smooth animations
- 📱 **Responsive**: Mobile-first design that works on all devices
- 🚀 **Performance**: Built with Next.js 14 and optimized for speed
- ✨ **Animations**: Smooth transitions and micro-interactions with Framer Motion
- 🎯 **Conversion Focused**: Optimized landing page with clear CTAs

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Inter (Google Fonts)
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/          # Reusable components
│   ├── Hero.tsx        # Hero section
│   ├── Features.tsx    # Features section
│   ├── DemoVideo.tsx   # Demo video section
│   ├── HowItWorks.tsx  # How it works section
│   ├── Testimonials.tsx # Testimonials carousel
│   ├── Pricing.tsx     # Pricing plans
│   └── Footer.tsx      # Footer
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── styles/             # Additional styles
```

## Components

### Hero Section
- Main headline and subheadline
- Two CTA buttons (Start Free Trial, Watch Demo)
- Animated product mockup with floating elements

### Features Section
- 4 feature cards with icons and descriptions
- Smooth hover animations and transitions

### Demo Video Section
- Video preview placeholder
- Video information and stats
- Performance metrics below

### How It Works
- 3-step process explanation
- Connected flow with visual elements
- CTA section for conversion

### Testimonials
- Customer testimonial carousel
- Auto-rotating with manual controls
- Overall platform statistics

### Pricing
- 3-tier pricing structure
- Monthly/yearly toggle with savings
- Feature comparison

### Footer
- Organized link sections
- Social media links
- Brand information

## Customization

### Colors
The design uses a consistent color palette:
- Primary: Blue (#3B82F6) to Purple (#8B5CF6)
- Background: Off-white (#FAFAFA)
- Text: Dark gray (#111827)
- Accents: Various gradients for visual appeal

### Typography
- Font Family: Inter (Google Fonts)
- Weights: 300, 400, 500, 600, 700, 800
- Responsive sizing with Tailwind's text utilities

### Animations
- Framer Motion for smooth transitions
- Staggered animations for component sequences
- Hover effects and micro-interactions

## Performance

- Optimized images and assets
- Lazy loading for animations
- Efficient CSS with Tailwind
- Next.js optimization features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the ReelMate platform.
