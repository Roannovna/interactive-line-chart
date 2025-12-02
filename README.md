# Interactive Line Chart

This project implements an interactive line chart using React, TypeScript, and Recharts. It visualizes conversion data with various interactive features and customization options.

## Chosen Visualization Library

**Recharts** (`recharts`) was chosen for this project because:

- It is a composable charting library built on React components.
- It uses SVG for rendering, ensuring high-quality scaling and performance.
- It offers great flexibility for customization (custom tooltips, axes, legends).
- It has excellent documentation and community support.

## Implemented Features

### Core Features

- **Interactive Visualization:** Displays conversion rates over time using Line or Area charts.
- **Time Period Selection:** Toggle between **Day** and **Week** data views.
- **Variation Filtering:** Filter the chart to show specific data variations or all variations at once.
- **Custom Tooltips:** Hover over data points to see detailed information with a custom-styled tooltip.
- **Responsive Design:** The chart adapts to the container size.

### Bonus & Advanced Features

- **Chart Type Switching:** Users can switch between different chart styles:
  - Linear Line
  - Smooth Line
  - Smooth Line with Outline (Visual enhancement)
  - Area Chart
- **Zoom Controls:** Dedicated **Zoom In** and **Zoom Out** buttons to explore data in detail.
- **Fullscreen Mode:** Toggle fullscreen view for an immersive analysis experience.
- **Reset View:** Quickly reset zoom levels and exit fullscreen mode.
- **Brush/Selection (Internal):** The zoom functionality is implemented using data slicing (brushing logic) for performance.

## Local Setup Instructions

Follow these steps to set up and run the project locally:

### Prerequisites

- Node.js (v16 or higher recommended)
- npm (or yarn/pnpm)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd interactive-line-chart
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Development

To start the development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`).

### Production Build

To build the project for production:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

### Linting

To run ESLint and check for code quality issues:

```bash
npm run lint
```
