"use client"

import { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Home() {
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setError('No file selected.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setReport(null);

    try {
      const response = await fetch('/api/analyze-statement', {
        method: 'POST',
        // Next.js and the browser will automatically set the correct Content-Type (e.g., application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)
        // by sending the raw File object as the body.
        body: file,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setReport(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const pieChartData = report ? {
    labels: Object.keys(report.category_totals),
    datasets: [
      {
        label: '₹',
        data: Object.values(report.category_totals),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(199, 199, 199, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
        ],
        borderWidth: 1,
      },
    ],
  } : null;

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: 'auto' }}>
      <h1>Web Expenditure Report</h1>
      <p>Upload your PhonePe statement as an XLSX file to generate a report.</p>

      <div style={{ margin: '1rem 0' }}>
        <input type="file" accept=".xlsx" onChange={handleFileChange} />
      </div>

      {isProcessing && <p style={{ color: 'blue' }}>Processing...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {report && (
        <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2>Report Summary</h2>
          <p><strong>Total Debits (Expenditure):</strong> ₹{report.total_debit.toFixed(2)}</p>
          <p><strong>Total Credits (Income):</strong> ₹{report.total_credit.toFixed(2)}</p>
          <p><strong>Net Expenditure:</strong> ₹{report.net_expenditure.toFixed(2)}</p>

          <div style={{ width: '400px', height: '400px', marginTop: '2rem' }}>
            <h3>Expenditure by Category</h3>
            {pieChartData && <Pie data={pieChartData} />}
          </div>
        </div>
      )}
    </div>
  );
}