import { useState } from "react";
import { lintGutter } from "@codemirror/lint";
import CodeMirror from "@uiw/react-codemirror";
import * as yamlMode from "@codemirror/legacy-modes/mode/yaml";
import { StreamLanguage } from "@codemirror/language";
import { githubLight } from "@uiw/codemirror-theme-github";
import setIn from 'lodash/fp/set';
import Tree from './Tree'

import { yamlToJson, getErrorLine, yamlLinter, jsonToYaml } from '../utils'

const yaml = StreamLanguage.define(yamlMode.yaml);

const exampleYaml = `---
doe: "a deer, a female deer"
>>,,,
ray: "a drop of golden sun"
pi: 3.14159
xmas: true
french-hens: 3
calling-birds:
  - huey
  - dewey
  - louie
  - fred
xmas-fifth-day:
  calling-birds: four
  french-hens: 3
  golden-rings: 5
  partridges:
    count: 1
    location: "a pear tree"
  turtle-doves: two`;

export function YamlEditor(props: any) {
    const [yamlText, setYamlText] = useState<string>(exampleYaml);
    const [yamlData, setYamlData] = useState<any>();






    const handleUpdateValue = (itemKey: string, newValue: string, index = -1) => {

        if (index > -1) {
            const data = setIn(itemKey + `[${index}]`, newValue, yamlData)
            setYamlData(data)
            setYamlText(jsonToYaml(data))
        } else {
            const data = setIn(itemKey, newValue, yamlData)
            setYamlData(data)
            setYamlText(jsonToYaml(data))
        }
    };


    const handleYamlChange = (newValue: string) => {
        setYamlText(newValue);
        const errorLine = getErrorLine(newValue);
        if (errorLine < 0) {
            setYamlData(yamlToJson(newValue));
        }
    };


    return (
        <div className='container'>
            <Tree
                yamlData={yamlData}
                height='200px'
                handleUpdateValue={handleUpdateValue}
            />
            <CodeMirror
                className="flex-item"
                height="200px"
                value={yamlText}
                theme={githubLight}
                extensions={[yaml, yamlLinter, lintGutter()]}
                onChange={handleYamlChange}
            />

        </div>
    );
}
