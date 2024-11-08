import http from 'node:http'
import url from 'node:url'
import {createTask, deleteTask, getTasks, updateTask } from './controllers/taskController.js'
import { login, isAuthenticated } from'./helpers/auth.js';

const PORT = 3333;

export function sendJSONResponse(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true); 
  const { pathname, query } = parsedUrl;

  // Rota de login
  if (pathname === '/login' && req.method === 'POST') {
    login(req, res);
    return;
  }

  // Verificar autenticação antes das rotas protegidas
  if (!isAuthenticated(req, res) && pathname.startsWith('/tasks')) {
    sendJSONResponse(res, 401, { message: 'Unauthorized' });
    return;
  }

  // Rotas de tarefas
  if (pathname.startsWith('/tasks')) {
    const id = query.id ? parseInt(query.id) : null;
    switch (req.method) {
      case 'GET':
        getTasks(req, res, id);
        break;
      case 'POST':
        createTask(req, res);
        break;
      case 'PUT':
        updateTask(req, res, id);
        break;
      case 'DELETE':
        deleteTask(req, res, id);
        break;
      default:
        sendJSONResponse(res, 404, { message: 'Not Found' });
        break;
    }
  } else {
    sendJSONResponse(res, 404, { message: 'Not Found' });
  }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
