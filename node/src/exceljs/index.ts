import ExcelJS, { Workbook } from 'exceljs';
import { readFileSync } from 'fs';

const embedValuesOnTemplate = async (outputWorkbook: Workbook, templateWorkbook: Workbook): Promise<void> => {
  for (const templateWorksheet of templateWorkbook.worksheets) {
    const outputWorksheet = outputWorkbook.addWorksheet(
      templateWorksheet.name,
    )
    outputWorksheet.model = templateWorksheet.model
    outputWorksheet.state = templateWorksheet.state

    for (let r = 1; r <= templateWorksheet.rowCount; r++) {
      outputWorksheet.getRow(r).height = templateWorksheet.getRow(r).height

      for (let c = 1; c <= templateWorksheet.columnCount; c++) {
        if (r === 1) outputWorksheet.getColumn(c).width = templateWorksheet.getColumn(c).width

        const outputCell = outputWorksheet.getCell(r, c)
        const templateCell = templateWorksheet.getCell(r, c)
        outputCell.style = templateCell.style

        // TODO: parse template cell value and embed value from resource object
        outputCell.value = templateCell.value
      }
    }
  }
}

const main = async () => {
  const [outputWorkbook, templateWorkbook] = [
    new ExcelJS.Workbook(),
    new ExcelJS.Workbook(),
  ];
  // read Workbook from buffer
  await templateWorkbook.xlsx.load(readFileSync('./template.xlsx'))
  await embedValuesOnTemplate(outputWorkbook, templateWorkbook);

  const buffer = await outputWorkbook.xlsx.writeBuffer();
  await outputWorkbook.xlsx.writeFile('./result.xlsx')

  return new Uint8Array(buffer);
}

(async () => {
  await main()
})()
