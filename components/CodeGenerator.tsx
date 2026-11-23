import { classNames } from '../styles/classNames';
import React, { useState, useEffect } from 'react';
import { CodeBlock } from './CodeBlock';
import { Settings, RefreshCw, Layers } from 'lucide-react';
import styles from './styles/CodeGenerator.module.css';

type ComponentType = 'DigitalOut' | 'DigitalIn' | 'PwmOut' | 'AnalogIn' | 'Ticker' | 'InterruptIn';

export const CodeGenerator: React.FC = () => {
  const [type, setType] = useState<ComponentType>('DigitalOut');
  const [pin, setPin] = useState('PTA0');
  const [variableName, setVariableName] = useState('myDevice');
  const [extraParam, setExtraParam] = useState('0.5'); // Used for period, interval, etc.
  const [generatedCode, setGeneratedCode] = useState('');

  useEffect(() => {
    generate();
  }, [type, pin, variableName, extraParam]);

  const generate = () => {
    const includes = `#include "DarkLight.h"`;
    let setup = '';
    let loop = '';
    let globals = '';
    let functions = '';

    switch (type) {
      case 'DigitalOut':
        globals = `DigitalOut ${variableName}(${pin});`;
        loop = `    ${variableName}.write(1); // Set High (3.3V)\n    wait_ms(500);\n    ${variableName}.write(0); // Set Low (0V)\n    wait_ms(500);`;
        break;
      case 'DigitalIn':
        globals = `DigitalIn ${variableName}(${pin});`;
        setup = `    ${variableName}.mode(PullUp); // Internal pull-up resistor`;
        loop = `    int state = ${variableName}.read();\n    if(state) {\n        // Pin is High\n    }`;
        break;
      case 'PwmOut':
        globals = `PwmOut ${variableName}(${pin});`;
        setup = `    ${variableName}.period(0.020); // 20ms period`;
        loop = `    ${variableName}.write(${extraParam}); // ${parseFloat(extraParam) * 100}% Duty Cycle\n    wait_ms(100);`;
        break;
      case 'AnalogIn':
        globals = `AnalogIn ${variableName}(${pin});`;
        loop = `    float val = ${variableName}.read(); // 0.0 - 1.0\n    float volts = val * 3.3;\n    wait_ms(100);`;
        break;
      case 'Ticker':
        globals = `Ticker ${variableName};\nDigitalOut led(LED1);`;
        functions = `void blink_callback() {\n    led = !led;\n}`;
        setup = `    // Call callback every ${extraParam} seconds\n    ${variableName}.attach(&blink_callback, ${extraParam});`;
        loop = `    // Main loop runs freely\n    wait_ms(1000);`;
        break;
      case 'InterruptIn':
        globals = `InterruptIn ${variableName}(${pin});\nvolatile bool triggered = false;`;
        functions = `void isr_handler() {\n    triggered = true;\n}`;
        setup = `    ${variableName}.rise(&isr_handler); // Trigger on rising edge`;
        loop = `    if(triggered) {\n        printf("Interrupt Fired!\\n");\n        triggered = false;\n    }`;
        break;
    }

    const code = `${includes}\n\n${globals}\n${functions ? '\n' + functions + '\n' : ''}\nint main() {\n${setup ? setup + '\n\n' : ''}    while(1) {\n${loop}\n    }\n}`;
    setGeneratedCode(code);
  };

  return (
    <div className={classNames(styles, styles.layout)}>
      {/* Configuration Panel */}
      <div className={classNames(styles, styles.panel)}>
        <h3 className={classNames(styles, styles.heading)}>
          <Settings size={20} className={classNames(styles, styles.accentIcon)} />
          Configuration
        </h3>

        <div className={classNames(styles, styles.fields)}>
          <div>
            <label className={classNames(styles, styles.label)}>Function / Class</label>
            <div className={classNames(styles, styles.types)}>
              {(['DigitalOut', 'DigitalIn', 'PwmOut', 'AnalogIn', 'Ticker', 'InterruptIn'] as ComponentType[]).map(t => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={classNames(styles, `${styles.typeButton} ${type === t ? styles.typeSelected : ''}`)}
                >
                  {type === t && <Layers size={14} />}
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className={classNames(styles, styles.pair)}>
             <div>
                <label className={classNames(styles, styles.label)}>Object Name</label>
                <input 
                  type="text" 
                  value={variableName}
                  onChange={(e) => setVariableName(e.target.value)}
                  className={classNames(styles, styles.input)}
                />
             </div>
             
             {type !== 'Ticker' && (
               <div>
                  <label className={classNames(styles, styles.label)}>Pin Name</label>
                  <select 
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className={classNames(styles, styles.input)}
                  >
                    <option value="PTA0">PTA0</option>
                    <option value="PTA5">PTA5</option>
                    <option value="PTB2">PTB2</option>
                    <option value="PTC10">PTC10</option>
                    <option value="LED1">LED1</option>
                    <option value="LED_BUILTIN">LED_BUILTIN</option>
                  </select>
               </div>
             )}
          </div>

          {(type === 'PwmOut' || type === 'Ticker') && (
            <div>
              <label className={classNames(styles, styles.label)}>
                {type === 'PwmOut' ? 'Duty Cycle (0.0 - 1.0)' : 'Interval (seconds)'}
              </label>
              <input 
                type="number" 
                step="0.1"
                min="0"
                max={type === 'PwmOut' ? "1" : "100"}
                value={extraParam}
                onChange={(e) => setExtraParam(e.target.value)}
                className={classNames(styles, styles.input)}
              />
            </div>
          )}
          
          <button 
             onClick={generate}
             className={classNames(styles, styles.regenerate)}
          >
             <RefreshCw size={16} /> Regenerate
          </button>
        </div>
      </div>

      {/* Preview Panel */}
      <div className={classNames(styles, styles.preview)}>
        <div className={classNames(styles, styles.previewHeading)}>
           <h3 className={classNames(styles, styles.previewTitle)}>Generated Snippet</h3>
           <span className={classNames(styles, styles.filename)}>main.cpp</span>
        </div>
        <div className={classNames(styles, styles.codeWrap)}>
           <CodeBlock code={generatedCode} language="cpp" />
           <p className={classNames(styles, styles.note)}>
             Copy this code directly into your main project file. Ensure you have the DarkLight library linked in your build system.
           </p>
        </div>
      </div>
    </div>
  );
};
