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

export default function ChapterIntroToDebating() {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedPairs, setSelectedPairs] = useState([]);
  const [leftSelected, setLeftSelected] = useState(null);
  const [rightSelected, setRightSelected] = useState(null);

  // Quiz data for match the columns
  const quizData = {
    leftColumn: [
      "1st Speaker",
      "2nd Speaker", 
      "3rd Speaker",
      "Claim",
      "Evidence",
      "British Parliamentary"
    ],
    rightColumn: [
      "Define motion, outline team case",
      "Build arguments, give examples",
      "Rebut opponents, summarize case",
      "The main point you're arguing",
      "Stats, examples, analogies",
      "4 teams, 15 mins prep format"
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
        progress.intro = true;
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
    <div className="min-h-screen flex flex-row bg-gray-50">
      {/* Sidebar Navigation */}
      <div className="hidden md:flex flex-col items-center bg-gray-950 border-r border-gray-200 w-20 py-8">
        <Link href="/dashboard" legacyBehavior>
          <a className="flex flex-col items-center text-pink-400 hover:text-pink-300 font-bold text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Dashboard
          </a>
        </Link>
      </div>
      {/* Chapter Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 p-6 flex-shrink-0">
        <div className="mb-6 text-2xl font-bold tracking-widest text-black">
          <Link href="/dashboard">Chapters</Link>
        </div>
        <nav>
          <ul className="space-y-2">
            {sidebarChapters.map((chapter, idx) => (
              <li key={chapter.title}>
                <Link href={chapter.link} legacyBehavior>
                  <a className={`block px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${idx === 0 ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"}`}>
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
          <h1 className="text-3xl font-bold mb-2">🧠 Chapter: <span className="font-extrabold">Introduction to Debating</span></h1>
          <hr className="my-4 border-gray-300" />

          {/* Section 1 */}
          <h2 className="text-2xl font-semibold mt-8 mb-2">🎬 1. What is Debating?</h2>
          <blockquote className="border-l-4 border-black pl-4 italic text-gray-700 bg-gray-100 py-2 mb-2">
            A debate is a <b>structured argument</b> between two sides, often with one supporting a motion and the other opposing it. It's more than just disagreement — it's the art of <b>reasoned persuasion</b>.
          </blockquote>
          <h3 className="font-semibold mt-4 mb-1">💡 Key Points:</h3>
          <ul className="list-disc ml-8 mb-2 text-gray-800">
            <li>Debating ≠ fighting</li>
            <li>Goal: Convince the audience or judges using <b>logic</b>, <b>structure</b>, and <b>evidence</b></li>
            <li>Every argument needs: a <b>claim</b>, <b>reason</b>, and <b>proof</b></li>
          </ul>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
            <span className="font-bold">📝 Mini Task:</span><br />
            <span>Think of a recent disagreement you had. What was your claim? What was your reason?</span>
          </div>

          {/* Section 2 */}
          <h2 className="text-2xl font-semibold mt-8 mb-2">🧱 2. Basic Structure of a Debate</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2 text-left">Role</th>
                  <th className="border px-4 py-2 text-left">Responsibility</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2 font-bold">1st Speaker</td>
                  <td className="border px-4 py-2">Define the motion, outline team case</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">2nd Speaker</td>
                  <td className="border px-4 py-2">Build arguments, give examples</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">3rd Speaker</td>
                  <td className="border px-4 py-2">Rebut opponents, summarize team case</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">Reply Speaker <span className="italic text-xs">(optional)</span></td>
                  <td className="border px-4 py-2">Final summary and emotional appeal</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
            <span className="font-bold">👀 Example Motion:</span><br />
            <span>"This house believes that school uniforms should be banned."</span><br />
            <span className="block mt-2">Try identifying:</span>
            <ul className="list-disc ml-8">
              <li>Who supports this motion? (Proposition)</li>
              <li>Who opposes it? (Opposition)</li>
            </ul>
          </div>

          {/* Section 3 */}
          <h2 className="text-2xl font-semibold mt-8 mb-2">🥊 3. What Makes a Strong Argument?</h2>
          <ul className="list-disc ml-8 mb-2 text-gray-800">
            <li><b>Clarity</b> – Say it simply.</li>
            <li><b>Logic</b> – Make it flow.</li>
            <li><b>Evidence</b> – Stats, examples, analogies.</li>
            <li><b>Impact</b> – Why should we care?</li>
          </ul>
          <div className="bg-green-50 border-l-4 border-green-400 p-4 my-4">
            <span className="font-bold">🧩 Try This:</span><br />
            <span>Claim: "Homework should be optional." <br />Add a reason and an example to support it.</span>
          </div>

          {/* Section 4 */}
          <h2 className="text-2xl font-semibold mt-8 mb-2">🔍 4. Common Debate Formats</h2>
          <ul className="list-disc ml-8 mb-2 text-gray-800">
            <li><b>British Parliamentary (BP)</b> – 4 teams, 15 mins prep, very popular in colleges</li>
            <li><b>Asian Parliamentary</b> – 3 members per team, structured roles</li>
            <li><b>Lincoln-Douglas / Public Forum</b> – Used in schools, simpler formats</li>
          </ul>
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 my-4">
            <span className="font-bold">🎲 Fun Fact:</span> Debates are also used in <b>law</b>, <b>business pitches</b>, and even <b>AI ethics</b>!
          </div>

          {/* Section 5 */}
          <h2 className="text-2xl font-semibold mt-8 mb-2">🎯 5. Why Learn Debating?</h2>
          <ul className="list-disc ml-8 mb-2 text-gray-800">
            <li>Boosts <b>critical thinking</b></li>
            <li>Improves <b>public speaking</b></li>
            <li>Enhances <b>teamwork</b> and <b>research skills</b></li>
            <li>Teaches <b>graceful disagreement</b></li>
          </ul>

          {/* Recap */}
          <h2 className="text-2xl font-semibold mt-8 mb-2">✅ Chapter Recap</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2 text-left">You Learned</th>
                  <th className="border px-4 py-2 text-left">Examples</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">What debating is</td>
                  <td className="border px-4 py-2">Arguing with structure and persuasion</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Roles in a debate</td>
                  <td className="border px-4 py-2">First speaker → third speaker</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Argument formula</td>
                  <td className="border px-4 py-2">Claim + Reason + Evidence</td>
                </tr>
              </tbody>
            </table>
          </div>

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
                  <Link href="/chapter-building-arguments" legacyBehavior>
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
              {quizCompleted ? '🏆' : '🗣️'} {quizCompleted ? 'Master Debater' : 'Rookie Debater'}
            </span> 
            <span className="block mt-1">
              {quizCompleted 
                ? 'Congratulations! You completed the quiz with perfect score!' 
                : 'Complete this chapter and score 100% on quiz'
              }
            </span>
          </div>
        </div>
      </main>
    </div>
  );
} 