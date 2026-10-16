import { db } from "@/app";
import { AppError } from "@/error";

export const rejectPostService = async (id: string, reason: string) => {
  const updated = await db.$executeRaw`
    UPDATE "Post"
    SET "rejectedAt" = NOW(),
        "rejection_reason" = ${reason}
    WHERE "id" = ${id} AND is_accepted = false;
  `;

  if (updated === 0) {
    throw new AppError("Pending post not found", 404);
  }
};
