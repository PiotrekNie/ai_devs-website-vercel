import type { ChatCompletionMessageParam } from 'ai/prompts';
import { OpenAIService } from './OpenAIService';
import type { ChatCompletion } from 'openai/resources/index.mjs';

const openAIService = new OpenAIService();

export async function AiCompletion(instruction: string) {
  console.log(instruction);
  const messages: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: `You are a helpful AI assistant who can read a given schema and generate position based on the provided instruction.

      <instruction>${instruction}</instruction>      
      
      <map_schema>
      [S-1-1][G-1-2][T-1-3][H-1-4]
      [G-2-1][F-2-2][G-2-3][G-2-4]
      [G-3-1][G-3-2][R-3-3][T-3-4]
      [M-4-1][M-4-2][C-4-3][W-4-4]
      </map_schema>
      
      <map_legend>
      - S: Start point
      - G: Grass (Trawa)
      - T: Tree (Drzewo)
      - H: House (Dom)
      - F: Windmill (Wiatrak)
      - R: Rocks (Skały)
      - M: Mountain (Góra)
      - C: Car (Samochód)
      - W: Cave (Jaskinia)

      - Number of squares in row and column is 4
      - FIRST Number in brackets [] represents row
      - SECOND Number in brackets [] represents column
      </map_legend>
      
      <prompt_rules>
      - ALWAYS start from the Start point [S-1-1]
      - READ and follow the <instruction> carefully
      - Move EXACTLY as instructed, no more, no less
      - SCHEMA is 4x4 grid
      - SCHEMA is the representation of the map and legend provided above
      - Move in four directions: up (góra), down (dół), left (lewo), or right (prawo)
      - One step means moving to the adjacent square in the specified direction
      - ALWAYS respond in JSON format
      - Include a "_thinking" include a process of following the <instruction>
      - Each step object should have "action" and "position" keys
      - The "description" key should contain the Polish name of the final location
      - The "position" key should contain the final position in [X-Y-Z] format
      </prompt_rules>
      
      <example>
      NOTE: These examples are for illustrative purposes only.

      **INSTRUCTION**: "Idziemy na sam dół mapy. Następnie idziemy maksymalnie w prawo. Co się tam znajduje?"
      **AI**:
      {
        "_thinking": "I am starting from position [S-1-1] and following the instruction: Move to the very down of the map [M-4-1]. Then move to the very right of the map [W-4-4]. The final position is [W-4-4].",
        "description": "Jaskinia",
        "poisition": "[W-4-4]"
      }

      **INSTRUCTION**: "Idziemy dwa pola w prawo. Albo nie! Zaczynamy od nowa. Idziemy 2 pola w prawo. Następnie przesuwamy się 2 pola w dół. Co się tam znajduje?"
      **AI**:
      {
        "_thinking": "I am starting from position [S-1-1] and following the instruction: Move 2 steps to the right, then move 2 steps down. The final position is [R-3-3].",
        "description": "Skały",
        "poisition": "[R-3-3]"
      }
      </example>`,
    },
  ];
  const config = {
    messages,
    model: 'gpt-4o-mini',
    stream: false,
    jsonMode: false,
    maxTokens: 4096,
  };

  try {
    const chatCompletion = (await openAIService.completion(
      config
    )) as ChatCompletion;

    if (!chatCompletion.choices || chatCompletion.choices.length === 0) {
      throw new Error('No text found in the image.');
    }

    return chatCompletion.choices[0].message.content || '';
  } catch (error) {
    console.error('Error in processing AI response:', error);
    return '';
  }
}
