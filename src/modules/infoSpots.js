/**
 * =============================================================================
 * INFO-SPOTS.JS - Information Spot Detection Module
 * =============================================================================
 * 
 * This module handles the information spots in the garden:
 * - Detecting when the car is near a spot
 * - Triggering callbacks when spots are reached
 * - Visual feedback for active/visited spots
 * 
 * USAGE:
 * const infoSpots = new InfoSpots({
 *   spots: document.querySelectorAll('.info-spot'),
 *   onSpotReached: (spotId) => showPopup(spotId)
 * });
 * 
 * =============================================================================
 */

/**
 * InfoSpots class - Manages information spot interactions
 */
export class InfoSpots {
  /**
   * Create a new InfoSpots instance
   * @param {Object} options - Configuration options
   * @param {NodeList|Array} options.spots - The spot DOM elements
   * @param {Function} options.onSpotReached - Callback when spot is reached
   * @param {number} options.triggerDistance - Distance to trigger spot (default: 80)
   */
  constructor(options = {}) {
    // -------------------------------------------------------------------------
    // PROPERTIES
    // -------------------------------------------------------------------------
    
    // DOM elements for each spot
    this.spots = Array.from(options.spots || []);
    
    // Callback when a spot is reached
    this.onSpotReached = options.onSpotReached || (() => {});
    
    // Distance at which spot triggers (in pixels)
    this.triggerDistance = options.triggerDistance || 80;
    
    // Track which spots have been visited
    this.visitedSpots = new Set();
    
    // Track the currently active spot (to prevent repeat triggers)
    this.currentSpot = null;
    
    // Cooldown to prevent rapid re-triggering
    this.cooldown = false;
    this.cooldownDuration = 1000; // 1 second
    
    // Spot data (positions extracted from DOM)
    this.spotData = [];
    
    // -------------------------------------------------------------------------
    // INITIALIZATION
    // -------------------------------------------------------------------------
    
    this.init();
  }
  
  /**
   * Initialize info spots
   */
  init() {
    console.log('📍 InfoSpots initialized with', this.spots.length, 'spots');
    
    // Extract position data from DOM elements
    this.extractSpotData();
    
    // Setup car tracking
    this.setupCarTracking();
    
    // Add click handlers for spots (alternative to driving)
    this.setupClickHandlers();
  }
  
  /**
   * Extract position data from spot DOM elements
   */
  extractSpotData() {
    this.spotData = this.spots.map(spot => {
      // Get computed position
      const rect = spot.getBoundingClientRect();
      
      // Get position from inline styles or computed styles
      const style = window.getComputedStyle(spot);
      const left = parseInt(style.left) || 0;
      const top = parseInt(style.top) || 0;
      
      return {
        id: spot.id,
        element: spot,
        x: left + 50, // Center of spot (assuming ~100px width)
        y: top + 50,  // Center of spot
        dataInfo: spot.dataset.info,
      };
    });
    
    console.log('📍 Spot positions extracted:', this.spotData.map(s => s.id));
  }
  
  /**
   * Setup car tracking to detect when car reaches spots
   */
  setupCarTracking() {
    const car = document.getElementById('car');
    
    if (car) {
      car.addEventListener('carMove', (e) => {
        const { x, y } = e.detail;
        this.checkCarPosition(x, y);
      });
    }
  }
  
  /**
   * Setup click handlers for spots
   * Allows users to click directly on spots
   */
  setupClickHandlers() {
    this.spots.forEach(spot => {
      spot.addEventListener('click', () => {
        if (!this.cooldown) {
          this.triggerSpot(spot.id);
        }
      });
      
      // Add hover cursor
      spot.style.cursor = 'pointer';
    });
  }
  
  /**
   * Check if car is near any spot
   * @param {number} carX - Car X position
   * @param {number} carY - Car Y position
   */
  checkCarPosition(carX, carY) {
    // Skip if in cooldown
    if (this.cooldown) return;
    
    // Check distance to each spot
    for (const spot of this.spotData) {
      const distance = this.calculateDistance(carX, carY, spot.x, spot.y);
      
      if (distance <= this.triggerDistance) {
        // Car is within trigger distance
        
        // Only trigger if this is a different spot than current
        if (this.currentSpot !== spot.id) {
          this.triggerSpot(spot.id);
        }
        
        return; // Only trigger one spot at a time
      }
    }
    
    // Car is not near any spot - reset current spot
    if (this.currentSpot !== null) {
      this.currentSpot = null;
    }
  }
  
  /**
   * Calculate distance between two points
   * @param {number} x1 - First point X
   * @param {number} y1 - First point Y
   * @param {number} x2 - Second point X
   * @param {number} y2 - Second point Y
   * @returns {number} - Distance in pixels
   */
  calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }
  
  /**
   * Trigger a spot (show its content)
   * @param {string} spotId - The ID of the spot to trigger
   */
  triggerSpot(spotId) {
    console.log('📍 Spot triggered:', spotId);
    
    // Set current spot
    this.currentSpot = spotId;
    
    // Mark as visited
    this.visitedSpots.add(spotId);
    this.updateSpotVisual(spotId, 'visited');
    
    // Start cooldown
    this.startCooldown();
    
    // Call the callback
    this.onSpotReached(spotId);
  }
  
  /**
   * Start the cooldown timer
   */
  startCooldown() {
    this.cooldown = true;
    
    setTimeout(() => {
      this.cooldown = false;
    }, this.cooldownDuration);
  }
  
  /**
   * Update spot visual state
   * @param {string} spotId - The spot ID
   * @param {string} state - 'default', 'active', 'visited'
   */
  updateSpotVisual(spotId, state) {
    const spot = document.getElementById(spotId);
    
    if (!spot) return;
    
    // Remove existing state classes
    spot.classList.remove('spot-active', 'spot-visited');
    
    // Add new state class
    switch (state) {
      case 'active':
        spot.classList.add('spot-active');
        break;
      case 'visited':
        spot.classList.add('spot-visited');
        break;
    }
  }
  
  /**
   * Check if a spot has been visited
   * @param {string} spotId - The spot ID
   * @returns {boolean}
   */
  hasVisited(spotId) {
    return this.visitedSpots.has(spotId);
  }
  
  /**
   * Get list of all visited spots
   * @returns {string[]} - Array of visited spot IDs
   */
  getVisitedSpots() {
    return Array.from(this.visitedSpots);
  }
  
  /**
   * Get completion percentage
   * @returns {number} - Percentage of spots visited (0-100)
   */
  getCompletionPercentage() {
    if (this.spots.length === 0) return 100;
    return Math.round((this.visitedSpots.size / this.spots.length) * 100);
  }
  
  /**
   * Reset all spots to unvisited
   */
  reset() {
    this.visitedSpots.clear();
    this.currentSpot = null;
    this.cooldown = false;
    
    // Reset visual states
    this.spots.forEach(spot => {
      spot.classList.remove('spot-active', 'spot-visited');
    });
  }
  
  /**
   * Get spot by ID
   * @param {string} spotId - The spot ID
   * @returns {Object|null} - Spot data or null
   */
  getSpot(spotId) {
    return this.spotData.find(s => s.id === spotId) || null;
  }
  
  /**
   * Get position of a spot
   * @param {string} spotId - The spot ID
   * @returns {Object|null} - { x, y } or null
   */
  getSpotPosition(spotId) {
    const spot = this.getSpot(spotId);
    return spot ? { x: spot.x, y: spot.y } : null;
  }
}
