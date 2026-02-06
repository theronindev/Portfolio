# 🚗 Interactive Portfolio

An interactive portfolio website featuring a car that drives through a garden landscape. Users can explore different information spots to learn about you!

## ✨ Features

- **Dual Mode**: Choose between Interactive (garden exploration) or Quick View (traditional)
- **Keyboard Controls**: Navigate using arrow keys or WASD
- **Smooth Animations**: Powered by GSAP for buttery-smooth movement
- **Responsive Design**: Works on desktop and tablets
- **Well-Commented Code**: Easy to understand and modify

## 🚀 Quick Start

```bash
# 1. Navigate to the project folder
cd portfolio

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open http://localhost:3000 in your browser
```

## 📁 Project Structure

```
portfolio/
├── index.html              # Main HTML file
├── package.json            # Dependencies & scripts
├── vite.config.js          # Vite configuration
├── public/                 # Static assets
│   └── favicon.svg         # Site icon
└── src/
    ├── main.js             # Application entry point
    ├── styles/
    │   ├── main.scss       # Main stylesheet
    │   └── _variables.scss # Design tokens (colors, sizes)
    ├── modules/
    │   ├── car.js          # Car movement & physics
    │   ├── garden.js       # Garden environment
    │   ├── navigation.js   # Keyboard controls
    │   └── infoSpots.js    # Information spot detection
    └── assets/
        ├── images/         # Your images
        └── sprites/        # Game sprites
```

## 🎮 Controls

| Key | Action |
|-----|--------|
| ↑ or W | Move Up |
| ↓ or S | Move Down |
| ← or A | Move Left |
| → or D | Move Right |
| ESC | Close popup |

## 🎨 Customization

### Change Colors

Edit `src/styles/_variables.scss`:

```scss
// Main theme color
$color-primary: #4a7c59;

// Sky gradient
$color-sky-gradient-top: #5fa8d3;
$color-sky-gradient-bottom: #b8e0f0;
```

### Update Your Information

Edit the `getSpotContent()` function in `src/main.js`:

```javascript
const content = {
  'spot-about': {
    title: '👤 About Me',
    body: `<p>Your info here...</p>`
  },
  // ... more spots
};
```

### Adjust Info Spot Positions

Edit `src/styles/main.scss`:

```scss
#spot-about {
  top: 300px;
  left: 400px;
}
```

### Change Car Speed

Edit the car initialization in `src/main.js`:

```javascript
state.car = new Car(elements.car, {
  startX: 200,
  startY: 300,
  speed: 8,  // Increase for faster movement
});
```

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## 📦 Technologies Used

- **Vite** - Fast build tool & dev server
- **SCSS** - CSS with superpowers
- **GSAP** - Professional-grade animations
- **Vanilla JS** - No framework overhead

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy! ✅

### Netlify

1. Run `npm run build`
2. Drag the `dist` folder to [netlify.com](https://netlify.com)

### Manual

1. Run `npm run build`
2. Upload contents of `dist` folder to any static host

## 📝 Tips for a Great Portfolio

1. **Keep it Fast**: Don't overload with huge images
2. **Mobile Fallback**: Consider adding touch controls
3. **Accessibility**: Test with keyboard-only navigation
4. **Real Projects**: Link to actual work, not placeholders
5. **Contact Info**: Make it easy to reach you

## 🐛 Troubleshooting

**Car won't move?**
- Make sure you clicked "Explore the Garden" mode
- Check if the browser tab is focused

**Styles not updating?**
- Clear browser cache
- Restart the dev server

**Build errors?**
- Delete `node_modules` and run `npm install` again

## 📄 License

MIT License - Feel free to use this for your own portfolio!

---

Made with ❤️ and lots of ☕

Good luck with your portfolio! 🚀
