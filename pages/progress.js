import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaMedal, FaTrophy, FaStar } from "react-icons/fa";

const badges = [
  { iconName: "FaMedal", color: "text-yellow-500", name: "Rookie Debater" },
  { iconName: "FaTrophy", color: "text-pink-500", name: "Builder Brain" },
  { iconName: "FaStar", color: "text-green-500", name: "Rebuttal Ninja" },
  { iconName: "FaStar", color: "text-blue-500", name: "Stage Speaker" },
  { iconName: "FaStar", color: "text-purple-500", name: "Format Master" },
  { iconName: "FaStar", color: "text-gray-400", name: "Judge Whisperer" },
];

export default function Progress() {
  const [mounted, setMounted] = useState(false);
  const [completed, setCompleted] = useState(0);
  const total = 6;

  useEffect(() => {
    setMounted(true);
    // Get progress from localStorage
    if (typeof window !== 'undefined') {
      const progress = localStorage.getItem('debateProgress');
      if (progress) {
        const progressData = JSON.parse(progress);
        const completedCount = Object.values(progressData).filter(Boolean).length;
        setCompleted(completedCount);
      }
    }
  }, []);

  const percent = (completed / total) * 100;

  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-row bg-white">
        <div className="hidden md:flex flex-col items-center bg-white border-r border-gray-200 w-20 py-8">
          <Link href="/dashboard" legacyBehavior>
            <a className="flex flex-col items-center text-pink-500 hover:text-pink-400 font-bold text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Dashboard
            </a>
          </Link>
        </div>
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8 border border-gray-200">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-6"></div>
              <div className="h-4 bg-gray-200 rounded mb-8"></div>
              <div className="h-32 bg-gray-200 rounded mb-8"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-row bg-white">
      {/* Sidebar Navigation */}
      <div className="hidden md:flex flex-col items-center bg-white border-r border-gray-200 w-20 py-8">
        <Link href="/dashboard" legacyBehavior>
          <a className="flex flex-col items-center text-pink-500 hover:text-pink-400 font-bold text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Dashboard
          </a>
        </Link>
      </div>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Your Progress & Rewards</h1>
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-gray-700 font-semibold">Chapters Completed</span>
              <span className="text-pink-500 font-bold">{completed} / {total}</span>
            </div>
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-4 bg-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${percent}%` }}
              ></div>
            </div>
          </div>
          {/* Badges */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Badges Earned</h2>
            <div className="flex flex-wrap gap-6 justify-center">
              {badges.slice(0, completed).map((badge, idx) => {
                const getIcon = () => {
                  switch (badge.iconName) {
                    case "FaMedal":
                      return <FaMedal className={`${badge.color} text-3xl`} />;
                    case "FaTrophy":
                      return <FaTrophy className={`${badge.color} text-3xl`} />;
                    case "FaStar":
                      return <FaStar className={`${badge.color} text-3xl`} />;
                    default:
                      return <FaStar className={`${badge.color} text-3xl`} />;
                  }
                };
                
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="bg-gray-100 rounded-full p-4 mb-2 border-2 border-pink-200">
                      {getIcon()}
                    </div>
                    <span className="text-gray-900 text-sm font-semibold text-center">{badge.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Summary */}
          <div className="bg-gray-100 rounded-lg p-6 text-gray-900 text-center border border-gray-200">
            <div className="text-lg font-semibold mb-2">Keep going!</div>
            <div className="text-gray-600">Complete all chapters to unlock every badge and become a Debate Master.</div>
          </div>
        </div>
      </main>
    </div>
  );
} 