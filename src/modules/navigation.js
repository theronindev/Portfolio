/**
 * =============================================================================
 * NAVIGATION.JS - Keyboard Input Handler (FIXED VERSION)
 * =============================================================================
 * 
 * This module handles all keyboard navigation:
 * - Arrow keys (↑ ↓ ← →)
 * - WASD keys (W A S D)
 * - Enable/disable navigation
 * - Prevent default scrolling behavior
 * 
 * FIXES APPLIED:
 * 1. Properly tracks individual key releases
 * 2. Calls onStopDirection for specific direction stops
 * 3. Allows smooth direction changes without position reset
 * 
 * USAGE:
 * const nav = new Navigation({
 *   onMove: (direction) => car.move(direction),
 *   onStopDirection: (direction) => car.stopDirection(direction),
 *   onStop: () => car.stop()
 * });
 * nav.enable();   // Start listening
 * nav.disable();  // Stop listening
 * 
 * =============================================================================
 */

/**
 * Navigation class - Handles keyboard input for car control
 */
export class Navigation {
  /**
   * Create a new Navigation instance
   * @param {Object} callbacks - Callback functions
   * @param {Function} callbacks.onMove - Called when movement key pressed (direction)
   * @param {Function} callbacks.onStopDirection - Called when specific direction key released
   * @param {Function} callbacks.onStop - Called when all movement should stop
   */
  constructor(callbacks = {}) {
    // -------------------------------------------------------------------------
    // PROPERTIES
    // -------------------------------------------------------------------------
    
    // Callback functions
    this.onMove = callbacks.onMove || (() => {});
    this.onStopDirection = callbacks.onStopDirection || (() => {});
    this.onStop = callbacks.onStop || (() => {});
    
    // Whether navigation is currently enabled
    this.isEnabled = false;
    
    // Track which keys are currently pressed
    // This allows for smooth diagonal movement
    this.keysPressed = {
      up: false,
      down: false,
      left: false,
      right: false,
    };
    
    // Key mappings
    // Maps keyboard keys to movement directions
    this.keyMap = {
      // Arrow keys
      'ArrowUp': 'up',
      'ArrowDown': 'down',
      'ArrowLeft': 'left',
      'ArrowRight': 'right',
      
      // WASD keys (lowercase)
      'w': 'up',
      's': 'down',
      'a': 'left',
      'd': 'right',
      
      // WASD keys (uppercase - in case caps lock is on)
      'W': 'up',
      'S': 'down',
      'A': 'left',
      'D': 'right',
    };
    
    // -------------------------------------------------------------------------
    // BIND EVENT HANDLERS
    // -------------------------------------------------------------------------
    // We need to bind these so we can remove them later
    
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }
  
  /**
   * Enable keyboard navigation
   * Adds event listeners for keyboard input
   */
  enable() {
    if (this.isEnabled) return;
    
    console.log('⌨️ Navigation enabled');
    
    this.isEnabled = true;
    
    // Add keyboard event listeners
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
    
    // Handle window blur (stop movement when window loses focus)
    window.addEventListener('blur', this.handleBlur);
  }
  
  /**
   * Disable keyboard navigation
   * Removes event listeners and stops any current movement
   */
  disable() {
    if (!this.isEnabled) return;
    
    console.log('⌨️ Navigation disabled');
    
    this.isEnabled = false;
    
    // Remove keyboard event listeners
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('blur', this.handleBlur);
    
    // Reset all pressed keys
    this.resetAllKeys();
    
    // Trigger stop callback
    this.onStop();
  }
  
  /**
   * Handle keydown event
   * @param {KeyboardEvent} event - The keyboard event
   */
  handleKeyDown(event) {
    // Get the direction for this key
    const direction = this.keyMap[event.key];
    
    // If this isn't a movement key, ignore it
    if (!direction) return;
    
    // Prevent default behavior (scrolling, etc.)
    event.preventDefault();
    
    // If this key is already pressed, ignore (prevents key repeat)
    if (this.keysPressed[direction]) return;
    
    // Mark key as pressed
    this.keysPressed[direction] = true;
    
    // Trigger movement callback
    this.onMove(direction);
  }
  
  /**
   * Handle keyup event
   * @param {KeyboardEvent} event - The keyboard event
   */
  handleKeyUp(event) {
    // Get the direction for this key
    const direction = this.keyMap[event.key];
    
    // If this isn't a movement key, ignore it
    if (!direction) return;
    
    // Prevent default behavior
    event.preventDefault();
    
    // If this key wasn't pressed, ignore
    if (!this.keysPressed[direction]) return;
    
    // Mark key as released
    this.keysPressed[direction] = false;
    
    // Tell the car to stop this specific direction
    // This is the key fix - we stop individual directions, not everything
    this.onStopDirection(direction);
  }
  
  /**
   * Handle window blur
   * Stops all movement when window loses focus
   */
  handleBlur() {
    console.log('⌨️ Window lost focus - stopping movement');
    this.resetAllKeys();
    this.onStop();
  }
  
  /**
   * Reset all pressed keys to false
   */
  resetAllKeys() {
    this.keysPressed = {
      up: false,
      down: false,
      left: false,
      right: false,
    };
  }
  
  /**
   * Check if a specific direction is currently pressed
   * @param {string} direction - The direction to check
   * @returns {boolean}
   */
  isPressed(direction) {
    return this.keysPressed[direction] || false;
  }
  
  /**
   * Check if any movement key is currently pressed
   * @returns {boolean}
   */
  isAnyKeyPressed() {
    return Object.values(this.keysPressed).some(v => v);
  }
  
  /**
   * Get all currently pressed directions
   * @returns {string[]} Array of pressed directions
   */
  getPressedDirections() {
    return Object.entries(this.keysPressed)
      .filter(([_, pressed]) => pressed)
      .map(([direction, _]) => direction);
  }
}
