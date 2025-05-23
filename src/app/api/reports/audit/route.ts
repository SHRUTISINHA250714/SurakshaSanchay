import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const session = await auth();
    const role = session?.user.role;
    const userId = session?.user.id;

    if (role !== "admin") {
      return NextResponse.json({
        status: 403,
        body: "Forbidden",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const reports = await prisma.auditReport.findFirst({
      where: {
        location: user?.location,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        Policies: true,
        StockAccuracy: true,
      },
    });

    console.log("report:", reports);

    const policies =
      reports?.Policies.map((policy) => ({
        policy: policy.name,
        status: policy.complianceStatus,
        percentage: policy.compliancePercentage,
      })) || [];

    const percentages =
      reports?.Policies.map((policy) => policy.compliancePercentage) || [];

    const keyFindings =
      reports?.Policies.map((policy) => ({
        category: policy.name,
        finding: policy.findings,
        impact: policy.impact,
        recommendation: policy.recommendation,
      })) || [];

    const totalItems = await prisma.inventoryItem.count({
      where: {
        location: user?.location,
      },
    });

    const oneMonthsAgo = new Date();
    oneMonthsAgo.setMonth(oneMonthsAgo.getMonth() - 2);

    const newProcurements = await prisma.inventoryItem.findMany({
      where: {
        location: user?.location, // Ensure to filter by location
        acquisitionDate: {
          gte: oneMonthsAgo,
        },
      },
    });

    const groupedData = await prisma.inventoryItem.groupBy({
      by: ["category"],
      _sum: {
        price: true,
      },
      _count: {
        _all: true,
      },
    });

    const categories = groupedData.map((group) => group.category);
    const inventoryValues = groupedData.map((group) => group._count._all);
    const costValues = groupedData.map((group) =>
      group._sum.price ? group._sum.price : 0,
    );

    const workingItems = await prisma.inventoryItem.count({
      where: {
        location: user?.location,
        NOT: { condition: "damaged" },
      },
    });

    const damagedItems = await prisma.inventoryItem.count({
      where: {
        location: user?.location,
        condition: "damaged",
      },
    });

    const complianceData = {
      policies,
      complianceOverview: percentages,
      labels: [
        "Procurement",
        "Storage",
        "Usage & Deployment",
        "Disposal",
        "Purchase",
      ],
    };

    const valuationData = {
      categories: [
        "Specialized Equipment",
        "Operational Assets",
        "Government-Funded Items",
      ],
      accuracy: [
        reports?.StockAccuracy?.specializedEquipment,
        reports?.StockAccuracy?.operationalAssets,
        reports?.StockAccuracy?.governmentFundedItems,
      ],
    };

    const report = {
      auditDetails: {
        auditOfficerName: reports?.auditOfficerName,
        auditOfficerId: reports?.auditOfficerId,
        auditStartDate: reports?.startDate,
        auditEndDate: reports?.endDate,
      },
      complianceData,
      valuationData,
      keyFindings,
      totalItems,
      damagedItems,
      workingItems,
    };

    return NextResponse.json(report, { status: 200 }); // Changed to 200 for GET request
  } catch (error) {
    console.error("Error creating request:", error);
    return NextResponse.json(
      { error: "Failed to create request" },
      { status: 500 },
    );
  }
}
