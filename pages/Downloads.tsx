import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Wrench,
  Cpu,
  FileText,
  Library,
  Download,
  ExternalLink,
  Search,
  Sparkles,
  Layers,
  ShieldCheck,
  Terminal,
  FileArchive,
  Code2,
  Check,
  X,
  Radio,
  Zap,
  HardDrive,
  SlidersHorizontal,
  ArrowUpRight,
  Usb,
  Bug,
} from 'lucide-react';
import { BOARDS } from '../components/ImageCarousel';
import styles from './styles/downloads.module.css'

type CategoryFilter = 'all' | 'tools' | 'sdk' | 'templates' | 'docs' | 'libraries';

interface DownloadItem {
  id: string;
  title: string;
  type: 'IDE' | 'Debugger' | 'Driver' | 'Library' | 'SDK' | 'Documentation' | 'Template' | 'Examples';
  category: CategoryFilter;
  description: string;
  actionText: string;
  link: string;
  version: string;
  sizeOrPlatform: string;
  formatBadge: string;
  isExternal?: boolean;
  highlight?: string;
}

interface BoardTierTheme {
  id: string;
  shortName: string;
  tierBadge: string;
  tagline: string;
  accentText: string;
  accentBg: string;
  accentBorder: string;
  glowGradient: string;
  buttonAccent: string;
  partNumber: string;
  hasWireless?: boolean;
}

const BOARD_THEMES: BoardTierTheme[] = [
  {
    id: 'uhuru',
    shortName: 'Uhuru',
    tierBadge: 'Entry Tier • Learn & Prototype',
    tagline: ' Ideal for Education & Rapid Embedded Prototyping',
    accentText: 'text-brand-400',
    accentBg: 'bg-brand-500/10',
    accentBorder: 'border-brand-500/30',
    glowGradient: 'from-brand-500/20 via-brand-600/5 to-transparent',
    buttonAccent: 'bg-brand-600 hover:bg-brand-500 shadow-brand-600/20',
    partNumber: 'DL-UHU-M0-48',
  },
  {
    id: 'katana',
    shortName: 'Katana',
    tierBadge: 'Mid-Tier • Advanced Prototyping',
    tagline: 'High-Density Peripherals & Real-Time Control',
    accentText: 'text-cyan-400',
    accentBg: 'bg-cyan-500/10',
    accentBorder: 'border-cyan-500/30',
    glowGradient: 'from-cyan-500/20 via-cyan-600/5 to-transparent',
    buttonAccent: 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-600/20',
    partNumber: 'DL-KAT-M0-48',
  },
  {
    id: 'bravo',
    shortName: 'Bravo',
    tierBadge: 'Flagship • High Performance',
    tagline: 'Mission-Critical Determinism & Full DMA Matrix',
    accentText: 'text-purple-400',
    accentBg: 'bg-purple-500/10',
    accentBorder: 'border-purple-500/30',
    glowGradient: 'from-purple-500/20 via-purple-600/5 to-transparent',
    buttonAccent: 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/20',
    partNumber: 'DL-BRV-M0-48',
  },
  {
    id: 'uhuru-connect',
    shortName: 'Uhuru Connect',
    tierBadge: 'Connected • Wireless IoT Entry',
    tagline: 'Integrated WiFi 6 & BLE 5.0 Co-Processor Stack',
    accentText: 'text-amber-400',
    accentBg: 'bg-amber-500/10',
    accentBorder: 'border-amber-500/30',
    glowGradient: 'from-amber-500/20 via-amber-600/5 to-transparent',
    buttonAccent: 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20',
    partNumber: 'DL-UHU-W6-48',
    hasWireless: true,
  },
  {
    id: 'katana-connect',
    shortName: 'Katana Connect',
    tierBadge: 'Connected • Wireless IoT Mid-Tier',
    tagline: 'Industrial Telemetry & Edge Cloud Connectivity',
    accentText: 'text-emerald-400',
    accentBg: 'bg-emerald-500/10',
    accentBorder: 'border-emerald-500/30',
    glowGradient: 'from-emerald-500/20 via-emerald-600/5 to-transparent',
    buttonAccent: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20',
    partNumber: 'DL-KAT-W6-48',
    hasWireless: true,
  },
];

const DOC_ITEMS: DownloadItem[] = [

]

const SOFTWARE_TOOLS: DownloadItem[] = [
  {
    id: 'segger-ses',
    title: 'SEGGER Embedded Studio',
    type: 'IDE',
    category: 'tools',
    description:
      'Complete C/C++ IDE, project manager, and Clang/GCC toolchain tailored for DarkLight Arm Cortex-M0 microcontrollers.',
    actionText: 'Visit SEGGER',
    link: 'https://www.segger.com/downloads/embedded-studio/',
    version: 'v8.16a',
    sizeOrPlatform: 'Win • macOS • Linux',
    formatBadge: 'IDE SUITE',
    isExternal: true,
    highlight: 'Official Recommended IDE',
  },
  {
    id: 'segger-jlink',
    title: 'J-Link Software & Documentation Pack',
    type: 'Debugger',
    category: 'tools',
    description:
      'High-speed SWD/JTAG flash programming, GDB server, RTT viewer, and real-time instruction trace utilities.',
    actionText: 'Visit SEGGER',
    link: 'https://www.segger.com/downloads/jlink/',
    version: 'v7.96h',
    sizeOrPlatform: 'Win • macOS • Linux',
    formatBadge: 'DEBUGGER',
    isExternal: true,
    highlight: 'SWD + Real-Time Trace',
  },
  {
    id: 'usb-driver',
    title: 'DarkLight CPU Support Packages',
    type: 'Driver',
    category: 'tools',
    description:
      'Support packages for seamless initialization of Darklight projects',
    actionText: 'Download Packages',
    link: 'https://takeout-download-drive-eu.usercontent.google.com/download/Embedded%20Studio%20CPU%20Supoort%20Packages-20261122T093221Z-1-001.zip?j=47e621f1-a11f-48dd-9886-92ef604eddc1&i=0&user=971679582076&authuser=0',
    version: 'v2.1.4',
    sizeOrPlatform: '211 MB • Installer',
    formatBadge: 'Packages',
    isExternal: false,
    highlight: 'WHQL & macOS Notarized',
  },
];

const LIBRARIES: (DownloadItem & {
  headerFile: string;
  protocol: string;
  waveformType: 'nzr' | 'spi';
})[] = [
    {
      id: 'lib-ws2812b',
      title: 'lib_ws2812b',
      type: 'Library',
      category: 'libraries',
      description:
        'Zero-CPU-overhead WS2812B addressable RGB LED driver leveraging hardware PWM + DMA circular buffers for deterministic 800kHz timing.',
      actionText: 'Download ZIP',
      link: '#',
      version: 'v1.4.2',
      sizeOrPlatform: '420 KB • C99 Source',
      formatBadge: 'DMA LIBRARY',
      headerFile: '#include "dl_ws2812b_dma.h"',
      protocol: '800 kHz Single-Wire NZR + DMA',
      waveformType: 'nzr',
    },
    {
      id: 'lib-apa102',
      title: 'lib_apa102',
      type: 'Library',
      category: 'libraries',
      description:
        'High-refresh APA102 (DotStar) addressable RGB LED driver utilizing hardware SPI master + DMA channels up to 24 MHz clock rates.',
      actionText: 'Download ZIP',
      link: '#',
      version: 'v1.3.0',
      sizeOrPlatform: '385 KB • C99 Source',
      formatBadge: 'SPI LIBRARY',
      headerFile: '#include "dl_apa102_spi.h"',
      protocol: '24 MHz Dual-Wire SPI + DMA',
      waveformType: 'spi',
    },
  ];

const getBoardDownloads = (boardTitle: string, shortName: string, hasWireless?: boolean): DownloadItem[] => [
  {
    id: `${shortName}-bsp`,
    title: 'CPU & Board Support Package (BSP)',
    type: 'SDK',
    category: 'sdk',
    description: `CMSIS-Core device headers, memory linker scripts, startup assembly, and peripheral HAL drivers for ${boardTitle}.`,
    actionText: 'Download SDK',
    link: '#',
    version: 'v2.4.0',
    sizeOrPlatform: hasWireless ? '28.4 MB • Pack' : '19.2 MB • Pack',
    formatBadge: 'BSP / SDK',
    highlight: hasWireless ? 'Includes WiFi 6 / BLE Stack' : 'Register + HAL Drivers',
  },
  {
    id: `${shortName}-datasheet`,
    title: `${shortName} Technical Datasheet & RM`,
    type: 'Documentation',
    category: 'docs',
    description: `Complete electrical characteristics, register map, clock tree architecture, and mechanical footprint for ${boardTitle}.`,
    actionText: 'View PDF',
    link: '#',
    version: 'Rev 1.8',
    sizeOrPlatform: '6.4 MB • 248 Pages',
    formatBadge: 'PDF DOC',
    highlight: 'Pin Mux & Timing Specs',
  },
  {
    id: `${shortName}-freertos`,
    title: 'FreeRTOS Starter Template',
    type: 'Template',
    category: 'templates',
    description: `Pre-configured SEGGER Embedded Studio workspace with FreeRTOS kernel v10.6, SysTick tickless idle, and task notifications.`,
    actionText: 'Download ZIP',
    link: '#',
    version: 'v10.6.1',
    sizeOrPlatform: '4.1 MB • SES Project',
    formatBadge: 'FREERTOS (.ZIP)',
    highlight: 'Deterministic Scheduler',
  },
  {
    id: `${shortName}-embos`,
    title: 'SEGGER EmbOS Template',
    type: 'Template',
    category: 'templates',
    description: `Zero-interrupt-latency RTOS starter project pre-integrated with SEGGER SystemView real-time task trace instrumentation.`,
    actionText: 'Download ZIP',
    link: '#',
    version: 'v5.18',
    sizeOrPlatform: '5.3 MB • SES Project',
    formatBadge: 'EMBOS (.ZIP)',
    highlight: 'SystemView Ready',
  },
  {
    id: `${shortName}-baremetal`,
    title: 'Baremetal Superloop Template',
    type: 'Template',
    category: 'templates',
    description: `Ultra-lean C99 firmware skeleton with direct register/DMA setup, zero RTOS overhead, and sub-microsecond ISR response.`,
    actionText: 'Download ZIP',
    link: '#',
    version: 'v2.4.0',
    sizeOrPlatform: '1.2 MB • SES Project',
    formatBadge: 'BAREMETAL (.ZIP)',
    highlight: '< 4 KB Flash Footprint',
  },
  {
    id: `${shortName}-examples`,
    title: 'Peripheral & DMA Example Suite',
    type: 'Examples',
    category: 'sdk',
    description: `25+ verified reference projects covering non-blocking SPI/I2C/UART DMA transfers, 16-ch ADC scan, PWM motor control${hasWireless ? ', and MQTT telemetry' : ''
      }.`,
    actionText: 'View Projects',
    link: '#',
    version: 'v2.4.0',
    sizeOrPlatform: '16.8 MB • 25+ Projects',
    formatBadge: 'EXAMPLES',
    highlight: 'Copy-Paste Reference Code',
  },
];

export const Downloads: React.FC = () => {
  const [title, setTItle] = useState<string>('Software Tools & Host Drivers');
  const [downloadItems, setDownLoadItems] = useState<DownloadItem[]>(SOFTWARE_TOOLS);
  const [selectedBoardIdx, setSelectedBoardIdx] = useState<number>(0);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPinoutModalOpen, setIsPinoutModalOpen] = useState<boolean>(false);

  const activeBoard = BOARDS[selectedBoardIdx] || BOARDS[0];
  const activeTheme = BOARD_THEMES[selectedBoardIdx] || BOARD_THEMES[0];

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handleSelectBoardAndScroll = (index: number) => {
    setSelectedBoardIdx(index);
    scrollToSection('board-hub');
  };

  const boardResources = useMemo(
    () => getBoardDownloads(activeBoard.title, activeTheme.shortName, activeTheme.hasWireless),
    [activeBoard.title, activeTheme.shortName, activeTheme.hasWireless]
  );

  const matchesFilter = (item: { title: string; description: string; type: string; category: CategoryFilter }) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const query = searchQuery.trim().toLowerCase();
    if (!query) return matchesCategory;
    return (
      matchesCategory &&
      (item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query))
    );
  };

  const filteredTools = useMemo(() => SOFTWARE_TOOLS.filter(matchesFilter), [activeCategory, searchQuery]);
  const filteredBoardResources = useMemo(() => boardResources.filter(matchesFilter), [boardResources, activeCategory, searchQuery]);
  const filteredLibraries = useMemo(() => LIBRARIES.filter(matchesFilter), [activeCategory, searchQuery]);

  const totalMatchingCount =
    filteredTools.length + filteredBoardResources.length + filteredLibraries.length;

  const getTypeIcon = (type: DownloadItem['type']) => {
    switch (type) {
      case 'IDE':
        return <Terminal size={20} className="text-brand-400" />;
      case 'Debugger':
        return <Bug size={20} className="text-cyan-400" />;
      case 'Driver':
        return <Usb size={20} className="text-purple-400" />;
      case 'SDK':
        return <Cpu size={20} className="text-brand-400" />;
      case 'Documentation':
        return <FileText size={20} className="text-amber-400" />;
      case 'Template':
        return <FileArchive size={20} className="text-emerald-400" />;
      case 'Examples':
        return <Code2 size={20} className="text-cyan-400" />;
      case 'Library':
        return <Library size={20} className="text-brand-400" />;
    }
  };

  const getTypeBadgeStyle = (type: DownloadItem['type']) => {
    switch (type) {
      case 'IDE':
        return 'bg-brand-500/10 text-brand-300 border-brand-500/30';
      case 'Debugger':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
      case 'Driver':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'SDK':
        return 'bg-brand-500/10 text-brand-300 border-brand-500/30';
      case 'Documentation':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'Template':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      case 'Examples':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
      case 'Library':
        return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
    }
  };

  const renderItems = (items: DownloadItem[], title: string) => {
    setDownLoadItems(items);
    setTItle(title);
  }

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-1/4 w-[650px] h-[500px] bg-brand-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Technical Pinout Modal */}
      {isPinoutModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setIsPinoutModalOpen(false)}
        >
          <div
            className="relative max-w-5xl w-full bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-950">
              <div className="flex items-center gap-2.5">
                <Cpu className="text-brand-400" size={20} />
                <h3 className="text-white font-bold">{activeBoard.title} — Technical Pinout Diagram</h3>
                <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-xs font-mono bg-gray-800 text-gray-300 border border-gray-700">
                  {activeTheme.partNumber}
                </span>
              </div>
              <button
                onClick={() => setIsPinoutModalOpen(false)}
                aria-label="Close pinout modal"
                className="p-1.5 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                <X size={22} />
              </button>
            </div>
            <div className="p-3 md:p-8 bg-gray-900 flex items-center justify-center min-h-[380px]">
              <img
                src={activeBoard.pinoutImage ?? activeBoard.image.url}
                alt={`${activeBoard.title} pinout`}
                className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-lg border border-gray-800"
              />
            </div>
            <div className="p-4 bg-gray-950 border-t border-gray-800 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400 font-mono">
              <span>{activeBoard.title} • 48 Multiplexed GPIO • 3.3V Logic Levels Required</span>
              <span className="text-brand-400">Rev 1.8 Hardware Reference</span>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative z-10">
        {/* HERO BANNER WITH CUSTOM SVG HARDWARE TOOLCHAIN GRAPHIC */}
        <div className="relative rounded-3xl border border-gray-800/90 bg-gradient-to-br from-gray-900/95 via-gray-900/80 to-gray-950 p-6 sm:p-8 lg:p-10 mb-10 overflow-hidden shadow-2xl">
          {/* Decorative Circuit Grid Pattern */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <pattern id="dl-circuit-grid" width="36" height="36" patternUnits="userSpaceOnUse">
                <path d="M 36 0 L 0 0 0 36" fill="none" stroke="currentColor" strokeWidth="1" className="text-brand-400" />
                <circle cx="36" cy="36" r="1.5" fill="currentColor" className="text-brand-400" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dl-circuit-grid)" />
          </svg>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Title, Copy & Ecosystem Metrics */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3.5 py-1 text-xs font-semibold text-brand-300 tracking-wide uppercase">
                <Sparkles size={13} className="text-brand-400" />
                <span>DarkLight Developer Resource Center • SDK v2.4</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Hardware SDKs, Toolchains &{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-cyan-400 to-blue-500">
                  Silicon Resources
                </span>
              </h1>

              <p className="text-gray-400 text-base sm:text-lg max-w-2xl leading-relaxed">
                Download production-grade Board Support Packages (BSP), RTOS starter templates, non-blocking DMA driver libraries, and technical datasheets for the entire DarkLight lineup.
              </p>

              {/* Quick Ecosystem Pill Badges */}
              {/* <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <div className="px-3 py-1.5 rounded-xl bg-gray-950/80 border border-gray-800 text-xs font-mono text-gray-300 flex items-center gap-2">
                  <Cpu size={14} className="text-brand-400" />
                  <span>5 Hardware Targets</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-gray-950/80 border border-gray-800 text-xs font-mono text-gray-300 flex items-center gap-2">
                  <Zap size={14} className="text-cyan-400" />
                  <span>Zero-CPU DMA Drivers</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-gray-950/80 border border-gray-800 text-xs font-mono text-gray-300 flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>CMSIS & MISRA-C Compliant</span>
                </div>
              </div> */}
            </div>
          </div>

          {/* Interactive Search & Category Filter Bar */}
          
        </div>

        {/* MAIN BODY: STICKY SIDEBAR + CONTENT */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sticky Sidebar Navigation */}
          <aside className="lg:w-60 flex-shrink-0">
            <div className="sticky top-24 rounded-2xl border border-gray-800/90 bg-gray-900/50 backdrop-blur-md p-5 space-y-6">
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                  <BookOpen size={14} className="text-brand-400" />
                  <span>Resource Sections</span>
                </h5>

                <ul className="space-y-1.5">
                  <li>
                    <button
                      onClick={() => {
                        renderItems(SOFTWARE_TOOLS, 'Software Tools & Host Drivers');
                        scrollToSection('software-tools');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/70 flex items-center justify-between group transition-colors"
                    >
                      <span className="flex items-center gap-2.5">
                        <Wrench size={15} className="text-brand-400" />
                        Software Tools
                      </span>
                      <span className="text-[11px] font-mono text-gray-500 group-hover:text-gray-300">
                        {SOFTWARE_TOOLS.length}
                      </span>
                    </button>
                  </li>

                  <li>
                    <button
                      onClick={() => {
                        renderItems([], 'Documentation');
                        scrollToSection('board-hub')
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/70 flex items-center justify-between group transition-colors"
                    >
                      <span className="flex items-center gap-2.5">
                        <Cpu size={15} className="text-cyan-400" />
                        Docs
                      </span>
                      <span className="text-[11px] font-mono text-gray-500 group-hover:text-gray-300">
                        5 Boards
                      </span>
                    </button>
                  </li>

                  <li>
                    <button
                      onClick={() => {
                        renderItems(LIBRARIES, 'Extended Libraries');
                        scrollToSection('libraries');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/70 flex items-center justify-between group transition-colors"
                    >
                      <span className="flex items-center gap-2.5">
                        <Library size={15} className="text-purple-400" />
                        Extended Libraries
                      </span>
                      <span className="text-[11px] font-mono text-gray-500 group-hover:text-gray-300">
                        {LIBRARIES.length}
                      </span>
                    </button>
                  </li>
                </ul>
              </div>

              {/* Quick Checksum / Verification Note */}
              <div className="rounded-xl bg-gray-950/90 border border-gray-800/80 p-3.5 text-xs text-gray-400 space-y-1.5">
                <div className="flex items-center gap-1.5 text-white font-semibold">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>Verified Packages</span>
                </div>
                <p className="text-[11px] leading-relaxed text-gray-400">
                  All DarkLight SDK archives and drivers are SHA-256 signed and tested with SEGGER Embedded Studio.
                </p>
              </div>
            </div>
          </aside>

          {/* Main Content Column */}
          <main className="flex-1 min-w-0 space-y-16">
            {totalMatchingCount === 0 && (
              <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-12 text-center space-y-3">
                <Search size={32} className="mx-auto text-gray-500" />
                <h3 className="text-lg font-bold text-white">No matching downloads found</h3>
                <p className="text-sm text-gray-400 max-w-md mx-auto">
                  No resources matched &ldquo;{searchQuery}&rdquo; in the selected category. Try clearing your filter or searching for another term.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {
              title === 'Documentation' 
              ?
              <section id="board-hub" className="scroll-mt-24">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                        <Cpu size={18} className="text-cyan-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white tracking-tight">
                        Board Support Packages, Templates & Datasheets
                      </h2>
                    </div>
                    <p className="text-sm text-gray-400 mt-1.5">
                      Select your DarkLight development board below to view its tailored SDKs, RTOS templates, and hardware documentation.
                    </p>
                  </div>
                </div>

                {/* Interactive 5-Board Selector Pills */}
                <div
                  role="tablist"
                  aria-label="Select DarkLight hardware board"
                  className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-5"
                >
                  {BOARD_THEMES.map((theme, idx) => {
                    const isActive = idx === selectedBoardIdx;
                    return (
                      <button
                        key={theme.id}
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setSelectedBoardIdx(idx)}
                        className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 border ${isActive
                            ? 'bg-gray-900 text-white border-brand-500/60 shadow-lg shadow-brand-500/10 ring-1 ring-brand-500/30'
                            : 'bg-gray-900/50 text-gray-400 border-gray-800 hover:bg-gray-800 hover:text-gray-200'
                          }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${isActive ? 'bg-brand-400 scale-125 animate-pulse' : 'bg-gray-600'
                            }`}
                        />
                        <span>DarkLight {theme.shortName}</span>
                        {theme.hasWireless && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-mono">
                            WiFi 6
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Selected Board Visual Showcase Banner Card */}
                <div className="relative rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900/95 via-gray-900/80 to-gray-950 p-5 sm:p-6 lg:p-7 mb-6 overflow-hidden shadow-xl">
                  {/* Dynamic Tier Glow */}
                  <div
                    className={`absolute -top-24 -right-24 w-80 h-80 bg-gradient-to-br ${activeTheme.glowGradient} rounded-full blur-[80px] pointer-events-none`}
                  />

                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    {/* Board Image Preview */}
                    <div className="lg:col-span-5">
                      <div className="relative rounded-xl overflow-hidden border border-gray-800 bg-gray-950 h-48 sm:h-56 group">
                        <img
                          src={activeBoard.image.url}
                          alt={activeBoard.title}
                          className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono text-gray-200 flex items-center gap-1.5">
                            <Radio size={11} className={activeTheme.accentText} />
                            {activeTheme.partNumber}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-brand-500/20 backdrop-blur-md border border-brand-500/40 text-[10px] font-bold text-brand-300 font-mono">
                            48-PIN QFP
                          </span>
                        </div>
                        <div className="absolute bottom-0 inset-x-0 p-3.5 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent flex items-center justify-between">
                          <span className="text-xs font-semibold text-white">
                            {activeBoard.image.title}
                          </span>
                          <button
                            onClick={() => setIsPinoutModalOpen(true)}
                            className="px-2.5 py-1 rounded-lg bg-brand-600/90 hover:bg-brand-500 text-white text-[11px] font-semibold flex items-center gap-1 shadow-md transition-colors"
                          >
                            <Cpu size={12} />
                            <span>View Pinout</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Board Details & Specs Summary */}
                    <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${activeTheme.accentBg} ${activeTheme.accentText} ${activeTheme.accentBorder}`}
                          >
                            <Sparkles size={11} />
                            {activeTheme.tierBadge}
                          </span>
                          <span className="text-xs font-mono text-gray-500">
                            {activeTheme.tagline}
                          </span>
                        </div>

                        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                          {activeBoard.title} Documentation
                        </h3>

                        <p className="text-sm text-gray-400 leading-relaxed">
                          {activeBoard.description}
                        </p>
                      </div>

                      {/* Key Hardware Architecture Pills */}
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
                          <Layers size={12} className="text-brand-400" />
                          <span>Target Silicon Specifications</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {activeBoard.specs.slice(0, 6).map((spec, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2.5 py-1 rounded-lg bg-gray-950/80 border border-gray-800 text-xs text-gray-300 flex items-center gap-1.5"
                            >
                              <Check size={11} className="text-brand-400" />
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6-Card Grid for Selected Board Resources */}
                <div className={styles.tableContent}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Link</th>
                      </tr>
                    </thead>
                    <tbody>
                      
                    {filteredBoardResources.map((item) => (
                      <tr>
                        <td>{item.title}</td>
                        <td>{item.description}</td>
                        <td>
                          <a href={item.link}>
                            {item.actionText}
                          </a>
                        </td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </section>
              :
              (
                title === 'Extended Libraries' 
                ?
                <section id="libraries" className="scroll-mt-24 pb-8">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                          <Library size={18} className="text-purple-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">
                          Non-Blocking DMA Peripheral Libraries
                        </h2>
                      </div>
                      <p className="text-sm text-gray-400 mt-1.5">
                        Production C libraries engineered around DarkLight&apos;s DMA controller for zero-jitter waveform generation.
                      </p>
                    </div>
                  </div>

                  <div className={styles.tableContent}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Description</th>
                          <th>Link</th>
                        </tr>
                      </thead>
                      <tbody>
                        
                      {filteredLibraries.map((item) => (
                        <tr>
                          <td>{item.title}</td>
                          <td>{item.description}</td>
                          <td>
                            <a href={item.link}>
                              {item.actionText}
                            </a>
                          </td>
                        </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
                </section>
                
                  :

                <section id="software-tools" className="scroll-mt-24">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center">
                          <Wrench size={18} className="text-brand-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">
                          {title}
                        </h2>
                      </div>
                      <p className="text-sm text-gray-400 mt-1.5">
                        Core development environment, J-Link debug probes, and USB communication drivers.
                      </p>
                    </div>
                    <span className="text-xs font-mono text-gray-500">
                      Windows 10/11 • macOS (Universal) • Ubuntu/Debian
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {downloadItems.map((tool) => (
                      <div
                        key={tool.id}
                        className="group relative rounded-2xl border border-gray-800/90 bg-gradient-to-b from-gray-900/90 to-gray-950 p-6 flex flex-col justify-between hover:border-brand-500/50 transition-all duration-300 shadow-lg hover:shadow-brand-500/5 overflow-hidden"
                      >
                        {/* Decorative Corner Schematic Accent */}
                        <div className="absolute -right-8 -top-8 w-28 h-28 bg-brand-500/5 rounded-full blur-2xl group-hover:bg-brand-500/15 transition-colors pointer-events-none" />

                        <div>
                          {/* Top Icon + Format Pill */}
                          <div className="flex items-center justify-between gap-2 mb-4">
                            <div className="w-11 h-11 rounded-xl bg-gray-950 border border-gray-800 flex items-center justify-center shadow-inner group-hover:border-gray-700 transition-colors">
                              {getTypeIcon(tool.type)}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="px-2.5 py-0.5 rounded-md bg-gray-950 border border-gray-800 text-[11px] font-mono text-gray-300">
                                {tool.version}
                              </span>
                              <span
                                className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold border ${getTypeBadgeStyle(
                                  tool.type
                                )}`}
                              >
                                {tool.formatBadge}
                              </span>
                            </div>
                          </div>

                          {/* Highlight Tag */}
                          {tool.highlight && (
                            <div className="text-[11px] font-mono text-brand-400 mb-1 flex items-center gap-1">
                              <Sparkles size={11} />
                              <span>{tool.highlight}</span>
                            </div>
                          )}

                          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-300 transition-colors">
                            {tool.title}
                          </h3>

                          <p className="text-sm text-gray-400 leading-relaxed mb-6">
                            {tool.description}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-gray-800/80 flex items-center justify-between gap-3">
                          <span className="text-xs font-mono text-gray-500">
                            {tool.sizeOrPlatform}
                          </span>

                          <a
                            href={tool.link}
                            target={tool.isExternal ? '_blank' : undefined}
                            rel={tool.isExternal ? 'noopener noreferrer' : undefined}
                            className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-brand-600 text-white text-xs font-semibold border border-gray-700 hover:border-brand-500 transition-all flex items-center gap-1.5 shadow-sm"
                          >
                            <span>{tool.actionText}</span>
                            {tool.isExternal ? (
                              <ExternalLink size={13} />
                            ) : (
                              <Download size={13} />
                            )}
                          </a>
                        </div>
                      </div>
                    )
                  )}
                  </div>
                </section>
              ) 
            }

            {/* SECTION 2: INTERACTIVE 5-BOARD HARDWARE HUB */}
            

            {/* SECTION 3: HARDWARE PERIPHERAL LIBRARIES WITH WAVEFORM GRAPHICS */}
            {/* {filteredLibraries.length > 0 && (
              
            )} */}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Downloads;
