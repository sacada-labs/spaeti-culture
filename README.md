# Sit-in Spaeti 🍺

A mobile-first web application to find Spaetis (convenience stores) in Berlin that have sitting places.

## Features

- 🗺️ Interactive map showing all Spaetis with seating
- 🔍 Search functionality by name or location
- 🏠 Filter by seating type (Indoor, Outdoor, Both)
- 📱 Mobile-optimized design for on-the-go use
- 📋 List view for easy browsing
- 🎨 Modern, beautiful UI/UX

## Tech Stack

- **React 18** - UI framework
- **TanStack Query (React Query)** - Data fetching and state management
- **Vite** - Build tool and dev server
- **Leaflet.js** - Map functionality
- **OpenStreetMap** - Map tiles (free and open-source)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
  ├── components/     # React components
  │   ├── Header.jsx
  │   ├── SearchBar.jsx
  │   ├── Filters.jsx
  │   ├── Map.jsx
  │   ├── ListPanel.jsx
  │   └── Loading.jsx
  ├── hooks/          # Custom React hooks
  │   ├── useSpaetis.js
  │   └── useFilteredSpaetis.js
  ├── data/           # Data and API functions
  │   └── spaetiData.js
  ├── App.jsx         # Main app component
  ├── main.jsx        # Entry point
  └── index.css       # Global styles
```

## Mobile Usage

The app is optimized for mobile devices:
- Touch-friendly interface
- Responsive design
- Fast loading
- Easy navigation while walking

## Data

Currently uses dummy data with 10 sample Spaetis across Berlin. Real data can be integrated later by updating the `fetchSpaetis` function in `src/data/spaetiData.js`.

## Routing Service

The app uses OSRM's demo server for routing by default, which is **NOT suitable for production**. For production use, please configure your own routing service. See [ROUTING.md](./ROUTING.md) for details.

## Browser Support

Works on all modern browsers including:
- Chrome/Edge
- Firefox
- Safari
- Mobile browsers

## License

MIT
