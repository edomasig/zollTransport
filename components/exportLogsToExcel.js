// Utility to export logs to Excel using SheetJS (xlsx) - Updated to match Excel template
import * as XLSX from "xlsx";

export function exportLogsToExcel(logs, filename = "nurse_logs.xlsx") {
  // Create workbook
  const workbook = XLSX.utils.book_new();

  // Create worksheet data starting with headers and legend
  const worksheetData = [];

  // Row 1: Legend
  worksheetData.push([
    "Legend = check (√) mark if indicator is met or X if not met.",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  // Row 2: Instructions and weekly tests info
  worksheetData.push([
    "DAILY check for CODE READINESS TEST (√), pads connected, plugged into AC",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "Weekly TESTS: EVERY TUESDAY , see instructions in binder.",
    "",
    "",
    "",
    "",
    "",
  ]);

  // Row 3: Battery check instruction and manual tests
  worksheetData.push([
    "DAILY Battery Check. If LOW send to Healthcare Technology Management (BIOMED) for replacement.",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "***Manual Defibrillator, Pacer, and Recorder. PLUGGED INTO AC.",
    "",
    "",
    "",
    "",
    "",
  ]);

  // Row 4: Main headers
  worksheetData.push([
    "Day",
    "Week Day",
    "Time",
    "Defibrillator or Device ID",
    "DAILY CODE READINESS TEST",
    "DAILY BATTERY CHECK",
    "WEEKLY MANUAL DEFIB TEST",
    "WEEKLY PACER TEST",
    "WEEKLY RECORDER",
    "PADS: NOT EXPIRED",
    "Freq / Earliest Expiration Date",
    "Follow up / Corrective Action",
    "Print Name & Title",
    "",
  ]);

  // Add log data rows
  logs.forEach((log) => {
    worksheetData.push([
      // Format date as MM/DD/YYYY
      new Date(log.day).toLocaleDateString("en-US"),
      // Week day
      log.weekDay ||
        new Date(log.day).toLocaleDateString("en-US", { weekday: "long" }),
      // Time
      log.time ||
        new Date(log.day).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      // Device ID
      log.deviceId || "",
      // Daily Code Readiness Test - use √ or X
      log.dailyCodeReadinessTest ? "√" : "X",
      // Daily Battery Check - use √ or X
      log.dailyBatteryCheck ? "√" : "X",
      // Weekly Manual Defib Test - use √ or X
      log.weeklyManualDefibTest ? "√" : "X",
      // Weekly Pacer Test - use √ or X
      log.weeklyPacerTest ? "√" : "X",
      // Weekly Recorder - use √ or X
      log.weeklyRecorder ? "√" : "X",
      // Pads Not Expired - use √ or X
      log.padsNotExpired ? "√" : "X",
      // Expiration Date
      log.expirationDate
        ? new Date(log.expirationDate).toLocaleDateString("en-US")
        : "",
      // Corrective Action
      log.correctiveAction || "",
      // Nurse Name & Title
      log.nurseName || "",
      "",
    ]);
  });

  // Create worksheet from array of arrays
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Set column widths to match the Excel template exactly
  const colWidths = [
    { wch: 10 }, // Day
    { wch: 12 }, // Week Day
    { wch: 8 }, // Time
    { wch: 12 }, // Device ID
    { wch: 12 }, // Daily Code Readiness
    { wch: 12 }, // Daily Battery Check
    { wch: 12 }, // Weekly Manual Defib
    { wch: 12 }, // Weekly Pacer
    { wch: 12 }, // Weekly Recorder
    { wch: 12 }, // Pads Not Expired
    { wch: 15 }, // Expiration Date
    { wch: 30 }, // Corrective Action
    { wch: 18 }, // Print Name & Title
    { wch: 3 }, // Extra column
  ];
  worksheet["!cols"] = colWidths;

  // Merge cells for the legend and instruction rows
  if (!worksheet["!merges"]) worksheet["!merges"] = [];

  // Merge legend row (A1:N1)
  worksheet["!merges"].push({
    s: { r: 0, c: 0 }, // start: row 0, col 0 (A1)
    e: { r: 0, c: 13 }, // end: row 0, col 13 (N1)
  });

  // Merge instruction rows as needed
  worksheet["!merges"].push({
    s: { r: 1, c: 0 }, // Daily check instruction (A2:H2)
    e: { r: 1, c: 7 },
  });

  worksheet["!merges"].push({
    s: { r: 1, c: 8 }, // Weekly tests instruction (I2:N2)
    e: { r: 1, c: 13 },
  });

  worksheet["!merges"].push({
    s: { r: 2, c: 0 }, // Battery check instruction (A3:H3)
    e: { r: 2, c: 7 },
  });

  worksheet["!merges"].push({
    s: { r: 2, c: 8 }, // Manual tests instruction (I3:N3)
    e: { r: 2, c: 13 },
  });

  // Define styling for different sections
  const legendStyle = {
    font: { bold: true, size: 11 },
    alignment: { horizontal: "left", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } },
    },
  };

  const instructionStyle = {
    font: { bold: true, size: 10 },
    alignment: { horizontal: "left", vertical: "center", wrapText: true },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } },
    },
  };

  const weeklyTestStyle = {
    font: { bold: true, size: 10, color: { rgb: "000000" } },
    fill: { fgColor: { rgb: "FFFF00" } }, // Bright yellow background
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } },
    },
  };

  const headerStyle = {
    font: { bold: true, size: 10 },
    fill: { fgColor: { rgb: "D9D9D9" } }, // Light gray background
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    border: {
      top: { style: "medium", color: { rgb: "000000" } },
      bottom: { style: "medium", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } },
    },
  };

  const dataStyle = {
    font: { size: 10 },
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } },
    },
  };

  const tuesdayStyle = {
    font: { size: 10, bold: true },
    fill: { fgColor: { rgb: "FFFF00" } }, // Yellow background for Tuesday
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } },
    },
  };

  // Apply styling to legend row (row 1)
  for (let col = 0; col < 14; col++) {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c: col });
    if (!worksheet[cellRef]) worksheet[cellRef] = { v: "" };
    worksheet[cellRef].s = legendStyle;
  }

  // Apply styling to instruction rows (rows 2-3)
  // Row 2: Daily instructions and weekly tests header
  for (let col = 0; col < 8; col++) {
    const cellRef = XLSX.utils.encode_cell({ r: 1, c: col });
    if (!worksheet[cellRef]) worksheet[cellRef] = { v: "" };
    worksheet[cellRef].s = instructionStyle;
  }

  // Weekly tests section (columns I-N in row 2)
  for (let col = 8; col < 14; col++) {
    const cellRef = XLSX.utils.encode_cell({ r: 1, c: col });
    if (!worksheet[cellRef]) worksheet[cellRef] = { v: "" };
    worksheet[cellRef].s = weeklyTestStyle;
  }

  // Row 3: Battery instruction and manual tests
  for (let col = 0; col < 8; col++) {
    const cellRef = XLSX.utils.encode_cell({ r: 2, c: col });
    if (!worksheet[cellRef]) worksheet[cellRef] = { v: "" };
    worksheet[cellRef].s = instructionStyle;
  }

  // Manual tests section (columns I-N in row 3)
  for (let col = 8; col < 14; col++) {
    const cellRef = XLSX.utils.encode_cell({ r: 2, c: col });
    if (!worksheet[cellRef]) worksheet[cellRef] = { v: "" };
    worksheet[cellRef].s = weeklyTestStyle;
  }

  // Apply styling to main header row (row 4)
  for (let col = 0; col < 14; col++) {
    const cellRef = XLSX.utils.encode_cell({ r: 3, c: col });
    if (worksheet[cellRef]) {
      worksheet[cellRef].s = headerStyle;
    }
  }

  // Apply styling to data rows and highlight specific columns
  for (let row = 4; row < worksheetData.length; row++) {
    const weekDayCell = XLSX.utils.encode_cell({ r: row, c: 1 });
    const isTuesday =
      worksheet[weekDayCell] && worksheet[weekDayCell].v === "Tuesday";

    for (let col = 0; col < 14; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
      if (worksheet[cellRef]) {
        // Apply Tuesday styling to entire row if it's Tuesday
        if (isTuesday) {
          worksheet[cellRef].s = tuesdayStyle;
        } else {
          worksheet[cellRef].s = dataStyle;
        }

        // Special highlighting for weekly test columns (6-8: Manual Defib, Pacer, Recorder)
        if (col >= 6 && col <= 8) {
          worksheet[cellRef].s = {
            ...worksheet[cellRef].s,
            fill: { fgColor: { rgb: isTuesday ? "FFFF00" : "F0F0F0" } }, // Yellow for Tuesday, light gray otherwise
          };
        }
      }
    }
  }

  // Add row height for better visibility
  if (!worksheet["!rows"]) worksheet["!rows"] = [];
  worksheet["!rows"][0] = { hpt: 20 }; // Legend row
  worksheet["!rows"][1] = { hpt: 25 }; // Instruction row 1
  worksheet["!rows"][2] = { hpt: 25 }; // Instruction row 2
  worksheet["!rows"][3] = { hpt: 30 }; // Header row

  // Add the worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Nurse Logs");

  // Export to file
  XLSX.writeFile(workbook, filename);
}

// Alternative function for simpler export without complex formatting
export function exportLogsToExcelSimple(
  logs,
  filename = "nurse_logs_simple.xlsx"
) {
  const headers = [
    "Day",
    "Week Day",
    "Time",
    "Device ID",
    "Daily Code Readiness",
    "Daily Battery Check",
    "Weekly Manual Defib",
    "Weekly Pacer",
    "Weekly Recorder",
    "Pads Not Expired",
    "Expiration Date",
    "Corrective Action",
    "Nurse Name",
  ];

  const data = logs.map((log) => [
    new Date(log.day).toLocaleDateString("en-US"),
    log.weekDay ||
      new Date(log.day).toLocaleDateString("en-US", { weekday: "long" }),
    log.time || new Date(log.day).toLocaleTimeString("en-US"),
    log.deviceId || "",
    log.dailyCodeReadinessTest ? "Yes" : "No",
    log.dailyBatteryCheck ? "Yes" : "No",
    log.weeklyManualDefibTest ? "Yes" : "No",
    log.weeklyPacerTest ? "Yes" : "No",
    log.weeklyRecorder ? "Yes" : "No",
    log.padsNotExpired ? "Yes" : "No",
    log.expirationDate
      ? new Date(log.expirationDate).toLocaleDateString("en-US")
      : "",
    log.correctiveAction || "",
    log.nurseName || "",
  ]);

  const worksheetData = [headers, ...data];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Logs");

  XLSX.writeFile(workbook, filename);
}
