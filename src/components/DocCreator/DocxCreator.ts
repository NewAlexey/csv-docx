import {
    AlignmentType,
    HeadingLevel,
    Paragraph,
    Table,
    TableCell,
    TableRow,
    WidthType,
    Document,
    Packer,
    IParagraphOptions,
} from "docx";
import { saveAs } from "file-saver";

import { ColumnType, HeaderDataType } from "./types.ts";

export class DocxCreator {
    private readonly COLUMN_WIDTH: Record<ColumnType, number> = {
        first: 500,
        second: 1400,
        third: 6550,
        fourth: 1800,
    };

    private readonly HEADER_DATA_LIST: HeaderDataType[] = [
        { title: "№", column: "first" },
        { title: "Дата", column: "second" },
        { title: "Содержание задач, выполненных за отчетный период", column: "third" },
        { title: "Количество затраченных часов", column: "fourth" },
    ];

    public generate(data: string[][]) {
        console.log("muhehehe");
        const headerRow = this.createHeaderRow();
        const dataRowList = this.createRowList(data);

        const table = this.createTable([headerRow, ...dataRowList]);
        const docFile = this.createDoc(table);

        Packer.toBlob(docFile).then(blob => saveAs(blob, "Time Tracking Krupenya.docx"));
    }

    private createDoc(table: Table) {
        return new Document({
            sections: [
                {
                    children: [table],
                },
            ],
            styles: {
                default: {
                    document: {
                        run: {
                            size: "10pt",
                            font: "Calibri",
                        },
                    },
                },
            },
        });
    }

    private createTable(rows: TableRow[]) {
        return new Table({
            rows,
            columnWidths: Object.values(this.COLUMN_WIDTH),
        });
    }

    private createRowList(data: string[][]): TableRow[] {
        return data.map((dataItem, index) => this.createDataRow(dataItem, index + 1));
    }

    private createDataRow(rowData: string[], ordinalNumber: number): TableRow {
        return new TableRow({
            children: [
                this.getCell(`${ordinalNumber}`, this.COLUMN_WIDTH.first, { alignment: AlignmentType.CENTER }),
                this.getCell(rowData[0], this.COLUMN_WIDTH.second, { alignment: AlignmentType.CENTER }),
                this.getCell(rowData[1], this.COLUMN_WIDTH.third),
                this.getCell(rowData[2], this.COLUMN_WIDTH.fourth, { alignment: AlignmentType.CENTER }),
            ],
        });
    }

    private createHeaderRow() {
        return new TableRow({
            children: this.HEADER_DATA_LIST.map((headerItem) => new TableCell({
                width: {
                    size: this.COLUMN_WIDTH[headerItem.column],
                    type: WidthType.DXA,
                },
                children: [
                    new Paragraph({
                        text: headerItem.title,
                        heading: HeadingLevel.HEADING_2,
                        alignment: AlignmentType.CENTER,
                    }),
                ],
            })),
        });
    }

    private getCell(text: string, size: number, options?: IParagraphOptions) {
        return new TableCell({
            width: {
                size,
                type: WidthType.DXA,
            },
            children: [new Paragraph({ text, ...options })],
        });
    }
}
