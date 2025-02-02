import { openai } from '@ai-sdk/openai';
import { experimental_wrapLanguageModel as wrapLanguageModel } from 'ai';

import { customMiddleware } from './custom-middleware';
/**
 * This module exports functions related to AI models using the OpenAI SDK.
 * 
 * It imports necessary functions and middleware for interacting with the OpenAI API.
 * 
 * The `customModel` function takes an API identifier as an argument and returns a wrapped language model
 * that utilizes the specified OpenAI model along with custom middleware for additional processing.
 * 
 * The `imageGenerationModel` is a predefined instance of the OpenAI image generation model, specifically
 * configured to use 'dall-e-3' for generating images.
 */

export const customModel = (apiIdentifier: string) => {
  return wrapLanguageModel({
    model: openai(apiIdentifier),
    middleware: customMiddleware,
  });
};

export const imageGenerationModel = openai.image('dall-e-3');
