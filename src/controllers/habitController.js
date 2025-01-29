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
}