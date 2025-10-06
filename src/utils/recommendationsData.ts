// Fetch and parse recommendations CSV at runtime
import { parseRecommendationsCSV } from './recommendationCSV';

let recommendationsData: any[] = [];

export async function loadRecommendationsData() {
  if (recommendationsData.length > 0) return recommendationsData;
  const res = await fetch('/Recommendations (1).csv');
  const text = await res.text();
  recommendationsData = parseRecommendationsCSV(text);
  return recommendationsData;
}
