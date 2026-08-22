import fs from 'fs';
import path from 'path';
import SpellingHome from '../components/SpellingHome';

interface Word {
  id: number;
  alphabet: string;
  word: string;
  note: string;
}

export default function Page() {
  const filePath = path.join(process.cwd(), 'public', 'spelling_data.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  const words: Word[] = JSON.parse(jsonData);

  return <SpellingHome words={words} />;
}
