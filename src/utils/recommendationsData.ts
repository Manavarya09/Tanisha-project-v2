import recommendationsCSV from '../../Recommendations (1).csv?raw';
import { parseRecommendationsCSV } from '../utils/recommendationCSV';

export const recommendationsData = parseRecommendationsCSV(recommendationsCSV);
