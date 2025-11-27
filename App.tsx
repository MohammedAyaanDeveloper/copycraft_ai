import React, { useState, useEffect, useRef } from 'react';
import GeneratorForm from './components/GeneratorForm';
import ResultDisplay from './components/ResultDisplay';
import HistorySidebar from './components/HistorySidebar';
import { GenerationParams, HistoryItem } from './types';
import { generateCopy } from './services/geminiService';
import { PenTool, Command, History as HistoryIcon } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

const App: React.FC = () => {
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // History State
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedParams, setSelectedParams] = useState<GenerationParams | null>(null);

  // Refs for scrolling
  const resultRef = useRef<HTMLDivElement>(null);

  // Load history from local storage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('cc_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
  }, []);

  const handleGenerate = async (params: GenerationParams) => {
    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);

    try {
      const content = await generateCopy(params);
      setGeneratedContent(content);
      
      // Add to History
      const newItem: HistoryItem = {
        id: Date.now().toString(), // Simple ID generation
        content,
        timestamp: Date.now(),
        params: { ...params }
      };
      
      const updatedHistory = [newItem, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('cc_history', JSON.stringify(updatedHistory));

      // On mobile, scroll to result after generation
      if (window.innerWidth < 1024 && resultRef.current) {
        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setGeneratedContent(item.content);
    setSelectedParams(item.params);
    setIsHistoryOpen(false);
    
    // On mobile, scroll to result when history item is selected
    if (window.innerWidth < 1024 && resultRef.current) {
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleHistoryDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('cc_history', JSON.stringify(updatedHistory));
  };

  return (
    <div className="min-h-screen bg-slate-50 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-slate-50 to-slate-100 flex flex-col font-sans text-gray-900">
      
      <HistorySidebar
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={handleHistorySelect}
        onDelete={handleHistoryDelete}
      />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-sm shadow-indigo-200">
              <PenTool className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-1">
              CopyCraft
              <span className="text-indigo-600">AI</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
              title="View History"
            >
              <HistoryIcon className="w-5 h-5" />
              <span className="hidden sm:inline font-medium text-sm">History</span>
            </button>
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 rounded-full border border-indigo-100">
              <Command className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-xs font-semibold text-indigo-700">Powered by Gemini 2.5</span>
            </div>
            <SignedOut>
              <SignInButton mode="modal" />
            </SignedOut>
            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-10 h-10",
                  },
                }}
              />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <SignedIn>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <GeneratorForm onSubmit={handleGenerate} isLoading={isLoading} />
            </div>

            {/* Result Section */}
            <div className="lg:col-span-1 lg:row-span-2">
              <div ref={resultRef}>
                <ResultDisplay content={generatedContent} isLoading={isLoading} error={error} />
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-6 bg-red-50 border border-red-100 p-4 rounded-xl flex items-center justify-between shadow-sm animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-1.5 rounded-full flex-shrink-0">
                  <svg className="h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-red-700 font-medium">{error}</span>
              </div>
            </div>
          )}
        </SignedIn>

        <SignedOut>
          <div className="flex flex-col items-center justify-center min-h-96 text-center">
            <div className="bg-indigo-50 p-8 rounded-xl border border-indigo-100 max-w-md">
              <PenTool className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to CopyCraft AI</h2>
              <p className="text-gray-600 mb-6">Sign in to start generating amazing content with the power of Gemini AI.</p>
              <SignInButton mode="modal" />
            </div>
          </div>
        </SignedOut>
      </main>
    </div>
  );
};

export default App;
