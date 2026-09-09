import z from "zod";
export const updateSessionSchema = z.object({
      title: z.string().min(3, "Title must be at least 3 characters long"),
});
export const updateSessionParamsSchema = z.object({
      sessionID: z.string(),
      id: z.string()
});
