-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "qrCodeUrl" TEXT NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "day" TIMESTAMP(3) NOT NULL,
    "weekDay" TEXT NOT NULL,
    "time" TEXT,
    "deviceId" TEXT NOT NULL,
    "dailyCodeReadinessTest" BOOLEAN NOT NULL,
    "dailyBatteryCheck" BOOLEAN NOT NULL,
    "weeklyManualDefibTest" BOOLEAN NOT NULL,
    "weeklyPacerTest" BOOLEAN NOT NULL,
    "weeklyRecorder" BOOLEAN NOT NULL,
    "padsNotExpired" BOOLEAN NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "correctiveAction" TEXT NOT NULL,
    "nurseName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
