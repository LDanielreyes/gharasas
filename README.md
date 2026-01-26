# Ghara - Modern Real Estate Platform

Ghara is a modern, responsive real estate application designed to make finding your dream home an effortless experience. Built with performance and user experience in mind, it features a sleek UI, interactive maps, and smooth animations.

## Features

-   🏠 **Property Listings**: Browse a curated list of properties with detailed information.
-   🗺️ **Interactive Maps**: View property locations using integrated Leaflet maps.
-   ✨ **Modern UI/UX**: Built with Tailwind CSS and Framer Motion for a premium feel.
-   📱 **Fully Responsive**: Optimized for all devices, from mobile to desktop.

## Tech Stack

-   **Frontend**: React 19, Vite
-   **Styling**: Tailwind CSS 4, Motion (Framer Motion)
-   **Icons**: Lucide React
-   **Maps**: Leaflet, React Leaflet
-   **Routing**: React Router DOM

## Getting Started

### Prerequisites

-   Node.js (v18 or higher recommended)
-   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/ghara.git
    cd ghara
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:5173](http://localhost:5173) in your browser.

## Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Docker Deployment

This project includes a `Dockerfile` for containerized deployment using Nginx.

1.  Build the image:
    ```bash
    docker build -t ghara .
    ```

2.  Run the container:
    ```bash
    docker run -p 8080:80 ghara
    ```

Access the app at [http://localhost:8080](http://localhost:8080).
