import { marked } from 'marked';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/storage.js';
import { shareContent } from '../utils/share.js';

export class PoetryCorner {
  constructor() {
    this.poems = [
      {
        title: "Desiderata",
        author: "Max Ehrmann",
        text: "Go placidly amid the noise and haste, and remember what peace there may be in silence. As far as possible without surrender be on good terms with all persons.\n\nSpeak your truth quietly and clearly; and listen to others, even the dull and ignorant; they too have their story.",
        theme: "life-guidance"
      },
      {
        title: "The Road Not Taken",
        author: "Robert Frost",
        text: "Two roads diverged in a yellow wood,\nAnd sorry I could not travel both\nAnd be one traveler, long I stood\nAnd looked down one as far as I could\nTo where it bent in the undergrowth;",
        theme: "choices"
      },
      {
        title: "Still I Rise",
        author: "Maya Angelou",
        text: "You may write me down in history\nWith your bitter, twisted lies,\nYou may trod me in the very dirt\nBut still, like dust, I'll rise.",
        theme: "resilience"
      }
    ];
    
    this.userPoems = getFromLocalStorage('user_poems') || [];
    this.setupPoetryUI();
  }

  setupPoetryUI() {
    const poetryContainer = document.createElement('div');
    poetryContainer.className = 'poetry-corner';
    poetryContainer.innerHTML = `
      <div class="poetry-controls">
        <button id="write-poem">Write a Poem</button>
        <button id="read-poem">Read a Poem</button>
        <button id="share-poem">Share Poetry</button>
      </div>
      <div class="poetry-content"></div>
    `;

    document.querySelector('.container').appendChild(poetryContainer);
    this.attachEventListeners();
  }

  attachEventListeners() {
    document.getElementById('write-poem').addEventListener('click', () => this.showWriteInterface());
    document.getElementById('read-poem').addEventListener('click', () => this.showRandomPoem());
    document.getElementById('share-poem').addEventListener('click', () => this.sharePoetry());
  }

  showWriteInterface() {
    const content = document.querySelector('.poetry-content');
    content.innerHTML = `
      <div class="write-poetry">
        <input type="text" id="poem-title" placeholder="Title of your poem">
        <textarea id="poem-text" placeholder="Write your poem here..."></textarea>
        <div class="poem-controls">
          <button id="save-poem">Save Poem</button>
          <button id="preview-poem">Preview</button>
        </div>
      </div>
    `;

    document.getElementById('save-poem').addEventListener('click', () => this.savePoem());
    document.getElementById('preview-poem').addEventListener('click', () => this.previewPoem());
  }

  previewPoem() {
    const title = document.getElementById('poem-title').value;
    const text = document.getElementById('poem-text').value;
    
    const content = document.querySelector('.poetry-content');
    content.innerHTML = `
      <div class="poem-preview">
        <h3>${title || 'Untitled'}</h3>
        ${marked(text)}
        <button id="back-to-edit">Back to Edit</button>
      </div>
    `;

    document.getElementById('back-to-edit').addEventListener('click', () => this.showWriteInterface());
  }

  savePoem() {
    const title = document.getElementById('poem-title').value;
    const text = document.getElementById('poem-text').value;

    if (!text) {
      alert('Please write something before saving.');
      return;
    }

    const poem = {
      title: title || 'Untitled',
      text,
      timestamp: new Date().toISOString(),
    };

    this.userPoems.unshift(poem);
    saveToLocalStorage('user_poems', this.userPoems);
    alert('Poem saved successfully!');
    this.showWriteInterface();
  }

  showRandomPoem() {
    const allPoems = [...this.poems, ...this.userPoems];
    const randomPoem = allPoems[Math.floor(Math.random() * allPoems.length)];

    const content = document.querySelector('.poetry-content');
    content.innerHTML = `
      <div class="poem-display">
        <h3>${randomPoem.title}</h3>
        ${marked(randomPoem.text)}
        ${randomPoem.author ? `<p class="author">- ${randomPoem.author}</p>` : ''}
        <button id="another-poem">Read Another</button>
      </div>
    `;

    document.getElementById('another-poem').addEventListener('click', () => this.showRandomPoem());
  }

  async sharePoetry() {
    const shareData = {
      title: "Zenith Minds Poetry",
      text: "Check out this inspiring poetry from Zenith Minds!",
      url: window.location.href
    };

    try {
      await shareContent(shareData);
    } catch (error) {
      console.error('Error sharing:', error);
      this.fallbackShare(shareData);
    }
  }

  fallbackShare(shareData) {
    const content = document.querySelector('.poetry-content');
    const encodedText = encodeURIComponent(`${shareData.text} ${shareData.url}`);
    
    content.innerHTML = `
      <div class="share-options">
        <h3>Share via:</h3>
        <div class="share-buttons">
          <button onclick="window.open('https://wa.me/?text=${encodedText}', '_blank', 'noopener,noreferrer')">
            Share on WhatsApp
          </button>
          <button onclick="window.open('https://twitter.com/intent/tweet?text=${encodedText}', '_blank', 'noopener,noreferrer')">
            Share on Twitter
          </button>
          <button onclick="navigator.clipboard.writeText('${shareData.url}').then(() => alert('Link copied to clipboard!'))">
            Copy Link
          </button>
        </div>
        <button class="back-button" id="back-to-poems">Back to Poems</button>
      </div>
    `;

    document.getElementById('back-to-poems').addEventListener('click', () => this.showRandomPoem());
  }
}