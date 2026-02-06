/**
 * =============================================================================
 * MAIN.JS - Application Entry Point
 * =============================================================================
 * 
 * This is the main entry point for our portfolio application.
 * It initializes all modules and manages the overall application state.
 * 
 * TABLE OF CONTENTS:
 * 1. Imports
 * 2. DOM Elements
 * 3. Application State
 * 4. Initialization
 * 5. Event Listeners
 * 6. Mode Switching Functions
 * 
 * =============================================================================
 */

// =============================================================================
// 1. IMPORTS
// =============================================================================

// Import our styles (Vite handles SCSS compilation)
import './styles/main.scss';

// Import our custom modules
import { Car } from './modules/car.js';
import { Garden } from './modules/garden.js';
import { Navigation } from './modules/navigation.js';
import { InfoSpots } from './modules/infoSpots.js';

// Import GSAP for animations
import { gsap } from 'gsap';


// =============================================================================
// 2. DOM ELEMENTS
// =============================================================================
// Cache DOM elements for better performance (avoid repeated querySelector calls)

const elements = {
  // Screens
  loadingScreen: document.getElementById('loading-screen'),
  welcomeModal: document.getElementById('welcome-modal'),
  quickView: document.getElementById('quick-view'),
  gardenWorld: document.getElementById('garden-world'),
  
  // Buttons
  btnExplore: document.getElementById('btn-explore'),
  btnQuick: document.getElementById('btn-quick'),
  btnSwitchToExplore: document.getElementById('btn-switch-to-explore'),
  btnSwitchToQuick: document.getElementById('btn-switch-to-quick'),
  
  // Garden elements
  gardenContainer: document.getElementById('garden-container'),
  car: document.getElementById('car'),
  
  // Info popup
  infoPopup: document.getElementById('info-popup'),
  infoPopupClose: document.getElementById('info-popup-close'),
  infoPopupTitle: document.getElementById('info-popup-title'),
  infoPopupBody: document.getElementById('info-popup-body'),
};


// =============================================================================
// 3. APPLICATION STATE
// =============================================================================
// Central state object to track the current state of the application

const state = {
  // Current mode: 'loading' | 'welcome' | 'explore' | 'quick'
  currentMode: 'loading',
  
  // Is the info popup currently open?
  isPopupOpen: false,
  
  // Has the user seen the welcome modal before? (for returning visitors)
  hasSeenWelcome: false,
  
  // Module instances (initialized later)
  car: null,
  garden: null,
  navigation: null,
  infoSpots: null,
};


// =============================================================================
// 4. INITIALIZATION
// =============================================================================

/**
 * Initialize the application
 * Called when the DOM is fully loaded
 */
function init() {
  console.log('🚀 Portfolio initializing...');
  
  // Step 1: Initialize the garden (background, decorations)
  state.garden = new Garden(elements.gardenContainer);
  
  // Step 2: Initialize the car with starting position
  // Car starts in the MIDDLE OF THE ROAD
  // Road is at Y: 950-1050, so car center should be around Y: 980
  state.car = new Car(elements.car, {
    startX: 100,   // Near the left side of the garden
    startY: 980,   // Middle of the road (road is at 950-1050)
    speed: 5,      // Movement speed
  });
  
  // Step 3: Initialize info spots (places to visit in the garden)
  state.infoSpots = new InfoSpots({
    spots: document.querySelectorAll('.info-spot'),
    onSpotReached: handleSpotReached,
  });
  
  // Step 4: Initialize keyboard navigation
  // FIXED: Added onStopDirection to properly handle individual key releases
  state.navigation = new Navigation({
    onMove: (direction) => state.car.move(direction),
    onStopDirection: (direction) => state.car.stopDirection(direction),
    onStop: () => state.car.stop(),
  });
  
  // Step 5: Setup event listeners
  setupEventListeners();
  
  // Step 6: Simulate loading (or wait for actual assets to load)
  simulateLoading();
}

/**
 * Simulate loading screen
 * In production, you'd wait for actual assets to load
 */
function simulateLoading() {
  // Minimum loading time for smooth UX (adjust as needed)
  const MIN_LOADING_TIME = 1500; // 1.5 seconds
  
  setTimeout(() => {
    hideLoadingScreen();
  }, MIN_LOADING_TIME);
}

/**
 * Hide the loading screen and show welcome modal
 */
function hideLoadingScreen() {
  // Animate loading screen out
  gsap.to(elements.loadingScreen, {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      elements.loadingScreen.style.display = 'none';
      showWelcomeModal();
    }
  });
}

/**
 * Show the welcome modal with entrance animation
 */
function showWelcomeModal() {
  state.currentMode = 'welcome';
  elements.welcomeModal.setAttribute('aria-hidden', 'false');
  elements.welcomeModal.style.display = 'flex';
  
  // Animate modal content in
  gsap.from('.modal-content', {
    y: 50,
    opacity: 0,
    duration: 0.6,
    ease: 'back.out(1.7)'
  });
}


// =============================================================================
// 5. EVENT LISTENERS
// =============================================================================

/**
 * Setup all event listeners
 */
function setupEventListeners() {
  // -----------------------------------------
  // Welcome Modal Buttons
  // -----------------------------------------
  
  // "Explore the Garden" button
  elements.btnExplore.addEventListener('click', () => {
    switchToMode('explore');
  });
  
  // "Quick View" button
  elements.btnQuick.addEventListener('click', () => {
    switchToMode('quick');
  });
  
  // -----------------------------------------
  // Mode Switching Buttons
  // -----------------------------------------
  
  // Switch from Quick View to Explore
  elements.btnSwitchToExplore.addEventListener('click', () => {
    switchToMode('explore');
  });
  
  // Switch from Explore to Quick View
  elements.btnSwitchToQuick.addEventListener('click', () => {
    switchToMode('quick');
  });
  
  // -----------------------------------------
  // Info Popup
  // -----------------------------------------
  
  // Close popup button
  elements.infoPopupClose.addEventListener('click', closeInfoPopup);
  
  // Close popup when clicking outside
  elements.infoPopup.addEventListener('click', (e) => {
    if (e.target === elements.infoPopup) {
      closeInfoPopup();
    }
  });
  
  // Close popup with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.isPopupOpen) {
      closeInfoPopup();
    }
  });
  
  // -----------------------------------------
  // Window Events
  // -----------------------------------------
  
  // Handle window resize
  window.addEventListener('resize', handleResize);
  
  // Handle visibility change (pause when tab is hidden)
  document.addEventListener('visibilitychange', handleVisibilityChange);
}

/**
 * Handle window resize
 */
function handleResize() {
  // Update garden dimensions
  if (state.garden) {
    state.garden.updateDimensions();
  }
  
  // Update car boundaries
  if (state.car) {
    state.car.updateBoundaries();
  }
}

/**
 * Handle tab visibility change
 * Pause/resume game when user switches tabs
 */
function handleVisibilityChange() {
  if (document.hidden) {
    // Tab is hidden - pause the car
    if (state.car) {
      state.car.pause();
    }
  } else {
    // Tab is visible - resume
    if (state.car) {
      state.car.resume();
    }
  }
}


// =============================================================================
// 6. MODE SWITCHING FUNCTIONS
// =============================================================================

/**
 * Switch between different view modes
 * @param {string} mode - The mode to switch to: 'explore' | 'quick'
 */
function switchToMode(mode) {
  console.log(`🔄 Switching to ${mode} mode`);
  
  // Hide welcome modal if visible
  if (state.currentMode === 'welcome') {
    gsap.to(elements.welcomeModal, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        elements.welcomeModal.style.display = 'none';
        elements.welcomeModal.setAttribute('aria-hidden', 'true');
      }
    });
  }
  
  // Handle mode-specific transitions
  switch (mode) {
    case 'explore':
      activateExploreMode();
      break;
    case 'quick':
      activateQuickMode();
      break;
  }
  
  state.currentMode = mode;
}

/**
 * Activate the interactive garden mode
 */
function activateExploreMode() {
  // Hide quick view
  elements.quickView.setAttribute('aria-hidden', 'true');
  gsap.to(elements.quickView, {
    opacity: 0,
    duration: 0.3,
    onComplete: () => {
      elements.quickView.style.display = 'none';
    }
  });
  
  // Show garden world
  elements.gardenWorld.style.display = 'block';
  elements.gardenWorld.setAttribute('aria-hidden', 'false');
  gsap.fromTo(elements.gardenWorld, 
    { opacity: 0 },
    { opacity: 1, duration: 0.5 }
  );
  
  // Enable keyboard navigation
  if (state.navigation) {
    state.navigation.enable();
  }
  
  // NOTE: We do NOT reset car position here anymore!
  // The car remembers its position between mode switches.
  // Only call state.car.reset() if you want to start fresh.
}

/**
 * Activate the quick/professional view mode
 */
function activateQuickMode() {
  // Hide garden world
  elements.gardenWorld.setAttribute('aria-hidden', 'true');
  gsap.to(elements.gardenWorld, {
    opacity: 0,
    duration: 0.3,
    onComplete: () => {
      elements.gardenWorld.style.display = 'none';
    }
  });
  
  // Disable keyboard navigation (so user can scroll normally)
  if (state.navigation) {
    state.navigation.disable();
  }
  
  // Show quick view
  elements.quickView.style.display = 'block';
  elements.quickView.setAttribute('aria-hidden', 'false');
  gsap.fromTo(elements.quickView,
    { opacity: 0 },
    { opacity: 1, duration: 0.5 }
  );
}


// =============================================================================
// 7. INFO SPOT HANDLERS
// =============================================================================

/**
 * Handle when the car reaches an info spot
 * @param {string} spotId - The ID of the spot reached
 */
function handleSpotReached(spotId) {
  console.log(`📍 Reached spot: ${spotId}`);
  
  // Get content for this spot
  const content = getSpotContent(spotId);
  
  // Show the popup
  showInfoPopup(content.title, content.body);
}

/**
 * Get content for a specific info spot
 * @param {string} spotId - The spot ID
 * @returns {object} - { title, body } content object
 */
function getSpotContent(spotId) {
  // ===========================================
  // CUSTOMIZE YOUR CONTENT HERE!
  // ===========================================
  const content = {
    'spot-about': {
      title: '👤 About Me',
      body: `
        <p>Hello! I'm <strong>Your Name</strong>, a passionate Frontend Developer.</p>
        <p>I love creating interactive web experiences that delight users.</p>
        <p>When I'm not coding, you can find me [your hobbies].</p>
      `
    },
    'spot-skills': {
      title: '⚡ My Skills',
      body: `
        <ul>
          <li><strong>Frontend:</strong> HTML, CSS, JavaScript, React</li>
          <li><strong>Styling:</strong> SCSS, Tailwind, CSS Animations</li>
          <li><strong>Tools:</strong> Git, Vite, Figma</li>
          <li><strong>Other:</strong> Node.js, REST APIs</li>
        </ul>
      `
    },
    'spot-projects': {
      title: '💼 My Projects',
      body: `
        <div class="project-list">
          <div class="project-item">
            <h3>Project 1</h3>
            <p>Description of your project...</p>
            <a href="#" target="_blank">View Project →</a>
          </div>
          <div class="project-item">
            <h3>Project 2</h3>
            <p>Description of your project...</p>
            <a href="#" target="_blank">View Project →</a>
          </div>
        </div>
      `
    },
    'spot-contact': {
      title: '📧 Get in Touch',
      body: `
        <p>I'd love to hear from you!</p>
        <ul class="contact-links">
          <li>📧 <a href="mailto:your@email.com">your@email.com</a></li>
          <li>💼 <a href="https://linkedin.com/in/yourprofile" target="_blank">LinkedIn</a></li>
          <li>🐙 <a href="https://github.com/yourusername" target="_blank">GitHub</a></li>
        </ul>
      `
    },
  };
  
  return content[spotId] || { title: 'Info', body: 'Content not found.' };
}

/**
 * Show the info popup with content
 * @param {string} title - Popup title
 * @param {string} body - Popup HTML content
 */
function showInfoPopup(title, body) {
  // Set content
  elements.infoPopupTitle.textContent = title;
  elements.infoPopupBody.innerHTML = body;
  
  // Show popup
  elements.infoPopup.style.display = 'flex';
  elements.infoPopup.setAttribute('aria-hidden', 'false');
  state.isPopupOpen = true;
  
  // Pause car movement while popup is open
  if (state.navigation) {
    state.navigation.disable();
  }
  
  // Animate in
  gsap.fromTo('.info-popup-content',
    { scale: 0.8, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
  );
}

/**
 * Close the info popup
 */
function closeInfoPopup() {
  // Animate out
  gsap.to('.info-popup-content', {
    scale: 0.8,
    opacity: 0,
    duration: 0.2,
    onComplete: () => {
      elements.infoPopup.style.display = 'none';
      elements.infoPopup.setAttribute('aria-hidden', 'true');
      state.isPopupOpen = false;
      
      // Re-enable navigation
      if (state.currentMode === 'explore' && state.navigation) {
        state.navigation.enable();
      }
    }
  });
}


// =============================================================================
// START THE APPLICATION
// =============================================================================
// Wait for DOM to be fully loaded before initializing

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // DOM is already loaded
  init();
}
