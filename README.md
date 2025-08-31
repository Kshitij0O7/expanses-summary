# Financial Report Web Application
This is a web-based financial analysis tool that allows users to upload a PhonePe transaction statement in .xlsx format and receive an intelligent, categorized expenditure report. The application uses a Next.js backend to parse the file and the Gemini API to analyze the data, providing both a visual breakdown and a qualitative summary of spending habits.

## Features

- XLSX File Upload: Securely upload your PhonePe transaction statement in a .xlsx format.

- Intelligent Reporting: The Gemini API analyzes the transaction data to provide accurate categorization of expenditures.

- Dynamic Visualization: A pie chart is generated to visually represent the breakdown of spending by category.

- Qualitative Analysis: Receive a short, human-readable summary of your monthly spending patterns.

- Client-Side API Key: Your Gemini API key is securely handled on the client side and is never stored on the server.

## Technologies Used

- Frontend: React, Next.js, and Tailwind CSS

- Backend: Next.js API Routes

- Data Parsing: xlsx library for parsing XLSX files

- AI Integration: @google/generative-ai SDK for interacting with the Gemini API

- Visualization: react-chartjs-2 for dynamic charts

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites
- Node.js (v18 or higher)
- npm

### Clone the repository

```sh
git clone https://github.com/Kshitij0O7/expanses-summary
cd expanses-summary
```

### Install Dependencies

Install all the necessary packages for both the frontend and backend.

```sh
npm install
```

### Obtain a Gemini API Key

You need a Gemini API key to use the intelligent reporting feature.

1. Go to the [Google AI Studio](https://aistudio.google.com/apikey).

2. Create a new API key.

### Run the Project

Start the Next.js development server.

```sh
npm run dev
```