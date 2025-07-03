import { z } from "zod/v4";

export const folderNameSchema = z
  .string()
  .max(100, { error: "Folder name can be maximum of length 100." })
  .min(2, { error: "Folder name must be more than of size 2." });

export const createNewFolderSchema = z.object({
  name: folderNameSchema,
  userId: z.string().nonempty({ error: "userId required" }),
  parentId: z.string().optional(),
});
