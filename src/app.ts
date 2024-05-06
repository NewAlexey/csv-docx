import { DocxCreator } from "./components/DocCreator/DocxCreator.ts";
import { CsvParser } from "./components/CsvParser/CsvParser.ts";

class App {
    private readonly monthInput = document.createElement("input");
    private readonly dropzone = document.createElement("div");
    private readonly DocCreator = new DocxCreator();
    private readonly CsvParser = new CsvParser();

    constructor() {
        this.initDropzone();
        this.initMonthInput();
    }

    public init() {
        const appElement = document.getElementById("app");

        if (!appElement) {
            throw new Error("Missing element with 'app' id.");
        }

        const monthInputContainer = this.initMonthInput();

        appElement.append(monthInputContainer);
        appElement.append(this.dropzone);
    }

    private initMonthInput(): HTMLDivElement {
        const container = document.createElement("div");
        container.classList.add("month-input__container");

        const monthInputId = "month-input";

        const label = document.createElement("label");
        label.htmlFor = monthInputId;
        label.textContent = "Текущий месяц";

        this.monthInput.classList.add("month-input");
        this.monthInput.type = "checkbox";
        this.monthInput.checked = true;
        this.monthInput.id = monthInputId;

        container.append(this.monthInput, label);

        return container;
    }

    private initDropzone() {
        const label = document.createElement("span");
        label.textContent = "Перетяни CSV файл сюда";
        this.dropzone.append(label);

        this.dropzone.classList.add("dropzone");
        ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
            this.dropzone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(event: DragEvent | Event) {
            event.preventDefault();
            event.stopPropagation();
        }

        const onDragEnterHandler = () => this.dropzone.classList.add("dropzone_active");
        const onDragLeaveHandler = () => this.dropzone.classList.remove("dropzone_active");

        const onDropHandler = (event: DragEvent) => {
            const files = event.dataTransfer?.files;

            if (!files || !files[0]) {
                throw new Error("Error when getting file from DOM.");
            }

            const month = this.getMonth();

            this.CsvParser.parse(files[0], month, (data: string[][]) => this.DocCreator.generate(data));

            onDragLeaveHandler();
        };

        this.dropzone.addEventListener("dragenter", onDragEnterHandler, false);
        this.dropzone.addEventListener("dragleave", onDragLeaveHandler, false);
        this.dropzone.addEventListener("drop", onDropHandler, false);
    }

    private getMonth(): number {
        const isCheckboxChecked = this.monthInput.checked;

        return isCheckboxChecked ? new Date().getMonth() + 1 : new Date().getMonth();
    }
}

export default new App();
