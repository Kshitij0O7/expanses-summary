// "use client"

// import { useState } from 'react';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// import { Pie } from 'react-chartjs-2';

// ChartJS.register(ArcElement, Tooltip, Legend);

// export default function Home() {
//   const [report, setReport] = useState(null);
//   const [error, setError] = useState(null);
//   const [isProcessing, setIsProcessing] = useState(false);

//   const handleFileChange = async (event) => {
//     const file = event.target.files?.[0];
//     if (!file) {
//       setError('No file selected.');
//       return;
//     }

//     setIsProcessing(true);
//     setError(null);
//     setReport(null);

//     try {
//       const response = await fetch('/api/analyze-statement', {
//         method: 'POST',
//         // Next.js and the browser will automatically set the correct Content-Type (e.g., application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)
//         // by sending the raw File object as the body.
//         body: file,
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       setReport(result);
//     } catch (e) {
//       setError(e.message);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const pieChartData = report ? {
//     labels: Object.keys(report.category_breakdown),
//     datasets: [
//       {
//         label: '₹',
//         data: Object.values(report.category_breakdown),
//         backgroundColor: [
//           'rgba(255, 99, 132, 0.6)',
//           'rgba(54, 162, 235, 0.6)',
//           'rgba(255, 206, 86, 0.6)',
//           'rgba(75, 192, 192, 0.6)',
//           'rgba(153, 102, 255, 0.6)',
//           'rgba(255, 159, 64, 0.6)',
//           'rgba(199, 199, 199, 0.6)',
//         ],
//         borderColor: [
//           'rgba(255, 99, 132, 1)',
//           'rgba(54, 162, 235, 1)',
//           'rgba(255, 206, 86, 1)',
//           'rgba(75, 192, 192, 1)',
//           'rgba(153, 102, 255, 1)',
//           'rgba(255, 159, 64, 1)',
//           'rgba(199, 199, 199, 1)',
//         ],
//         borderWidth: 1,
//       },
//     ],
//   } : null;

//   return (
//     <div className="bg-gray-100 min-h-screen p-8 font-sans antialiased">
//       <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
//         <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
//           Financial Report
//         </h1>
//         <p className="text-gray-600 mb-6">
//           Upload your PhonePe statement XLSX file to get a categorized report and summary powered by Gemini.
//         </p>

//         <div className="flex flex-col items-center justify-center space-y-4 border-2 border-dashed border-gray-300 rounded-lg p-8 mb-8">
//           <label htmlFor="file-upload" className="cursor-pointer">
//             <div className="flex flex-col items-center justify-center">
//               <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-4-4v-1a4 4 0 014-4h10a4 4 0 014 4v1a4 4 0 01-4 4H7z"></path>
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
//               </svg>
//               <p className="text-lg text-gray-600">
//                 <span className="font-medium text-indigo-600 hover:text-indigo-500">Click to upload</span> or drag and drop
//               </p>
//               <p className="text-sm text-gray-500">XLSX file</p>
//             </div>
//             <input id="file-upload" type="file" accept=".xlsx" onChange={handleFileChange} className="sr-only" />
//           </label>
//         </div>

//         {isProcessing && (
//           <div className="flex justify-center my-8">
//             <TailSpin color="#4f46e5" height={50} width={50} />
//           </div>
//         )}

//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative my-8" role="alert">
//             <strong className="font-bold">Error!</strong>
//             <span className="block sm:inline ml-2">{error}</span>
//           </div>
//         )}

//         {report && (
//           <div className="grid md:grid-cols-2 gap-8 mt-8">
//             <div className="bg-indigo-50 rounded-xl p-6 shadow-sm">
//               <h2 className="text-2xl font-bold text-gray-900 mb-4">Report Summary</h2>
//               <ul className="space-y-2 text-gray-700">
//                 <li className="flex justify-between items-center text-lg">
//                   <span className="font-semibold">Total Debits:</span>
//                   <span className="text-red-600 font-bold">₹{report.total_debit.toFixed(2)}</span>
//                 </li>
//                 <li className="flex justify-between items-center text-lg">
//                   <span className="font-semibold">Total Credits:</span>
//                   <span className="text-green-600 font-bold">₹{report.total_credit.toFixed(2)}</span>
//                 </li>
//                 <li className="flex justify-between items-center text-lg">
//                   <span className="font-semibold">Net Expenditure:</span>
//                   <span className="text-gray-900 font-bold">₹{report.net_expenditure.toFixed(2)}</span>
//                 </li>
//               </ul>
//             </div>
            
//             <div className="bg-indigo-50 rounded-xl p-6 shadow-sm flex items-center justify-center">
//               <div className="w-full h-full">
//                 <h3 className="text-2xl font-bold text-center text-gray-900 mb-4">Expenditure by Category</h3>
//                 {pieChartData && <Pie data={pieChartData} />}
//               </div>
//             </div>

//             <div className="md:col-span-2 bg-indigo-50 rounded-xl p-6 shadow-sm">
//               <h3 className="text-2xl font-bold text-gray-900 mb-4">Spending Habits Analysis</h3>
//               <p className="text-gray-700 leading-relaxed">{report.spending_summary}</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
// import { TailSpin } from 'react-loader-spinner';

ChartJS.register(ArcElement, Tooltip, Legend);

const Loader = () => (
  <div className="flex justify-center items-center my-8">
    <div className="w-12 h-12 border-4 border-indigo-600 border-dashed rounded-full animate-spin"></div>
  </div>
);

export default function Home() {
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [inputKey, setInputKey] = useState('');

  const handleApiKeySubmit = (e) => {
    e.preventDefault();
    if (inputKey) {
      setApiKey(inputKey);
    }
  };

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
        headers: {
          'X-Gemini-Api-Key': apiKey, // Pass the API key in a custom header
        },
        body: file,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.error) {
        setError(result.error);
      } else {
        setReport(result);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const pieChartData = report ? {
    labels: Object.keys(report.category_breakdown),
    datasets: [
      {
        label: '₹',
        data: Object.values(report.category_breakdown),
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

  if (!apiKey) {
    return (
      <div className="bg-gray-100 min-h-screen p-8 flex items-center justify-center font-sans antialiased">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4 text-center">
            Enter Your Gemini API Key
          </h1>
          <p className="text-gray-600 mb-6 text-center">
            This key is used to power the intelligent reporting and is not stored.
          </p>
          <form onSubmit={handleApiKeySubmit} className="space-y-4">
            <input
              type="text"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Enter your API key here..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8 font-sans antialiased">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          Financial Report
        </h1>
        <p className="text-gray-600 mb-6">
          Upload your PhonePe statement XLSX file to get a categorized report and summary powered by Gemini.
        </p>

        <div className="flex flex-col items-center justify-center space-y-4 border-2 border-dashed border-gray-300 rounded-lg p-8 mb-8">
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center justify-center">
              <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-4-4v-1a4 4 0 014-4h10a4 4 0 014 4v1a4 4 0 01-4 4H7z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <p className="text-lg text-gray-600">
                <span className="font-medium text-indigo-600 hover:text-indigo-500">Click to upload</span> or drag and drop
              </p>
              <p className="text-sm text-gray-500">XLSX file</p>
            </div>
            <input id="file-upload" type="file" accept=".xlsx" onChange={handleFileChange} className="sr-only" />
          </label>
        </div>

        {isProcessing && (
          <div className="flex justify-center my-8">
            <Loader />
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative my-8" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        {report && (
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div className="bg-indigo-50 rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Report Summary</h2>
              <ul className="space-y-2 text-gray-700">
                <li className="flex justify-between items-center text-lg">
                  <span className="font-semibold">Total Debits:</span>
                  <span className="text-red-600 font-bold">₹{report.total_debit.toFixed(2)}</span>
                </li>
                <li className="flex justify-between items-center text-lg">
                  <span className="font-semibold">Total Credits:</span>
                  <span className="text-green-600 font-bold">₹{report.total_credit.toFixed(2)}</span>
                </li>
                <li className="flex justify-between items-center text-lg">
                  <span className="font-semibold">Net Expenditure:</span>
                  <span className="text-gray-900 font-bold">₹{report.net_expenditure.toFixed(2)}</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-indigo-50 rounded-xl p-6 shadow-sm flex items-center justify-center">
              <div className="w-full h-full">
                <h3 className="text-2xl font-bold text-center text-gray-900 mb-4">Expenditure by Category</h3>
                {pieChartData && <Pie data={pieChartData} />}
              </div>
            </div>

            <div className="md:col-span-2 bg-indigo-50 rounded-xl p-6 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Spending Habits Analysis</h3>
              <p className="text-gray-700 leading-relaxed">{report.spending_summary}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
