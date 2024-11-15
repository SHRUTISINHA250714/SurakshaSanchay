import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
type EnumMaintenanceStatusFieldUpdateOperationsInput = 'COMPLETED' | 'DISCARDED';
// Submit Maintenance Request
async function submitRequest(userId: any, itemId: any, issueDescription: any) {
  try {
    return await prisma.maintenanceRequest.create({
      data: {
        userId,
        itemId,
        issueDescription,
      },
    });
  } catch (error) {
    console.error("Error in submitRequest:", error);
  }
}

// Approve Request & Assign Technician
async function approveRequest(requestId: any, technicianId: any) {
  try {
    return await prisma.maintenanceRequest.update({
      where: { id: requestId },
      data: {
        status: 'APPROVED',
        technicianId, // Make sure technicianId exists in the schema
        approvalDate: new Date(),
      },
    });
  } catch (error) {
    console.error("Error in approveRequest:", error);
  }
}

// Reject Request
async function rejectRequest(requestId: any, discardReason: any) {
  try {
    return await prisma.maintenanceRequest.update({
      where: { id: requestId },
      data: {
        status: 'REJECTED',
        discardReason,
      },
    });
  } catch (error) {
    console.error("Error in rejectRequest:", error);
  }
}

// Complete Maintenance Request (Repair or Replacement)
async function completeRequest(requestId: any, resolutionDetails: any, isRepaired: any) {
  try {
    const status = isRepaired ? 'COMPLETED' : 'DISCARDED';
    const updateData = isRepaired
      ? { status:'COMPLETED' as EnumMaintenanceStatusFieldUpdateOperationsInput, resolutionDetails, completionDate: new Date() }
      : { status:'DISCARDED' as EnumMaintenanceStatusFieldUpdateOperationsInput, resolutionDetails, discardReason: 'Irreparable', completionDate: new Date() };

    return await prisma.maintenanceRequest.update({
      where: { id: requestId },
      data: updateData,
    });
  } catch (error) {
    console.error("Error in completeRequest:", error);
  }
}
          