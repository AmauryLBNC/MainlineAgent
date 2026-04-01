import { prisma } from "@/lib/prisma";

type CreateAnalysisMessageInput = {
  userId: string;
  promptText: string;
  responseText: string;
  keywords: string;
};

export async function listAnalysisMessages(userId: string) {
  return prisma.analysisMessage.findMany({
    where: { userId },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createAnalysisMessage({
  userId,
  promptText,
  responseText,
  keywords,
}: CreateAnalysisMessageInput) {
  return prisma.analysisMessage.create({
    data: {
      userId,
      promptText,
      responseText,
      keywords,
    },
  });
}
