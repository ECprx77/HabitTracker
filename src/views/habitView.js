import Chart from 'chart.js/auto';

export default class HabitView {
  constructor() {
    this.app = document.getElementById('app');
    this.form = document.getElementById('habit-form');
    this.list = document.getElementById('habits-list');
    this.chartContainer = document.getElementById('chart-container');
    this.chart = document.getElementById('habit-chart');
    this.completedTasksDiv = document.getElementById('CompletedTask');
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
              <p class="card-text">
                Frequency: ${habit.frequency}
                <br>
                Next due: ${habit.nextDueDate ? new Date(habit.nextDueDate).toLocaleDateString() : 'One-time'}
                ${habit.type === 'increment' ? 
                  `<br>Progress: ${habit.progress}/${habit.goal}` : 
                  `<br>Status: ${habit.progress.length > 0 ? 'In Progress' : 'Not Started'}`
                }
              </p>
              ${habit.type === 'increment' ? 
                `<canvas id="pie-chart-${habit.id}" width="50" height="50"></canvas>` : 
                ''
              }
            </div>
            <div class="d-flex flex-column align-items-end">
              ${habit.type === 'increment' ? `
                <div class="mb-2">
                  <input type="number" 
                    class="form-control" 
                    id="increment-${habit.id}" 
                    placeholder="Increment by"
                    min="1" 
                    value="1"
                  >
                </div>
              ` : ''}
              <div class="btn-group">
                <button class="btn btn-success complete" data-id="${habit.id}">
                  ${habit.type === 'increment' ? 'Add Progress' : 'Complete'}
                </button>
                <button class="btn btn-danger delete" data-id="${habit.id}">Delete</button>
              </div>
            </div>
          </div>
          ${habit.lastRenewal ? `
            <div class="text-muted mt-2">
              <small>Last renewed: ${new Date(habit.lastRenewal).toLocaleDateString()}</small>
            </div>
          ` : ''}
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

  renderChart(habits, graphData) {
    const chartContainer = document.getElementById('chart-container');
    chartContainer.innerHTML = `
        <canvas id="habit-chart"></canvas>
        <button id="clear-graph" class="btn btn-warning mt-3">Clear Graph</button>
    `;

    const ctx = document.getElementById('habit-chart').getContext('2d');
    
    const allHabits = [...habits, ...(graphData || [])];
    
    if (allHabits.length === 0) {
      chartContainer.innerHTML = `
          <p>No habits to display in the graph yet.</p>
          <button id="clear-graph" class="btn btn-warning mt-3" disabled>Clear Graph</button>
      `;
      return;
    }

    const data = {
        labels: allHabits.map(habit => habit.name),
        datasets: [{
            label: 'Progress',
            data: allHabits.map(habit => 
                habit.type === 'increment' ? (habit.progress || 0) : 
                (habit.progress ? habit.progress.length : 0)
            ),
            backgroundColor: allHabits.map(habit => 
                habit.completedDate ? 'rgba(75, 192, 192, 0.2)' : 'rgba(54, 162, 235, 0.2)'
            ),
            borderColor: allHabits.map(habit => 
                habit.completedDate ? '#fff234': '#fff567'
            ),
            borderWidth: 1
        }]
    };

    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    const clearGraphBtn = document.getElementById('clear-graph');
    if (clearGraphBtn) {
      clearGraphBtn.addEventListener('click', () => {
          document.dispatchEvent(new CustomEvent('clearGraph'));
      });
    }
  }

  renderCompletedHabits(completedHabits) {
    if (completedHabits.length === 0) {
      this.completedTasksDiv.innerHTML = '<h2>Completed Habits</h2><p>No completed habits yet</p>';
      return;
    }

    const content = `
        <h2>Completed Habits</h2>
        ${completedHabits.map(habit => `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h5 class="card-title">${habit.name}</h5>
                            <p class="card-text">
                                Completed on: ${new Date(habit.completedDate).toLocaleDateString()}
                                ${habit.frequency !== 'once' ? '<br>(Recurring)' : ''}
                            </p>
                        </div>
                        <button class="btn btn-danger delete-completed" data-id="${habit.id}">
                            Delete ${habit.frequency !== 'once' ? '& Stop Recurring' : ''}
                        </button>
                    </div>
                </div>
            </div>
        `).join('')}
        <button id="Clear-button" class="btn btn-danger">Clear All Completed</button>
    `;
    
    this.completedTasksDiv.innerHTML = content;
    this.initCompletedTasksListeners();
  }

initCompletedTasksListeners() {

    const clearButton = document.getElementById('Clear-button');
    if (clearButton) {
        clearButton.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('clearCompleted'));
        });
    }

    const deleteButtons = document.querySelectorAll('.delete-completed');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = parseInt(button.dataset.id);
            document.dispatchEvent(new CustomEvent('deleteCompleted', { 
                detail: { id }
            }));
        });
    });
  }

  hideCompletedTasks() {
    this.completedTasksDiv.innerHTML = '<h2>Completed Habits</h2><p>No completed habits yet</p>';
  }
}
