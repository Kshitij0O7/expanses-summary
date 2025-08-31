import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

// Simple function to categorize transactions based on keywords.
function categorizeTransaction(description) {
  const lowerDesc = description.toLowerCase();
  
  if (lowerDesc.includes('zomato') || lowerDesc.includes('swiggy')) {
    return 'Food Delivery';
  }
  if (
    lowerDesc.includes('msk') || 
    lowerDesc.includes('bakery') || 
    lowerDesc.includes('sweet') ||
    lowerDesc.includes('sarvjeet singh') ||
    lowerDesc.includes('keshav jairath')
    ) {
    return 'Groceries & Bakery';
  }
  if (lowerDesc.includes('netflix') || lowerDesc.includes('apple media services')) {
    return 'Subscriptions';
  }
  if (lowerDesc.includes('skechers')) {
    return 'Shopping';
  }
  if (lowerDesc.includes('reliance jio')) {
    return 'Utilities';
  }
  if (lowerDesc.includes('the pavilion')) {
    return 'Restaurants';
  }

  if (
    lowerDesc.includes('nityam gupta') || 
    lowerDesc.includes('palash gupta') ||
    lowerDesc.includes('nidhi mahajan') ||
    lowerDesc.includes('monika gupta') ||
    lowerDesc.includes('armaan gupta') ||
    lowerDesc.includes('hitakshaye arora') ||
    lowerDesc.includes('tushar seth')
  ) {
    return 'Individual Payments';
  }
  if (
    lowerDesc.includes('google pay') ||
    lowerDesc.includes('google') ||
    lowerDesc.includes('amazon pay')
  ) {
    return 'Digital Payments';
  }

  return 'Other';
}

export async function POST(request) {
    try {
      const arrayBuffer = await request.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert the worksheet to a JSON array. We no longer rely on the header.
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      let totalDebit = 0;
      let totalCredit = 0;
      const categoryTotals = {};
  
      // Start parsing from the third row (index 2), as the first two rows are headers and metadata
      for (let i = 2; i < jsonData.length; i++) {
          const row = jsonData[i];
          
          // A valid transaction row has a value in the first column (Date)
          if (row[0]) {
              const description = row[1] || '';
              const type = row[2] || '';
              // The amount might be a number or a string.
              const amount = parseFloat(row[3]);
  
              if (type.toLowerCase() === 'debit') {
                  totalDebit += amount;
                  const category = categorizeTransaction(description);
                  categoryTotals[category] = (categoryTotals[category] || 0) + amount;
              } else if (type.toLowerCase() === 'credit') {
                  totalCredit += amount;
              }
          }
      }
  
      const report = {
        total_debit: totalDebit,
        total_credit: totalCredit,
        net_expenditure: totalDebit - totalCredit,
        category_totals: categoryTotals,
      };
      
      return NextResponse.json(report);
  
    } catch (error) {
      console.error('API Error:', error);
      return NextResponse.json({ message: 'Error processing the XLSX file.', error: error.message }, { status: 500 });
    }
}