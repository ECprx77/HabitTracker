import Chart from 'chart.js/auto';

export default class HabitView {
  constructor() {
    this.app = document.getElementById('app');
    this.form = document.getElementById('habit-form');
    this.list = document.getElementById('habits-list');
    this.chart = document.getElementById('habit-chart');
  }

  renderForm() {
    this.form.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Add New Habit</h5>
          <form id="add-habit" class="mt-3">
            <div class="mb-3">
              <input type="text" class="form-control" name="name" placeholder="Habit name" required>
            </div>
            <div class="mb-3">
              <select class="form-select" name="frequency">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary">Add Habit</button>
          </form>
        </div>
      </div>
    `;
  }

  renderHabits(habits) {
    this.list.innerHTML = habits.map(habit => `
      <div class="card mb-3">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h5 class="card-title">${habit.name}</h5>
              <h6 class="card-subtitle mb-2 text-muted">${habit.frequency}</h6>
            </div>
            <div>
              <button class="btn btn-success btn-sm complete" data-id="${habit.id}">
                Complete
              </button>
              <button class="btn btn-danger btn-sm delete" data-id="${habit.id}">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  renderChart(habits) {
    if (habits.length === 0) return;

    // Get and destroy existing chart if it exists
    const existingChart = Chart.getChart(this.chart);
    if (existingChart) {
      existingChart.destroy();
    }

    const ctx = this.chart.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: [...Array(7)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return d.toLocaleDateString();
        }).reverse(),
        datasets: habits.map(habit => ({
          label: habit.name,
          data: habit.progress.map(p => p.completed ? 1 : 0),
          fill: false,
          tension: 0.1
        }))
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          }
        }
      }
    });
  }
}