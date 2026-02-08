import jsPDF from 'jspdf';

export const generateSafetyReport = (playerInfo, score, history, logoBase64) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let currentY = 20; // Starting vertical position

    // Add Logo
    if (logoBase64) {
        try {
            const imgProps = doc.getImageProperties(logoBase64);
            const logoWidth = 60; // Standard layout width
            const ratio = imgProps.height / imgProps.width;
            const logoHeight = logoWidth * ratio;

            doc.addImage(logoBase64, 'PNG', (pageWidth - logoWidth) / 2, 10, logoWidth, logoHeight);
            currentY = 10 + logoHeight + 15; // Set next text start after logo + padding
        } catch (e) {
            console.error("Error adding logo to PDF:", e);
            currentY = 25;
        }
    }

    // Title
    doc.setFontSize(22);
    doc.setTextColor(59, 29, 95); // Deep Purple
    doc.text("Cyber Safety Hero Report", pageWidth / 2, currentY, { align: "center" });
    currentY += 15;

    // Player Info
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Hero Name: ${playerInfo.name}`, 20, currentY);
    currentY += 10;
    doc.text(`Age: ${playerInfo.age}`, 20, currentY);
    currentY += 10;
    doc.text(`Final Score: ${Math.floor(score)}`, 20, currentY);
    currentY += 15;

    // Summary
    const correctAnswers = history.filter(h => h.isCorrect).length;
    doc.text(`Total Questions Answered Correctly: ${correctAnswers} / ${history.length}`, 20, currentY);
    currentY += 20;

    // Mistakes / Review Header
    doc.setFontSize(18);
    doc.setTextColor(212, 138, 29); // Accent Orange
    doc.text("Safety Review & Feedback", 20, currentY);
    currentY += 10;

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);

    let y = currentY;
    history.forEach((item, index) => {
        if (y > 270) {
            doc.addPage();
            y = 20;
        }

        doc.setFont(undefined, 'bold');
        doc.text(`${index + 1}. ${item.question}`, 20, y);
        y += 6;

        doc.setFont(undefined, 'normal');
        doc.text(`Your Answer: ${item.userAnswer}`, 25, y);
        y += 5;

        if (!item.isCorrect) {
            doc.setTextColor(168, 50, 50); // Red for mistakes
            doc.text(`Correct Answer: ${item.correctAnswer}`, 25, y);
            doc.setTextColor(0, 0, 0);
            y += 5;
        }

        y += 5; // Spacing between questions
    });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Stay safe online! Powered by CRY Cyber Champs", pageWidth / 2, 285, { align: "center" });

    doc.save(`${playerInfo.name}_CyberSafe_Report.pdf`);
};
