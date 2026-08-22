import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';
import Link from 'next/link';
import NativeBanner from '../../../components/NativeBanner';
import ShareActions from '../../../components/ShareActions';
import BannerAd from '../../../components/BannerAd';

interface Word {
  id: number;
  alphabet: string;
  word: string;
  note: string;
}

export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), 'public', 'spelling_data.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  const words: Word[] = JSON.parse(jsonData);

  return words.map((w) => ({
    id: w.id.toString(),
  }));
}

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const params = await props.params;
  const filePath = path.join(process.cwd(), 'public', 'spelling_data.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  const words: Word[] = JSON.parse(jsonData);
  
  const wordData = words.find(w => w.id.toString() === params.id);
  
  if (!wordData) {
    return { title: 'Not Found' };
  }

  return {
    title: `${wordData.word} - မြန်မာစာလုံးပေါင်းသတ်ပုံ`,
    description: wordData.note || `${wordData.word} ၏ စာလုံးပေါင်းသတ်ပုံအမှန်`,
    openGraph: {
      title: `${wordData.word} - မြန်မာစာလုံးပေါင်းသတ်ပုံ`,
      description: wordData.note || `${wordData.word} ၏ စာလုံးပေါင်းသတ်ပုံအမှန်`,
    }
  };
}

export default async function WordPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const filePath = path.join(process.cwd(), 'public', 'spelling_data.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  const words: Word[] = JSON.parse(jsonData);
  
  const wordData = words.find(w => w.id.toString() === params.id);

  if (!wordData) {
    return (
      <main className="container" style={{ textAlign: 'center', padding: '4rem' }}>
        <h1>ရှာမတွေ့ပါ</h1>
        <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>ပင်မစာမျက်နှာသို့ ပြန်သွားရန်</Link>
      </main>
    );
  }

  return (
    <main className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'DefinedTerm',
            name: wordData.word,
            description: wordData.note || `${wordData.word} ၏ စာလုံးပေါင်းသတ်ပုံအမှန်`,
            url: `https://mm-spelling.mnote.pp.ua/word/${wordData.id}`,
          }),
        }}
      />
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'none', marginBottom: '2rem', display: 'inline-block' }}>
          ← နောက်သို့ (Back to Search)
        </Link>
        
        <div className="word-card" style={{ maxWidth: '600px', margin: '0 auto', display: 'block', textAlign: 'center', padding: '3rem' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>{wordData.word}</h1>
          {wordData.note && (
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
              {wordData.note}
            </p>
          )}
          <ShareActions text={wordData.word} path={`/word/${wordData.id}`} />
        </div>

        <NativeBanner
          src="https://pl30889752.effectivecpmnetwork.com/1805853a00a27f487672c22a26b431f8/invoke.js"
          containerId="container-1805853a00a27f487672c22a26b431f8"
        />

        <BannerAd
          keyId="505ce4882e690f6fc4c4b34c53a08a37"
          src="https://www.highrevenueformat.com/505ce4882e690f6fc4c4b34c53a08a37/invoke.js"
        />
      </div>
    </main>
  );
}
