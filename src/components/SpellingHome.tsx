'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Fuse from 'fuse.js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import NativeBanner from './NativeBanner';

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

const FAVORITES_KEY = 'spelling-favorites';

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

const ShareIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"></circle>
    <circle cx="6" cy="12" r="3"></circle>
    <circle cx="18" cy="19" r="3"></circle>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
  </svg>
);

const StarIcon = ({ filled }: { filled?: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const ShuffleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 3 21 3 21 8"></polyline>
    <line x1="4" y1="20" x2="21" y2="3"></line>
    <polyline points="21 16 21 21 16 21"></polyline>
    <line x1="15" y1="15" x2="21" y2="21"></line>
    <line x1="4" y1="4" x2="9" y2="9"></line>
  </svg>
);

export default function SpellingHome({ words }: { words: Word[] }) {
  const allWords = words;
  const [search, setSearch] = useState('');
  const [activeAlpha, setActiveAlpha] = useState('က');
  const [theme, setTheme] = useState('dark');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const router = useRouter();

  // Initialize theme and favorites from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of persisted state after mount (SSR-safe)
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    try {
      setFavorites(JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]'));
    } catch {
      setFavorites([]);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const toggleFavorite = useCallback((id: number) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
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
      return fuse.search(search).map(result => result.item);
    }

    if (showFavorites) {
      return allWords.filter((w) => favorites.includes(w.id));
    }

    if (activeAlpha) {
      return allWords.filter((w) => w.alphabet === activeAlpha);
    }

    return [];
  }, [allWords, search, showFavorites, activeAlpha, favorites, fuse]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    setShowFavorites(false);
    if (val && activeAlpha) {
      setActiveAlpha('');
    } else if (!val && !activeAlpha) {
      setActiveAlpha('က');
    }
  };

  const handleAlphabetClick = (alpha: string) => {
    setSearch('');
    setShowFavorites(false);
    setActiveAlpha(alpha);
  };

  const goRandom = useCallback(() => {
    const randomWord = allWords[Math.floor(Math.random() * allWords.length)];
    router.push(`/word/${randomWord.id}`);
  }, [allWords, router]);

  const copyToClipboard = useCallback((id: number, word: string) => {
    navigator.clipboard.writeText(word).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }, []);

  const shareContent = useCallback((id: number, word: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'မြန်မာစာလုံးပေါင်းသတ်ပုံ',
        text: `${word}`,
        url: `${window.location.origin}/word/${id}`
      }).catch(console.error);
    } else {
      copyToClipboard(id, word);
    }
  }, [copyToClipboard]);

  return (
    <main className="container">

      <div className="header">
        <div className="header-top">
          <h1>မြန်မာစာလုံးပေါင်းသတ်ပုံကျမ်း</h1>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="theme-toggle"
              onClick={goRandom}
              aria-label="ရှာဖွေမှု အလိုအလျောက်"
              title="ကျပန်း စာလုံးကြည့်ရန် (Random)"
            >
              <ShuffleIcon />
            </button>
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle Dark/Light Mode"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
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

      {!search && favorites.length > 0 && (
        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          <button
            onClick={() => { setShowFavorites(!showFavorites); setActiveAlpha(''); }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '999px',
              border: showFavorites ? '1px solid var(--primary)' : '1px solid var(--border)',
              background: showFavorites ? 'var(--primary)' : 'transparent',
              color: showFavorites ? '#fff' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: '500',
            }}
          >
            <StarIcon filled={showFavorites} /> သိမ်းဆည်းထားသည်များ ({favorites.length})
          </button>
        </div>
      )}

      {!search && !showFavorites && (
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

      <div className="words-container">
        {filteredWords.length > 0 ? (
          filteredWords.map((w, index) => (
            <div key={w.id} style={{ display: 'contents' }}>
              <div className="word-card">
                <Link href={`/word/${w.id}`} style={{ textDecoration: 'none', flex: 1, color: 'inherit', display: 'block' }}>
                  <div className="word-text" style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'inherit'}>{w.word}</div>
                  {w.note && <div className="word-note">{w.note}</div>}
                </Link>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    className="copy-btn"
                    onClick={() => toggleFavorite(w.id)}
                    title="သိမ်းဆည်းရန် (Favorite)"
                    style={favorites.includes(w.id) ? { color: '#ffc107' } : undefined}
                  >
                    <StarIcon filled={favorites.includes(w.id)} />
                  </button>
                  <button
                    className={`copy-btn ${copiedId === w.id ? 'copied' : ''}`}
                    onClick={() => copyToClipboard(w.id, w.word)}
                    title="စာလုံးကူးယူရန် (Copy)"
                  >
                    {copiedId === w.id ? <CheckIcon /> : <CopyIcon />}
                  </button>
                  <button
                    className="copy-btn"
                    onClick={() => shareContent(w.id, w.word)}
                    title="မျှဝေရန် (Share)"
                  >
                    <ShareIcon />
                  </button>
                </div>
              </div>

              {/* Native Banner Ad after the 8th item (or at the end if list is short) */}
              {(index === 7 || (filteredWords.length > 4 && filteredWords.length < 8 && index === filteredWords.length - 1)) && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <NativeBanner
                    src="https://pl30889752.effectivecpmnetwork.com/1805853a00a27f487672c22a26b431f8/invoke.js"
                    containerId="container-1805853a00a27f487672c22a26b431f8"
                  />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="empty-state">
            {showFavorites ? 'သိမ်းဆည်းထားသော စာလုံး မရှိသေးပါ။' : 'ရှာဖွေနေသော စာလုံး မတွေ့ရှိပါခင်ဗျာ။'}
          </div>
        )}
      </div>
    </main>
  );
}
