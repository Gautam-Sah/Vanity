# Vanity - AI-Powered Fact Checker (Client)

A modern React frontend for the Vanity fact-checking application, built with Vite, Tailwind CSS, and DaisyUI.

## Features

- Clean and responsive UI with multiple theme options
- Real-time fact-checking using AI
- Interactive results with verdict badges
- Loading states and error handling
- Mobile-friendly design

## Tech Stack

- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind CSS

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the Client directory:
```bash
VITE_API_URL=http://localhost:8080
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173` (or the port shown in the terminal)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Themes

The app includes 5 built-in themes:
- Light
- Dark
- Cupcake
- Cyberpunk (default)
- Synthwave

Use the theme selector button in the top-right corner to switch themes.

## Project Structure

```
Client/
├── src/
│   ├── services/
│   │   └── api.js          # API service for fact-checking
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles with Tailwind
├── public/                 # Static assets
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
└── vite.config.js          # Vite configuration
```

## API Integration

The app connects to the backend API at the URL specified in `VITE_API_URL`. Make sure your backend server is running on port 8080 (or update the environment variable accordingly).

The API endpoint used:
- `POST /fact-check` - Submits a claim for fact-checking

## Usage

1. Enter a claim in the text area
2. Click "Check Fact" to submit
3. Wait for the AI to analyze the claim
4. View the results with a verdict badge (TRUE/FALSE/UNSURE/MIXED)
5. Read the detailed analysis

## Notes

- The app uses the Fetch API for HTTP requests
- Error handling is implemented for API failures
- Loading states provide visual feedback during API calls
- Results include a disclaimer about AI-generated content
