import { classNames } from '../styles/classNames';
import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';
import styles from './styles/CodeBlock.module.css';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'cpp' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={classNames(styles, styles.block)}>
      <div className={classNames(styles, styles.toolbar)}>
        <div className={classNames(styles, styles.languageGroup)}>
          <Terminal size={14} className={classNames(styles, styles.languageIcon)} />
          <span className={classNames(styles, styles.language)}>{language}</span>
        </div>
        <button 
          onClick={handleCopy}
          className={classNames(styles, styles.copyButton)}
        >
          {copied ? <Check size={14} className={classNames(styles, styles.copied)} /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className={classNames(styles, styles.body)}>
        <pre className={classNames(styles, styles.pre)}>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};
