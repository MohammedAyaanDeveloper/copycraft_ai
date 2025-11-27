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
      <div className="h-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 flex flex-col items-center justify-center text-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-indigo-600 animate-pulse" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Creating Magic...</h3>
        <p className="text-gray-500 max-w-md">
          Our AI is analyzing your inputs, structuring the narrative, and polishing the tone. This usually takes just a few seconds.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 flex flex-col items-center justify-center text-center">
        <div className="bg-red-100 p-4 rounded-full mb-6 border border-red-200">
          <svg className="h-12 w-12 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-red-800 mb-2">Generation Failed</h3>
        <p className="text-gray-600 max-w-sm leading-relaxed whitespace-pre-wrap">
          {error}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 flex flex-col items-center justify-center text-center">
        <div className="bg-red-100 p-4 rounded-full mb-6 border border-red-200">
          <svg className="h-12 w-12 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-red-800 mb-2">Generation Failed</h3>
        <p className="text-gray-600 max-w-sm leading-relaxed whitespace-pre-wrap">
          {error}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 flex flex-col items-center justify-center text-center">
        <div className="bg-red-100 p-4 rounded-full mb-6 border border-red-200">
          <svg className="h-12 w-12 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-red-800 mb-2">Generation Failed</h3>
        <p className="text-gray-600 max-w-sm leading-relaxed whitespace-pre-wrap">
          {error}
        </p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="h-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 flex flex-col items-center justify-center text-center">
        <div className="bg-gradient-to-br from-indigo-50 to-slate-100 p-6 rounded-full mb-6 border border-indigo-50">
          <FileText className="w-12 h-12 text-indigo-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to Write</h3>
        <p className="text-gray-500 max-w-sm leading-relaxed">
          Configure your preferences on the left and watch as professional-grade content appears here instantly.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 h-full flex flex-col overflow-hidden transition-all duration-300 animate-fadeIn">
      {/* Header / Actions */}
      <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-2">
          <div className="bg-green-100 p-1.5 rounded-full ring-2 ring-green-50">
            <Check className="w-3.5 h-3.5 text-green-600" />
          </div>
          <span className="font-semibold text-gray-700 text-sm">Generated Successfully</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
            title="Download as Markdown"
          >
            <Download className="w-4.5 h-4.5" />
          </button>
          <div className="h-5 w-px bg-gray-200 mx-1"></div>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm ${
              copied 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-white border border-gray-200 text-gray-700 hover:border-indigo-300 hover:text-indigo-600 hover:shadow'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Text
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow p-6 md:p-10 overflow-y-auto bg-white custom-scrollbar">
        <div className="prose prose-slate prose-lg max-w-none 
          prose-headings:font-bold prose-headings:text-gray-800 
          prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
          prose-p:text-gray-600 prose-p:leading-relaxed
          prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline
          prose-li:text-gray-600
          prose-strong:text-gray-900 prose-strong:font-semibold
          prose-blockquote:border-l-indigo-500 prose-blockquote:bg-indigo-50/30 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
          ">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;