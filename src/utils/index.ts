import parser from "js-yaml";
import { linter, Diagnostic } from "@codemirror/lint";
import { EditorView } from "@uiw/react-codemirror";


const getErrorLine = (val: string) => {

    let line = -1;
    const doc: string = val

    try {
        parser.load(doc);
    } catch (e: any) {
        line = e.mark.line;

    }

    return line;
};



const jsonToYaml = (file: object): string => {
    try {
        const yaml = parser.dump(file)
        return yaml
    } catch (e: any) {
        return ""
    }
}


type Severity = "hint" | "info" | "warning" | "error";

const yamlLinter = linter((view: EditorView) => {
    const diagnostics: Diagnostic[] = [];
    const doc: string = view.state.doc as unknown as string
    try {
        parser.load(doc);
    } catch (e: any) {
        const loc = e.mark;
        const from = loc ? loc.position : 0;
        const to = from;
        const severity: Severity = "error";

        diagnostics.push({
            from,
            to,
            message: e.message,
            severity
        });
    }

    return diagnostics;
});


const yamlToJson = (text: string): object => {

    return parser.load(text) as object
}

const objectMap = (obj: object, fn: Function) =>
    Object.entries(obj).map(
        ([k, v], i) => fn(v, k, i)

    )


export { getErrorLine, jsonToYaml, yamlToJson, yamlLinter, objectMap }