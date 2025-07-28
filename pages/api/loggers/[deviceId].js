import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { query } = req;
  const { deviceId: deviceId } = query;

  if (req.method === "GET") {
    try {
      const logs = await prisma.log.findMany({
        where: {
          deviceId: deviceId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      res.status(200).json(logs);
    } catch (error) {
      console.error(`Error fetching logs for device ${deviceId}:`, error);
      res
        .status(500)
        .json({ message: "Error fetching logs", error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
