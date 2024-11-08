const secretToken = 'secret';

export function login(req, res) {
  let body = '';
  req.on('data', chunk => {
      body += chunk.toString();
  });
  req.on('end', () => {
      try {
          const { username, password } = JSON.parse(body);
          if (username === 'user' && password === 'password') {
              res.writeHead(200, { 'Content-Type': 'application/json', 'Authorization': `Bearer ${secretToken}` });
              res.end(JSON.stringify({ message: 'Logged in', token: secretToken }));
          } else {
              res.writeHead(401, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'Invalid credentials' }));
          }
      } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Invalid request format' }));
      }
  });
}

export function isAuthenticated(req, res) {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader === `Bearer ${secretToken}`) {
    return true;
  }
  return false;

}

