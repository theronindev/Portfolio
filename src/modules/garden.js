/**
 * =============================================================================
 * GARDEN.JS - Garden Environment Module
 * =============================================================================
 * 
 * This module handles the garden environment:
 * - Background and scenery
 * - Decorative elements (trees, flowers)
 * - Camera following the car
 * - Parallax effects
 * 
 * USAGE:
 * const garden = new Garden(containerElement);
 * garden.followCar(carX, carY);  // Update camera to follow car
 * garden.updateDimensions();     // Recalculate on resize
 * 
 * =============================================================================
 */

import { gsap } from 'gsap';

/**
 * Garden class - Manages the interactive garden environment
 */
export class Garden {
  /**
   * Create a new Garden instance
   * @param {HTMLElement} container - The garden container element
   */
  constructor(container) {
    // -------------------------------------------------------------------------
    // PROPERTIES
    // -------------------------------------------------------------------------
    
    // DOM elements
    this.container = container;
    this.decorationsContainer = container.querySelector('.decorations');
    
    // Garden dimensions (should match CSS variables)
    this.width = 3000;
    this.height = 2000;
    
    // Viewport dimensions
    this.viewportWidth = window.innerWidth;
    this.viewportHeight = window.innerHeight;
    
    // Camera position (center of viewport in garden coordinates)
    this.cameraX = 0;
    this.cameraY = 0;
    
    // Camera smoothing (lower = smoother, higher = snappier)
    this.cameraSmoothness = 0.1;
    
    // -------------------------------------------------------------------------
    // INITIALIZATION
    // -------------------------------------------------------------------------
    
    this.init();
  }
  
  /**
   * Initialize the garden
   */
  init() {
    console.log('🌳 Garden initialized');
    
    // Generate decorative elements
    this.generateDecorations();
    
    // Set initial camera position (where the car starts - middle of road)
    this.updateCamera(100, 980);
    
    // Listen for car movement events
    this.setupCarTracking();
  }
  
  /**
   * Generate decorative elements (trees, flowers, etc.)
   * Creates a natural-looking garden environment
   */
  generateDecorations() {
    if (!this.decorationsContainer) {
      console.warn('Decorations container not found');
      return;
    }
    
    // Clear existing decorations
    this.decorationsContainer.innerHTML = '';
    
    // Generate trees
    this.generateTrees(20);
    
    // Generate flowers
    this.generateFlowers(30);
    
    // Generate bushes
    this.generateBushes(15);
    
    console.log('🌸 Decorations generated');
  }
  
  /**
   * Generate tree elements
   * @param {number} count - Number of trees to generate
   */
  generateTrees(count) {
    for (let i = 0; i < count; i++) {
      const tree = document.createElement('div');
      tree.className = 'tree';
      
      // Random position (avoiding the road area)
      const x = Math.random() * this.width;
      const y = this.getRandomYAvoidingRoad();
      
      // Random size variation
      const scale = 0.7 + Math.random() * 0.6; // 70% to 130%
      
      tree.innerHTML = `
        <div class="tree-trunk"></div>
        <div class="tree-leaves"></div>
      `;
      
      tree.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        transform: scale(${scale});
        z-index: ${Math.floor(y)};
      `;
      
      this.decorationsContainer.appendChild(tree);
    }
  }
  
  /**
   * Generate flower elements
   * @param {number} count - Number of flowers to generate
   */
  generateFlowers(count) {
    const flowerColors = ['#FF69B4', '#FFD700', '#FF6347', '#9370DB', '#00CED1'];
    
    for (let i = 0; i < count; i++) {
      const flower = document.createElement('div');
      flower.className = 'flower';
      
      // Random position
      const x = Math.random() * this.width;
      const y = this.getRandomYAvoidingRoad();
      
      // Random color
      const color = flowerColors[Math.floor(Math.random() * flowerColors.length)];
      
      flower.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: 20px;
        height: 20px;
        background: ${color};
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        z-index: ${Math.floor(y)};
      `;
      
      this.decorationsContainer.appendChild(flower);
    }
  }
  
  /**
   * Generate bush elements
   * @param {number} count - Number of bushes to generate
   */
  generateBushes(count) {
    for (let i = 0; i < count; i++) {
      const bush = document.createElement('div');
      bush.className = 'bush';
      
      // Random position
      const x = Math.random() * this.width;
      const y = this.getRandomYAvoidingRoad();
      
      // Random size
      const size = 30 + Math.random() * 30;
      
      bush.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size * 0.7}px;
        background: #228B22;
        border-radius: 50% 50% 40% 40%;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: ${Math.floor(y)};
      `;
      
      this.decorationsContainer.appendChild(bush);
    }
  }
  
  /**
   * Get a random Y position that avoids the road area
   * Road is now at Y: 950-1050
   * @returns {number} - Y coordinate
   */
  getRandomYAvoidingRoad() {
    // Road is at 950-1050 (middle of 2000px height)
    const roadTop = 900;      // Give some margin
    const roadBottom = 1100;  // Give some margin
    
    // Generate position either above or below the road
    if (Math.random() > 0.5) {
      // Above road (Y: 100 to 850)
      return 100 + Math.random() * 750;
    } else {
      // Below road (Y: 1150 to 1800)
      return 1150 + Math.random() * 650;
    }
  }
  
  /**
   * Setup car tracking
   * Listens for car movement and updates camera
   */
  setupCarTracking() {
    const car = document.getElementById('car');
    
    if (car) {
      car.addEventListener('carMove', (e) => {
        const { x, y } = e.detail;
        this.updateCamera(x, y);
      });
    }
  }
  
  /**
   * Update camera position to follow a target
   * @param {number} targetX - Target X position (car X)
   * @param {number} targetY - Target Y position (car Y)
   */
  updateCamera(targetX, targetY) {
    // Calculate where camera should be centered
    // Camera shows viewport centered on the target, clamped to boundaries
    
    // Calculate the offset needed to center the target in the viewport
    let offsetX = targetX - this.viewportWidth / 2;
    let offsetY = targetY - this.viewportHeight / 2;
    
    // Clamp to boundaries (don't show outside the garden)
    offsetX = Math.max(0, Math.min(this.width - this.viewportWidth, offsetX));
    offsetY = Math.max(0, Math.min(this.height - this.viewportHeight, offsetY));
    
    // Apply smooth camera movement using GSAP
    gsap.to(this.container, {
      x: -offsetX,
      y: -offsetY,
      duration: 0.3,
      ease: 'power2.out',
    });
    
    // Store current camera position
    this.cameraX = offsetX;
    this.cameraY = offsetY;
  }
  
  /**
   * Update dimensions (call on window resize)
   */
  updateDimensions() {
    this.viewportWidth = window.innerWidth;
    this.viewportHeight = window.innerHeight;
    
    console.log('📐 Garden dimensions updated:', this.viewportWidth, 'x', this.viewportHeight);
  }
  
  /**
   * Get current camera position
   * @returns {Object} - { x, y }
   */
  getCameraPosition() {
    return {
      x: this.cameraX,
      y: this.cameraY,
    };
  }
  
  /**
   * Convert screen coordinates to garden coordinates
   * @param {number} screenX - Screen X coordinate
   * @param {number} screenY - Screen Y coordinate
   * @returns {Object} - { x, y } in garden coordinates
   */
  screenToGarden(screenX, screenY) {
    return {
      x: screenX + this.cameraX,
      y: screenY + this.cameraY,
    };
  }
  
  /**
   * Convert garden coordinates to screen coordinates
   * @param {number} gardenX - Garden X coordinate
   * @param {number} gardenY - Garden Y coordinate
   * @returns {Object} - { x, y } in screen coordinates
   */
  gardenToScreen(gardenX, gardenY) {
    return {
      x: gardenX - this.cameraX,
      y: gardenY - this.cameraY,
    };
  }
}
