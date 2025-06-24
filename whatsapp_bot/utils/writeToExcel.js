import ExcelJS from "exceljs";
import fs from "fs";
const filePath = "./user_data.xlsx";

const appendToExcel = async (userData) => {
  try {
    console.log("Starting Excel write process...");
    console.log("User data received:", userData);
    
    const workbook = new ExcelJS.Workbook();
    
    // Add createdAt field to userData
    const dataWithDate = {
      ...userData,
      createdAt: new Date()
    };
    
    console.log("Data with date:", dataWithDate);
  
    // If file doesn't exist, create it with headers
    if (!fs.existsSync(filePath)) {
      console.log("Excel file doesn't exist, creating new file...");
      const sheet = workbook.addWorksheet("Users");
  
      sheet.columns = [
        { header: "Name", key: "name" },
        { header: "Contact", key: "contact" },
        { header: "Email", key: "email" },
        { header: "Course", key: "course" },
        { header: "Country", key: "country" },
        { header: "University", key: "university" },
        { header: "Date", key: "createdAt" },
      ];
  
      sheet.addRow(dataWithDate);
      await workbook.xlsx.writeFile(filePath);
      console.log("New Excel file created and data saved!");
      return true;
    }
  
    console.log("Excel file exists, reading and checking for duplicates...");
    await workbook.xlsx.readFile(filePath);
    const sheet = workbook.getWorksheet("Users");
    const isDuplicate = sheet.getRows(2, sheet.rowCount - 1).some(row => {
      const emailCell = row.getCell(3).value;
      const contactCell = row.getCell(2).value;
      return (
        (emailCell && emailCell.toString().toLowerCase() === userData.email.toLowerCase()) ||
        (contactCell && contactCell.toString() === userData.contact)
      );
    });
    if (isDuplicate) {
      console.log("Duplicate entry detected. Data not saved.");
      return false;
    }
    sheet.addRow(dataWithDate);
    await workbook.xlsx.writeFile(filePath);
    console.log("Data appended to existing Excel file!");
    return true;
  } catch (error) {
    console.error("Error writing to Excel:", error);
    
    // Handle file lock error specifically
    if (error.code === 'EBUSY' || error.message.includes('resource busy or locked')) {
      throw new Error(`Excel file is locked. Please close user_data.xlsx and try again.`);
    }
    
    throw new Error(`Failed to write to Excel: ${error.message}`);
  }
};

export {appendToExcel};
