
import 'dotenv/config';
import http from 'http';
import app from './app';
import { prisma } from './prismaClient';
import { socketService } from './services/SocketService';

const port = parseInt(process.env.API_PORT || '4000');
const httpServer = http.createServer(app);

// Initialize Robust Socket Architecture
socketService.init(httpServer);

// Use httpServer.listen instead of app.listen
httpServer.listen(port, () => console.log(`API + Socket listening on ${port}`));

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
