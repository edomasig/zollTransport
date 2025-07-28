import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handle(req, res) {
  if (req.method === "PUT") {
    const { logId } = req.query;
    const {
      day,
      weekDay,
      time,
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
          time: typeof time === "string" ? time : "", // Ensure time is a string
          dailyCodeReadinessTest: Boolean(dailyCodeReadinessTest),
          dailyBatteryCheck: Boolean(dailyBatteryCheck),
          weeklyManualDefibTest: Boolean(weeklyManualDefibTest),
          weeklyPacerTest: Boolean(weeklyPacerTest),
          weeklyRecorder: Boolean(weeklyRecorder),
          padsNotExpired: Boolean(padsNotExpired),
          expirationDate: new Date(expirationDate),
          correctiveAction,
          nurseName,
        },
      });
      res.json(updatedLog);
    } catch (error) {
      console.error("Error updating log:", error);
      res
        .status(500)
        .json({ error: "Failed to update log", details: error.message });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
