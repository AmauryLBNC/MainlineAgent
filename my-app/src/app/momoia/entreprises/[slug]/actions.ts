"use server";

import { LikeValue } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { CompanyPageCompany } from "./types";
import { getCompanyProfileMetadata, toNullableNumber } from "./utils";

export async function getCompanyPageCompany(
  slug: string,
  userId?: string
): Promise<CompanyPageCompany | null> {
  const companyRecord = await prisma.company.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      name: true,
      ticker: true,
      sector: true,
      country: true,
      website: true,
      financialMetrics: {
        orderBy: {
          asOf: "desc",
        },
        take: 1,
        select: {
          asOf: true,
          revenue: true,
          netIncome: true,
          debt: true,
          freeCashFlow: true,
          ebitda: true,
          peRatio: true,
          netMargin: true,
        },
      },
      extraFinancial: {
        select: {
          metadata: true,
        },
      },
      likes: {
        where: {
          value: LikeValue.LIKE,
        },
        select: {
          userId: true,
        },
      },
    },
  });

  if (!companyRecord) {
    return null;
  }

  const latestFinancialMetrics = companyRecord.financialMetrics[0] ?? null;
  const companyLikes = companyRecord.likes;

  return {
    id: companyRecord.id,
    slug: companyRecord.slug,
    name: companyRecord.name,
    ticker: companyRecord.ticker,
    sector: companyRecord.sector,
    country: companyRecord.country,
    website: companyRecord.website,
    metadata: getCompanyProfileMetadata(companyRecord.extraFinancial?.metadata),
    latestMetrics: latestFinancialMetrics
      ? {
          asOf: latestFinancialMetrics.asOf,
          revenue: toNullableNumber(latestFinancialMetrics.revenue),
          netIncome: toNullableNumber(latestFinancialMetrics.netIncome),
          debt: toNullableNumber(latestFinancialMetrics.debt),
          freeCashFlow: toNullableNumber(latestFinancialMetrics.freeCashFlow),
          ebitda: toNullableNumber(latestFinancialMetrics.ebitda),
          peRatio: toNullableNumber(latestFinancialMetrics.peRatio),
          netMargin: toNullableNumber(latestFinancialMetrics.netMargin),
        }
      : null,
    likesCount: companyLikes.length,
    isLiked: userId
      ? companyLikes.some((companyLike) => companyLike.userId === userId)
      : false,
  };
}

export async function toggleCompanyPageLike(userId: string, slug: string) {
  const companyRecord = await prisma.company.findUnique({
    where: { slug },
    select: {
      id: true,
    },
  });

  if (!companyRecord) {
    return null;
  }

  const existingLike = await prisma.userLike.findUnique({
    where: {
      userId_companyId: {
        userId,
        companyId: companyRecord.id,
      },
    },
  });

  if (existingLike?.value === LikeValue.LIKE) {
    await prisma.userLike.delete({
      where: {
        userId_companyId: {
          userId,
          companyId: companyRecord.id,
        },
      },
    });
  } else if (existingLike) {
    await prisma.userLike.update({
      where: {
        userId_companyId: {
          userId,
          companyId: companyRecord.id,
        },
      },
      data: {
        value: LikeValue.LIKE,
      },
    });
  } else {
    await prisma.userLike.create({
      data: {
        userId,
        companyId: companyRecord.id,
        value: LikeValue.LIKE,
      },
    });
  }

  const likesCount = await prisma.userLike.count({
    where: {
      companyId: companyRecord.id,
      value: LikeValue.LIKE,
    },
  });

  return {
    liked: !existingLike || existingLike.value !== LikeValue.LIKE,
    likesCount,
  };
}
