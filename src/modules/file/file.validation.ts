import { z } from "zod";

class FileValidation {
      resultAssenment = z.strictObject({
            grade: z.number().min(0, "Grade must be non-negative").max(100, "Grade must be at most 100"),
            feedback: z.string().optional(),
      });


}
export default new FileValidation();