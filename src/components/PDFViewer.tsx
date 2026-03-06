import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set worker from local node_modules
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  url: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ url }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [width, setWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div className="pdf-viewer-container">
      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<div className="loading">Loading PDF...</div>}
        error={<div className="error">Failed to load PDF.</div>}
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            width={width}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        ))}
      </Document>

      <style>{`
        .pdf-viewer-container {
          width: 100%;
          min-height: 100vh;
          background-color: #000;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .react-pdf__Page {
          margin-bottom: 10px;
          display: block;
          box-shadow: 0 4px 8px rgba(0,0,0,0.5);
        }
        .react-pdf__Page:last-child {
          margin-bottom: 0;
        }
        canvas {
          display: block;
          max-width: 100%;
          height: auto !important;
        }
        .loading, .error {
          color: white;
          padding: 20px;
        }
      `}</style>
    </div>
  );
};

export default PDFViewer;
