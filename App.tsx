import React, { useState, useEffect, useRef } from 'react';
import GeneratorForm from './components/GeneratorForm';
import ResultDisplay from './components/ResultDisplay';
import HistorySidebar from './components/HistorySidebar';
import PrivacyPolicy from './components/PrivacyPolicy';
import FAQ from './components/FAQ';
import Terms from './components/Terms';
import { GenerationParams, HistoryItem } from './types';
import { generateCopy } from './services/geminiService';
import { PenTool, Command, History as HistoryIcon } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react';

const App: React.FC = () => {
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isSignedIn, user } = useUser();

  // Simple client-side daily credits per user
  const DAILY_CREDITS = 10;
  const [remainingCredits, setRemainingCredits] = useState<number>(DAILY_CREDITS);
  const [page, setPage] = useState<'home'|'privacy'|'faq'|'terms'>('home');
  
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

  // Load credits for signed in user
  useEffect(() => {
    if (!isSignedIn || !user) return;
    const uid = user.id;
    const metaKey = `cc_credits_meta_${uid}`;
    const dataKey = `cc_credits_${uid}`;
    try {
      const metaRaw = localStorage.getItem(metaKey);
      const today = new Date().toISOString().slice(0,10);
      if (!metaRaw) {
        localStorage.setItem(metaKey, JSON.stringify({ lastReset: today }));
        localStorage.setItem(dataKey, JSON.stringify(DAILY_CREDITS));
        setRemainingCredits(DAILY_CREDITS);
      } else {
        const meta = JSON.parse(metaRaw) as { lastReset: string };
        if (meta.lastReset !== today) {
          meta.lastReset = today;
          localStorage.setItem(metaKey, JSON.stringify(meta));
          localStorage.setItem(dataKey, JSON.stringify(DAILY_CREDITS));
          setRemainingCredits(DAILY_CREDITS);
        } else {
          const stored = localStorage.getItem(dataKey);
          setRemainingCredits(stored ? parseInt(stored,10) : DAILY_CREDITS);
        }
      }
    } catch (e) {
      console.error('Failed to load credits', e);
      setRemainingCredits(DAILY_CREDITS);
    }
  }, [isSignedIn, user]);

  const handleGenerate = async (params: GenerationParams) => {
    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);

    try {
      // Check credits
      if (isSignedIn && user) {
        const uid = user.id;
        const dataKey = `cc_credits_${uid}`;
        const stored = localStorage.getItem(dataKey);
        const creditsLeft = stored ? parseInt(stored,10) : DAILY_CREDITS;
        if (creditsLeft <= 0) {
          throw new Error('No credits remaining for today');
        }
      }

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
      
      // decrement credits for user
      if (isSignedIn && user) {
        const uid = user.id;
        const dataKey = `cc_credits_${uid}`;
        const stored = localStorage.getItem(dataKey);
        const creditsLeft = stored ? parseInt(stored,10) : DAILY_CREDITS;
        const newCredits = Math.max(0, creditsLeft - 1);
        localStorage.setItem(dataKey, JSON.stringify(newCredits));
        setRemainingCredits(newCredits);
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
    <div className="min-h-screen bg-gradient-to-br from-[#060312] via-[#160428] to-black flex flex-col font-sans text-gray-100">
      
      <HistorySidebar
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={handleHistorySelect}
        onDelete={handleHistoryDelete}
      />

      {/* Header */}
      <header className="bg-transparent border-b border-purple-900/40 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-purple-600 p-2 rounded-lg shadow-sm shadow-purple-900">
              <PenTool className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight flex items-center gap-1 text-white">
              Xommunity
              <span className="text-purple-400">AI</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden sm:flex gap-3 items-center">
              <button onClick={() => setPage('home')} className="text-sm text-gray-200 hover:text-white">Home</button>
              <button onClick={() => setPage('privacy')} className="text-sm text-gray-200 hover:text-white">Privacy</button>
              <button onClick={() => setPage('faq')} className="text-sm text-gray-200 hover:text-white">FAQ</button>
              <button onClick={() => setPage('terms')} className="text-sm text-gray-200 hover:text-white">Terms</button>
            </nav>
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
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-200">
                  Credits: <span className="font-semibold text-white">{remainingCredits}</span>
                </div>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-10 h-10",
                    },
                  }}
                />
              </div>
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {page === 'home' ? (
          <>
            <SignedIn>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Form Section */}
                <div className="lg:col-span-2">
                  <GeneratorForm onSubmit={handleGenerate} isLoading={isLoading} remainingCredits={remainingCredits} />
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
                <div className="bg-gradient-to-br from-purple-800 via-purple-700 to-black p-8 rounded-xl border border-purple-700 max-w-md shadow-lg">
                  <PenTool className="w-16 h-16 text-white mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">Welcome to Xommunity AI</h2>
                  <p className="text-purple-200 mb-6">Sign in to start generating amazing content with the power of Gemini AI.</p>
                  <div className="mx-auto">
                    <SignInButton mode="modal" />
                  </div>
                </div>
              </div>
            </SignedOut>
          </>
        ) : page === 'privacy' ? (
          <PrivacyPolicy />
        ) : page === 'faq' ? (
          <FAQ />
        ) : (
          <Terms />
        )}
      </main>
    </div>
  );
};

export default App;
