import express from 'express';
import cors from 'cors';
import userRouter from './routes/user.js';
import categoriesRouter from './routes/categories.js';
import todosRouter from './routes/todos.js';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ["http://localhost:5173", "https://mini-project-3-backend.vercel.app/"],
  credentials: true
}));

app.use('/users', userRouter);
app.use('/categories', categoriesRouter);
app.use('/todos', todosRouter);

app.get('/', (req, res) => {
  try {
    res.send('Default route');
  } catch (error) {
    console.error('Query error:', error);
    res.send(' Sorry Error');
  }
});

app.listen(PORT, () => console.log(`Server ready on port ${PORT}.`));
