import { classNames } from '../styles/classNames';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search as SearchIcon, Cpu, Menu, X, Wrench } from 'lucide-react';
import styles from './styles/Header.module.css';

interface HeaderProps {
  onOpenSearch: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, mobileMenuOpen, setMobileMenuOpen }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
  if (path === '/') {
    return location.pathname === '/'
      ? styles.navActive
      : styles.navLink;
  }

  return location.pathname.startsWith(path)
    ? styles.navActive
    : styles.navLink;
};

  return (
    <header className={classNames(styles, styles.header)}>
      <div className={classNames(styles, styles.bar)}>
        <Link to="/" className={classNames(styles, styles.brandLink)}>
          <Cpu className={classNames(styles, styles.brandIcon)} size={28} />
          <span className={classNames(styles, styles.brandName)}>
            Dark<span className={classNames(styles, styles.brandAccent)}>Light</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className={classNames(styles, styles.desktopNav)}>
          <Link to="/" className={classNames(styles, isActive('/'))}>Home</Link>
          <Link to="/learn" className={classNames(styles, isActive('/learn'))}>Learn</Link>
          {/* <Link to="/tools" className={isActive('/tools')}>Tools</Link> */}
          <Link to="/downloads" className={classNames(styles, isActive('/downloads'))}>Downloads</Link>
          <Link to="/community" className={classNames(styles, isActive('/community'))}>Community</Link>
        </nav>

        <div className={classNames(styles, styles.actions)}>
          <button 
            onClick={onOpenSearch}
            className={classNames(styles, styles.searchButton)}
          >
            <SearchIcon size={14} />
            <span className={classNames(styles, styles.searchText)}>Search...</span>
            <kbd className={classNames(styles, styles.shortcut)}>Ctrl K</kbd>
          </button>
          
          <button 
            className={classNames(styles, styles.menuButton)}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={classNames(styles, styles.mobileMenu)}>
          <nav className={classNames(styles, styles.mobileNav)}>
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className={classNames(styles, styles.mobileLink)}>Home</Link>
            <Link to="/learn" onClick={() => setMobileMenuOpen(false)} className={classNames(styles, styles.mobileLink)}>Learn</Link>
            {/* <Link to="/tools" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 block">Tools</Link> */}
            <Link to="/downloads" onClick={() => setMobileMenuOpen(false)} className={classNames(styles, styles.mobileLink)}>Downloads</Link>
            <Link to="/community" onClick={() => setMobileMenuOpen(false)} className={classNames(styles, styles.mobileLink)}>Community</Link>
          </nav>
        </div>
      )}
    </header>
  );
};
