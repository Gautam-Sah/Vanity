import { useState, useEffect } from 'react';
import { getHistory } from '../services/api';

function HistorySidebar({ onSelectHistory, theme }) {
  const [history, setHistory] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHistory();
      setHistory(data.history || []);
    } catch (err) {
      setError(err.message || 'Failed to load history');
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistory = (item) => {
    onSelectHistory(item);
    setIsOpen(false);
  };

  const getVerdictBadge = (verdict) => {
    const badges = {
      TRUE: 'badge-success',
      FALSE: 'badge-error',
      UNSURE: 'badge-warning',
      MIXED: 'badge-info',
    };
    return badges[verdict] || 'badge-info';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateText = (text, maxLength = 80) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-circle btn-primary fixed top-20 left-4 z-50 shadow-lg"
        aria-label="Toggle History Sidebar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-base-100 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 bg-base-300 flex justify-between items-center">
            <h2 className="text-xl font-bold">History</h2>
            <div className="flex gap-2">
              <button
                onClick={fetchHistory}
                className="btn btn-sm btn-ghost"
                disabled={loading}
                aria-label="Refresh History"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="btn btn-sm btn-ghost"
                aria-label="Close Sidebar"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading && history.length === 0 && (
              <div className="flex justify-center items-center h-32">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            )}

            {error && (
              <div className="alert alert-error shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            )}

            {!loading && !error && history.length === 0 && (
              <div className="text-center text-base-content opacity-60 py-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto mb-4 opacity-30"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p>No history yet</p>
                <p className="text-sm mt-2">Your fact-checks will appear here</p>
              </div>
            )}

            {/* History Items */}
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleSelectHistory(item)}
                  className="card bg-base-200 hover:bg-base-300 cursor-pointer transition-all duration-200 hover:shadow-lg"
                >
                  <div className="card-body p-3">
                    <div className="flex justify-between items-start mb-2">
                      <span
                        className={`badge ${getVerdictBadge(item.verdict)} badge-sm`}
                      >
                        {item.verdict}
                      </span>
                      <span className="text-xs opacity-60">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm line-clamp-3">
                      {truncateText(item.claimText)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HistorySidebar;
