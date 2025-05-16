
'use server';
/**
 * @fileOverview A chatbot flow for ParkWatch Pass.
 *
 * - chatWithBot - A function that handles interaction with the chatbot.
 * - ChatbotInput - The input type for the chatWithBot function.
 * - ChatbotOutput - The return type for the chatWithBot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit'; // Genkit re-exports Zod's z

export const ChatbotInputSchema = z.object({
  message: z.string().describe('The user message to the chatbot.'),
  history: z.array(
    z.object({
      user: z.string().describe("The user's part of a previous turn in the conversation."),
      model: z.string().describe("The model's part of a previous turn in the conversation."),
    })
  ).optional().describe("Previous conversation history, alternating user and model turns, where each item is a pair of user message and model response."),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

export const ChatbotOutputSchema = z.object({
  reply: z.string().describe('The chatbot reply to the user message.'),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

export async function chatWithBot(input: ChatbotInput): Promise<ChatbotOutput> {
  return chatbotFlow(input);
}

const chatbotPrompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: { schema: ChatbotInputSchema },
  output: { schema: ChatbotOutputSchema },
  prompt: `You are a friendly and helpful AI assistant for ParkWatch Pass, a smart parking application.
Your goal is to assist users with their questions about booking parking, payments, QR codes, app features, or general parking-related queries.
Keep your responses concise, informative, and easy to understand.

Conversation History:
{{#if history}}
{{#each history}}
User: {{{this.user}}}
Assistant: {{{this.model}}}
{{/each}}
{{/if}}

Current User Message:
{{{message}}}

Assistant Reply:`,
});

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await chatbotPrompt(input);
      if (!output || !output.reply) {
        // This can happen if the model doesn't generate a reply or it's filtered.
        return { reply: "I'm sorry, I encountered an issue generating a response. Could you try rephrasing or asking again?" };
      }
      return output;
    } catch (error) {
      console.error("Error in chatbotFlow:", error);
      return { reply: "Apologies, I'm unable to process your request at the moment. Please try again later." };
    }
  }
);
