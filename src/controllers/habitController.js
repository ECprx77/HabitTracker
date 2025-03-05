export default class HabitController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.init();
    this.initCompletedTasks();
    this.initGraphControls()
  }

  init() {
    this.view.renderForm();
    this.view.renderHabits(this.model.habits);
    this.view.renderChart(this.model.habits,this.model.graphData);
    
    const form = document.getElementById('add-habit');
    form.addEventListener('submit', this.handleAdd.bind(this));
    this.view.list.addEventListener('click', this.handleClick.bind(this));

    if (this.model.completedHabits.length > 0) {
      this.view.renderCompletedHabits(this.model.completedHabits);
    }
  }

  initCompletedTasks() {
    // Clear all completed tasks
    document.addEventListener('clearCompleted', () => {
        this.model.clearCompleted();
        this.view.renderCompletedHabits(this.model.completedHabits);
    });

    // Delete individual completed task
    document.addEventListener('deleteCompleted', (event) => {
        const id = event.detail.id;
        this.model.deleteCompletedHabit(id);
        this.view.renderCompletedHabits(this.model.completedHabits);
    });
  }

  initGraphControls() {
    document.addEventListener('clearGraph', () => {
        this.model.clearGraphData();
        this.view.renderChart(this.model.habits, this.model.graphData);
    });
  }


  handleClick(event) {
    if (event.target.matches('.delete')) {
      const id = parseInt(event.target.dataset.id);
      this.model.deleteHabit(id);
      this.view.renderHabits(this.model.habits);
      this.view.renderChart(this.model.habits,this.model.graphData);
  } else if (event.target.matches('.complete')) {
        const id = parseInt(event.target.dataset.id);
        const habit = this.model.habits.find(h => h.id === id);
        if (habit.type === 'increment') {
            const incrementInput = document.getElementById(`increment-${id}`);
            const incrementValue = parseInt(incrementInput.value) || 1;
            this.model.updateProgress(id, incrementValue);
        } else {
            this.model.updateProgress(id, 1);
        }
        this.view.renderHabits(this.model.habits);
        this.view.renderChart(this.model.habits,this.model.graphData);
        this.view.renderCompletedHabits(this.model.completedHabits);
    }
  }

  handleAdd(event) {
    event.preventDefault();
    const form = event.target;
    const habit = {
        name: form.name.value,
        frequency: form.frequency.value,
        type: form.type.value,
        goal: form.goal ? parseInt(form.goal.value) : 0
    };
    
    this.model.addHabit(habit);
    form.reset();
    this.view.renderHabits(this.model.habits);
    this.view.renderChart(this.model.habits,this.model.graphData);
}
}