import express from 'express';
import { AiCompletion } from './services/AICompletion';

const UserAgentKey = process.env.AI_DEVS_AGENT_KEY;

if (!UserAgentKey) {
  throw new Error('AI_DEVS_AGENT_KEY is not set in the.env file');
}

const app = express();
const port = 3000;

app.use(express.json());
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

app.get('/', (req, res) => {
  res.send('AGI is here...');
});

app.post('/api/chat', async (req, res) => {
  let { instruction } = req.body;

  if (!instruction) {
    res.status(400).json({ message: 'Instruction is required' });
    return;
  }

  const completion = await AiCompletion(instruction);
  const completionJson = JSON.parse(completion);

  res.status(200).json({
    completion: completionJson,
    description: completionJson?.description || '',
    instruction: instruction,
    success: true,
  });
});
