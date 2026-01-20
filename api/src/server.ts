import 'dotenv/config';
import app from './app';
import { prisma } from './prismaClient';

const port = parseInt(process.env.API_PORT || '4000');
app.listen(port, () => console.log(`API listening on ${port}`));

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
