export default class HabitController {
    constructor(model, view) {
      this.model = model;
      this.view = view;
      this.init();
    }
  
    init() {
      this.view.renderForm();
      this.view.renderHabits(this.model.habits);
      this.view.renderChart(this.model.habits);
      
      const form = document.getElementById('add-habit');
      form.addEventListener('submit', this.handleAdd.bind(this));
      this.view.list.addEventListener('click', this.handleClick.bind(this));
    }
  
    handleAdd(event) {
      event.preventDefault();
      const form = event.target;
      const habit = {
        
        name: form.name.value,
        frequency: form.frequency.value
      };
      
      this.model.addHabit(habit);
      form.reset();
      this.view.renderHabits(this.model.habits);
      this.view.renderChart(this.model.habits);
    }
  
    handleClick(event) {
      if (event.target.matches('.delete')) {
        const id = parseInt(event.target.dataset.id);
        this.model.deleteHabit(id);
        this.view.renderHabits(this.model.habits);
        this.view.renderChart(this.model.habits);
      } else if (event.target.matches('.complete')) {
        const id = parseInt(event.target.dataset.id);
        this.model.updateProgress(id, new Date(), true);
        this.view.renderHabits(this.model.habits);
        this.view.renderChart(this.model.habits);
      }
    }
  }