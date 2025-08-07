// import { Configuration } from "openai";

// export const configureOpenAI = () => {
//   const config = new Configuration({
//     apiKey: process.env.OPEN_AI_SECRET,
//     organization: process.env.OPENAI_ORGANIZATION_ID,
//   });
//   return config;
// };
import OpenAI from "openai";

export const configureOpenAI = () => {
  return new OpenAI({
    apiKey: process.env.OPEN_AI_SECRET,
    organization: process.env.OPENAI_ORGANIZATION_ID,
  });
};
