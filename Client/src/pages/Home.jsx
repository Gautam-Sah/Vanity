import { useState, useEffect } from 'react';
import { checkFact } from '../services/api';
import HistorySidebar from '../components/HistorySidebar';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { logout, user } = useAuth();
  const [claimText, setClaimText] = useState('');
  const [result, setResult] = useState(null);
  const [displayedText, setDisplayedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [isTyping, setIsTyping] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Typewriter effect
  useEffect(() => {
    if (result && result.summary) {
      setIsTyping(true);
      setDisplayedText('');
      let currentIndex = 0;
      const text = result.summary;

      const interval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(interval);
        }
      }, 20); // Speed of typing (milliseconds per character)

      return () => clearInterval(interval);
    }
  }, [result]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!claimText.trim()) {
      setError('Please enter a claim to fact-check');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setDisplayedText('');

    try {
      const data = await checkFact(claimText);
      setResult(data);
    } catch (err) {
      setError(err.message || 'An error occurred while checking the fact');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setClaimText('');
    setResult(null);
    setError(null);
    setDisplayedText('');
  };

  const getVerdictColor = (summary) => {
    const lowerSummary = summary.toLowerCase();
    if (lowerSummary.includes('true') && !lowerSummary.includes('false')) {
      return 'badge-success';
    } else if (lowerSummary.includes('false')) {
      return 'badge-error';
    } else if (lowerSummary.includes('unsure') || lowerSummary.includes('unclear')) {
      return 'badge-warning';
    }
    return 'badge-info';
  };

  const getVerdict = (summary) => {
    const lowerSummary = summary.toLowerCase();
    if (lowerSummary.includes('false')) {
      return 'FALSE';
    } else if (lowerSummary.includes('true') && !lowerSummary.includes('false')) {
      return 'TRUE';
    } else if (lowerSummary.includes('unsure') || lowerSummary.includes('unclear')) {
      return 'UNSURE';
    }
    return 'MIXED';
  };

  const handleSelectHistory = (historyItem) => {
    setClaimText(historyItem.claimText);
    setResult({ summary: historyItem.summary });
    setError(null);
  };

  return (
    <div data-theme={theme} className="min-h-screen bg-base-200 flex flex-col">
      {/* History Sidebar */}
      <HistorySidebar onSelectHistory={handleSelectHistory} theme={theme} />

      {/* Header - Fixed at top */}
      <div className="sticky top-0 z-10 bg-base-300 shadow-lg">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-primary">
              Vanity
            </h1>
            <p className="text-sm font-semibold italic opacity-90 mt-1">
              See Beyond Illusion
            </p>
          </div>
          {/* Theme Toggle */}
          <div className="absolute right-4">
            <label className="swap swap-rotate">
              <input
                type="checkbox"
                checked={theme === 'dark'}
                onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              />
              {/* Sun icon */}
              <svg
                className="swap-off fill-current w-7 h-7"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
              </svg>
              {/* Moon icon */}
              <svg
                className="swap-on fill-current w-7 h-7"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
              </svg>
            </label>
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable area between fixed header and footer */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Error Alert */}
          {error && (
            <div className="alert alert-error shadow-lg mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body items-center text-center py-12">
                <div className="loading loading-bars loading-lg text-primary"></div>
                <p className="mt-4 text-lg">Analyzing claim with AI...</p>
                <p className="text-sm opacity-70">This may take a few moments</p>
              </div>
            </div>
          )}

          {/* Results Card */}
          {result && result.summary && (
            <div className="card bg-base-100 shadow-xl animate-fade-in mb-8">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="card-title text-2xl">Fact Check Result</h2>
                  <div className={`badge ${getVerdictColor(result.summary)} badge-lg gap-2 font-bold`}>
                    {getVerdict(result.summary)}
                  </div>
                </div>

                <div className="divider"></div>

                <div className="prose max-w-none">
                  <div className="bg-base-200 p-4 rounded-lg mb-4">
                    <h3 className="text-sm font-semibold opacity-70 mb-2">Your Claim:</h3>
                    <p className="text-base">{claimText}</p>
                  </div>

                  <h3 className="text-lg font-semibold mb-3">Analysis:</h3>
                  <div className="whitespace-pre-wrap text-base leading-relaxed">
                    {displayedText}
                    {isTyping && <span className="animate-pulse">|</span>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Centered title when no results */}
          {!result && !loading && (
            <div className="flex items-center justify-center py-16">
              <h2 className="text-3xl font-bold text-base-content">
                Enter a Claim to Verify
              </h2>
            </div>
          )}

          {/* Input Card - Always at the bottom when no results */}
          {!result && (
            <div className="card bg-base-100 shadow-xl sticky bottom-0">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-control">
                    <textarea
                      className="w-full px-6 py-4 text-lg bg-base-200 rounded-none border-l-4 border-primary focus:outline-none focus:border-l-8 focus:bg-base-100 transition-all duration-200 resize-none overflow-hidden"
                      placeholder="Type or paste your claim here..."
                      value={claimText}
                      onChange={(e) => {
                        setClaimText(e.target.value);
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                      }}
                      disabled={loading}
                      rows={1}
                      style={{ minHeight: '3rem' }}
                    />
                  </div>
                  <div className="card-actions justify-end mt-4">
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={handleClear}
                      disabled={loading || (!claimText && !result)}
                    >
                      Clear
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading || !claimText.trim()}
                    >
                      {loading ? (
                        <>
                          <span className="loading loading-spinner"></span>
                          Checking...
                        </>
                      ) : (
                        'Check Fact'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Show "Check Another Claim" button when results are displayed */}
          {result && result.summary && (
            <div className="card bg-base-100 shadow-xl sticky bottom-0 mt-8">
              <div className="card-body py-4 text-center">
                <button
                  onClick={handleClear}
                  className="btn btn-primary btn-lg"
                >
                  Check Another Claim
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer - Fixed at bottom */}
      <footer className="bg-base-300 py-4 mt-auto">
        <div className="container mx-auto px-4">
          {/* Main Footer Row */}
          <div className="flex items-center justify-between">
            {/* User Account - Left */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="btn btn-sm btn-ghost gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Account
              </button>

              {/* User Menu Popup */}
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  ></div>
                  <div className="absolute bottom-full left-0 mb-2 w-48 bg-base-100 rounded-lg shadow-xl z-50">
                    <div className="p-3 border-b border-base-300">
                      <div className="text-sm font-semibold">{user?.name}</div>
                      <div className="text-xs opacity-60">{user?.email}</div>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={logout}
                        className="btn btn-sm btn-ghost w-full justify-start gap-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer Info - Center */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
              <div className="text-center">
                <span className="font-semibold text-primary">Powered By:</span>
                <span className="ml-2 opacity-80">Google Fact Check API</span>
              </div>
              <div className="text-center">
                <span className="font-semibold text-primary">AI Model:</span>
                <span className="ml-2 opacity-80">Groq LLaMA 3.3 70B</span>
              </div>
              <div className="text-center">
                <span className="font-semibold text-primary">Response Time:</span>
                <span className="ml-2 opacity-80">~10s avg</span>
              </div>
            </div>

            {/* Empty space for symmetry - Right */}
            <div className="w-24"></div>
          </div>

          {/* Disclaimer - Bottom Center */}
          <div className="text-center mt-4 text-xs opacity-40">
            Results generated by AI may not be 100% accurate. Always verify with multiple sources.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
