# Sign-Up Form with Tailwind CSS

A modern, responsive sign-up form built with React and Tailwind CSS, converted from vanilla HTML/CSS/JavaScript.

## Features

- ✨ **Modern Design**: Beautiful UI with custom colors and typography
- 🔒 **Password Visibility Toggle**: Click eye icons to show/hide passwords
- 📍 **Location Picker**: Interactive location icon with fallback handling
- 🔗 **Social Login**: Google, Facebook, and Twitter integration buttons
- ♿ **Accessible**: Full keyboard navigation and ARIA labels
- 📱 **Responsive**: Built with Tailwind CSS for consistent styling
- 🎨 **Custom Styling**: Custom color palette and typography

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone or download this project
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Project Structure

```
├── src/
│   ├── SignUp.jsx          # Main React component
│   ├── main.jsx           # React entry point
│   └── index.css          # Tailwind CSS imports
├── tailwind.config.js     # Tailwind configuration
├── postcss.config.js      # PostCSS configuration
├── vite.config.js         # Vite configuration
└── package.json           # Dependencies and scripts
```

## Key Features Implemented

### Password Visibility Toggle
- Click the eye icons to toggle password visibility
- Supports both password and confirm password fields
- Automatic icon switching (open/closed eye)
- Keyboard accessible (Enter/Space keys)

### Interactive Elements
- **Sign-Up Button**: Click to submit form
- **Log-in Link**: Navigate to login page
- **Location Icon**: Click to open location picker
- **Social Buttons**: Google, Facebook, Twitter login

### Image Fallback System
- Automatic fallback for location icon
- SVG fallback if no images are found
- Graceful degradation for missing assets

## Customization

### Colors
The design uses a custom color palette defined in `tailwind.config.js`:
- `civix-primary`: #2B4D4A
- `civix-secondary`: #64B3AD
- `civix-accent`: #407470
- `civix-light`: #D7E9ED
- `civix-bg-light`: #CBDEEC

### Typography
Custom fonts are configured:
- **Perpetua**: Main body text
- **Jacques Francois**: Headings and buttons
- **Copperplate Gothic Light**: Alternative sign-in text

### Sizing
All dimensions are preserved from the original design using custom Tailwind utilities.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the MIT License.