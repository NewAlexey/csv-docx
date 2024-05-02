import Papa from "papaparse";

export class CsvParser {
    private readonly dateRegExp = new RegExp("^(?:(?:31(\\/|-|\\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\\1|(?:(?:29|30)(\\/|-|\\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\\2))(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$|^(?:29(\\/|-|\\.)(?:0?2|(?:Feb))\\3(?:(?:(?:1[6-9]|[2-9]\\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\\d|2[0-8])(\\/|-|\\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\\4(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$");

    public parse(file: File, callback: (data: string[][]) => void) {
        Papa.parse<string[]>(file, {
            complete: (results) => {
                console.log("Parsing complete.");
                const data = this.getNeededData(results.data);
                callback(data);
            },
        });
    }
    
    //TODO получать только необходимый месяц и удалить всё что не соответствует. Скорее всего input с нужным месяцем.
    private getNeededData(data: string[][]): string[][] {
        // Из всех данных получаем только дату [0], название тикета [4] и кол-во часов [5]
        const neededDataList = data.map((item) => ([item[0], item[4], item[5]]));
        const sortedData = neededDataList.sort((a, b) => a[0] > b[0] ? 1 : -1);
        const filteredData = sortedData.filter(item => this.dateRegExp.test(item[0]));
        console.log("filteredData~~", filteredData);

        return filteredData;
    }
}
