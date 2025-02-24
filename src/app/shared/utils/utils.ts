import { QuizDetails } from '../types/quiz-details.model';

export const API_URL =
  'https://api-inference.huggingface.co/models/google/gemma-2-2b-it';
export const API_KEY = 'hf_xxx';

/** Extract JSON from AI Response */
export function extractJson(text: string): string {
  try {
    // Match the first literal occurrence of "Response_Start and Response_End" and remove it
    const cleanedInput = text
      .replace(/Response_Start and Response_End/, '')
      .replace('```json', '')
      .replace('```', '')
      .replace(/,\s*([}\]])/g, '$1');

    // Now, extract the content between the next "Response_Start" and "Response_End"
    const match = cleanedInput.match(/Response_Start([\s\S]*?)Response_End/);

    // If match found, return the extracted data, trimmed
    if (match) {
      return match[1].trim();
    }
  } catch (error) {
    console.error('Error extracting JSON:', error);
  }
  return text;
}

function extractLargeJsonBlocks(jsonText: string): string[] {
  return Array.from(
    jsonText.matchAll(/"topic": "Angular",([\s\S]*?)"correct_answer"/g)
  )
    .map((match) => match[1].trim())
    .filter((jsonText) => jsonText.length > 200);
}

export const optionNumberDisplayNameMap: Record<number, string> = {
  1: 'A',
  2: 'B',
  3: 'C',
  4: 'D',
  5: 'E',
};

export function getRequestBody(
  quizDetails: QuizDetails,
  loadMoreQuestions: boolean
): { inputs: string } {
  const { topic, subTopic, difficulty } = quizDetails;
  return {
    inputs: `Generate ${
      loadMoreQuestions ? 'more and from different sub-topics,' : ''
    }
    5 multiple-choice quiz questions on "${topic}" ${
      subTopic !== '' ? 'and of "${subTopic}"' : ''
    } of difficulty "${difficulty}". in this JSON format:
        {
          "topic": "${topic}",
          "questions": [
            {
              "question": "What is the capital of France?",
              "options": ["Paris", "London", "Berlin", "Rome"],
              "correct_answer": "Paris"
            }
          ]
        } and wrap the actual generated data between Response_Start and Response_End.`,
  };
}

export const quizCategories: {
  name: string;
  description: string;
  technologies: string[];
}[] = [
  {
    name: 'Web Development',
    description: 'Web Development Technologies',
    technologies: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    name: 'Programming Languages',
    description: 'Programming Languages',
    technologies: ['Python', 'JavaScript', 'Java'],
  },
  {
    name: 'Frontend',
    description: 'Frontend Frameworks',
    technologies: ['React', 'Angular', 'Vue'],
  },
  {
    name: 'Backend',
    description: 'Backend Frameworks',
    technologies: ['Node.js', 'Django', 'Flask'],
  },
  {
    name: 'Database',
    description: 'Database',
    technologies: ['MySQL', 'PostgreSQL', 'MongoDB'],
  },
  {
    name: 'DevOps',
    description: 'DevOps Tools',
    technologies: ['Docker', 'Kubernetes', 'Jenkins'],
  },
];
