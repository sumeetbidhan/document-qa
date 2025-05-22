# Document QA

## Overview
Document QA is a modern web application built with Next.js and React. It provides a dashboard for managing document ingestion processes, allowing users to upload, process, and index documents for further querying and analysis.

## Features
- **Document Ingestion**: Upload and process documents with real-time status updates.
- **Status Tracking**: Monitor document processing status (pending, processing, indexed, failed) with visual indicators.
- **Retry Mechanism**: Retry failed document ingestion processes.
- **Responsive UI**: Built with a modern UI using Tailwind CSS and Radix UI components.
- **Real-time Updates**: Polling mechanism to update document status in real-time.

## Tech Stack
- **Frontend**: Next.js, React, TypeScript
- **UI Components**: Radix UI, Tailwind CSS
- **State Management**: React Hooks (useState, useEffect)
- **Icons**: Lucide React
- **Toast Notifications**: Custom toast component

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/sumeetbidhan/document-qa.git
   cd document-qa
   ```
2. Install dependencies:
   ```sh
   npm install
   npm install --save-dev @testing-library/jest-dom jest-environment-jsdom
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage
- **Dashboard**: Navigate to the ingestion page to view and manage documents.
- **Upload Documents**: Upload documents to start the ingestion process.
- **Monitor Status**: Track the status of each document with visual indicators.
- **Retry Failed Documents**: Retry ingestion for documents that failed processing.

## Project Structure
- `/components`: React components for the UI.
- `/context`: Context providers (e.g., authentication).
- `/lib`: Utility functions and mock services.
- `/pages`: Next.js pages.

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License. 

## Build
To build the project, run:
```sh
npm run build
``` 