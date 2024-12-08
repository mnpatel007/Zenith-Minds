import { format } from 'date-fns';

export class MoodAnalyzer {
  constructor() {
    this.moodHistory = [];
  }

  addMoodEntry(mood, intensity, notes = '') {
    const entry = {
      mood,
      intensity,
      notes,
      timestamp: new Date().toISOString(),
    };
    this.moodHistory.push(entry);
    return entry;
  }

  getWeeklyMoodSummary() {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return this.moodHistory
      .filter(entry => new Date(entry.timestamp) >= weekAgo)
      .reduce((acc, entry) => {
        const day = format(new Date(entry.timestamp), 'EEEE');
        if (!acc[day]) {
          acc[day] = [];
        }
        acc[day].push(entry);
        return acc;
      }, {});
  }

  getMoodSuggestions(currentMood) {
    const suggestions = {
      anxious: [
        'Try deep breathing exercises',
        'Practice progressive muscle relaxation',
        'Take a mindful walk',
      ],
      sad: [
        'Listen to uplifting music',
        'Reach out to a friend',
        'Write down three things that bring gratitude',
      ],
      stressed: [
        'Take a short break',
        'Practice mindfulness meditation',
        'Do some light stretching',
      ],
      happy: [
        'Share your joy with others',
        'Journal about what made you happy',
        'Build on this positive momentum',
      ],
    };
    
    return suggestions[currentMood] || ['Practice self-care', 'Stay mindful', 'Connect with others'];
  }
}