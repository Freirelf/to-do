import { tasks } from '../models/tasks.js'
import { sendJSONResponse } from '../app.js'

export function getTasks(req, res, id) {
  if (id) {
    const task = tasks.find((task => task.id === parseInt(id)));
    if (task) {
      sendJSONResponse(res, 200, task);
    } else {
      sendJSONResponse(res, 404, { message: 'Task not found' });
    }
  } else {
    sendJSONResponse(res, 200, tasks);
  }
}

export function createTask(req, res) {
  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  })

  req.on('end', () => {
    const { title, completed } = JSON.parse(body);

    if (!title || typeof completed !== 'boolean') {
      sendJSONResponse(res, 400, { message: 'Invalid data'})
      return
    }

    const newTask = {
      id: tasks.length + 1,
      title, 
      completed
    }

    tasks.push(newTask)
    sendJSONResponse(res, 201, newTask)
  })
}

export function updateTask(req, res, id) {
  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  })

  req.on('end', () => {
    const { title, completed } = JSON.parse(body)
    const task = tasks.find((task) => task.id === parseInt(id))

    if(!task) {
      sendJSONResponse(res, 404, { message: 'Task not found'})
      return
    }

    if (title) task.title = title;
    if (typeof completed === 'boolean') task.completed = completed;

    sendJSONResponse(res, 200, task);
  })

}

export function deleteTask(req, res, id) {
  const index = tasks.findIndex((task) => task.id === parseInt(id));
  if (index !== -1 ) {
    tasks.splice(index, 1)
    sendJSONResponse(res, 204, {})
  } else {
    sendJSONResponse(res, 404, {message: 'Task not found'})
  }
}

