import Airtable from "airtable";
import dotenv from "dotenv";
dotenv.config();

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN || "";
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || "";

Airtable.configure({ apiKey: AIRTABLE_TOKEN })

const airtable = new Airtable()

const base = airtable.base(AIRTABLE_BASE_ID)

export const test = () => {
    base('Talents').select({
        // Your query options here
    }).eachPage(function page(records, fetchNextPage) {
        // Process each record
        records.forEach(function (record) {
            console.log('Retrieved', record.get('Advanced'));
        });

        // Fetch next page
        fetchNextPage();
    }, function done(err) {
        if (err) { console.error(err); return; }
    });
}