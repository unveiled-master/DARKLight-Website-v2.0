import { classNames } from '../styles/classNames';
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './styles/ImageCarousel.module.css';

const uhuruBoardImg = new URL('../images/pic-microcontroller-projects.jpg', import.meta.url).href;
const katanaBoardImg = new URL('../images/PTS-00204-211_Application_d90dc395-121e-42a0-bf84-adc077d6b4f8_480x480.webp', import.meta.url).href;
const bravoBoardImg = new URL('../images/Best_Microcontrollers_for_Robotics.webp', import.meta.url).href;
const uhuruConnectImg = new URL('../images/mcubanner.jpg', import.meta.url).href;
const katanaConnectImg = new URL('../images/PTS-00204-211_Application_d90dc395-121e-42a0-bf84-adc077d6b4f8_480x480.webp', import.meta.url).href;
const pinoutDiagramA = new URL('../images/mcu-pinout.webp', import.meta.url).href;
const pinoutDiagramB = new URL('../images/images.jpeg', import.meta.url).href;

export const BOARDS = [
  {
    title: 'DarkLight Uhuru',
    description:
      "Uhuru is the entry board in the DarkLight development board lineup. Designed for learning, rapid prototyping, and professional embedded development.",
    specs: [
      '48MHz Arm Cortex M0 CPU',
      '256 Kbytes Flash',
      '32 Kbytes SRAM',
      '48 Multiplexed I/O',
      '2 SPI, 2 UART, 2 I2C',
      '16 Channel ADC',
      'Advanced PWM Timer',
      '2 Independent Watchdog Timers',
      'DMA',
    ],
    image: {
      url: uhuruBoardImg,
      title: 'DarkLight Uhuru',
      desc: 'Entry-level professional embedded development board.',
    },
    pinoutImage: pinoutDiagramA,
  },
  {
    title: 'DarkLight Katana',
    description:
      "Katana is the mid-tier board in the DarkLight development board lineup. Designed for advanced learning, complex prototyping, and professional embedded development.",
    specs: [
     '48MHz Arm Cortex M0 CPU',
      '256 Kbytes Flash',
      '32 Kbytes SRAM',
      '48 Multiplexed I/O',
      '2 SPI, 2 UART, 2 I2C',
      '16 Channel ADC',
      'Advanced PWM Timer',
      '2 Independent Watchdog Timers',
      'DMA',
    ],
    image: {
      url: katanaBoardImg,
      title: 'DarkLight Katana',
      desc: 'Mid-tier development board for advanced applications.',
    },
    pinoutImage: pinoutDiagramB,
  },
  {
    title: 'DarkLight Bravo',
    description:
      'Bravo is the flagship board in the DarkLight development board lineup. Designed for professional embedded development, complex applications, and high-performance prototyping.',
    specs: [
       '48MHz Arm Cortex M0 CPU',
      '256 Kbytes Flash',
      '32 Kbytes SRAM',
      '48 Multiplexed I/O',
      '2 SPI, 2 UART, 2 I2C',
      '16 Channel ADC',
      'Advanced PWM Timer',
      '2 Independent Watchdog Timers',
      'DMA',
    ],
    image: {
      url: bravoBoardImg,
      title: 'DarkLight Bravo',
      desc: 'Flagship development board for professional applications.',
    },
    pinoutImage: pinoutDiagramA,
  },
  {
    title: 'DarkLight Uhuru Connect',
    description:
      'Uhuru Connect is the entry board in the DarkLight development board lineup with add-on wireless connectivity. Designed for learning, rapid prototyping, and professional embedded development.',
    specs: [
       '48MHz Arm Cortex M0 CPU',
      '256 Kbytes Flash',
      '32 Kbytes SRAM',
      '48 Multiplexed I/O',
      '2 SPI, 2 UART, 2 I2C',
      '16 Channel ADC',
      'Advanced PWM Timer',
      '2 Independent Watchdog Timers',
      'DMA',
    ],
    image: {
      url: uhuruConnectImg,
      title: 'DarkLight Uhuru Connect',
      desc: 'Entry-level board with wireless connectivity.',
    },
    pinoutImage: pinoutDiagramB,
  },
  {
    title: 'DarkLight Katana Connect',
    description:
      'Katana Connect is the mid-tier board in the DarkLight development board lineup with add-on wireless connectivity. Designed for advanced learning, complex prototyping, and professional embedded development.',
    specs: [
       '48MHz Arm Cortex M0 CPU',
      '256 Kbytes Flash',
      '32 Kbytes SRAM',
      '48 Multiplexed I/O',
      '2 SPI, 2 UART, 2 I2C',
      '16 Channel ADC',
      'Advanced PWM Timer',
      '2 Independent Watchdog Timers',
      'DMA',
    ],
    image: {
      url: katanaConnectImg,
      title: 'DarkLight Katana Connect',
      desc: 'Mid-tier board with wireless connectivity.',
    },
    pinoutImage: pinoutDiagramA,
  },
];

interface ImageCarouselProps {
  onSlideChange?: (index: number) => void;
  isPaused?: boolean;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  onSlideChange,
  isPaused = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % BOARDS.length);
  }, []);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + BOARDS.length) % BOARDS.length);
  }, []);

  useEffect(() => {
    onSlideChange?.(currentIndex);
  }, [currentIndex, onSlideChange]);

  useEffect(() => {
    if (isHovering || isPaused) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next, isHovering, isPaused]);

  return (
    <div
      className={classNames(styles, styles.carousel)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {BOARDS.map((board, index) => {
        const isActive = index === currentIndex;
        return (
        <div
          key={index}
          className={classNames(styles, `${styles.slide} ${isActive ? styles.slideActive : styles.slideInactive}`)}
        >
          <img
            src={board.image.url}
            alt={board.image.title}
            className={classNames(styles, styles.image)}
          />

          <div className={classNames(styles, styles.caption)}>
            <h3 className={classNames(styles, styles.title)}>
              {board.image.title}
            </h3>
            <p className={classNames(styles, styles.description)}>
              {board.image.desc}
            </p>
          </div>
        </div>
        );
      })}

      <button
        onClick={prev}
        className={classNames(styles, `${styles.control} ${styles.controlPrevious}`)}
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={next}
        className={classNames(styles, `${styles.control} ${styles.controlNext}`)}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};
