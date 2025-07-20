import React, { useState } from "react";
import Link from "next/link";

const sidebarChapters = [
  { title: "Introduction to Debating", link: "/chapter-intro-to-debating" },
  { title: "Building Arguments", link: "/chapter-building-arguments" },
  { title: "Rebuttal Techniques", link: "/chapter-rebuttal-techniques" },
  { title: "Public Speaking Skills", link: "/chapter-public-speaking-skills" },
  { title: "Debate Formats", link: "/chapter-debate-formats" },
  { title: "Judging Criteria", link: "/chapter-judging-criteria" },
];

export default function ChapterDebateFormats() {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedPairs, setSelectedPairs] = useState([]);
  const [leftSelected, setLeftSelected] = useState(null);
  const [rightSelected, setRightSelected] = useState(null);

  // Quiz data for match the columns
  const quizData = {
    leftColumn: [
      "British Parliamentary",
      "Asian Parliamentary", 
      "Lincoln-Douglas",
      "Public Forum",
      "World Schools",
      "Policy Debate"
    ],
    rightColumn: [
      "4 teams, 15 mins prep",
      "3 members per team",
      "1-on-1 philosophical debate",
      "2 teams, current events focus",
      "3 speakers per team, international",
      "2 teams, detailed policy analysis"
    ],
    correctPairs: [
      { left: 0, right: 0 },
      { left: 1, right: 1 },
      { left: 2, right: 2 },
      { left: 3, right: 3 },
      { left: 4, right: 4 },
      { left: 5, right: 5 }
    ]
  };

  const handleLeftClick = (index) => {
    if (leftSelected === index) {
      setLeftSelected(null);
    } else {
      setLeftSelected(index);
    }
  };

  const handleRightClick = (index) => {
    if (rightSelected === index) {
      setRightSelected(null);
    } else {
      setRightSelected(index);
    }
  };

  const checkMatch = () => {
    if (leftSelected !== null && rightSelected !== null) {
      const isCorrect = quizData.correctPairs.some(
        pair => pair.left === leftSelected && pair.right === rightSelected
      );
      
      if (isCorrect) {
        // Check if this pair was already matched
        const alreadyMatched = selectedPairs.some(
          pair => pair.left === leftSelected || pair.right === rightSelected
        );
        
        if (!alreadyMatched) {
          setSelectedPairs([...selectedPairs, { left: leftSelected, right: rightSelected }]);
          setQuizScore(quizScore + 1);
        }
      }
      
      setLeftSelected(null);
      setRightSelected(null);
    }
  };

  const checkQuizComplete = () => {
    if (selectedPairs.length === quizData.leftColumn.length) {
      setQuizCompleted(true);
      setShowResults(true);
      
      // Mark chapter as completed in localStorage
      if (typeof window !== 'undefined') {
        const progress = JSON.parse(localStorage.getItem('debateProgress') || '{}');
        progress.formats = true;
        localStorage.setItem('debateProgress', JSON.stringify(progress));
      }
    }
  };

  const resetQuiz = () => {
    setQuizCompleted(false);
    setQuizScore(0);
    setShowResults(false);
    setSelectedPairs([]);
    setLeftSelected(null);
    setRightSelected(null);
  };

  // Check if quiz is complete whenever selectedPairs changes
  React.useEffect(() => {
    checkQuizComplete();
  }, [selectedPairs]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 p-6 flex-shrink-0">
        <div className="mb-6 text-2xl font-bold tracking-widest text-black">
          <Link href="/dashboard">Chapters</Link>
        </div>
        <nav>
          <ul className="space-y-2">
            {sidebarChapters.map((chapter, idx) => (
              <li key={chapter.title}>
                <Link href={chapter.link} legacyBehavior>
                  <a className={`block px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${idx === 4 ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"}`}>
                    {chapter.title}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex justify-center py-10 px-2 md:px-8">
        <div className="w-full max-w-3xl bg-white border border-gray-200 shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-2">🏛️ Chapter 5: <span className="font-extrabold">Debate Formats</span></h1>
          <hr className="my-4 border-gray-300" />

          {/* Section 1 */}
          <h2 className="text-2xl font-semibold mt-8 mb-2">🎯 1. Why Different Formats?</h2>
          <p className="mb-4 text-gray-800">Different debate formats exist for different purposes. Some focus on <b>speed and wit</b>, others on <b>depth and analysis</b>.</p>

          <h3 className="font-semibold mt-4 mb-1">💡 Format Categories:</h3>
          <ul className="list-disc ml-8 mb-2 text-gray-800">
            <li><b>Parliamentary</b> – Fast-paced, impromptu</li>
            <li><b>Policy</b> – Research-heavy, detailed</li>
            <li><b>Public Forum</b> – Accessible, current events</li>
            <li><b>Lincoln-Douglas</b> – Philosophical, values-based</li>
          </ul>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
            <span className="font-bold">🧠 Pro Tip:</span><br />
            <span>Start with simpler formats like Public Forum, then graduate to more complex ones like British Parliamentary.</span>
          </div>

          {/* Section 2 */}
          <h2 className="text-2xl font-semibold mt-8 mb-2">🏛️ 2. Popular Debate Formats</h2>
          <ul className="list-disc ml-8 mb-2 text-gray-800">
            <li><b>British Parliamentary (BP)</b> – 4 teams, 15 mins prep, very popular in colleges</li>
            <li><b>Asian Parliamentary</b> – 3 members per team, structured roles</li>
            <li><b>Lincoln-Douglas</b> – 1-on-1, philosophical debates</li>
            <li><b>Public Forum</b> – 2 teams, current events focus</li>
            <li><b>World Schools</b> – 3 speakers per team, international standard</li>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
            <span className="font-bold">🎲 Try This:</span><br />
            <span>Research which debate format is most popular in your region or school.</span>
          </div>

          {/* Section 3 */}
          <h3 className="font-semibold mt-4 mb-1">💡 Choosing Your Format:</h3>
          <ul className="list-disc ml-8 mb-2 text-gray-800">
            <li>Consider your strengths (speed vs. depth)</li>
            <li>Check what's available in your area</li>
            <li>Start simple, then challenge yourself</li>
            <li>Practice with friends in different formats</li>
          </ul>

          {/* Interactive Quiz */}
          <h2 className="text-2xl font-semibold mt-8 mb-4">🧠 Interactive Quiz: Match the Columns</h2>
          
          {!showResults ? (
            <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
              <p className="text-gray-700 mb-4">
                <strong>Instructions:</strong> Click on an item from the left column, then click on its matching item from the right column. 
                Correct matches will be highlighted in green. Match all 6 pairs to complete the quiz!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div>
                  <h3 className="font-bold text-lg mb-3 text-blue-600">Left Column</h3>
                  <div className="space-y-2">
                    {quizData.leftColumn.map((item, index) => {
                      const isSelected = leftSelected === index;
                      const isMatched = selectedPairs.some(pair => pair.left === index);
                      
                      return (
                        <div
                          key={index}
                          onClick={() => handleLeftClick(index)}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            isMatched 
                              ? 'bg-green-100 border-green-400 text-green-800' 
                              : isSelected 
                                ? 'bg-blue-100 border-blue-400 text-blue-800' 
                                : 'bg-white border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {item}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column */}
                <div>
                  <h3 className="font-bold text-lg mb-3 text-purple-600">Right Column</h3>
                  <div className="space-y-2">
                    {quizData.rightColumn.map((item, index) => {
                      const isSelected = rightSelected === index;
                      const isMatched = selectedPairs.some(pair => pair.right === index);
                      
                      return (
                        <div
                          key={index}
                          onClick={() => handleRightClick(index)}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            isMatched 
                              ? 'bg-green-100 border-green-400 text-green-800' 
                              : isSelected 
                                ? 'bg-purple-100 border-purple-400 text-purple-800' 
                                : 'bg-white border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {item}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Match Button */}
              <div className="mt-6 text-center">
                <button
                  onClick={checkMatch}
                  disabled={leftSelected === null || rightSelected === null}
                  className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                    leftSelected !== null && rightSelected !== null
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Check Match
                </button>
              </div>

              {/* Progress */}
              <div className="mt-4 text-center">
                <p className="text-gray-600">
                  Progress: <span className="font-bold text-blue-600">{selectedPairs.length}</span> / {quizData.leftColumn.length} pairs matched
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(selectedPairs.length / quizData.leftColumn.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ) : (
            /* Quiz Results */
            <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-green-800 mb-2">🎉 Quiz Completed!</h3>
                <p className="text-green-700 mb-4">
                  You matched all {quizData.leftColumn.length} pairs correctly!
                </p>
                <div className="bg-white p-4 rounded-lg inline-block">
                  <p className="text-lg font-semibold text-gray-800">
                    Score: <span className="text-green-600">{quizScore}</span> / {quizData.leftColumn.length}
                  </p>
                  <p className="text-sm text-gray-600">
                    {quizScore === quizData.leftColumn.length ? 'Perfect! 🏆' : 'Great job! 👍'}
                  </p>
                </div>
                <div className="mt-4 space-y-2">
                  <button
                    onClick={resetQuiz}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mr-2"
                  >
                    Try Again
                  </button>
                  <Link href="/chapter-judging-criteria" legacyBehavior>
                    <a className="inline-block px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                      Continue to Next Chapter →
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Badge */}
          <h2 className="text-2xl font-semibold mt-8 mb-2">🎓 Unlockable Badge:</h2>
          <div className={`p-4 my-4 rounded-lg border-l-4 ${
            quizCompleted 
              ? 'bg-green-50 border-green-400' 
              : 'bg-pink-50 border-pink-400'
          }`}>
            <span className="font-bold">
              {quizCompleted ? '🏛️' : '📋'} {quizCompleted ? 'Format Master' : 'Format Explorer'}
            </span> 
            <span className="block mt-1">
              {quizCompleted 
                ? 'Congratulations! You mastered debate formats!' 
                : 'Complete this chapter and score 100% on quiz'
              }
            </span>
          </div>
        </div>
      </main>
    </div>
  );
} 