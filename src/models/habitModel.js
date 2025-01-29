export default class HabitModel {
    constructor() {
      this.habits = JSON.parse(localStorage.getItem('habits')) || [];
    }
  
    addHabit(habit) {
      this.habits.push({
        id: Date.now(),
        name: habit.name,
        frequency: habit.frequency,
        progress: [],
        created: new Date()
      });
      this.save();
    }
  
    deleteHabit(id) {
      this.habits = this.habits.filter(habit => habit.id !== id);
      this.save();
    }
  
    updateProgress(id, date, completed) {
      const Habit = this.habits.find(h => h.id === id);
      if (habit) {
        habit.progress.push({ date, completed });
        this.save();
      }
    }
  
    save() {
      localStorage.setItem('habits', JSON.parse(this.habits));
    }
  }