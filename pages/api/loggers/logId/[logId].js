import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { query } = req;
  const { logId } = query;

  // Fixed boolean conversion - handles both boolean and string inputs
  const convertToBoolean = (value) => {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") return value === "true";
    return Boolean(value);
  };

  // Placeholder for admin authentication
  // In a real application, you would verify if the user is an admin
  const isAdmin = true; // For now, assume true for development

  if (!isAdmin) {
    return res
      .status(403)
      .json({ message: "Forbidden: Admin access required." });
  }

  if (req.method === "PUT") {
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
      const updatedLog = await prisma.log.update({
        where: { id: logId },
        data: {
          day: new Date(day),
          weekDay,
          time,
          deviceId,
          dailyCodeReadinessTest: convertToBoolean(dailyCodeReadinessTest),
          dailyBatteryCheck: convertToBoolean(dailyBatteryCheck),
          weeklyManualDefibTest: convertToBoolean(weeklyManualDefibTest),
          weeklyPacerTest: convertToBoolean(weeklyPacerTest),
          weeklyRecorder: convertToBoolean(weeklyRecorder),
          padsNotExpired: convertToBoolean(padsNotExpired),
          expirationDate: new Date(expirationDate),
          correctiveAction,
          nurseName,
        },
      });
      res.status(200).json(updatedLog);
    } catch (error) {
      console.error(`Error updating log entry ${logId}:`, error);
      res
        .status(500)
        .json({ message: "Error updating log entry", error: error.message });
    }
  } else if (req.method === "DELETE") {
    try {
      await prisma.log.delete({
        where: { id: logId },
      });
      res.status(204).end(); // No content for successful deletion
    } catch (error) {
      console.error(`Error deleting log entry ${logId}:`, error);
      res
        .status(500)
        .json({ message: "Error deleting log entry", error: error.message });
    }
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
