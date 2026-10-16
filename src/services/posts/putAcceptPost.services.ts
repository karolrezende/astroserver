import { db } from "@/app";

export const putAcceptPostService = async (id: string) => {
  await db.$executeRaw`
    UPDATE "Post"
    SET is_accepted = true,
        "rejectedAt" = NULL,
        "rejection_reason" = NULL
    WHERE id = ${id}
  `;
};
