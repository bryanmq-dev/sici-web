'use client';

import React from 'react';
import { FileText, ExternalLink, Download } from 'lucide-react';

interface PDFViewerProps {
  url: string;
  title: string;
}

export default function PDFViewer({ url, title }: PDFViewerProps) {
  return (
    <div className="glass rounded-3xl overflow-hidden border border-white/10 h-[600px] flex flex-col">
      <div className="p-4 bg-accent/50 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="w-5 h-5 text-primary" />
          <span className="text-sm font-bold truncate max-w-[200px] md:max-w-md">{title}</span>
        </div>
        <div className="flex items-center space-x-2">
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-secondary hover:text-white"
            title="Abrir en nueva pestaña"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <a 
            href={url} 
            download
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-secondary hover:text-white"
            title="Descargar"
          >
            <Download className="w-4 h-4" />
          </a>
        </div>
      </div>
      
      <div className="flex-grow bg-white/5 relative">
        <iframe
          src={`${url}#toolbar=0`}
          className="w-full h-full border-none"
          title={title}
        />
        {/* Overlay to prevent interaction if needed, or just let the iframe handle it */}
      </div>
      
      <div className="p-3 bg-accent/30 text-center">
        <p className="text-[10px] text-secondary uppercase tracking-widest">Vista previa del documento científico</p>
      </div>
    </div>
  );
}
