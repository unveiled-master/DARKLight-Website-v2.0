import { classNames } from '../styles/classNames';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DOC_DATA } from '../constants';
import { BookOpen, ChevronRight } from 'lucide-react';
import styles from './styles/Documentation.module.css';

export const Documentation: React.FC = () => {
  const { hash } = useLocation();

  // Scroll to hash on load/change
  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0,0);
    }
  }, [hash]);

  const categories = Array.from(new Set(DOC_DATA.map(d => d.category)));

  return (
    <div className={classNames(styles, styles.layout)}>
      {/* Sidebar Navigation */}
      <aside className={classNames(styles, styles.sidebar)}>
        <div className={classNames(styles, styles.stickyNav)}>
          {categories.map(category => (
            <div key={category}>
              <h5 className={classNames(styles, styles.categoryTitle)}>
                <BookOpen size={16} className={classNames(styles, styles.categoryIcon)} />
                {category}
              </h5>
              <ul className={classNames(styles, styles.linkList)}>
                {DOC_DATA.filter(d => d.category === category).map(doc => (
                  <li key={doc.id}>
                    <a 
                      href={`#${doc.id}`}
                      className={classNames(styles, `${styles.docLink} ${hash === `#${doc.id}` ? styles.docLinkActive : ''}`)}
                    >
                      {doc.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={classNames(styles, styles.main)}>
        <div className={classNames(styles, styles.article)}>
          <h1 className={classNames(styles, styles.title)}>Documentation</h1>
          <p className={classNames(styles, styles.intro)}>
            Complete technical reference for the DarkLight microcontroller ecosystem.
          </p>

          <div className={classNames(styles, styles.sections)}>
            {DOC_DATA.map((doc) => (
              <section key={doc.id} id={doc.id} className={classNames(styles, styles.section)}>
                <div className={classNames(styles, styles.eyebrow)}>
                  <span>{doc.category}</span>
                  <ChevronRight size={14} className={classNames(styles, styles.chevron)} />
                </div>
                <h2 className={classNames(styles, styles.sectionTitle)}>{doc.title}</h2>
                <div className={classNames(styles, styles.prose)}>
                  {doc.content}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
