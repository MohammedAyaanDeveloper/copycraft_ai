import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, FileText, Download, Share2, Sparkles } from 'lucide-react';

interface ResultDisplayProps {
  content: string | null;
  isLoading: boolean;
  error: string | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ content, isLoading, error }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (content) {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!content) return;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated-content-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="h-full bg-black/80 rounded-xl sm:rounded-2xl shadow-xl border border-purple-900/20 p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center text-center w-full">
        <div className="relative mb-6">
          <div className="w-16 sm:w-20 h-16 sm:h-20 border-4 border-purple-900/10 border-t-[#5E17EB] rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-6 sm:w-8 h-6 sm:h-8 text-[#CB6CE6] animate-pulse" />
          </div>
        </div>
        <h3 className="text-lg sm:text-2xl font-bold text-gray-100 mb-2">Creating Magic...</h3>
        <p className="text-xs sm:text-sm text-gray-300 max-w-md px-2">
          Our AI is analyzing your inputs, structuring the narrative, and polishing the tone.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-black/80 rounded-xl sm:rounded-2xl shadow-xl border border-purple-900/20 p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center text-center w-full">
        <div className="bg-red-900/30 p-3 sm:p-4 rounded-full mb-6 border border-red-800/20">
          <svg className="h-10 sm:h-12 w-10 sm:w-12 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-red-300 mb-2">Generation Failed</h3>
        <p className="text-xs sm:text-sm text-gray-300 max-w-sm leading-relaxed whitespace-pre-wrap px-2">
          {error}
        </p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="h-full bg-black/80 rounded-xl sm:rounded-2xl shadow-xl border border-purple-900/20 p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center text-center w-full">
        <div className="bg-gradient-to-br from-[#5E17EB] to-[#CB6CE6] p-4 sm:p-6 rounded-full mb-6 border border-purple-900/20">
          <FileText className="w-10 sm:w-12 h-10 sm:h-12 text-white" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-100 mb-2">Ready to Write</h3>
        <p className="text-xs sm:text-sm text-gray-300 max-w-sm leading-relaxed px-2">
          Configure your preferences and watch as professional-grade content appears here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-black/80 rounded-xl sm:rounded-2xl shadow-xl border border-purple-900/20 h-full flex flex-col overflow-hidden transition-all duration-300 animate-fadeIn text-gray-100 w-full">
      {/* Header / Actions */}
      <div className="border-b border-purple-900/20 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between bg-transparent gap-2 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <div className="bg-green-900/20 p-1 sm:p-1.5 rounded-full ring-2 ring-green-900/10 flex-shrink-0">
            <Check className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-green-400" />
          </div>
          <span className="font-semibold text-gray-200 text-xs sm:text-sm truncate">Generated Successfully</span>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <button
            onClick={handleDownload}
            className="p-1.5 sm:p-2 text-gray-300 hover:text-white hover:bg-purple-900/20 rounded-lg transition-all"
            title="Download as Markdown"
          >
            <Download className="w-4 sm:w-4.5 h-4 sm:h-4.5" />
          </button>
          <div className="h-4 w-px bg-purple-900/20 mx-0.5 sm:mx-1"></div>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm flex-shrink-0 whitespace-nowrap ${
              copied 
                ? 'bg-green-900/30 text-green-200 border border-green-800/20' 
                : 'bg-black/60 border border-purple-800 text-gray-100 hover:border-[#5E17EB] hover:text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3 sm:w-4 h-3 sm:h-4" />
                <span className="hidden sm:inline">Copied!</span>
                <span className="sm:hidden">✓</span>
              </>
            ) : (
              <>
                <Copy className="w-3 sm:w-4 h-3 sm:h-4" />
                <span className="hidden sm:inline">Copy Text</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow p-4 sm:p-6 lg:p-10 overflow-y-auto bg-black/30 custom-scrollbar">
        <div className="prose prose-invert prose-sm sm:prose-base lg:prose-lg max-w-none 
          prose-headings:font-bold prose-headings:text-gray-100 
          prose-h1:text-xl sm:text-2xl lg:text-3xl
          prose-h2:text-lg sm:text-xl lg:text-2xl
          prose-h3:text-base sm:text-lg lg:text-xl
          prose-p:text-xs sm:text-sm lg:text-base prose-p:text-gray-200 prose-p:leading-relaxed
          prose-a:text-[#CB6CE6] prose-a:no-underline hover:prose-a:underline
          prose-li:text-xs sm:text-sm lg:text-base prose-li:text-gray-200
          prose-strong:text-gray-100 prose-strong:font-semibold
          prose-blockquote:border-l-[#5E17EB] prose-blockquote:bg-black/20 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
          ">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;