package main

import (
	"log"

	"github.com/xuri/excelize/v2"
)

func main() {
	tf, err := excelize.OpenFile("./template.xlsx")
	if err != nil {
		panic(err)
	}
	defer func() {
		if err := tf.Close(); err != nil {
			panic(err)
		}
	}()

	// loop worksheet and get name
	for _, s := range tf.WorkBook.Sheets.Sheet {
		log.Println(s.Name)
	}

	f := excelize.NewFile()
	templateSheetName := tf.WorkBook.Sheets.Sheet[0].Name
	rows, err := tf.GetRows(templateSheetName)
	currentSheetName := f.WorkBook.Sheets.Sheet[0].Name
	if err != nil {
		panic(err)
	}
	for i, row := range rows {
		// copy row height
		rowHeight, err := tf.GetRowHeight(templateSheetName, i+1)
		if err != nil {
			panic(err)
		}
		if err = f.SetRowHeight(currentSheetName, i+1, rowHeight); err != nil {
			panic(err)
		}

		for j, cell := range row {
			// copy col width if row number is 1
			if i == 0 {
				colName, err := excelize.ColumnNumberToName(j + 1)
				if err != nil {
					panic(err)
				}
				colWidth, err := tf.GetColWidth(templateSheetName, colName)
				if err = f.SetColWidth(currentSheetName, colName, colName, colWidth); err != nil {
					panic(err)
				}
			}

			axis, err := excelize.CoordinatesToCellName(j+1, i+1)
			if err != nil {
				panic(err)
			}
			if err = f.SetCellStr(f.WorkBook.Sheets.Sheet[0].Name, axis, cell); err != nil {
				panic(err)
			}
			cellStyle, err := tf.GetCellStyle(templateSheetName, axis)
			if err != nil {
				panic(err)
			}
			// when copy template cell style to target cell style, file are broken
			// https://github.com/qax-os/excelize/issues/629#issuecomment-625586788
			if err = f.SetCellStyle(currentSheetName, axis, axis, cellStyle); err != nil {
				panic(err)
			}
		}
	}
	f.WorkBook.Sheets.Sheet[0].Name = tf.WorkBook.Sheets.Sheet[0].Name

	f.SaveAs("./result.xlsx")
}
