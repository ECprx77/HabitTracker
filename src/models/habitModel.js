export default class HabitModel {
  constructor() {
    this.habits = JSON.parse(localStorage.getItem('habits')) || [];
    this.completedHabits = JSON.parse(localStorage.getItem('completedHabits')) || [];
    this.graphData = JSON.parse(localStorage.getItem('graphData')) || [];
  }

  addHabit(habit) {
    const now = new Date();
    const newHabit = {
      id: Date.now(),
      name: habit.name,
      frequency: habit.frequency,
      type: habit.type,
      goal: habit.goal || 0,
      progress: habit.type === 'increment' ? 0 : [],
      created: now,
      lastRenewal: now,
      nextDueDate: this.calculateNextDueDate(habit.frequency, now)
    };
    
    this.habits.push(newHabit);
    this.save();
  }

  calculateNextDueDate(frequency, startDate) {
    const date = new Date(startDate);

    switch (frequency) {
      case 'daily':
        date.setDate(date.getDate() + 1);
        break;
      case 'weekly':
        date.setDate(date.getDate() + 7);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'yearly':
        date.setFullYear(date.getFullYear() + 1);
        break;
      default:
        return null;
    }
    return date;
  }

  loadAndUpdateHabits() {
    const habits = JSON.parse(localStorage.getItem('habits')) || [];
    const currentDate = new Date();

    habits.forEach(habit => {
      if (habit.nextDueDate && new Date(habit.nextDueDate) <= currentDate) {
        habit.progress = habit.type === 'increment' ? 0 : [];
        habit.lastRenewal = new Date();
        habit.nextDueDate = this.calculateNextDueDate(habit.frequency, new Date());
      }
    });
    return habits;
  }

  deleteHabit(id) {
    this.habits = this.habits.filter(habit => habit.id !== id);
    this.save();
  }

  deleteCompletedHabit(id) {
    const habit = this.completedHabits.find(h => h.id === id);
    if (habit && habit.frequency !== 'once') {
      this.habits = this.habits.filter(h => 
        !(h.name === habit.name && h.frequency === habit.frequency)
      );
    }
    this.completedHabits = this.completedHabits.filter(h => h.id !== id);
    this.save();
  }

  updateProgress(id, increment = 1) {
    const habit = this.habits.find(h => h.id === id);
    if (habit) {
      if (habit.type === 'increment') {
        habit.progress += increment;
        if (habit.progress >= habit.goal) {
          this.moveToCompleted(habit);
        }
      } else {
        habit.progress.push({ date: new Date(), completed: true });
        this.moveToCompleted(habit);
      }
      this.save();
    }
  }

  moveToCompleted(habit) {
    this.habits = this.habits.filter(h => h.id !== habit.id);
    
    const completionData = {
      ...habit,
      completedDate: new Date()
    };
    
    this.completedHabits.push(completionData);
    this.graphData.push(completionData);

    if (habit.frequency !== 'once') {
      const nextInstance = {
        ...habit,
        id: Date.now(),
        progress: habit.type === 'increment' ? 0 : [],
        lastRenewal: new Date(),
        nextDueDate: this.calculateNextDueDate(habit.frequency, new Date())
      };
      this.habits.push(nextInstance);
    }
    
    this.save();
  }

  clearCompleted() {
    this.completedHabits = [];
    this.save();
  }

  clearGraphData() {
    this.graphData = [];
    this.save();
  }

  save() {
    localStorage.setItem('habits', JSON.stringify(this.habits));
    localStorage.setItem('completedHabits', JSON.stringify(this.completedHabits));
    localStorage.setItem('graphData', JSON.stringify(this.graphData));
  }
}