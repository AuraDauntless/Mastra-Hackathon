function doPost(e) {
    try {
        // 1. Parse the incoming JSON data
        var data = JSON.parse(e.postData.contents);

        // 2. Get the active spreadsheet and sheet
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

        // 3. Prepare the row data
        // Columns: TimeStamp | Name | Age | Gender | Score | Finished | Shared
        var rowData = [
            new Date(),       // TimeStamp
            data.name,        // Name
            data.age,         // Age
            data.gender,      // Gender
            data.score,       // Score
            data.finished,    // Finished (true/false)
            data.shared       // Shared (true/false)
        ];

        // 4. Append the row to the sheet
        sheet.appendRow(rowData);

        // 5. Return a success response
        return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        // Handle errors globally
        return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// Optional: specific setup function to create headers if the sheet is empty
function setupSheet() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var headers = ["TimeStamp", "Name", "Age", "Gender", "Score", "Finished", "Shared"];
    sheet.appendRow(headers);
}
