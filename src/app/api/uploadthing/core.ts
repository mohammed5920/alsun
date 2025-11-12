import { readUser } from "@/lib/data/user";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

async function authMiddleware() {
  const user = await readUser();
  if (!user) throw new UploadThingError("Unauthorized");
  return { userId: user.id };
}

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(authMiddleware)
    .onUploadComplete(async ({ metadata }) => {
      console.log("Image upload complete for userId:", metadata.userId);
      return { uploadedBy: metadata.userId };
    }),

  mixedFileTypeUploader: f({
    blob: { maxFileSize: "64MB", maxFileCount: 1 },
  })
    .middleware(authMiddleware)
    .onUploadComplete(async ({ metadata, file }) => {
      console.log(`File [${file.name}] upload complete for userId:`, metadata.userId);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
