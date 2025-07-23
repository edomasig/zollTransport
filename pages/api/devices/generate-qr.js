import { PrismaClient } from '@prisma/client';
import QRCode from 'qrcode';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { deviceId } = req.body;

    if (!deviceId) {
      return res.status(400).json({ message: 'Device ID is required.' });
    }

    try {
      // Check if device exists
      let device = await prisma.device.findUnique({
        where: { id: deviceId },
      });

      if (!device) {
        // If device doesn't exist, create a new one (you might want more robust device creation logic)
        device = await prisma.device.create({
          data: {
            id: deviceId,
            name: `Device ${deviceId}`,
            location: 'Unknown',
            qrCodeUrl: '', // Placeholder, will be updated
          },
        });
      }

      // Generate QR code for the log page URL
      const logPageUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/log/${deviceId}`;
      const qrCodeDataUrl = await QRCode.toDataURL(logPageUrl);

      // Update the device with the new QR code URL
      const updatedDevice = await prisma.device.update({
        where: { id: deviceId },
        data: {
          qrCodeUrl: qrCodeDataUrl,
        },
      });

      res.status(200).json({ qrCodeUrl: updatedDevice.qrCodeUrl, device: updatedDevice });
    } catch (error) {
      console.error('Error generating QR code:', error);
      res.status(500).json({ message: 'Error generating QR code', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
