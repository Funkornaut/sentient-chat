import {
  type Message,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from 'ai';

import { auth } from '@/app/(auth)/auth';
import { customModel } from '@/lib/ai';
import { models } from '@/lib/ai/models';
import { systemPrompt } from '@/lib/ai/prompts';
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
} from '@/lib/db/queries';
import {
  generateUUID,
  getMostRecentUserMessage,
  sanitizeResponseMessages,
} from '@/lib/utils';

import { generateTitleFromUserMessage } from '../../actions';
import { createDocument } from '@/lib/ai/tools/create-document';
import { updateDocument } from '@/lib/ai/tools/update-document';
import { requestSuggestions } from '@/lib/ai/tools/request-suggestions';
import { getWeather } from '@/lib/ai/tools/get-weather';

//import { predictionMarketTool } from '@/lib/ai/tools/prediction-market';
import { initializeWeb3Tools } from '@/lib/ai/web3-tools';

export const maxDuration = 60;
// Initialize web3 tools
const web3Tools = await initializeWeb3Tools();

type AllowedTools =
  | 'createDocument'
  | 'updateDocument'
  | 'requestSuggestions'
  | 'getWeather'
  | (string & {}); // This allows any string while maintaining type safety

const blocksTools: AllowedTools[] = [
  'createDocument',
  'updateDocument',
  'requestSuggestions',
];

const weatherTools: AllowedTools[] = ['getWeather'];
const web3ToolNames = Object.keys(web3Tools) as AllowedTools[];

const allTools: AllowedTools[] = [
  ...blocksTools,
  ...weatherTools,
  ...web3ToolNames,
];

export async function POST(request: Request) {
  const {
    id,
    messages,
    modelId,
  }: { id: string; messages: Array<Message>; modelId: string } =
    await request.json();

  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const model = models.find((model) => model.id === modelId);

  if (!model) {
    return new Response('Model not found', { status: 404 });
  }

  const userMessage = getMostRecentUserMessage(messages);

  if (!userMessage) {
    return new Response('No user message found', { status: 400 });
  }

  const chat = await getChatById({ id });

  if (!chat) {
    const title = await generateTitleFromUserMessage({ message: userMessage });
    await saveChat({ id, userId: session.user.id, title });
  }
  // user message saved here
  await saveMessages({
    messages: [{ ...userMessage, createdAt: new Date(), chatId: id }],
  });

  return createDataStreamResponse({
    execute: (dataStream) => {
      const result = streamText({
        model: customModel(model.apiIdentifier),
        system: systemPrompt,
        messages,
        maxSteps: 10,
        //experimental_activeTools: allTools,
        experimental_transform: smoothStream({ chunking: 'word' }),
        experimental_generateMessageId: generateUUID,
        tools: {
          ...web3Tools,
          getWeather,
          createDocument: createDocument({ session, dataStream, model }),
          updateDocument: updateDocument({ session, dataStream, model }),
          requestSuggestions: requestSuggestions({
            session,
            dataStream,
            model,
          }),
          //predictionMarket: predictionMarketTool,
        },
        onStepFinish: (event) => {
          console.log('Tool Results:', event.toolResults);
        },
        onFinish: async ({ response }) => {
          if (session.user?.id) {
            try {
              const responseMessagesWithoutIncompleteToolCalls =
                sanitizeResponseMessages(response.messages);
              // log message content
              console.log(
                'Messages to save:',
                responseMessagesWithoutIncompleteToolCalls,
              );

              // bot response saved here
              // Only save non-empty messages
              const validMessages =
                responseMessagesWithoutIncompleteToolCalls.filter(
                  (message) => {
                    const content = message.content;
                    return typeof content === 'string' && content.trim() !== '';
                  }
                );

              if (validMessages.length > 0) {
                await saveMessages({
                  messages: validMessages.map((message) => ({
                    id: message.id,
                    chatId: id,
                    role: message.role,
                    content: message.content,
                    createdAt: new Date(),
                  })),
                });
              }
            } catch (error) {
              console.error('Failed to save chat', error);
            }
          }
        },
        experimental_telemetry: {
          isEnabled: true,
          functionId: 'stream-text',
        },
      });

      result.mergeIntoDataStream(dataStream);
    },
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Not Found', { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    await deleteChatById({ id });

    return new Response('Chat deleted', { status: 200 });
  } catch (error) {
    return new Response('An error occurred while processing your request', {
      status: 500,
    });
  }
}
