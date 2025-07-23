import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { deviceId } = req.body;

    if (!deviceId) {
      return res.status(400).json({ message: 'Device ID is required.' });
    }

    try {
      // Delete all logs associated with the device first (due to foreign key constraint)
      await prisma.log.deleteMany({
        where: {
          deviceId: deviceId,
        },
      });

      // Then delete the device itself
      await prisma.device.delete({
        where: {
          id: deviceId,
        },
      });

      res.status(200).json({ message: `Device ${deviceId} and its logs deleted successfully.` });
    } catch (error) {
      console.error(`Error deleting device ${deviceId}:`, error);
      res.status(500).json({ message: 'Error deleting device', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
