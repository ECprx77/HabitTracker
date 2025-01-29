export default class HabitModel {
  constructor() {
    this.habits = JSON.parse(localStorage.getItem('habits')) || [];
  }

  addHabit(habit) {
    this.habits.push({
      id: Date.now(),
      name: habit.name,
      frequency: habit.frequency,
      type: habit.type,
      goal: habit.goal || 0,
      progress: habit.type === 'increment' ? 0 : [],
      created: new Date()
    });
    this.save();
  }

  deleteHabit(id) {
    this.habits = this.habits.filter(habit => habit.id !== id);
    this.save();
  }

  updateProgress(id, increment = 1) {
    const habit = this.habits.find(h => h.id === id);
    if (habit) {
      if (habit.type === 'increment') {
        habit.progress += increment;
      } else {
        habit.progress.push({ date: new Date(), completed: true });
      }
      this.save();
    }
  }

  save() {
    localStorage.setItem('habits', JSON.stringify(this.habits));
  }
}