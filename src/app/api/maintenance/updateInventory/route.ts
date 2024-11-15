import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function updateInventoryAfterMaintenance(itemId: any, newCondition: any, lastInspectionDate: any) {
    return await prisma.inventoryItem.update({
      where: { id: itemId },
      data: {
        condition: newCondition,
        lastInspectionDate,
      },
    });
  }
  