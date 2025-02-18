import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import OpenAI from 'openai';
import { env } from "~/env.mjs";
import { b64Image } from "~/data/b64Image";
import AWS from 'aws-sdk';

const S3 = new AWS.S3({
  credentials:{
    accessKeyId: env.ACCESS_KEY_ID,
    secretAccessKey: env.SECRET_ACCESS_KEY,
  },
  region: 'us-west-2',
});

const BUCKET_NAME = 'ranch-generator-app';

const openai = new OpenAI({
  apiKey: process.env.DALLE_API_KEY, // This is the default and can be omitted
});

// const openai = new OpenAI();

async function generateIcon(prompt: string): Promise<string | undefined> {
  if (env.MOCK_DALLE === 'true') {
    return b64Image;
  } else {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json", // to get the image as a base64 string
    });
    // console.log(response.data[0]?.b64_json);
    return response.data[0]?.b64_json;
  }
}


export const generateRouter = createTRPCRouter({
   generateIcon: protectedProcedure
   .input(
    z.object({
    prompt: z.string(),
    color: z.string(),
})
) 
  .mutation(async ({ctx, input}) => {
    // console.log("we made it!", input.prompt);

    //TODO: Verify the user has enough credits to generate an icon
    const {count} = await ctx.prisma.user.updateMany({
      where: {
        id: ctx.session.user.id, //TODO: Update this to the actual user id
        credits: {
          gte: 1,
        },
      },
      data: {
        credits: {
          decrement: 1,
        },
      },
    });

    if (count <= 0) {
      throw new TRPCError ({
        code: "BAD_REQUEST",
        message: "Not enough credits!",
      });
    }

    console.log(count);

    //TODO: Make a fetch request to the API to generate the icon
    // async function main() {
    //   const chatCompletion = await client.chat.completions.create({
    //     messages: [{ role: 'user', content: 'Say this is a test' }],
    //     model: 'gpt-4o',
    //   });
    // }

    const finalPrompt = `A modern icon in ${input.color} of ${input.prompt}, 3d rendered, metallic material, shiny, minimalistic`;
    
    const base64Image = await generateIcon(finalPrompt);
    // console.log(base64);

    const icon = await ctx.prisma.icon.create({
      data: {
        prompt: input.prompt,
        userId: ctx.session.user.id,
      },
    });

    //TODO: Save the generated icon to the S3 bucket
    await S3.putObject({
      Bucket: 'ranch-generator-app',
      // Body: `base64${base64Image}`,
      Body: Buffer.from(base64Image!, 'base64'),
      Key: icon.id, 
      ContentEncoding: 'base64',
      ContentType: 'image/jpeg',
    })
    .promise();


    return {
      imageUrl: `https://${BUCKET_NAME}.s3.us-west-2.amazonaws.com/${icon.id}`,
    };
  }),
});