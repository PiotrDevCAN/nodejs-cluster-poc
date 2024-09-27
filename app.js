// cluster.js
const cluster = require('cluster');
const http = require('http');
const os = require('os');

// Check if the current process is the master process
if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  console.log(`Master process is running with PID: ${process.pid}`);

  // Fork workers for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // If a worker dies, fork a new one
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Starting a new one...`);
    cluster.fork();
  });
} else {
  // Worker processes share the TCP connection
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`Hello from Node.js! Process: ${process.pid}\n`);
  }).listen(8000);

  console.log(`Worker ${process.pid} started`);
}
