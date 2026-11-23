import { classNames } from '../styles/classNames';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Check, ChevronLeft, ChevronRight, Cpu, 
  ExternalLink, Sparkles, Layers, Radio, Play, Pause, ShieldCheck
} from 'lucide-react';
import { BOARDS } from './ImageCarousel';
import styles from './styles/BoardShowcaseCarousel.module.css';

// Tier metadata to enrich board presentation
interface BoardTierMeta {
  shortName: string;
  tierBadge: string;
  accentClass: string;
  badgeBg: string;
  badgeBorder: string;
  glowGradient: string;
  highlightTag: string;
}

const BOARD_TIERS: Record<number, BoardTierMeta> = {
  0: {
    shortName: 'Uhuru',
    tierBadge: 'Entry Tier • Learn & Prototype',
    accentClass: 'text-brand-400',
    badgeBg: 'bg-brand-500/10',
    badgeBorder: 'border-brand-500/30',
    glowGradient: 'from-brand-500/20 via-brand-600/5 to-transparent',
    highlightTag: 'Ideal for Education & Starters',
  },
  1: {
    shortName: 'Katana',
    tierBadge: 'Mid-Tier • Advanced Prototyping',
    accentClass: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/10',
    badgeBorder: 'border-cyan-500/30',
    glowGradient: 'from-cyan-500/20 via-cyan-600/5 to-transparent',
    highlightTag: 'High-Density Peripherals',
  },
  2: {
    shortName: 'Bravo',
    tierBadge: 'Flagship • High Performance',
    accentClass: 'text-purple-400',
    badgeBg: 'bg-purple-500/10',
    badgeBorder: 'border-purple-500/30',
    glowGradient: 'from-purple-500/20 via-purple-600/5 to-transparent',
    highlightTag: 'Mission-Critical Reliability',
  },
  3: {
    shortName: 'Uhuru Connect',
    tierBadge: 'Connected • Wireless IoT Entry',
    accentClass: 'text-amber-400',
    badgeBg: 'bg-amber-500/10',
    badgeBorder: 'border-amber-500/30',
    glowGradient: 'from-amber-500/20 via-amber-600/5 to-transparent',
    highlightTag: 'WiFi 6 & BLE 5.0 Combo',
  },
  4: {
    shortName: 'Katana Connect',
    tierBadge: 'Connected • Wireless IoT Mid-Tier',
    accentClass: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/10',
    badgeBorder: 'border-emerald-500/30',
    glowGradient: 'from-emerald-500/20 via-emerald-600/5 to-transparent',
    highlightTag: 'Industrial Cloud Ready',
  },
};

const CAROUSEL_SLIDES = [
  { boardIndex: BOARDS.length - 1, isClone: true },
  ...BOARDS.map((_, boardIndex) => ({ boardIndex, isClone: false })),
  { boardIndex: 0, isClone: true },
];

const AUTO_SCROLL_DELAY = 6000; // 6 seconds per slide

interface BoardShowcaseCarouselProps {
  onOpenPinout: (boardIndex: number) => void;
  activeBoard?: number;
  onBoardChange?: (index: number) => void;
}

export const BoardShowcaseCarousel: React.FC<BoardShowcaseCarouselProps> = ({
  onOpenPinout,
  activeBoard = 0,
  onBoardChange,
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(activeBoard);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [scrollStartLeft, setScrollStartLeft] = useState(0);

  // Auto-scroll states adhering to Web Interface Guidelines
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState(false);

  // Honor prefers-reduced-motion changes dynamically
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsAutoPlaying(false);
      }
    };
    mediaQuery.addEventListener('change', handleMotionChange);
    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);

  // Update scroll hints (affordance hints)
  const updateScrollAffordances = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const { scrollLeft, scrollWidth, clientWidth } = scroller;
    setCanScrollLeft(scrollLeft > 20);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 20);
  }, []);

  const scrollToPhysicalSlide = useCallback((physicalIndex: number, behavior: ScrollBehavior) => {
    const target = slideRefs.current[physicalIndex];
    const scroller = scrollerRef.current;
    if (!target || !scroller) return;

    const scrollerRect = scroller.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const targetLeft = scroller.scrollLeft + (targetRect.left - scrollerRect.left) - (scrollerRect.width - targetRect.width) / 2;

    scroller.scrollTo({
      left: Math.max(0, targetLeft),
      behavior,
    });
  }, []);

  // Scroll to a real board. Edge copies are used only for wrapping.
  const scrollToSlide = useCallback((index: number, physicalIndex = index + 1) => {
    if (index < 0 || index >= BOARDS.length) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    scrollToPhysicalSlide(physicalIndex, prefersReducedMotion ? 'auto' : 'smooth');

    setCurrentIndex(index);
    onBoardChange?.(index);
  }, [onBoardChange, scrollToPhysicalSlide]);

  const handlePrev = useCallback(() => {
    if (currentIndex === 0) {
      scrollToSlide(BOARDS.length - 1, 0);
    } else {
      scrollToSlide(currentIndex - 1);
    }
  }, [currentIndex, scrollToSlide]);

  const handleNext = useCallback(() => {
    if (currentIndex === BOARDS.length - 1) {
      scrollToSlide(0, BOARDS.length + 1);
    } else {
      scrollToSlide(currentIndex + 1);
    }
  }, [currentIndex, scrollToSlide]);

  // Keep external selection and the centered card in sync.
  useEffect(() => {
    if (activeBoard >= 0 && activeBoard < BOARDS.length && activeBoard !== currentIndex) {
      scrollToSlide(activeBoard);
    }
  }, [activeBoard, currentIndex, scrollToSlide]);

  // Start with the first real card centered, then loop at either edge after scrolling settles.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    scrollToPhysicalSlide(1, 'auto');

    let settleTimer: ReturnType<typeof setTimeout> | undefined;
    const handleScrollEnd = () => {
      if (settleTimer) clearTimeout(settleTimer);
      settleTimer = setTimeout(() => {
        const scrollerRect = scroller.getBoundingClientRect();
        const center = scrollerRect.left + scroller.clientWidth / 2;
        let nearestIndex = 0;
        let nearestDistance = Number.POSITIVE_INFINITY;

        slideRefs.current.forEach((slide, index) => {
          if (!slide) return;
          const rect = slide.getBoundingClientRect();
          const distance = Math.abs(rect.left + rect.width / 2 - center);
          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestIndex = index;
          }
        });

        const logicalIndex = nearestIndex === 0
          ? BOARDS.length - 1
          : nearestIndex === BOARDS.length + 1
            ? 0
            : nearestIndex - 1;

        setCurrentIndex(logicalIndex);
        onBoardChange?.(logicalIndex);

        if (nearestIndex === 0) {
          scrollToPhysicalSlide(BOARDS.length, 'auto');
        } else if (nearestIndex === BOARDS.length + 1) {
          scrollToPhysicalSlide(1, 'auto');
        }
      }, 120);
    };

    scroller.addEventListener('scroll', handleScrollEnd, { passive: true });
    return () => {
      scroller.removeEventListener('scroll', handleScrollEnd);
      if (settleTimer) clearTimeout(settleTimer);
    };
  }, [onBoardChange, scrollToPhysicalSlide]);

  // Smooth auto-scroll timer: pauses on focus or drag
  useEffect(() => {
    if (!isAutoPlaying || isFocused || isPointerDown) {
      return;
    }

    const timer = setInterval(() => {
      handleNext();
    }, AUTO_SCROLL_DELAY);

    return () => clearInterval(timer);
  }, [isAutoPlaying, isFocused, isPointerDown, handleNext]);

  // Scroll listener for affordances
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    updateScrollAffordances();
    scroller.addEventListener('scroll', updateScrollAffordances, { passive: true });
    window.addEventListener('resize', updateScrollAffordances);

    return () => {
      scroller.removeEventListener('scroll', updateScrollAffordances);
      window.removeEventListener('resize', updateScrollAffordances);
    };
  }, [updateScrollAffordances]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  // Drag-to-scroll implementation
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button, a, input')) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;

    setIsPointerDown(true);
    setDragStartX(e.clientX);
    setScrollStartLeft(scroller.scrollLeft);
    scroller.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDown) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const walk = (e.clientX - dragStartX) * 1.5;
    scroller.scrollLeft = scrollStartLeft - walk;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isPointerDown) return;
    setIsPointerDown(false);
    const scroller = scrollerRef.current;
    if (scroller) {
      try {
        scroller.releasePointerCapture(e.pointerId);
      } catch {
        // no-op if already released
      }
    }
  };

  const handlePointerCancel = (e: React.PointerEvent) => {
    handlePointerUp(e);
  };

  const isPaused = isFocused || isPointerDown;

  return (
    <section 
      className={classNames(styles, "py-16 md:py-20 bg-gray-950 border-y border-gray-900 relative overflow-hidden select-none")}
      aria-roledescription="carousel"
      aria-label="DarkLight Hardware Lineup"
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsFocused(false);
        }
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Background Accent Gradients */}
      <div className={classNames(styles, "absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[140px] pointer-events-none -z-10")} />
      <div className={classNames(styles, "absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[130px] pointer-events-none -z-10")} />

      {/* Screen Reader Live Region for Slide Announcements */}
      <div className={classNames(styles, "sr-only")} aria-live="polite" aria-atomic="true">
        Active slide: {BOARDS[currentIndex].title}
      </div>

      <div className={classNames(styles, "container mx-auto px-4 sm:px-6 lg:px-8 mb-8")}>
        {/* Section Header */}
        <div className={classNames(styles, "flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8")}>
          <div className={classNames(styles, "min-w-0")}>
            <div className={classNames(styles, "inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3.5 py-1 text-xs font-semibold text-brand-300 mb-3 tracking-wide uppercase")}>
              <Cpu size={14} className={classNames(styles, "text-brand-400")} aria-hidden="true" />
              <span>Hardware Lineup</span>
            </div>
            <h2 className={classNames(styles, "text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight text-balance")}>
              Explore the DarkLight Series
            </h2>
            <p className={classNames(styles, "mt-2 text-gray-400 text-base md:text-lg max-w-2xl leading-relaxed text-pretty")}>
              Deterministic performance, non-blocking DMA peripherals, and modular architectures engineered for mission-critical embedded control.
            </p>
          </div>
        </div>

        {/* Board Category Quick-Pills */}
        <div 
          role="tablist" 
          aria-label="Select board"
          className={classNames(styles, "flex items-center gap-2 overflow-x-auto no-scrollbar pb-2")}
        >
          {BOARDS.map((board, idx) => {
            const meta = BOARD_TIERS[idx] || BOARD_TIERS[0];
            const isActive = idx === currentIndex;
            return (
              <button
                key={idx}
                role="tab"
                aria-selected={isActive}
                onClick={() => scrollToSlide(idx)}
                className={classNames(styles, `px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-[transform,background-color,border-color,color,box-shadow] duration-300 whitespace-nowrap flex items-center gap-2 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                  isActive
                    ? 'bg-gray-900 text-white border-brand-500/60 shadow-lg shadow-brand-500/10 ring-1 ring-brand-500/40'
                    : 'bg-gray-900/60 text-gray-400 border-gray-800/80 hover:bg-gray-800 hover:text-gray-200'
                }`)}
              >
                <span
                  className={classNames(styles, `w-2 h-2 rounded-full transition-transform duration-300 ${
                    isActive ? 'bg-brand-400 scale-125 animate-pulse' : 'bg-gray-600'
                  }`)}
                  aria-hidden="true"
                />
                <span>{meta.shortName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Carousel Wrapper with Affordance Edge Hints */}
      <div className={classNames(styles, "relative w-full")}>
        {/* Left Scroll Gradient Affordance */}
        <div 
          className={classNames(styles, `pointer-events-none transition-opacity duration-300 ${
            canScrollLeft ? 'opacity-100' : 'opacity-0'
          }`)}
          aria-hidden="true"
        />

        {/* Right Scroll Gradient Affordance */}
        <div 
          className={classNames(styles, ` pointer-events-none transition-opacity duration-300 ${
            canScrollRight ? 'opacity-100' : 'opacity-0'
          }`)}
          aria-hidden="true"
        />

        {/* Horizontal Scroll Track */}
        <div
          ref={scrollerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onPointerLeave={handlePointerUp}
          className={classNames(styles, `flex gap-3 sm:gap-5 overflow-x-auto snap-x snap-mandatory no-scrollbar py-3 cursor-grab active:cursor-grabbing ${styles.track}`)}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {CAROUSEL_SLIDES.map(({ boardIndex, isClone }, physicalIndex) => {
            const board = BOARDS[boardIndex];
            const meta = BOARD_TIERS[boardIndex] || BOARD_TIERS[0];
            const isActive = !isClone && boardIndex === currentIndex;

            return (
              <div
                key={isClone ? `clone-${physicalIndex}` : `board-${boardIndex}`}
                ref={(el) => (slideRefs.current[physicalIndex] = el)}
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${boardIndex + 1} of ${BOARDS.length}: ${board.title}`}
                aria-hidden={isClone}
                className={classNames(styles, ` ${styles.card} snap-center shrink-0 w-[50vw] sm:w-[47vw] md:w-[416px] lg:w-[540px] xl:w-[608px] rounded-xl bg-gradient-to-b from-gray-900/90 via-gray-900/70 to-gray-950/95 border transition-[border-color,opacity] duration-500 relative overflow-hidden backdrop-blur-md p-3 sm:p-4 lg:p-5 shadow-2xl group ${
                  isActive
                    ? 'border-gray-700/80 shadow-brand-500/5 ring-1 ring-white/5'
                    : 'border-gray-800/80 opacity-85 hover:opacity-100'
                }`)}
              >
                {/* Background Ambient Glow */}
                <div 
                  className={classNames(styles, `absolute -top-20 -right-20 w-56 h-56 bg-gradient-to-br ${meta.glowGradient} rounded-full blur-[55px] pointer-events-none`)} 
                  aria-hidden="true"
                />

                <div className={classNames(styles, "relative z-10 flex flex-col lg:flex-row items-center gap-4 lg:gap-6")}>
                  {/* Left Column: Board Details & Specs */}
                  <div className={classNames(styles, "w-full lg:w-1/2 flex flex-col justify-between min-w-0")}>
                    <div>
                      {/* Tier Chip & Meta */}
                      <div className={classNames(styles, "flex flex-wrap items-center gap-1.5 mb-2")}>
                        <span className={classNames(styles, `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${meta.badgeBg} ${meta.accentClass} border ${meta.badgeBorder}`)}>
                          <Sparkles size={10} aria-hidden="true" />
                          {meta.tierBadge}
                        </span>
                        <span className={classNames(styles, "text-[10px] text-gray-500 font-mono tracking-wide")}>
                          {meta.highlightTag}
                        </span>
                      </div>

                      {/* Board Title */}
                      <h3 className={classNames(styles, "text-lg sm:text-xl lg:text-2xl font-extrabold text-white mb-1.5 tracking-tight group-hover:text-brand-300 transition-colors duration-200")}>
                        {board.title}
                      </h3>

                      {/* Board Description */}
                      <p className={classNames(styles, "text-gray-400 text-[11px] sm:text-xs leading-relaxed mb-3")}>
                        {board.description}
                      </p>

                      {/* Specifications Grid */}
                      <div className={classNames(styles, `mb-3.5 ${styles.specs}`)}>
                        <p className={classNames(styles, "text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1")}>
                          <Layers size={10} className={classNames(styles, "text-brand-400")} aria-hidden="true" />
                          Key Hardware Architecture
                        </p>
                        <ul className={classNames(styles, "grid grid-cols-1 sm:grid-cols-2 gap-1.5")}>
                          {board.specs.map((spec, specIdx) => (
                            <li 
                              key={specIdx} 
                              className={classNames(styles, `flex items-center gap-1.5 text-[11px] text-gray-300 bg-gray-950/60 border border-gray-800/80 rounded-md px-2 py-1 transition-[border-color] duration-200 hover:border-gray-700 ${
                                specIdx === board.specs.length - 1 && board.specs.length % 2 !== 0
                                  ? 'sm:col-span-2'
                                  : ''
                              }`)}
                            >
                              <div className={classNames(styles, "w-3 h-3 rounded-full bg-brand-500/20 border border-brand-500/50 flex items-center justify-center shrink-0")}>
                                <Check size={8} className={classNames(styles, "text-brand-400")} aria-hidden="true" />
                              </div>
                              <span className={classNames(styles, "font-medium leading-snug")}>{spec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Action Row */}
                    <div className={classNames(styles, "flex flex-wrap items-center gap-2 pt-2.5 border-t border-gray-800/80")}>
                      <button
                        onClick={() => onOpenPinout(boardIndex)}
                        tabIndex={isClone ? -1 : undefined}
                        className={classNames(styles, "px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-semibold text-[11px] sm:text-xs transition-[transform,background-color,box-shadow] duration-200 flex items-center justify-center gap-1 group/btn shadow-lg shadow-brand-600/20 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500")}
                      >
                        <Cpu size={13} aria-hidden="true" />
                        <span>View Technical Pinout</span>
                        <ArrowRight size={12} aria-hidden="true" className={classNames(styles, "transition-transform duration-200 group-hover/btn:translate-x-1")} />
                      </button>

                      {/* <Link
                        to="/learn"
                        className="px-3 py-1.5 bg-gray-800/80 hover:bg-gray-800 text-gray-200 hover:text-white border border-gray-700/80 rounded-lg font-semibold text-[11px] sm:text-xs transition-[transform,background-color,color] duration-200 flex items-center gap-1 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                      >
                        <ExternalLink size={11} aria-hidden="true" className="text-gray-400" />
                      </Link> */}

                      <div className={classNames(styles, "hidden sm:flex items-center gap-1 text-[10px] text-gray-500 ml-auto font-mono")}>
                        <ShieldCheck size={11} aria-hidden="true" className={classNames(styles, "text-brand-400")} />
                        <span>3.3V Logic Safe</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Visual Board Presentation */}
                  <div className={classNames(styles, "w-full lg:w-1/2")}>
                    <div className={classNames(styles, "relative rounded-lg overflow-hidden border border-gray-800 bg-gray-950 shadow-2xl h-[158px] sm:h-[191px] lg:h-[236px] group/img")}>
                      {/* Board Photography with Smooth Zoom */}
                      <img
                        src={board.image.url}
                        alt={`${board.image.title} development board hardware showcase`}
                        width={1200}
                        height={800}
                        className={classNames(styles, "w-full h-full object-cover opacity-85 group-hover/img:opacity-95 group-hover/img:scale-105 transition-[transform,opacity] duration-700 ease-out")}
                        loading={boardIndex === 0 ? 'eager' : 'lazy'}
                      />

                      {/* Top Badges Overlay */}
                      <div className={classNames(styles, "absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none")}>
                        <div className={classNames(styles, "px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-mono text-gray-200 flex items-center gap-1 shadow-lg")}>
                          <Radio size={9} aria-hidden="true" className={classNames(styles, meta.accentClass)} />
                          <span>DarkLight Silicon v1.2</span>
                        </div>
                        <div className={classNames(styles, "px-1.5 py-0.5 rounded bg-brand-500/20 backdrop-blur-md border border-brand-500/40 text-[9px] font-bold text-brand-300 font-mono shadow-lg")}>
                          48-PIN
                        </div>
                      </div>

                      {/* Bottom Info Gradient */}
                      <div className={classNames(styles, "absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent")}>
                        <div className={classNames(styles, "flex items-center gap-1.5 mb-0.5")}>
                          <h4 className={classNames(styles, "text-sm font-bold text-white tracking-wide")}>
                            {board.image.title}
                          </h4>
                        </div>
                        <p className={classNames(styles, "text-[11px] text-gray-300 line-clamp-2")}>
                          {board.image.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Progress Bar & Indicator Dots */}
      <div className={classNames(styles, "container mx-auto px-4 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4")}>
        {/* Progress Bar & Status Pill */}
        <div className={classNames(styles, "flex items-center gap-3 w-full sm:max-w-sm")}>
          <div className={classNames(styles, "flex-1 h-1.5 bg-gray-900 rounded-full overflow-hidden border border-gray-800/80 relative")}>
            <div
              className={classNames(styles, "h-full bg-gradient-to-r from-brand-500 to-cyan-400 rounded-full transition-[width] duration-500")}
              style={{
                width: `${((currentIndex + 1) / BOARDS.length) * 100}%`,
              }}
            />
          </div>
          {/* Status Label */}
          <span className={classNames(styles, "text-[11px] font-mono text-gray-500 tabular-nums shrink-0 flex items-center gap-1")}>
            {isAutoPlaying ? (
              isPaused ? (
                <span className={classNames(styles, "text-amber-400/90 font-medium")}>Paused</span>
              ) : (
                <span className={classNames(styles, "text-brand-400/90 font-medium")}>Auto-scroll</span>
              )
            ) : (
              <span>Manual</span>
            )}
          </span>
        </div>

        {/* Indicator Dots */}
        <div className={classNames(styles, "flex items-center gap-2")}>
          {BOARDS.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => scrollToSlide(dotIdx)}
              aria-label={`Go to slide ${dotIdx + 1}`}
              className={classNames(styles, `h-2 rounded-full transition-[width,background-color] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                dotIdx === currentIndex
                  ? 'w-8 bg-brand-500 shadow-md shadow-brand-500/30'
                  : 'w-2 bg-gray-800 hover:bg-gray-700'
              }`)}
            />
          ))}
        </div>
      </div>

      {/* Controls: Counter, Play/Pause Toggle & Prev/Next Buttons */}
      <div className={classNames(styles, `container mx-auto px-4 mt-4 flex items-center justify-center gap-3 ${styles.actions}`)}>
        {/* Slide Index Counter */}
        <Link className={classNames(styles, `px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 font-mono text-xs sm:text-sm font-medium tracking-wider tabular-nums flex items-center gap-1.5 ${styles.exploreAction}`)} to='/learn' style={{color: '#3ce9e0'}}>
          Explore
        </Link>
        <div className={classNames(styles, styles.navAction)}>
          <div className={classNames(styles, "px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 font-mono text-xs sm:text-sm font-medium tracking-wider tabular-nums flex items-center gap-1.5")}>
            <span className={classNames(styles, "text-white font-bold")}>{String(currentIndex + 1).padStart(2, '0')}</span>
            <span className={classNames(styles, "text-gray-600")}>/</span>
            <span>{String(BOARDS.length).padStart(2, '0')}</span>
            {isAutoPlaying && (
              <span 
                className={classNames(styles, `w-1.5 h-1.5 rounded-full ml-1 transition-[background-color] duration-300 ${
                  isPaused ? 'bg-amber-400' : 'bg-brand-400 animate-pulse'
                }`)} 
                title={isPaused ? 'Auto-scroll paused' : 'Auto-scroll running'}
                aria-hidden="true"
              />
            )}
          </div>

          {/* Play / Pause Toggle Button */}
          <button
            onClick={() => setIsAutoPlaying((prev) => !prev)}
            aria-label={isAutoPlaying ? 'Pause carousel auto-scroll' : 'Resume carousel auto-scroll'}
            aria-pressed={isAutoPlaying}
            className={classNames(styles, "w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 hover:text-white hover:bg-gray-800 hover:border-gray-700 active:scale-95 transition-[transform,opacity,background-color,border-color] duration-200 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 shadow-lg")}
          >
            {isAutoPlaying ? (
              <Pause 
                size={16} 
                aria-hidden="true" 
                className={classNames(styles, isPaused ? 'text-amber-400' : 'text-brand-400')} 
              />
            ) : (
              <Play 
                size={16} 
                aria-hidden="true" 
                className={classNames(styles, "text-gray-400 ml-0.5")} 
              />
            )}
          </button>

          {/* Direction Arrows */}
          <div className={classNames(styles, "flex items-center gap-1.5")}>
            <button
              onClick={handlePrev}
              aria-label="Previous board"
              className={classNames(styles, "w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 hover:text-white hover:bg-gray-800 hover:border-gray-700 active:scale-95 transition-[transform,opacity,background-color,border-color] duration-200 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 shadow-lg")}
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next board"
              className={classNames(styles, "w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 hover:text-white hover:bg-gray-800 hover:border-gray-700 active:scale-95 transition-[transform,opacity,background-color,border-color] duration-200 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 shadow-lg")}
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
