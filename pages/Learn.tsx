import { classNames } from '../styles/classNames';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { DOC_DATA } from '../constants';
import { BookOpen, ChevronRight } from 'lucide-react';
import { LEARN_PAGES } from '../learnPages';
import styles from './styles/Learn.module.css';

export const Learn: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  const [openSubMenu, setOpenSubMenu] = useState<string>('djcjcnjnsjn')

  const { hash } = useLocation();
  const { pageSlug } = useParams();

  const currentPage =
    LEARN_PAGES.find(page => page.slug === pageSlug) ??
    LEARN_PAGES[0];

  const pageDocs = DOC_DATA.filter(doc =>
    currentPage.docs.includes(doc.id)
  );

  const handleSubMenu = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const href = e.currentTarget.href;
    if(href.includes(openSubMenu)) {
      setOpenSubMenu('shcbjn cjscb');
      return;
    }
    
    setOpenSubMenu(e.currentTarget.href);
  }

  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {

    // alert(window.location);
    renderDocsInfo(String(window.location))//.replace('#', ''));
    setOpenSubMenu(String(window.location))//.replace('#', ''))
  }, []);


  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');

      setTimeout(() => {
        const element = document.getElementById(id);

        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash, pageSlug]);

  const renderDocsInfo = (id: string) => {
    return <>
    { isMobile && openSubMenu.includes(id) && (
      <div className={classNames(styles, "space-y-20 p-4")}>
        {pageDocs.map(doc => (
          <section
            key={doc.id}
            id={doc.id}
            className={classNames(styles, "scroll-mt-24")}
          >
            <div className={classNames(styles, "flex items-center gap-2 mb-6")}>
              <span className={classNames(styles, "text-brand-500 text-sm font-mono uppercase tracking-wider")}>
                {doc.category}
              </span>

              <ChevronRight
                size={14}
                className={classNames(styles, "text-gray-600")}
              />
            </div>

            <h2 className={classNames(styles, "text-3xl font-bold text-white mb-6")}>
              {doc.title}
            </h2>

            <div className={classNames(styles, "prose prose-invert prose-brand max-w-none")}>
              {doc.content}
            </div>
          </section>
        ))}
      </div>
    )}
    </>
  }

  // if(isMobile) return <></>
  return (
    <div className={classNames(styles, "container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8")}>
      
      {/* Sidebar */}
      <aside className={classNames(styles, "lg:w-64 flex-shrink-0")}>
        <div className={classNames(styles, "sticky top-24 space-y-8")}>

          {/* Getting Started */}
          <div>
            <h5 className={classNames(styles, "font-bold text-white mb-3 flex items-center gap-2")}>
              <BookOpen size={16} className={classNames(styles, "text-brand-500")} />
              Getting Started
            </h5>

            <ul className={classNames(styles, "space-y-1 border-l border-gray-800 ml-2")}>
              <li>
                <Link
                  to="/learn/installation-setup"
                  className={classNames(styles, `block pl-4 py-1 text-sm border-l-2 transition-colors ${
                    pageSlug === 'installation-setup'
                      ? 'border-brand-500 text-brand-400'
                      : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
                  }`)}
                  onClick={(e) => {
                    handleSubMenu(e);
                  }}
                >
                  Installation & Setup
                </Link>

                {renderDocsInfo('/learn/installation-setup')}
              </li>
              <li>
                <Link
                  to="/learn/getting-started"
                  className={classNames(styles, `block pl-4 py-1 text-sm border-l-2 transition-colors ${
                    pageSlug === 'getting-started'
                      ? 'border-brand-500 text-brand-400'
                      : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
                  }`)}
                  onClick={(e) => {
                    handleSubMenu(e);
                  }}
                  
                >
                  Introduction & Terminology
                </Link>

                { renderDocsInfo('/learn/getting-started') }
              </li>
            </ul>
          </div>

          {/* Hardware I/O */}
          <div>
            <h5 className={classNames(styles, "font-bold text-white mb-3 flex items-center gap-2")}>
              <BookOpen size={16} className={classNames(styles, "text-brand-500")} />
              Hardware I/O
            </h5>

            <ul className={classNames(styles, "space-y-1 border-l border-gray-800 ml-2")}>
              <li>
                <Link
                  to="/learn/digital-io"
                  className={classNames(styles, `block pl-4 py-1 text-sm border-l-2 transition-colors ${
                    pageSlug === 'digital-io'
                      ? 'border-brand-500 text-brand-400'
                      : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
                  }`)}
                  onClick={(e) => {
                    handleSubMenu(e);
                  }}
                  
                >
                  Digital Input / Output
                </Link>

                { renderDocsInfo('/learn/digital-io') }
              </li>

              <li>
                <Link
                  to="/learn/analog"
                  className={classNames(styles, `block pl-4 py-1 text-sm border-l-2 transition-colors ${
                    pageSlug === 'analog'
                      ? 'border-brand-500 text-brand-400'
                      : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
                  }`)}
                  onClick={(e) => {
                    handleSubMenu(e);
                  }}
                  
                >
                  Analog Input (ADC)
                </Link>

                { renderDocsInfo('/learn/analog') }
              </li>

              <li>
                <Link
                  to="/learn/pwm"
                  className={classNames(styles, `block pl-4 py-1 text-sm border-l-2 transition-colors ${
                    pageSlug === 'pwm'
                      ? 'border-brand-500 text-brand-400'
                      : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
                  }`)}
                  onClick={(e) => {
                    handleSubMenu(e);
                  }}
                  
                >
                  Pulse Width Modulation (PWM)
                </Link>

                { renderDocsInfo('/learn/pwm') }
              </li>
            </ul>
          </div>

          {/* Advanced Control */}
          <div>
            <h5 className={classNames(styles, "font-bold text-white mb-3 flex items-center gap-2")}>
              <BookOpen size={16} className={classNames(styles, "text-brand-500")} />
              Advanced Control
            </h5>

            <ul className={classNames(styles, "space-y-1 border-l border-gray-800 ml-2")}>
              <li>
                <Link
                  to="/learn/interrupts"
                  className={classNames(styles, `block pl-4 py-1 text-sm border-l-2 transition-colors ${
                    pageSlug === 'interrupts'
                      ? 'border-brand-500 text-brand-400'
                      : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
                  }`)}
                  onClick={(e) => {
                    handleSubMenu(e);
                  }}
                >
                  Interrupts & Debouncing
                </Link>

                { renderDocsInfo('/learn/interrupts') }
              </li>

              <li>
                <Link
                  to="/learn/ticker"
                  className={classNames(styles, `block pl-4 py-1 text-sm border-l-2 transition-colors ${
                    pageSlug === 'ticker'
                      ? 'border-brand-500 text-brand-400'
                      : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
                  }`)}
                  onClick={(e) => {
                    handleSubMenu(e);
                  }}
                >
                  Task Scheduling (Ticker)
                </Link>

                { renderDocsInfo('/learn/ticker') }
              </li>
            </ul>
          </div>

          {/* Communication */}
          <div>
            <h5 className={classNames(styles, "font-bold text-white mb-3 flex items-center gap-2")}>
              <BookOpen size={16} className={classNames(styles, "text-brand-500")} />
              Communication
            </h5>

            <ul className={classNames(styles, "space-y-1 border-l border-gray-800 ml-2")}>
              <li>
                <Link
                  to="/learn/comms"
                  className={classNames(styles, `block pl-4 py-1 text-sm border-l-2 transition-colors ${
                    pageSlug === 'comms'
                      ? 'border-brand-500 text-brand-400'
                      : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
                  }`)}
                  onClick={(e) => {
                    handleSubMenu(e);
                  }}
                >
                  Communication (SPI & UART)
                </Link>
                { renderDocsInfo('/learn/comms') }
              </li>
            </ul>
          </div>

        </div>
      </aside>

      {/* Main Content */}
      <main className={classNames(styles, "flex-1 min-w-0")}>
        {!isMobile && (
          <div className={classNames(styles, "max-w-4xl")}>

            <h1 className={classNames(styles, "text-4xl font-bold text-white mb-6")}>
              {currentPage.title}
            </h1>

            <p className={classNames(styles, "text-xl text-gray-400 mb-12 border-b border-gray-800 pb-8")}>
              Complete technical reference and tutorials for the DarkLight microcontroller ecosystem.
            </p>

            <div className={classNames(styles, "space-y-20")}>
              {pageDocs.map(doc => (
                <section
                  key={doc.id}
                  id={doc.id}
                  className={classNames(styles, "scroll-mt-24")}
                >
                  <div className={classNames(styles, "flex items-center gap-2 mb-6")}>
                    <span className={classNames(styles, "text-brand-500 text-sm font-mono uppercase tracking-wider")}>
                      {doc.category}
                    </span>

                    <ChevronRight
                      size={14}
                      className={classNames(styles, "text-gray-600")}
                    />
                  </div>

                  <h2 className={classNames(styles, "text-3xl font-bold text-white mb-6")}>
                    {doc.title}
                  </h2>

                  <div className={classNames(styles, "prose prose-invert prose-brand max-w-none")}>
                    {doc.content}
                  </div>
                </section>
              ))}
            </div>

            <div className={classNames(styles, "flex justify-between mt-16 border-t border-gray-800 pt-8")}>
              {currentPage.previous ? (
                <Link
                  to={`/learn/${currentPage.previous}`}
                  onClick={(e) => {
                    handleSubMenu(e);
                  }}
                  className={classNames(styles, "px-5 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition")}
                >
                  ← Previous
                </Link>
              ) : (
                <div />
              )}

              {currentPage.next && (
                <Link
                  to={`/learn/${currentPage.next}`}
                  onClick={(e) => {
                    handleSubMenu(e);
                  }}
                  className={classNames(styles, "px-5 py-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white transition")}
                >
                  Next →
                </Link>
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
};
