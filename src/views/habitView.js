import Chart from 'chart.js/auto';

export default class HabitView {
  constructor() {
    this.app = document.getElementById('app');
    this.form = document.getElementById('habit-form');
    this.list = document.getElementById('habits-list');
    this.chartContainer = document.getElementById('chart-container');
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
            <div class="mb-3">
              <label for="taskType">Task Type:</label>
              <select class="form-select" name="type">
                <option value="complete">Complete</option>
                <option value="increment">Increment</option>
              </select>
            </div>
            <div class="mb-3" id="goal-container" style="display: none;">
              <input type="number" class="form-control" name="goal" placeholder="Goal number">
            </div>
            <button type="submit" class="btn btn-primary">Add Habit</button>
          </form>
        </div>
      </div>
    `;

    const typeSelect = this.form.querySelector('select[name="type"]');
    typeSelect.addEventListener('change', (event) => {
      const goalContainer = this.form.querySelector('#goal-container');
      if (event.target.value === 'increment') {
        goalContainer.style.display = 'block';
      } else {
        goalContainer.style.display = 'none';
      }
    });
  }

  renderHabits(habits) {
    this.list.innerHTML = habits.map(habit => `
      <div class="card mb-3">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h5 class="card-title">${habit.name}</h5>
              <p class="card-text">${habit.frequency}</p>
              ${habit.type === 'increment' ? `<canvas id="pie-chart-${habit.id}" width="50" height="50"></canvas>` : ''}
            </div>
            <div>
              ${habit.type === 'increment' ? `<input type="number" class="form-control mb-2" id="increment-${habit.id}" placeholder="Increment by">` : ''}
              <button class="btn btn-success complete" data-id="${habit.id}">Complete</button>
              <button class="btn btn-danger delete" data-id="${habit.id}">Delete</button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    habits.forEach(habit => {
      if (habit.type === 'increment') {
        this.renderPieChart(habit);
      }
    });
  }

  renderPieChart(habit) {
    const ctx = document.getElementById(`pie-chart-${habit.id}`).getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Completed', 'Remaining'],
        datasets: [{
          data: [habit.progress, habit.goal - habit.progress],
          backgroundColor: ['#4caf50', '#f44336']
        }]
      },
      options: {
        responsive: false,
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  renderChart(habits) {
    if (habits.length === 0) return;

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
          data: habit.type === 'increment' ? [habit.progress / habit.goal] : habit.progress.map(p => (p.completed ? 1 : 0)),
          fill: false,
          tension: 0.1
        }))
      },
      options: {
        responsive: true,
        plugins: {
          // ...existing options...
        }
      }
    });
  }
}