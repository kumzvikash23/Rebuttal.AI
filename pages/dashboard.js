import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const chapters = [
  { title: "Introduction to Debating", link: "/chapter-intro-to-debating", image: "/Ch-1.png", id: "intro" },
  { title: "Building Arguments", link: "/chapter-building-arguments", image: "/Ch-2.png", id: "building" },
  { title: "Rebuttal Techniques", link: "/chapter-rebuttal-techniques", image: "/Ch-3.png", id: "rebuttal" },
  { title: "Public Speaking Skills", link: "/chapter-public-speaking-skills", image: "/Ch-4.png", id: "speaking" },
  { title: "Debate Formats", link: "/chapter-debate-formats", image: "/Ch-5.png", id: "formats" },
  { title: "Judging Criteria", link: "/chapter-judging-criteria", image: "/Ch-6.png", id: "judging" },
];

const sidebarLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Progress", href: "/progress" },
  { label: "Profile", href: "/profile" },
  { label: "AI Debating", href: "/ai-evaluation" },
  { label: "Public Speaking", href: "/public-speaking" },
  { label: "Log Out", href: "/auth", isLogout: true },
];

// Progress tracking functions
const getProgress = () => {
  if (typeof window === 'undefined') return {};
  const progress = localStorage.getItem('debateProgress');
  return progress ? JSON.parse(progress) : {};
};

const setProgress = (chapterId, completed) => {
  if (typeof window === 'undefined') return;
  const progress = getProgress();
  progress[chapterId] = completed;
  localStorage.setItem('debateProgress', JSON.stringify(progress));
};

const isChapterUnlocked = (chapterIndex) => {
  if (chapterIndex === 0) return true; // First chapter is always unlocked
  const progress = getProgress();
  const previousChapter = chapters[chapterIndex - 1];
  return progress[previousChapter.id] === true;
};

const isChapterCompleted = (chapterId) => {
  const progress = getProgress();
  return progress[chapterId] === true;
};

const Sidebar = () => {
  const router = useRouter();
  return (
    <aside className="h-full min-h-screen w-64 flex flex-col bg-white text-gray-900 border-r border-gray-200">
      <div className="flex items-center h-20 px-8 text-2xl font-extrabold tracking-widest border-b border-gray-200 select-none">
        REBUTTAL.AI
      </div>
      <nav className="flex-1 py-8 px-4">
        <ul className="space-y-2">
          {sidebarLinks.map((link) => (
            <li key={link.label}>
              {link.isLogout ? (
                <button
                  className={`block w-full text-left px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-gray-900 hover:bg-gray-100 hover:text-pink-600`}
                  onClick={() => router.push("/auth")}
                >
                  {link.label}
                </button>
              ) : (
                <Link href={link.href} legacyBehavior>
                  <a
                    className={`block px-4 py-2 rounded-lg font-medium transition-colors duration-200
                      ${router.pathname === link.href
                        ? "bg-pink-100 text-pink-700 shadow-md"
                        : "text-gray-900 hover:bg-gray-100 hover:text-pink-600"}
                    `}
                  >
                    {link.label}
                  </a>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

const Dashboard = () => {
  const [progress, setProgressState] = useState({});
  const [mounted, setMounted] = useState(false);
  const [showCompletionNotification, setShowCompletionNotification] = useState(false);

  useEffect(() => {
    setMounted(true);
    const currentProgress = getProgress();
    setProgressState(currentProgress);
    
    // Check if user just completed a chapter
    const completedChapters = Object.values(currentProgress).filter(Boolean).length;
    if (completedChapters > 0) {
      setShowCompletionNotification(true);
      setTimeout(() => setShowCompletionNotification(false), 5000); // Hide after 5 seconds
    }
  }, []);

  const handleChapterClick = (chapter, index) => {
    if (!isChapterUnlocked(index)) {
      alert(`Complete the previous chapter first to unlock "${chapter.title}"`);
      return;
    }
    // Navigate to chapter
    window.location.href = chapter.link;
  };

  const getChapterStatus = (chapter, index) => {
    if (!mounted) return { unlocked: false, completed: false };
    
    const unlocked = isChapterUnlocked(index);
    const completed = isChapterCompleted(chapter.id);
    
    return { unlocked, completed };
  };

  return (
    <div className="min-h-screen flex bg-white" style={{height: '100vh', overflow: 'hidden'}}>
      <Sidebar />
      <main className="flex-1 p-10 flex flex-col h-full min-h-screen" style={{height: '100vh', overflow: 'auto'}}>
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Chapters</h1>
        <hr className="border-gray-300 mb-8" />
        
        {/* Completion Notification */}
        {showCompletionNotification && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-pulse">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Great progress! Keep going to unlock more chapters.
                </p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setShowCompletionNotification(false)}
                  className="text-green-400 hover:text-green-600"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Progress Overview */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-blue-900">Your Progress</h2>
            <span className="text-sm text-blue-700">
              {Object.values(progress).filter(Boolean).length} / {chapters.length} completed
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${(Object.values(progress).filter(Boolean).length / chapters.length) * 100}%` 
              }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 flex-1">
          {chapters.map((chapter, idx) => {
            const { unlocked, completed } = getChapterStatus(chapter, idx);
            
            return (
              <div
                key={idx}
                onClick={() => handleChapterClick(chapter, idx)}
                className={`rounded-xl flex flex-col overflow-hidden transition-all duration-300 group cursor-pointer relative ${
                  unlocked 
                    ? 'bg-white border-2 border-black hover:shadow-lg hover:scale-105' 
                    : 'bg-gray-100 border-2 border-gray-300 cursor-not-allowed'
                }`}
              >
                {/* Lock overlay for locked chapters */}
                {!unlocked && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10 rounded-xl">
                    <div className="text-center text-white">
                      <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm font-medium">Complete previous chapter</p>
                    </div>
                  </div>
                )}

                {/* Completion badge */}
                {completed && (
                  <div className="absolute top-3 right-3 z-20">
                    <div className="bg-green-500 text-white rounded-full p-2 shadow-lg">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Top Section - Logo/Image */}
                <div className="bg-black h-48 flex items-center justify-center relative">
                  <img
                    src={chapter.image}
                    alt={chapter.title}
                    className={`w-full h-full object-cover ${
                      unlocked ? 'opacity-90' : 'opacity-50'
                    }`}
                  />
                  {unlocked && (
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="text-4xl font-bold mb-2">📚</div>
                        <div className="text-sm font-medium">Chapter {idx + 1}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Middle Section - Chapter Details */}
                <div className="bg-black text-white p-4 border-t border-white">
                  <div className="text-lg font-bold mb-1">{chapter.title}</div>
                  <div className="text-sm text-gray-300">
                    {completed ? (
                      <span className="text-green-400">✓ Completed</span>
                    ) : !unlocked ? (
                      <span className="text-gray-400">🔒 Locked</span>
                    ) : (
                      <span className="text-blue-400">📖 Available</span>
                    )}
                  </div>
                </div>

                {/* Bottom Section - Footer */}
                <div className="bg-black text-white p-3 border-t border-white flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mr-2">
                      <span className="text-black text-xs font-bold">D</span>
                    </div>
                    <span className="text-sm font-medium underline">Debate</span>
                  </div>
                  <div className="text-white text-lg">•••</div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 