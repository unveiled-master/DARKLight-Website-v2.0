import { classNames } from '../styles/classNames';
import React, { useState } from 'react';
import { Zap, Activity, Radio, Cpu, Info, Minimize2 } from 'lucide-react';
import styles from './styles/PinoutDiagram.module.css';

interface PinData {
  id: number;
  name: string;
  capabilities: string[];
  description: string;
}

// Generate 49 pins with simulated specific capabilities matching DarkLight specs
// 0-15: Port A (ADC capable)
// 16-33: Port B (PWM capable)
// 34-48: Port C (General Digital/Interrupt)
const generatePins = (): PinData[] => {
  return Array.from({ length: 49 }, (_, i) => {
    const caps = ['DigitalIn', 'DigitalOut'];
    let port = 'A';
    let pinNum = i;
    let desc = "General Purpose I/O";

    if (i < 16) {
      port = 'A';
      caps.push('AnalogIn');
      desc = "High-precision Analog Input (ADC) enabled pin.";
    } else if (i < 34) {
      port = 'B';
      pinNum = i - 16;
      caps.push('PwmOut');
      caps.push('InterruptIn'); // Overlapping interrupt capability
      desc = "PWM capable pin for motor control or signal generation.";
    } else {
      port = 'C';
      pinNum = i - 34;
      caps.push('InterruptIn');
      desc = "Digital I/O with hardware interrupt capability.";
    }

    return {
      id: i + 1,
      name: `PT${port}${pinNum}`,
      capabilities: caps,
      description: desc
    };
  });
};

const PINS = generatePins();

export const PinoutDiagram: React.FC = () => {
  const [selectedPin, setSelectedPin] = useState<PinData | null>(null);

  const renderPin = (pin: PinData) => {
    const isSelected = selectedPin?.id === pin.id;
    const isPWM = pin.capabilities.includes('PwmOut');
    const isADC = pin.capabilities.includes('AnalogIn');

    // Color coding based on primary capability
    let pinColor = styles.pinDigital;
    if (isPWM) pinColor = styles.pinPwm;
    else if (isADC) pinColor = styles.pinAnalog;
    
    if (isSelected) pinColor = styles.pinSelected;

    return (
      <button
        key={pin.id}
        onClick={() => setSelectedPin(pin)}
        className={classNames(styles, `${styles.pin} ${pinColor}`)}
        title={`${pin.name} - Click for details`}
      >
        {pin.id}
        {isSelected && (
           <span className={classNames(styles, styles.pinMarker)} />
        )}
      </button>
    );
  };

  return (
    <div className={classNames(styles, styles.diagram)}>
      <div className={classNames(styles, styles.content)}>
        
        {/* Visual Board Representation */}
        <div className={classNames(styles, styles.boardColumn)}>
          <div className={classNames(styles, styles.legend)}>
             <div className={classNames(styles, styles.legendItem)}><div className={classNames(styles, `${styles.swatch} ${styles.analogSwatch}`)}></div> Analog (ADC)</div>
             <div className={classNames(styles, styles.legendItem)}><div className={classNames(styles, `${styles.swatch} ${styles.pwmSwatch}`)}></div> PWM</div>
             <div className={classNames(styles, styles.legendItem)}><div className={classNames(styles, `${styles.swatch} ${styles.digitalSwatch}`)}></div> Digital I/O</div>
          </div>

          <div className={classNames(styles, styles.board)}>
            {/* Chip Label */}
            <div className={classNames(styles, styles.chipWatermark)}>
                <Cpu size={200} />
            </div>
            <div className={classNames(styles, styles.chipLabel)}>
                <h3 className={classNames(styles, styles.chipTitle)}>DARKLIGHT</h3>
                <span className={classNames(styles, styles.chipVersion)}>DL-CORE-V2</span>
            </div>

            {/* Pins Grid - Simulating a board layout */}
            <div className={classNames(styles, styles.banks)}>
              {/* Left Bank */}
              <div className={classNames(styles, styles.pinBank)}>
                {PINS.slice(0, 25).map(renderPin)}
              </div>
              
              {/* Right Bank */}
              <div className={classNames(styles, styles.pinBank)}>
                {PINS.slice(25, 49).map(renderPin)}
              </div>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className={classNames(styles, styles.info)}>
          <h3 className={classNames(styles, styles.infoHeading)}>
            <Info size={20} className={classNames(styles, styles.accentIcon)} />
            Pin Details
          </h3>
          
          {selectedPin ? (
            <div className={classNames(styles, styles.pinDetails)}>
              <div className={classNames(styles, styles.detailSection)}>
                <span className={classNames(styles, styles.pinName)}>{selectedPin.name}</span>
                <span className={classNames(styles, styles.physicalPin)}>Physical Pin: {selectedPin.id}</span>
              </div>
              
              <div className={classNames(styles, styles.detailSection)}>
                <h4 className={classNames(styles, styles.detailTitle)}>Capabilities</h4>
                <div className={classNames(styles, styles.capabilities)}>
                  {selectedPin.capabilities.map(cap => (
                    <span key={cap} className={classNames(styles, styles.capability)}>
                      {cap === 'PwmOut' && <Zap size={10} />}
                      {cap === 'AnalogIn' && <Activity size={10} />}
                      {cap === 'InterruptIn' && <Radio size={10} />}
                      {cap === 'DigitalOut' && <Minimize2 size={10} />}
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className={classNames(styles, styles.detailTitle)}>Description</h4>
                <p className={classNames(styles, styles.description)}>
                  {selectedPin.description}
                </p>
              </div>
            </div>
          ) : (
            <div className={classNames(styles, styles.empty)}>
              <Cpu size={48} />
              <p>Select a pin on the board diagram to view its specific configuration and hardware capabilities.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
