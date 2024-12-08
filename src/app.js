import { Journal } from './components/Journal.js';
import { MusicTherapy } from './components/MusicTherapy.js';
import { PoetryCorner } from './components/PoetryCorner.js';

class ZenithMinds {
  constructor() {
    this.journal = new Journal();
    this.musicTherapy = new MusicTherapy();
    this.poetryCorner = new PoetryCorner();
    
    this.setupAnalytics();
  }

  setupAnalytics() {
    // Track user engagement and feature usage
    document.addEventListener('click', (e) => {
      if (e.target.closest('.feature-card')) {
        const feature = e.target.closest('.feature-card').querySelector('h2').textContent;
        this.logAnalytics('feature_interaction', { feature });
      }
    });
  }

  logAnalytics(event, data) {
    // Simple analytics logging
    const analyticsData = {
      event,
      data,
      timestamp: new Date().toISOString(),
    };
    
    const analytics = JSON.parse(localStorage.getItem('analytics') || '[]');
    analytics.push(analyticsData);
    localStorage.setItem('analytics', JSON.stringify(analytics));
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  new ZenithMinds();
});