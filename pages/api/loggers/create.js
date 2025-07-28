import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      day,
      weekDay,
      time,
      deviceId,
      dailyCodeReadinessTest,
      dailyBatteryCheck,
      weeklyManualDefibTest,
      weeklyPacerTest,
      weeklyRecorder,
      padsNotExpired,
      expirationDate,
      correctiveAction,
      nurseName,
    } = req.body;

    try {
      // Check if device exists
      const device = await prisma.device.findUnique({
        where: { id: deviceId },
      });

      if (!device) {
        return res.status(400).json({ message: "Device not found" });
      }

      // Sanitize string fields to remove null bytes
      function sanitizeString(str) {
        return typeof str === "string" ? str.replace(/\u0000/g, "") : str;
      }

      const newLog = await prisma.log.create({
        data: {
          day: new Date(day),
          weekDay: sanitizeString(weekDay),
          time: sanitizeString(time), // Store as string
          deviceId,
          dailyCodeReadinessTest: dailyCodeReadinessTest === "true",
          dailyBatteryCheck: dailyBatteryCheck === "true",
          weeklyManualDefibTest: weeklyManualDefibTest === "true",
          weeklyPacerTest: weeklyPacerTest === "true",
          weeklyRecorder: weeklyRecorder === "true",
          padsNotExpired: padsNotExpired === "true",
          expirationDate: new Date(expirationDate),
          correctiveAction: sanitizeString(correctiveAction),
          nurseName: sanitizeString(nurseName),
        },
      });
      res.status(201).json(newLog);
    } catch (error) {
      console.error("Error creating log entry:", error);
      res
        .status(500)
        .json({ message: "Error creating log entry", error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
