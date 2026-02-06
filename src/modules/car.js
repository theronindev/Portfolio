/**
 * =============================================================================
 * CAR.JS - Car Movement & Physics Module (FIXED VERSION)
 * =============================================================================
 * 
 * This module handles all car-related functionality:
 * - Movement and physics
 * - Rotation and direction (fixed to prevent upside-down car)
 * - Boundary detection
 * - Animation states
 * 
 * FIXES APPLIED:
 * 1. Uses GSAP consistently for ALL transforms (no mixing with CSS)
 * 2. Smart rotation that finds the shortest path
 * 3. Car never flips upside down
 * 4. Position persists correctly when stopping/starting
 * 
 * USAGE:
 * const car = new Car(element, { startX: 100, startY: 200, speed: 5 });
 * car.move('up');    // Move the car up
 * car.stop();        // Stop movement
 * car.reset();       // Reset to starting position
 * 
 * =============================================================================
 */

import { gsap } from 'gsap';

/**
 * Car class - Controls the user's vehicle in the garden
 */
export class Car {
  /**
   * Create a new Car instance
   * @param {HTMLElement} element - The car DOM element
   * @param {Object} options - Configuration options
   * @param {number} options.startX - Starting X position
   * @param {number} options.startY - Starting Y position
   * @param {number} options.speed - Movement speed (pixels per frame)
   */
  constructor(element, options = {}) {
    // -------------------------------------------------------------------------
    // PROPERTIES
    // -------------------------------------------------------------------------
    
    // DOM element reference
    this.element = element;
    
    // Position (in pixels)
    // Default: Start in middle of road (road is at Y: 950-1050)
    this.x = options.startX || 100;
    this.y = options.startY || 980;
    
    // Starting position (for reset)
    this.startX = this.x;
    this.startY = this.y;
    
    // Movement configuration
    this.speed = options.speed || 5;
    
    // Current rotation angle (in degrees)
    // 0 = facing right, 90 = facing down, -90 = facing up, 180/-180 = facing left
    this.rotation = 0;
    
    // Target rotation (what we're rotating towards)
    this.targetRotation = 0;
    
    // Movement state
    this.isMoving = false;
    this.isPaused = false;
    
    // Current movement direction
    this.currentDirection = null;
    
    // Track which directions are currently pressed
    this.activeDirections = {
      up: false,
      down: false,
      left: false,
      right: false,
    };
    
    // Boundaries (updated dynamically)
    this.boundaries = {
      minX: 50,
      maxX: 2900, // Garden width - car width
      minY: 50,
      maxY: 1900, // Garden height - car height
    };
    
    // Wheel elements for animation
    this.wheels = {
      front: this.element.querySelector('.car-wheel-front'),
      back: this.element.querySelector('.car-wheel-back'),
    };
    
    // Animation frame ID for the game loop
    this.animationFrameId = null;
    
    // -------------------------------------------------------------------------
    // INITIALIZATION
    // -------------------------------------------------------------------------
    
    this.init();
  }
  
  /**
   * Initialize the car
   * Sets initial position and starts the update loop
   */
  init() {
    console.log('🚗 Car initialized at', this.x, this.y);
    
    // Set initial position using GSAP (this establishes GSAP's internal state)
    gsap.set(this.element, {
      x: this.x,
      y: this.y,
      rotation: this.rotation,
    });
    
    // Start the game loop for smooth movement
    this.startGameLoop();
  }
  
  /**
   * Start the game loop
   * Uses requestAnimationFrame for smooth 60fps movement
   */
  startGameLoop() {
    const gameLoop = () => {
      if (!this.isPaused) {
        this.update();
      }
      this.animationFrameId = requestAnimationFrame(gameLoop);
    };
    
    this.animationFrameId = requestAnimationFrame(gameLoop);
  }
  
  /**
   * Stop the game loop
   */
  stopGameLoop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
  
  /**
   * Update car state (called every frame)
   * Applies movement based on active directions
   */
  update() {
    if (!this.isMoving) return;
    
    // Calculate velocity based on active directions
    let velocityX = 0;
    let velocityY = 0;
    
    if (this.activeDirections.up) velocityY = -this.speed;
    if (this.activeDirections.down) velocityY = this.speed;
    if (this.activeDirections.left) velocityX = -this.speed;
    if (this.activeDirections.right) velocityX = this.speed;
    
    // If no direction is active, stop
    if (velocityX === 0 && velocityY === 0) {
      this.isMoving = false;
      this.stopWheelSpin();
      return;
    }
    
    // Calculate new position
    let newX = this.x + velocityX;
    let newY = this.y + velocityY;
    
    // Apply boundary constraints
    newX = Math.max(this.boundaries.minX, Math.min(this.boundaries.maxX, newX));
    newY = Math.max(this.boundaries.minY, Math.min(this.boundaries.maxY, newY));
    
    // Update position if changed
    if (newX !== this.x || newY !== this.y) {
      this.x = newX;
      this.y = newY;
      this.updatePosition();
    }
  }
  
  /**
   * Move the car in a direction
   * @param {string} direction - 'up', 'down', 'left', 'right'
   */
  move(direction) {
    // Mark this direction as active
    this.activeDirections[direction] = true;
    this.isMoving = true;
    this.currentDirection = direction;
    
    // Calculate target rotation based on direction
    const targetRotation = this.getRotationForDirection(direction);
    
    // Apply smart rotation (finds shortest path, prevents flipping)
    this.rotateTo(targetRotation);
    
    // Start wheel animation
    this.startWheelSpin();
  }
  
  /**
   * Get the target rotation angle for a direction
   * @param {string} direction - The direction
   * @returns {number} - Rotation in degrees
   */
  getRotationForDirection(direction) {
    // Rotation angles where 0 = facing right
    const rotations = {
      right: 0,
      down: 90,
      left: 180,
      up: -90,  // Using -90 instead of 270 to prevent full rotation
    };
    
    return rotations[direction] ?? 0;
  }
  
  /**
   * Rotate the car to a target angle using the shortest path
   * This prevents the car from flipping upside down
   * @param {number} targetRotation - Target rotation in degrees
   */
  rotateTo(targetRotation) {
    // Normalize current rotation to -180 to 180 range
    let currentRotation = this.rotation % 360;
    if (currentRotation > 180) currentRotation -= 360;
    if (currentRotation < -180) currentRotation += 360;
    
    // Calculate the difference
    let diff = targetRotation - currentRotation;
    
    // Find the shortest rotation path
    // If diff > 180, rotate the other way
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    
    // Calculate final rotation
    this.targetRotation = currentRotation + diff;
    this.rotation = this.targetRotation;
    
    // Animate rotation smoothly with GSAP
    gsap.to(this.element, {
      rotation: this.targetRotation,
      duration: 0.15,
      ease: 'power2.out',
    });
  }
  
  /**
   * Stop movement in a specific direction
   * @param {string} direction - 'up', 'down', 'left', 'right'
   */
  stopDirection(direction) {
    this.activeDirections[direction] = false;
    
    // Check if any directions are still active
    const hasActiveDirection = Object.values(this.activeDirections).some(v => v);
    
    if (!hasActiveDirection) {
      this.isMoving = false;
      this.currentDirection = null;
      this.stopWheelSpin();
    } else {
      // Update rotation to match remaining active direction
      const activeDirection = Object.entries(this.activeDirections)
        .find(([dir, active]) => active)?.[0];
      
      if (activeDirection) {
        this.currentDirection = activeDirection;
        const newRotation = this.getRotationForDirection(activeDirection);
        this.rotateTo(newRotation);
      }
    }
  }
  
  /**
   * Stop all car movement
   */
  stop() {
    // Reset all active directions
    this.activeDirections = {
      up: false,
      down: false,
      left: false,
      right: false,
    };
    
    this.isMoving = false;
    this.currentDirection = null;
    
    // Stop wheel animation
    this.stopWheelSpin();
  }
  
  /**
   * Stop movement in a specific axis
   * @param {string} axis - 'horizontal' or 'vertical'
   */
  stopAxis(axis) {
    if (axis === 'horizontal') {
      this.activeDirections.left = false;
      this.activeDirections.right = false;
    } else if (axis === 'vertical') {
      this.activeDirections.up = false;
      this.activeDirections.down = false;
    }
    
    // Check if completely stopped
    const hasActiveDirection = Object.values(this.activeDirections).some(v => v);
    
    if (!hasActiveDirection) {
      this.isMoving = false;
      this.currentDirection = null;
      this.stopWheelSpin();
    }
  }
  
  /**
   * Update the car's DOM position
   * Uses GSAP for consistent transform handling
   */
  updatePosition() {
    // Use GSAP.set for immediate position updates (no animation delay)
    // This keeps position in sync with our internal state
    gsap.set(this.element, {
      x: this.x,
      y: this.y,
    });
    
    // Dispatch custom event for other modules to listen to
    this.element.dispatchEvent(new CustomEvent('carMove', {
      detail: { x: this.x, y: this.y, rotation: this.rotation }
    }));
  }
  
  /**
   * Start wheel spinning animation
   */
  startWheelSpin() {
    if (this.wheels.front) {
      this.wheels.front.classList.add('spinning');
    }
    if (this.wheels.back) {
      this.wheels.back.classList.add('spinning');
    }
  }
  
  /**
   * Stop wheel spinning animation
   */
  stopWheelSpin() {
    if (this.wheels.front) {
      this.wheels.front.classList.remove('spinning');
    }
    if (this.wheels.back) {
      this.wheels.back.classList.remove('spinning');
    }
  }
  
  /**
   * Reset car to starting position
   */
  reset() {
    this.x = this.startX;
    this.y = this.startY;
    this.rotation = 0;
    this.targetRotation = 0;
    this.isMoving = false;
    this.currentDirection = null;
    
    // Reset active directions
    this.activeDirections = {
      up: false,
      down: false,
      left: false,
      right: false,
    };
    
    this.stopWheelSpin();
    
    // Update position using GSAP
    gsap.set(this.element, {
      x: this.x,
      y: this.y,
      rotation: this.rotation,
    });
    
    console.log('🚗 Car reset to starting position');
  }
  
  /**
   * Pause car movement (e.g., when tab is hidden)
   */
  pause() {
    this.isPaused = true;
    this.stopWheelSpin();
  }
  
  /**
   * Resume car movement
   */
  resume() {
    this.isPaused = false;
    if (this.isMoving) {
      this.startWheelSpin();
    }
  }
  
  /**
   * Update boundaries (call when garden size changes)
   * @param {Object} boundaries - { minX, maxX, minY, maxY }
   */
  updateBoundaries(boundaries) {
    this.boundaries = { ...this.boundaries, ...boundaries };
  }
  
  /**
   * Get current car position
   * @returns {Object} - { x, y, rotation }
   */
  getPosition() {
    return {
      x: this.x,
      y: this.y,
      rotation: this.rotation,
    };
  }
  
  /**
   * Set car position directly (for teleporting)
   * @param {number} x - X position
   * @param {number} y - Y position
   */
  setPosition(x, y) {
    this.x = x;
    this.y = y;
    
    gsap.set(this.element, {
      x: this.x,
      y: this.y,
    });
  }
  
  /**
   * Check if car is at a specific position (with tolerance)
   * @param {number} x - Target X
   * @param {number} y - Target Y
   * @param {number} tolerance - Distance tolerance (default 50px)
   * @returns {boolean}
   */
  isNear(x, y, tolerance = 50) {
    const distance = Math.sqrt(
      Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2)
    );
    return distance <= tolerance;
  }
}
