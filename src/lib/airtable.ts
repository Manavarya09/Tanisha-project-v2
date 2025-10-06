// Airtable utility for fetching and storing data
// Use environment variables for production to keep your token secure!

import Airtable, { type Records, FieldSet } from 'airtable';

const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = import.meta.env.VITE_AIRTABLE_TABLE_NAME;

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

export async function fetchAirtableRecords(): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const records: any[] = [];
    base(AIRTABLE_TABLE_NAME)
      .select({})
      .eachPage(
        function page(partialRecords: Records<FieldSet>, fetchNextPage: () => void) {
          records.push(...partialRecords.map((rec) => ({ id: rec.id, ...rec.fields })));
          fetchNextPage();
        },
        function done(err: any) {
          if (err) { reject(err); }
          else { resolve(records); }
        }
      );
  });
}

export async function createAirtableRecord(fields: Record<string, any>): Promise<any> {
  return new Promise((resolve, reject) => {
    // Clean up field names and values for Airtable compatibility
    const cleanedFields = Object.keys(fields).reduce((acc, key) => {
      const value = fields[key];
      // Skip null/undefined values
      if (value === null || value === undefined) return acc;
      
      // Clean field names (Airtable has restrictions on field names)
      const cleanKey = key.replace(/[^\w\s-]/g, '').substring(0, 100);
      
      // Handle different value types
      if (typeof value === 'string' && value.length > 100000) {
        // Truncate very long strings
        acc[cleanKey] = value.substring(0, 100000);
      } else {
        acc[cleanKey] = value;
      }
      
      return acc;
    }, {} as Record<string, any>);

    base(AIRTABLE_TABLE_NAME).create([{ fields: cleanedFields }], function (err: any, records: any) {
      if (err) { 
        console.error('Airtable error:', err);
        reject(err); 
      } else { 
        console.log('Airtable record created:', records?.[0]?.id);
        resolve(records); 
      }
    });
  });
}

export async function createAssessmentRecord(assessmentData: any): Promise<any> {
  try {
    // Create main assessment record with company info and summary
    const mainRecord = {
      'Company Name': assessmentData.companyName,
      'Industry': assessmentData.industry,
      'Company Size': assessmentData.companySize,
      'Region': assessmentData.region || 'Global',
      'Assessment Type': assessmentData.assessmentType || 'free',
      'Submitted At': new Date().toISOString(),
      'Total Questions Answered': Object.keys(assessmentData.responses || {}).length,
      'Assessment Status': 'Completed',
      'Raw Responses': JSON.stringify(assessmentData.responses || {})
    };

    const result = await createAirtableRecord(mainRecord);
    console.log('Assessment record created successfully:', result?.[0]?.id);
    return result;
  } catch (error) {
    console.error('Failed to create assessment record:', error);
    throw error;
  }
}
