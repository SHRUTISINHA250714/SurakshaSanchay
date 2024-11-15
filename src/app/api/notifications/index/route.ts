import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
const prisma=new PrismaClient;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ) {
    if (req.method === 'GET') {
      const { userId, inchargeId } = req.query;
  
      if (!userId && !inchargeId) {
        return res.status(400).json({ error: 'Either userId or inchargeId is required' });
      }
  
      try {
        const notifications = await prisma.notification.findMany({
          where: {
            OR: [
              { userId: userId as string },
              { inchargeId: inchargeId as string },
            ],
          },
          orderBy: { createdAt: 'desc' },
        });
  
        return res.status(200).json({ notifications });
      } catch (error) {
        console.error('Error fetching notifications:', error);
        return res.status(500).json({ error: 'Something went wrong' });
      }
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  }
  