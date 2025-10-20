import { Transaction, TransactionType, Account } from '../types';

// TypeScript declarations for global variables from CDN scripts
declare const XLSX: any;
declare const jspdf: any;
declare const PizZip: any;
declare const Docxtemplater: any;
declare const saveAs: any;

const getFormattedDateTime = () => {
    return new Date().toLocaleString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
};

const mapTransactionsToExportData = (transactions: Transaction[], baseCurrency: string, accounts: Account[]) => {
    const accountMap = new Map(accounts.map(acc => [acc.id, acc.name]));
    return transactions.map(t => {
        let description = t.merchant || t.category || t.type;
        if (t.isTransfer) description = 'Transfer';
        
        let amountDisplay = `${t.amount.toFixed(2)} ${t.currencyCode}`;
        if (t.type === TransactionType.Income) {
            amountDisplay = `+${amountDisplay}`;
        } else {
            amountDisplay = `-${amountDisplay}`;
        }

        return {
            'Date': t.date,
            'Time': t.time,
            'Type': t.isTransfer ? 'Transfer' : t.type,
            'Account': accountMap.get(t.accountId) || 'Unknown Account',
            'Destination Account': t.isTransfer ? (accountMap.get(t.destinationAccountId!) || 'Unknown Account') : 'N/A',
            'Description': description,
            'Amount': amountDisplay,
            'Base Currency Amount': (t.baseCurrencyAmount && t.type === TransactionType.Outflow) ? `${t.baseCurrencyAmount.toFixed(2)} ${baseCurrency}` : 'N/A',
            'Exchange Rate': (t.exchangeRate && t.type === TransactionType.Outflow) ? t.exchangeRate.toFixed(4) : 'N/A',
            'Recurring': t.isRecurring ? `${t.recurrenceFrequency} (Next: ${t.nextRecurrenceDate})` : 'No',
            'Location': t.locationText || '',
            'Note': t.note || ''
        };
    });
};

export const exportToExcel = (transactions: Transaction[], baseCurrency: string, accounts: Account[]) => {
    const data = mapTransactionsToExportData(transactions, baseCurrency, accounts);
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    XLSX.utils.sheet_add_aoa(worksheet, [
        [`Finance Report - Base Currency: ${baseCurrency}`], 
        [`Generated: ${getFormattedDateTime()}`]
    ], { origin: "A1" });
    XLSX.writeFile(workbook, "Transactions.xlsx");
};

export const exportToPdf = (transactions: Transaction[], baseCurrency: string, accounts: Account[]) => {
    const { jsPDF } = jspdf;
    const doc = new jsPDF({ orientation: 'landscape' });

    doc.setFontSize(18);
    doc.text("Finance Report", 14, 22);
    doc.setFontSize(11);
    doc.text(`Base Currency: ${baseCurrency}`, 14, 30);
    doc.text(`Generated: ${getFormattedDateTime()}`, 14, 36);

    const mappedData = mapTransactionsToExportData(transactions, baseCurrency, accounts);
    const tableColumn = Object.keys(mappedData[0] || {});
    const tableRows = mappedData.map(row => Object.values(row));

    (doc as any).autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 50,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [22, 160, 133] },
    });
    doc.save("Transactions.pdf");
};

export const exportToDocx = async (transactions: Transaction[], baseCurrency: string, accounts: Account[]) => {
  const data = {
      base_currency: baseCurrency,
      generation_timestamp: getFormattedDateTime(),
      transactions: mapTransactionsToExportData(transactions, baseCurrency, accounts).map(t => ({...t, Recurring: t.Recurring.replace(/ /g, '\n')})) // Better formatting for docx
  };
  
  try {
    const response = await fetch('/template.docx');
    if (!response.ok) {
        alert('Could not load DOCX template. Creating a simple one.');
        createAndDownloadDocx(data);
        return;
    }
    const content = await response.arrayBuffer();
    
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    });
    
    doc.render(data);
    
    const out = doc.getZip().generate({
        type: "blob",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    saveAs(out, "Transactions.docx");
  } catch(e) {
      console.error("Error generating DOCX:", e);
      alert("Failed to generate DOCX file. A template 'template.docx' might be needed in the public folder. Creating a simple one as fallback.");
      createAndDownloadDocx(data);
  }
};

const createAndDownloadDocx = (data: {base_currency: string, generation_timestamp: string, transactions: any[]}) => {
    const headers = Object.keys(data.transactions[0] || {});
    const content = `
        <h1>Finance Report</h1>
        <p>Base Currency: ${data.base_currency}</p>
        <p>Generated: ${data.generation_timestamp}</p>
        <table border="1" style="width:100%; border-collapse: collapse;">
            <thead>
                <tr>
                    ${headers.map(h => `<th>${h}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                ${data.transactions.map(t => `
                    <tr>
                        ${headers.map(h => `<td>${t[h] || ''}</td>`).join('')}
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
        "xmlns:w='urn:schemas-microsoft-com:office:word' "+
        "xmlns='http://www.w3.org/TR/REC-html40'>"+
        "<head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header+content+footer;
    
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = 'Transactions.doc';
    fileDownload.click();
    document.body.removeChild(fileDownload);
};