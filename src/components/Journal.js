import { marked } from 'marked';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/storage.js';
import { MoodAnalyzer } from '../utils/moodAnalyzer.js';

export class Journal {
  constructor() {
    this.moodAnalyzer = new MoodAnalyzer();
    this.entries = getFromLocalStorage('journal_entries') || [];
    this.setupJournalUI();
  }

  setupJournalUI() {
    const journalContainer = document.createElement('div');
    journalContainer.className = 'journal-container';
    journalContainer.innerHTML = `
      <div class="mood-tracker">
        <h3>How are you feeling?</h3>
        <div class="mood-buttons">
          <button data-mood="happy">😊 Happy</button>
          <button data-mood="sad">😢 Sad</button>
          <button data-mood="anxious">😰 Anxious</button>
          <button data-mood="stressed">😫 Stressed</button>
        </div>
        <input type="range" id="mood-intensity" min="1" max="10" value="5">
        <label for="mood-intensity">Intensity: <span id="intensity-value">5</span></label>
      </div>
      <div class="journal-entry">
        <textarea id="journal-text" placeholder="Write your thoughts here..."></textarea>
        <button id="save-entry">Save Entry</button>
      </div>
      <div class="journal-history"></div>
    `;

    document.querySelector('.container').appendChild(journalContainer);
    this.attachEventListeners();
  }

  attachEventListeners() {
    const moodButtons = document.querySelectorAll('.mood-buttons button');
    const intensitySlider = document.getElementById('mood-intensity');
    const saveButton = document.getElementById('save-entry');

    moodButtons.forEach(button => {
      button.addEventListener('click', () => this.handleMoodSelection(button.dataset.mood));
    });

    intensitySlider.addEventListener('input', (e) => {
      document.getElementById('intensity-value').textContent = e.target.value;
    });

    saveButton.addEventListener('click', () => this.saveJournalEntry());
  }

  handleMoodSelection(mood) {
    this.currentMood = mood;
    const suggestions = this.moodAnalyzer.getMoodSuggestions(mood);
    this.displaySuggestions(suggestions);
  }

  displaySuggestions(suggestions) {
    const suggestionsList = document.createElement('div');
    suggestionsList.className = 'suggestions';
    suggestionsList.innerHTML = `
      <h4>Suggestions for your current mood:</h4>
      <ul>${suggestions.map(s => `<li>${s}</li>`).join('')}</ul>
    `;

    const existing = document.querySelector('.suggestions');
    if (existing) existing.remove();
    document.querySelector('.mood-tracker').appendChild(suggestionsList);
  }

  saveJournalEntry() {
    const text = document.getElementById('journal-text').value;
    const intensity = document.getElementById('mood-intensity').value;

    if (!text || !this.currentMood) {
      alert('Please select a mood and write something in your journal.');
      return;
    }

    const entry = {
      text,
      mood: this.currentMood,
      intensity: parseInt(intensity),
      timestamp: new Date().toISOString(),
    };

    this.entries.unshift(entry);
    saveToLocalStorage('journal_entries', this.entries);
    this.moodAnalyzer.addMoodEntry(this.currentMood, intensity, text);
    this.updateJournalHistory();
    this.clearForm();
  }

  updateJournalHistory() {
    const historyContainer = document.querySelector('.journal-history');
    historyContainer.innerHTML = this.entries
      .slice(0, 5)
      .map(entry => `
        <div class="entry">
          <div class="entry-header">
            <span class="mood-emoji">${this.getMoodEmoji(entry.mood)}</span>
            <span class="timestamp">${new Date(entry.timestamp).toLocaleString()}</span>
          </div>
          <div class="entry-content">${marked(entry.text)}</div>
        </div>
      `)
      .join('');
  }

  getMoodEmoji(mood) {
    const emojis = {
      happy: '😊',
      sad: '😢',
      anxious: '😰',
      stressed: '😫',
    };
    return emojis[mood] || '😐';
  }

  clearForm() {
    document.getElementById('journal-text').value = '';
    document.getElementById('mood-intensity').value = '5';
    document.getElementById('intensity-value').textContent = '5';
    this.currentMood = null;
    const suggestions = document.querySelector('.suggestions');
    if (suggestions) suggestions.remove();
  }
}