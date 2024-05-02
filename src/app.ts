import { DocxCreator } from "./components/DocCreator/DocxCreator.ts";
import { CsvParser } from "./components/CsvParser/CsvParser.ts";

class App {
    private readonly button = document.createElement("button");
    private readonly dropzone = document.createElement("div");
    private readonly DocCreator = new DocxCreator();
    private readonly CsvParser = new CsvParser();

    constructor() {
        this.initDropzone();

        this.button.textContent = "Click me!";
        this.button.addEventListener("click", () => {
            this.DocCreator.generate([]);
        });
    }

    public init() {
        const appElement = document.getElementById("app");

        if (!appElement) {
            throw new Error("Missing element with 'app' id.");
        }

        appElement.append(this.button);
        appElement.append(this.dropzone);
    }

    private initDropzone() {
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

            this.CsvParser.parse(files[0], (data: string[][]) => this.DocCreator.generate(data));

            onDragLeaveHandler();
        };

        this.dropzone.addEventListener("dragenter", onDragEnterHandler, false);
        this.dropzone.addEventListener("dragleave", onDragLeaveHandler, false);
        this.dropzone.addEventListener("drop", onDropHandler, false);
    }
}

export default new App();
