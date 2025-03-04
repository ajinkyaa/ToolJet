import React, { useEffect, useMemo, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/mode/handlebars/handlebars';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/sql/sql';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/display/placeholder';
import 'codemirror/addon/search/match-highlighter';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/theme/base16-light.css';
import 'codemirror/theme/duotone-light.css'
import 'codemirror/theme/monokai.css';
import { getSuggestionKeys, onBeforeChange, handleChange } from './utils';
import { resolveReferences } from '@/_helpers/utils';

export function CodeHinter({
  initialValue, 
  onChange, 
  currentState, 
  mode, 
  theme, 
  lineNumbers, 
  className, 
  placeholder, 
  ignoreBraces, 
  enablePreview, 
  height
}) {
  console.log('theme', theme)
  const options = {
    lineNumbers: lineNumbers,
    singleLine: true,
    mode: mode || 'handlebars',
    tabSize: 2,
    theme: theme || 'default',
    readOnly: false,
    highlightSelectionMatches: true,
    placeholder
  };

  const [realState, setRealState] = useState(currentState);
  const [currentValue, setCurrentValue] = useState(initialValue);

  useEffect(() => {
    setRealState(currentState);
  }, [currentState.components]);

  let suggestions = useMemo(() => {
    return getSuggestionKeys(realState);
  }, [realState.components, realState.queries]);

  function valueChanged(editor, onChange, suggestions, ignoreBraces) {
    handleChange(editor, onChange, suggestions, ignoreBraces);
    setCurrentValue(editor.getValue());
  }

  return (
    <div className={`code-hinter ${className || 'codehinter-default-input'}`} key={suggestions.length}>
      <CodeMirror
        value={initialValue}
        realState={realState}
        scrollbarStyle={null}
        height={height || '100%'}
        onBlur={(editor) => { 
          const value = editor.getValue();
          onChange(value);
        }}
        onChange={(editor) => valueChanged(editor, onChange, suggestions, ignoreBraces)}
        onBeforeChange={(editor, change) => onBeforeChange(editor, change, ignoreBraces)}
        options={options}
      />
      {enablePreview && 
        <div className="dynamic-variable-preview bg-azure-lt px-2 py-1">
          {resolveReferences(currentValue, realState)}
        </div>
      }
    </div>
  );
}
