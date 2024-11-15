import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
const prisma=new PrismaClient;
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ) {
    if (req.method === 'PATCH') {
      const { notificationId } = req.body;
  
      if (!notificationId) {
        return res.status(400).json({ error: 'Notification ID is required' });
      }
  
      try {
        const notification = await prisma.notification.update({
          where: { id: notificationId },
          data: { read: true },
        });
  
        return res.status(200).json({ message: 'Notification marked as seen', notification });
      } catch (error) {
        console.error('Error marking notification as seen:', error);
        return res.status(500).json({ error: 'Something went wrong' });
      }
    } else {
      res.setHeader('Allow', ['PATCH']);
      res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  }
  