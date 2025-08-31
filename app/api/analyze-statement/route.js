import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as XLSX from 'xlsx';

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// async function findSupportedModel() {
//     try {
//       const { models } = await genAI.listModels();
//       const supportedModel = models.find(m =>
//         m.supportedGenerationMethods.includes('generateContent') && m.name.includes('gemini')
//       );
//       if (supportedModel) {
//         // The model name from the API has a 'models/' prefix, e.g., 'models/gemini-1.5-flash'.
//         // We need to strip this for the getGenerativeModel call.
//         return supportedModel.name.split('/')[1];
//       }
//     } catch (error) {
//       console.error('Error listing models from Gemini API:', error);
//     }
//     return null;
// }

const reportSchema = {
  type: 'object',
  properties: {
    total_debit: { type: 'number' },
    total_credit: { type: 'number' },
    net_expenditure: { type: 'number' },
    category_breakdown: {
      type: 'object',
      additionalProperties: {
        type: 'number',
      },
    },
    spending_summary: { type: 'string' },
  },
};

export async function POST(request) {
  try {
    const apiKey = request.headers.get('X-Gemini-Api-Key');
        if (!apiKey) {
            return NextResponse.json({ message: 'API key is missing from request headers.' }, { status: 400 });
        }

    const genAI = new GoogleGenerativeAI(apiKey);

    const arrayBuffer = await request.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert the worksheet to a JSON array.
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    // Process the unstructured data to create a clean text summary for Gemini
    let transactionText = '';
    for (let i = 2; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (row[0]) {
            const date = row[0];
            const description = row[1] || '';
            const type = row[2] || '';
            const amount = row[3] || 0;
            transactionText += `Date: ${date}, Description: ${description}, Type: ${type}, Amount: ${amount}\n`;
        }
    }
    
    // const modelName = await findSupportedModel();
    // if (!modelName) {
    //   return NextResponse.json({ message: 'Error: No Gemini model found that supports generateContent.' }, { status: 500 });
    // }
    
    // Use the dynamically found model name
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

    const prompt = `
        You are a financial analysis assistant. Your task is to analyze the following PhonePe transaction statement.
        
        1.  Extract all transactions, including the debit/credit amount and description.
        2.  Categorize each transaction into logical spending categories like 'Food', 'Shopping', 'Travel', 'Subscriptions', 'Utilities', 'Restaurants', 'Groceries & Bakery', and 'Individual Payments'.
        3.  Note that some individuals like "keshav jairath" and "sarvjeet singh" are small vendor names.
        4.  Calculate the total debit, total credit, and a total for each category.
        5.  Provide a short, qualitative summary of the spending habits for the month.
        6.  For individual payments, mention the individual names in the summary in descending order of amount paid.
        
        Return the result as a single JSON object that strictly adheres to the following schema:
        ${JSON.stringify(reportSchema, null, 2)}
        
        Transaction Statement:
        
        """
        ${transactionText}
        """
        `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleanedJsonString = text.replace(/```json\n|```/g, '').trim();
    const report = JSON.parse(cleanedJsonString);

    return NextResponse.json(report);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { message: 'Error processing statement with Gemini.', error: error.message },
      { status: 500 }
    );
  }
}