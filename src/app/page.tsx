'use client';

import { useState, useEffect, useMemo } from 'react';

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

export default function Home() {
  const [allWords, setAllWords] = useState<Word[]>([]);
  const [search, setSearch] = useState('');
  const [activeAlpha, setActiveAlpha] = useState('က');
  const [loading, setLoading] = useState(true);

  // Fetch the static JSON data once on mount
  useEffect(() => {
    const fetchStaticData = async () => {
      try {
        const basePath = process.env.NODE_ENV === 'production' ? '/myanmar-spelling-web' : '';
        const res = await fetch(`${basePath}/spelling_data.json`);
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

  // Filter words instantly on the client side
  const filteredWords = useMemo(() => {
    if (search) {
      // If there's a search term, filter all words by matching the term
      return allWords
        .filter((w) => w.word.includes(search))
        .slice(0, 500); // Limit to 500 to prevent rendering lag
    }
    
    // Otherwise, filter by the active alphabet
    if (activeAlpha) {
      return allWords.filter((w) => w.alphabet === activeAlpha);
    }
    
    return [];
  }, [allWords, search, activeAlpha]);

  // When search changes, we want to clear the active alphabet visually
  useEffect(() => {
    if (search && activeAlpha) {
      setActiveAlpha('');
    } else if (!search && !activeAlpha) {
      setActiveAlpha('က');
    }
  }, [search, activeAlpha]);

  const handleAlphabetClick = (alpha: string) => {
    setSearch('');
    setActiveAlpha(alpha);
  };

  return (
    <main className="container">
      <div className="header">
        <h1>မြန်မာစာလုံးပေါင်းသတ်ပုံကျမ်း</h1>
        <p>Myanmar Spelling Dictionary (2003 Reference)</p>
        
        <div className="search-container">
          <input 
            type="text" 
            className="search-input" 
            placeholder="စာလုံး ရှာဖွေရန်..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
                <div className="word-text">{w.word}</div>
                {w.note && <div className="word-note">{w.note}</div>}
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
