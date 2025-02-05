import { z } from "zod";
import { Input } from "~/component/Input";

import {
  createTRPCRouter, publicProcedure} from "~/server/api/trpc";

export const generateRouter = createTRPCRouter({
   generateIcon: publicProcedure
   .input(
    z.object({
    prompt: z.string(),
})
) 
  .mutation(({ctx, input}) => {
    console.log("we made it!", input.prompt);
    return {
      message: "success",
    };
  }),
});