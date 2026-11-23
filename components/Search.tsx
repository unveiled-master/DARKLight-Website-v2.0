import { classNames } from '../styles/classNames';
import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X, ChevronRight } from 'lucide-react';
import { DOC_DATA } from '../constants';
import { SearchResult } from '../types';
import { useNavigate } from 'react-router-dom';
import styles from './styles/Search.module.css';

interface SearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Search: React.FC<SearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered: SearchResult[] = DOC_DATA.flatMap(doc => {
      // Very basic relevance scoring could be added here
      if (
        doc.title.toLowerCase().includes(lowerQuery) ||
        doc.keywords.some(k => k.toLowerCase().includes(lowerQuery))
      ) {
        return [{
          id: doc.id,
          title: doc.title,
          category: doc.category,
          snippet: `Found in ${doc.category}`
        }];
      }
      return [];
    });
    setResults(filtered);
  }, [query]);

  const handleSelect = (id: string) => {
    navigate(`/learn#${id}`);
    onClose();
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <div className={classNames(styles, styles.backdrop)}>
      <div className={classNames(styles, styles.dialog)}>
        <div className={classNames(styles, styles.toolbar)}>
          <SearchIcon className={classNames(styles, styles.searchIcon)} size={20} />
          <input
            ref={inputRef}
            type="text"
            className={classNames(styles, styles.input)}
            placeholder="Search API, functions, terminology..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={onClose} className={classNames(styles, styles.closeButton)}>
            <X size={20} />
          </button>
        </div>
        
        <div className={classNames(styles, styles.results)}>
          {results.length === 0 && query && (
            <div className={classNames(styles, styles.empty)}>
              No results found for "{query}"
            </div>
          )}
          {results.map((result) => (
            <button
              key={result.id}
              onClick={() => handleSelect(result.id)}
              className={classNames(styles, styles.result)}
            >
              <div>
                <h4 className={classNames(styles, styles.title)}>
                  {result.title}
                </h4>
                <span className={classNames(styles, styles.category)}>
                  {result.category}
                </span>
              </div>
              <ChevronRight className={classNames(styles, styles.chevron)} size={16} />
            </button>
          ))}
          {!query && (
            <div className={classNames(styles, styles.hint)}>
              Type to search API methods, pins, or concepts.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
