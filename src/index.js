import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles.css';
import HabitView from './views/habitView';
import HabitController from './controllers/habitController';

const app = new HabitController(new HabitModel(), new HabitView());