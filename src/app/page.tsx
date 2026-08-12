'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Fuse from 'fuse.js';

interface Word {
  id: number;
  alphabet: string;
  word: string;
  note: string;
}

const alphabets = [
  'က', 'ခ', 'ဂ', 'ဃ', 'င', 'စ', 'ဆ', 'ဇ', 'ဈ', 'ဉ', 'ည', 
  'ဋ', 'ဌ', 'ဍ', 'ဎ', 'ဏ', 'တ', 'ထ', 'ဒ', 'ဓ', 'န', 
  'ပ', 'ဖ', 'ဗ', 'ဘ', 'မ', 'ယ', 'ရ', 'လ', 'ဝ', 'သ', 
  'ဟ', 'ဠ', 'အ'
];

// SVG Icons
const SunIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

const MoonIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

const CopyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default function Home() {
  const [allWords, setAllWords] = useState<Word[]>([]);
  const [search, setSearch] = useState('');
  const [activeAlpha, setActiveAlpha] = useState('က');
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Fetch the static JSON data once on mount
  useEffect(() => {
    const fetchStaticData = async () => {
      try {
        const res = await fetch('/spelling_data.json');
        const data = await res.json();
        setAllWords(data);
      } catch (error) {
        console.error('Failed to fetch spelling data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStaticData();
  }, []);

  // Initialize Fuse.js for fuzzy search
  const fuse = useMemo(() => new Fuse(allWords, {
    keys: ['word'],
    threshold: 0.4, // Lower means more strict, 0.4 allows slight typos
    distance: 100,
  }), [allWords]);

  // Filter words instantly on the client side
  const filteredWords = useMemo(() => {
    if (search) {
      // Fuzzy search using Fuse.js
      return fuse.search(search).map(result => result.item).slice(0, 500);
    }
    
    // Otherwise, filter by the active alphabet
    if (activeAlpha) {
      return allWords.filter((w) => w.alphabet === activeAlpha);
    }
    
    return [];
  }, [allWords, search, activeAlpha, fuse]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    if (val && activeAlpha) {
      setActiveAlpha('');
    } else if (!val && !activeAlpha) {
      setActiveAlpha('က');
    }
  };

  const handleAlphabetClick = (alpha: string) => {
    setSearch('');
    setActiveAlpha(alpha);
  };

  const copyToClipboard = useCallback((id: number, word: string) => {
    navigator.clipboard.writeText(word).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }, []);

  return (
    <main className="container">

      <div className="header">
        <div className="header-top">
          <h1>မြန်မာစာလုံးပေါင်းသတ်ပုံကျမ်း</h1>
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            aria-label="Toggle Dark/Light Mode"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
        <p>Myanmar Spelling Dictionary (2003 Reference)</p>
        
        <div className="search-container">
          <input 
            type="text" 
            className="search-input" 
            placeholder="စာလုံး အမှားအယွင်းများ (Fuzzy) ပါရှာဖွေနိုင်ပါသည်..." 
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {!search && (
        <div className="alphabet-grid">
          {alphabets.map((alpha) => (
            <button
              key={alpha}
              className={`alphabet-btn ${activeAlpha === alpha ? 'active' : ''}`}
              onClick={() => handleAlphabetClick(alpha)}
            >
              {alpha}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="loading">ဒေတာများကို ရှာဖွေနေပါသည်...</div>
      ) : (
        <div className="words-container">
          {filteredWords.length > 0 ? (
            filteredWords.map((w) => (
              <div key={w.id} className="word-card">
                <div>
                  <div className="word-text">{w.word}</div>
                  {w.note && <div className="word-note">{w.note}</div>}
                </div>
                <button 
                  className={`copy-btn ${copiedId === w.id ? 'copied' : ''}`}
                  onClick={() => copyToClipboard(w.id, w.word)}
                  title="စာလုံးကူးယူရန် (Copy)"
                >
                  {copiedId === w.id ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
            ))
          ) : (
            <div className="empty-state">
              ရှာဖွေနေသော စာလုံး မတွေ့ရှိပါခင်ဗျာ။
            </div>
          )}
        </div>
      )}
    </main>
  );
}
