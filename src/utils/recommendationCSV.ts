import Papa from 'papaparse';

export interface CSVRecommendationRow {
  pillar: string;
  resultType: string;
  priority: string;
  title: string;
  description: string;
  timeline: string;
}

export function parseRecommendationsCSV(csvText: string): CSVRecommendationRow[] {
  const parsed = Papa.parse(csvText, { header: true });
  return (parsed.data as any[]).map(row => ({
    pillar: row.Pillar || '',
    resultType: row.ResultType || '',
    priority: row.Priority || '',
    title: row.Title || '',
    description: row.Description || '',
    timeline: row.Timeline || ''
  }));
}
