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
    base(AIRTABLE_TABLE_NAME).create([{ fields }], function (err: any, records: any) {
      if (err) { reject(err); }
      else { resolve(records); }
    });
  });
}
