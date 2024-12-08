import * as Tone from 'tone';

export class MusicTherapy {
  constructor() {
    this.playlists = {
      happy: {
        spotify: "https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC",
        ambient: this.createHappyAmbience.bind(this)
      },
      calm: {
        spotify: "https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ",
        ambient: this.createCalmAmbience.bind(this)
      },
      motivated: {
        spotify: "https://open.spotify.com/playlist/37i9dQZF1DXdxcBWuJkbcy",
        ambient: this.createMotivatedAmbience.bind(this)
      }
    };

    this.setupMusicUI();
    this.synth = new Tone.PolySynth().toDestination();
    this.currentAmbience = null;
  }

  setupMusicUI() {
    const musicContainer = document.createElement('div');
    musicContainer.className = 'music-therapy';
    musicContainer.innerHTML = `
      <div class="music-controls">
        <h3>Music Therapy</h3>
        <div class="playlist-buttons">
          ${Object.keys(this.playlists).map(mood => `
            <button class="mood-button" data-mood="${mood}">
              ${mood.charAt(0).toUpperCase() + mood.slice(1)}
            </button>
          `).join('')}
        </div>
        <div class="ambient-controls">
          <button id="toggle-ambient">Play Ambient Sounds</button>
          <div class="volume-control">
            <label for="volume">Volume:</label>
            <input type="range" id="volume" min="0" max="1" step="0.1" value="0.5">
          </div>
        </div>
      </div>
    `;

    document.querySelector('.container').appendChild(musicContainer);
    this.attachEventListeners();
  }

  attachEventListeners() {
    const moodButtons = document.querySelectorAll('.mood-button');
    const ambientToggle = document.getElementById('toggle-ambient');
    const volumeControl = document.getElementById('volume');

    moodButtons.forEach(button => {
      button.addEventListener('click', () => this.handleMoodSelection(button.dataset.mood));
    });

    ambientToggle.addEventListener('click', () => this.toggleAmbientSound());
    volumeControl.addEventListener('input', (e) => this.updateVolume(e.target.value));
  }

  handleMoodSelection(mood) {
    const playlist = this.playlists[mood];
    if (playlist) {
      if (this.currentAmbience) {
        this.stopAmbientSound();
      }
      window.open(playlist.spotify, '_blank');
      playlist.ambient();
    }
  }

  async createHappyAmbience() {
    const synth = new Tone.PolySynth().toDestination();
    const notes = ['C4', 'E4', 'G4', 'B4'];
    const pattern = new Tone.Pattern((time, note) => {
      synth.triggerAttackRelease(note, '8n', time);
    }, notes);
    
    await Tone.start();
    pattern.start(0);
    Tone.Transport.start();
    this.currentAmbience = { synth, pattern };
  }

  async createCalmAmbience() {
    const noise = new Tone.Noise('pink').start();
    const filter = new Tone.Filter(1000, 'lowpass').toDestination();
    noise.connect(filter);
    
    await Tone.start();
    this.currentAmbience = { noise, filter };
  }

  async createMotivatedAmbience() {
    const synth = new Tone.PolySynth().toDestination();
    const chord = ['C4', 'E4', 'G4'];
    
    const loop = new Tone.Loop(time => {
      synth.triggerAttackRelease(chord, '4n', time);
    }, '4n');
    
    await Tone.start();
    loop.start(0);
    Tone.Transport.start();
    this.currentAmbience = { synth, loop };
  }

  stopAmbientSound() {
    if (this.currentAmbience) {
      if (this.currentAmbience.pattern) {
        this.currentAmbience.pattern.stop();
      }
      if (this.currentAmbience.loop) {
        this.currentAmbience.loop.stop();
      }
      if (this.currentAmbience.noise) {
        this.currentAmbience.noise.stop();
      }
      if (this.currentAmbience.synth) {
        this.currentAmbience.synth.dispose();
      }
      Tone.Transport.stop();
      this.currentAmbience = null;
    }
  }

  toggleAmbientSound() {
    if (this.currentAmbience) {
      this.stopAmbientSound();
    } else {
      this.createCalmAmbience();
    }
  }

  updateVolume(value) {
    Tone.Destination.volume.value = Tone.gainToDb(parseFloat(value));
  }
}