import { classNames } from '../styles/classNames';
import React from 'react';
import { Github, Twitter, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './styles/Footer.module.css';

export const Footer: React.FC = () => {
  const handleSocialClick = (e: React.MouseEvent, platform: string) => {
    e.preventDefault();
    alert(`Redirecting to official ${platform} page...`);
  };

  return (
    <footer className={classNames(styles, styles.footer)}>
      <div className={classNames(styles, styles.container)}>
        <div className={classNames(styles, styles.grid)}>
          <div>
            <h3 className={classNames(styles, styles.heading)}>DarkLight</h3>
            <p className={classNames(styles, styles.description)}>
              Empowering embedded engineers with high-performance, 3.3V logic microcontroller platforms.
              Designed for speed, precision, and ease of use.
            </p>
          </div>
          <div>
            <h3 className={classNames(styles, styles.heading)}>Resources</h3>
            <ul className={classNames(styles, styles.list)}>
              <li><Link to="/learn" className={classNames(styles, styles.link)}>Learn</Link></li>
              <li><Link to="/community" className={classNames(styles, styles.link)}>Downloads & Examples</Link></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); alert("API Reference available in Learn section."); }} className={classNames(styles, styles.link)}>API Reference</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); alert("Schematics download requires login."); }} className={classNames(styles, styles.link)}>Hardware Schematics</a></li>
            </ul>
          </div>
          <div>
            <h3 className={classNames(styles, styles.heading)}>Connect</h3>
            <div className={classNames(styles, styles.socials)}>
              <a href="#" onClick={(e) => handleSocialClick(e, "GitHub")} className={classNames(styles, styles.socialLink)}><Github size={20} /></a>
              <a href="#" onClick={(e) => handleSocialClick(e, "Twitter")} className={classNames(styles, styles.socialLink)}><Twitter size={20} /></a>
              <a href="mailto:contact@darklight.dev" className={classNames(styles, styles.socialLink)}><Mail size={20} /></a>
            </div>
            <p className={classNames(styles, styles.copyright)}>
              © {new Date().getFullYear()} DarkLight Microcontrollers. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
