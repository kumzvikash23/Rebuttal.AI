import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "../utils/supabaseClient";

export default function AIEvaluation() {
  const [userSpeech, setUserSpeech] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [speakerScale, setSpeakerScale] = useState(null);
  const [speechHistory, setSpeechHistory] = useState([]);
  const [showUserSpeech, setShowUserSpeech] = useState(true);
  const [showSpeechHistory, setShowSpeechHistory] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [detectedFallacies, setDetectedFallacies] = useState([]);
  const [showSpeakerScale, setShowSpeakerScale] = useState(false);
  const [showFallacyDetection, setShowFallacyDetection] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(null);

  // Default voice and language (no user selection needed)
  const defaultVoice = 'hitesh';
  const defaultLanguage = 'en-IN';

  // Load speech history on component mount
  useEffect(() => {
    loadSpeechHistory();
  }, []);

  // Auto-hide success notification
  useEffect(() => {
    if (showSuccessNotification) {
      const timer = setTimeout(() => {
        setShowSuccessNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessNotification]);

  // Cleanup audio when component unmounts or voice/language changes
  useEffect(() => {
    return () => {
      if (isSpeaking) {
        stopSpeaking();
      }
    };
  }, [defaultVoice, defaultLanguage]);

  // Sarvam AI TTS functions
  const speakText = async (text, options = {}) => {
    // Prevent multiple speech instances
    if (isSpeaking) {
      console.log('Speech already in progress, stopping current speech first');
      stopSpeaking();
      // Wait a bit for cleanup
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    try {
      setIsSpeaking(true);
      
      const selectedSpeaker = options.speaker || defaultVoice;
      console.log('=== TTS DEBUG ===');
      console.log('Selected voice from dropdown:', defaultVoice);
      console.log('Options speaker:', options.speaker);
      console.log('Final speaker being used:', selectedSpeaker);
      console.log('Language being used:', options.language || defaultLanguage);
      console.log('Text length:', text.length);
      console.log('==================');
      
      const response = await fetch('/api/sarvam-tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          target_language_code: options.language || defaultLanguage,
          speaker: selectedSpeaker,
          pitch: options.pitch || 0,
          pace: options.pace || 1,
          loudness: options.loudness || 1
        }),
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        console.error('Sarvam TTS API Error:', data);
        // Only fallback if it's a server error, not API key issues
        if (response.status >= 500) {
          console.log('Server error, falling back to browser TTS...');
          await speakWithBrowserTTS(text);
        } else {
          setIsSpeaking(false);
          throw new Error(`Sarvam TTS failed: ${data.details || data.error || 'Check your API key'}`);
        }
        return;
      }

      if (!data.audio) {
        setIsSpeaking(false);
        throw new Error('No audio data received from Sarvam AI');
      }

      console.log('Sarvam AI audio received, size:', data.size, 'bytes');
      
      // Convert base64 to blob
      const binaryString = atob(data.audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const audioBlob = new Blob([bytes], { type: 'audio/wav' });
      
      console.log('Audio blob created, size:', audioBlob.size, 'bytes');
      
      if (audioBlob.size === 0) {
        setIsSpeaking(false);
        throw new Error('Created empty audio blob');
      }

      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio();
      
      // Store current audio for stopping
      setCurrentAudio(audio);
      
      // Wait for audio to load before playing
      await new Promise((resolve, reject) => {
        audio.oncanplaythrough = resolve;
        audio.onerror = () => reject(new Error('Audio failed to load'));
        audio.src = audioUrl;
        
        // Timeout after 10 seconds
        setTimeout(() => reject(new Error('Audio loading timeout')), 10000);
      });
      
      audio.onended = () => {
        console.log('Audio ended naturally');
        setIsSpeaking(false);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        setIsSpeaking(false);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
        // Only fallback on playback error
        speakWithBrowserTTS(text);
      };
      
      console.log('Playing Sarvam AI audio with voice:', selectedSpeaker);
      await audio.play();
      
    } catch (error) {
      console.error('TTS error:', error);
      setIsSpeaking(false);
      setCurrentAudio(null);
      // Only fallback on critical errors
      if (error.message.includes('API key') || error.message.includes('Sarvam TTS failed')) {
        alert(`Text-to-speech failed: ${error.message}`);
      } else {
        await speakWithBrowserTTS(text);
      }
    }
  };

  // Browser-based TTS fallback
  const speakWithBrowserTTS = async (text) => {
    try {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = defaultLanguage;
        utterance.rate = 0.9;
        utterance.pitch = 1;
        
        utterance.onend = () => {
          console.log('Browser TTS ended');
          setIsSpeaking(false);
        };
        
        utterance.onerror = (event) => {
          console.error('Browser TTS error:', event);
          setIsSpeaking(false);
          // Only show error for actual TTS failures, not user cancellation
          if (event.error !== 'canceled') {
            alert('Text-to-speech is not available. Please check your browser settings.');
          }
        };
        
        console.log('Using browser TTS as fallback');
        speechSynthesis.speak(utterance);
      } else {
        setIsSpeaking(false);
        alert('Text-to-speech is not supported in your browser.');
      }
    } catch (error) {
      console.error('Browser TTS error:', error);
      setIsSpeaking(false);
      // Don't show alert for user cancellation
      if (!error.message.includes('canceled')) {
        alert('Text-to-speech failed. Please try again.');
      }
    }
  };

  const stopSpeaking = () => {
    console.log('Stopping speech...');
    setIsSpeaking(false);
    
    // Stop current audio if exists
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = '';
      setCurrentAudio(null);
    }
    
    // Stop any playing audio elements
    const audios = document.querySelectorAll('audio');
    audios.forEach(audio => {
      audio.pause();
      audio.src = '';
    });
    
    // Stop browser TTS
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    
    console.log('Speech stopped');
  };

  // Speech-to-text functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      setMediaRecorder(recorder);
      setAudioChunks(chunks);
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Recording error:', error);
      alert('Could not access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob) => {
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Audio = reader.result.split(',')[1];
        
        const response = await fetch('/api/sarvam-stt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            audio: base64Audio
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setUserSpeech(prev => prev + (prev ? ' ' : '') + data.text);
        } else {
          console.error('STT failed');
        }
      };
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('Audio processing error:', error);
    }
  };

  const speakAIFeedback = () => {
    if (aiReply) {
      console.log('=== AI FEEDBACK TTS ===');
      console.log('Current selected voice:', defaultVoice);
      speakText(aiReply, {
        speaker: defaultVoice,
        language: defaultLanguage
      });
    }
  };

  const speakSpeakerScale = () => {
    if (speakerScale) {
      const feedback = `Your speech received an overall score of ${speakerScale.overall} out of 5. 
        Clarity: ${speakerScale.clarity} stars. 
        Logic: ${speakerScale.logic} stars. 
        Style: ${speakerScale.style} stars. 
        Impact: ${speakerScale.impact} stars. 
        ${getFeedbackMessage(speakerScale.overall)}`;
      console.log('=== SPEAKER SCALE TTS ===');
      console.log('Current selected voice:', defaultVoice);
      speakText(feedback, {
        speaker: defaultVoice,
        language: defaultLanguage
      });
    }
  };

  const speakFallacies = () => {
    if (detectedFallacies.length > 0) {
      const fallacyText = detectedFallacies.map(fallacy => 
        `Detected ${fallacy.name}: ${fallacy.description}`
      ).join('. ');
      console.log('=== FALLACIES TTS ===');
      console.log('Current selected voice:', defaultVoice);
      speakText(fallacyText + '. Try to avoid these fallacies in your next speech for stronger arguments.', {
        speaker: defaultVoice,
        language: defaultLanguage
      });
    }
  };

  const speakSpeechHistory = (speech) => {
    const speechText = `Speech from ${new Date(speech.created_at).toLocaleDateString()}. 
      ${speech.user_speech.substring(0, 100)}... 
      ${speech.speaker_scale ? `Overall score: ${speech.speaker_scale.overall} out of 5.` : ''}
      ${speech.detected_fallacies && speech.detected_fallacies.length > 0 ? 
        `Detected ${speech.detected_fallacies.length} logical fallacies.` : 
        'No logical fallacies detected.'}`;
    console.log('=== SPEECH HISTORY TTS ===');
    console.log('Current selected voice:', defaultVoice);
    speakText(speechText, {
      speaker: defaultVoice,
      language: defaultLanguage
    });
  };

  const loadSpeechHistory = async () => {
    try {
      // Check if Supabase is available
      if (!supabase) {
        console.log("Supabase not configured, skipping speech history load");
        return;
      }

      const { data, error } = await supabase
        .from("ai_evaluations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (error) throw error;
      setSpeechHistory(data || []);
    } catch (error) {
      console.error("Error loading speech history:", error);
      // Set empty array if there's an error
      setSpeechHistory([]);
    }
  };

  const detectFallacies = (speech) => {
    const fallacies = [];
    const speechLower = speech.toLowerCase();
    
    // Common fallacy patterns
    const fallacyPatterns = [
      {
        name: "Ad Hominem",
        description: "Attacking the person instead of the argument",
        patterns: [
          "you're stupid", "you're dumb", "you're ignorant", "you don't understand",
          "because you're", "since you're", "you people", "people like you"
        ]
      },
      {
        name: "Appeal to Authority",
        description: "Using authority as evidence without proper reasoning",
        patterns: [
          "experts say", "scientists agree", "studies show", "research proves",
          "everyone knows", "it's common sense", "obviously", "clearly"
        ]
      },
      {
        name: "Straw Man",
        description: "Misrepresenting an opponent's argument",
        patterns: [
          "so you're saying", "what you mean is", "you think that",
          "you believe", "you want to", "you're arguing for"
        ]
      },
      {
        name: "False Dilemma",
        description: "Presenting only two options when more exist",
        patterns: [
          "either or", "you're either", "it's either", "choose between",
          "only two options", "only choice", "no other way"
        ]
      },
      {
        name: "Hasty Generalization",
        description: "Making broad conclusions from limited evidence",
        patterns: [
          "all people", "everyone", "nobody", "always", "never",
          "every time", "all the time", "constantly"
        ]
      },
      {
        name: "Slippery Slope",
        description: "Assuming one action will lead to extreme consequences",
        patterns: [
          "if we do this", "next thing you know", "before long",
          "it will lead to", "this will cause", "inevitably"
        ]
      }
    ];

    // Check for each fallacy
    fallacyPatterns.forEach(fallacy => {
      fallacy.patterns.forEach(pattern => {
        if (speechLower.includes(pattern)) {
          fallacies.push({
            name: fallacy.name,
            description: fallacy.description,
            example: `Found pattern: "${pattern}"`
          });
        }
      });
    });

    // Remove duplicates
    const uniqueFallacies = fallacies.filter((fallacy, index, self) => 
      index === self.findIndex(f => f.name === fallacy.name)
    );

    return uniqueFallacies;
  };

  const generateSpeakerScale = () => {
    // Generate random scores for demo purposes
    // In a real app, this would come from AI analysis
    const scores = {
      clarity: Math.floor(Math.random() * 3) + 3, // 3-5
      logic: Math.floor(Math.random() * 3) + 3,   // 3-5
      style: Math.floor(Math.random() * 3) + 3,   // 3-5
      impact: Math.floor(Math.random() * 3) + 3,  // 3-5
      overall: Math.floor(Math.random() * 3) + 3  // 3-5
    };
    return scores;
  };

  const handleEvaluate = async () => {
    setLoading(true);
    setAiReply("");
    setSpeakerScale(null);
    setDetectedFallacies([]);
    setShowSpeakerScale(false);
    setShowFallacyDetection(false);
    
    try {
      const res = await fetch("/api/sarvam-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userSpeech }),
      });
      const data = await res.json();
      const reply = data.reply || "No reply from AI.";
      setAiReply(reply);
      
      // Generate speaker scale feedback
      const scale = generateSpeakerScale();
      setSpeakerScale(scale);
      
      // Detect fallacies
      const fallacies = detectFallacies(userSpeech);
      setDetectedFallacies(fallacies);
      
      // Save to Supabase with speaker scale and fallacies (if available)
      if (supabase) {
        try {
          await supabase.from("ai_evaluations").insert([
            { 
              user_speech: userSpeech, 
              ai_reply: reply,
              speaker_scale: scale,
              detected_fallacies: fallacies,
              created_at: new Date().toISOString()
            },
          ]);
          
          // Reload speech history
          await loadSpeechHistory();
        } catch (error) {
          console.error("Error saving to Supabase:", error);
          // Continue without saving - app still works
        }
      }
      
      setShowSuccessNotification(true);
      
    } catch (err) {
      setAiReply("Error getting AI reply.");
      console.error("Evaluation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (score) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= score ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const getFeedbackMessage = (overallScore) => {
    if (overallScore >= 4.5) return "🏆 Outstanding! You're a debate master!";
    if (overallScore >= 4) return "🌟 Excellent! Great argument structure!";
    if (overallScore >= 3.5) return "👍 Good! Solid debating skills!";
    if (overallScore >= 3) return "📚 Fair! Keep practicing!";
    return "💪 Keep working on it! Practice makes perfect!";
  };

  return (
    <div className="min-h-screen flex flex-row bg-white">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col items-center bg-white border-r border-gray-200 w-20 py-8">
        <Link href="/dashboard" legacyBehavior>
          <a className="flex flex-col items-center text-pink-500 hover:text-pink-400 font-bold text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Dashboard
          </a>
        </Link>
      </div>
      
      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          ✅ Speech evaluated successfully!
        </div>
      )}

      {/* Global Speech Control */}
      {isSpeaking && (
        <div className="fixed top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
          <button
            onClick={stopSpeaking}
            className="flex items-center space-x-2 font-semibold"
          >
            <span>🔇</span>
            <span>Stop Speech</span>
          </button>
        </div>
      )}

      {/* Floating Stop Button */}
      {isSpeaking && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={stopSpeaking}
            className="bg-red-500 hover:bg-red-600 text-white rounded-full p-4 shadow-lg transition-colors animate-pulse"
            title="Stop Speech"
          >
            <span className="text-2xl">🔇</span>
          </button>
        </div>
      )}
      
      {/* User Side */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-0 border-b md:border-b-0 md:border-r border-gray-200">
        <div className="flex flex-col items-center w-full max-w-xl">
          {/* Avatar */}
          <div className="flex items-center w-full mb-6 mt-2">
            <Image
              src="/Avatar.jpg"
              alt="User Avatar"
              width={56}
              height={56}
              className="rounded-lg border-2 border-pink-400 mr-4"
              priority
            />
            <div className="flex flex-col justify-center ml-2">
              <div className="text-gray-900 font-semibold text-lg underline">You</div>
              <div className="text-gray-500 text-sm">Debater</div>
            </div>
          </div>
          
          {/* Collapsible User Speech Box */}
          <div className="w-full flex-1 flex flex-col mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-lg font-semibold text-gray-900">Your Speech</div>
              <button
                onClick={() => setShowUserSpeech(!showUserSpeech)}
                className="text-pink-600 hover:text-pink-700 transition-colors"
              >
                {showUserSpeech ? "−" : "+"}
              </button>
            </div>
            
            {showUserSpeech && (
              <>
                <div className="relative">
                  <textarea
                    className="w-full flex-1 min-h-[220px] rounded-lg bg-gray-100 text-gray-900 p-4 border border-pink-400 focus:ring-2 focus:ring-pink-400 resize-none mb-4 pr-12"
                    placeholder="Paste or type your speech here... (or use microphone to speak)"
                    value={userSpeech}
                    onChange={(e) => setUserSpeech(e.target.value)}
                  />
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                      isRecording 
                        ? 'bg-red-500 text-white animate-pulse' 
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                    title={isRecording ? "Stop Recording" : "Start Voice Input"}
                  >
                    {isRecording ? "🔴" : "🎤"}
                  </button>
                </div>
                <div className="flex space-x-2 mb-4">
                  <button
                    className="flex-1 py-3 rounded-md bg-pink-600 text-white font-semibold text-lg hover:bg-pink-700 transition disabled:opacity-60"
                    onClick={handleEvaluate}
                    disabled={loading || !userSpeech.trim()}
                  >
                    {loading ? "Evaluating..." : "Evaluate with AI"}
                  </button>
                  <button
                    className="px-4 py-3 rounded-md bg-gray-500 text-white font-semibold text-sm hover:bg-gray-600 transition"
                    onClick={() => setUserSpeech("Everyone knows that homework is bad for students. Studies show that it causes stress and experts say it doesn't help learning. You're either for homework or against education. If we ban homework, next thing you know students will be failing all their classes. So you're saying that teachers don't know how to teach properly? Obviously, homework should be banned because it's common sense that it doesn't work.")}
                  >
                    Demo Speech
                  </button>
                </div>
              </>
            )}
          </div>
          
          {/* Speech History Box */}
          <div className="w-full bg-gray-50 rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">📊 Speech History</h2>
              <button
                onClick={() => setShowSpeechHistory(!showSpeechHistory)}
                className="text-pink-600 hover:text-pink-700 transition-colors"
              >
                {showSpeechHistory ? "−" : "+"}
              </button>
            </div>
            
            {showSpeechHistory && (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {!supabase ? (
                  <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">📝 Speech history requires Supabase setup</p>
                    <p className="text-xs mt-1">Add environment variables to enable data persistence</p>
                  </div>
                ) : speechHistory.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">No speeches yet</p>
                    <p className="text-xs mt-1">Your evaluated speeches will appear here</p>
                  </div>
                ) : (
                  speechHistory.map((speech, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          Speech #{speechHistory.length - index}
                        </span>
                        {speech.speaker_scale && (
                          <div className="flex items-center space-x-1">
                            {renderStars(speech.speaker_scale.overall)}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {speech.user_speech.substring(0, 100)}...
                      </p>
                      {speech.speaker_scale && (
                        <div className="text-xs text-gray-500">
                          <span className="font-medium">Overall: {speech.speaker_scale.overall}/5</span>
                          <span className="ml-2 text-pink-600">
                            {getFeedbackMessage(speech.speaker_scale.overall).split('!')[0]}!
                          </span>
                        </div>
                      )}
                      {speech.detected_fallacies && speech.detected_fallacies.length > 0 && (
                        <div className="text-xs text-yellow-600 mt-1">
                          ⚠️ {speech.detected_fallacies.length} fallacy(s) detected
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xs text-gray-400">
                          {new Date(speech.created_at).toLocaleDateString()}
                        </div>
                        <button
                          onClick={isSpeaking ? stopSpeaking : () => speakSpeechHistory(speech)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                        >
                          {isSpeaking ? "🔇 Stop" : "🔊 Listen"}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
            
            {/* Quick Stats */}
            {showSpeechHistory && speechHistory.length > 0 && (
              <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">📈 Quick Stats</h3>
                <div className="space-y-1 text-xs text-gray-600">
                  <div>Total Speeches: {speechHistory.length}</div>
                  {speechHistory.some(s => s.speaker_scale) && (
                    <>
                      <div>
                        Avg Score: {
                          (speechHistory
                            .filter(s => s.speaker_scale)
                            .reduce((sum, s) => sum + s.speaker_scale.overall, 0) / 
                            speechHistory.filter(s => s.speaker_scale).length
                          ).toFixed(1)
                        }/5
                      </div>
                      <div>Best Score: {
                        Math.max(...speechHistory
                          .filter(s => s.speaker_scale)
                          .map(s => s.speaker_scale.overall)
                        )
                      }/5</div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* AI Side */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-0">
        <div className="flex flex-col items-center w-full max-w-xl">
          {/* Avatar */}
          <div className="flex items-center w-full mb-6 mt-2">
            <Image
              src="/AI_Baba.jpg"
              alt="AI Avatar"
              width={56}
              height={56}
              className="rounded-lg border-2 border-pink-400 mr-4"
              priority
            />
            <div className="flex flex-col justify-center ml-2">
              <div className="text-gray-900 font-semibold text-lg underline">Debate AI</div>
              <div className="text-gray-500 text-sm">AI Evaluator</div>
            </div>
          </div>
          
          <div className="w-full flex-1 flex flex-col">
            {/* AI Reply */}
            {aiReply && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">🤖 AI Feedback</h3>
                  <button
                    onClick={isSpeaking ? stopSpeaking : speakAIFeedback}
                    className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition text-sm"
                  >
                    <span>{isSpeaking ? "🔇 Stop" : "🔊 Listen"}</span>
                  </button>
                </div>
                <div className="text-gray-700 leading-relaxed">
                  {aiReply}
                </div>
              </div>
            )}
            
            {/* Speaker Scale Feedback */}
            {speakerScale && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-blue-900">🎯 Speaker Scale Feedback</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={isSpeaking ? stopSpeaking : speakSpeakerScale}
                      className="flex items-center space-x-1 px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition text-xs"
                    >
                      <span>{isSpeaking ? "🔇" : "🔊"}</span>
                    </button>
                    <button 
                      onClick={() => setShowSpeakerScale(!showSpeakerScale)}
                      className="text-blue-600 hover:text-blue-800 font-bold text-xl"
                    >
                      {showSpeakerScale ? "−" : "+"}
                    </button>
                  </div>
                </div>
                {showSpeakerScale && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-800 font-medium">Clarity:</span>
                      {renderStars(speakerScale.clarity)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-800 font-medium">Logic:</span>
                      {renderStars(speakerScale.logic)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-800 font-medium">Style:</span>
                      {renderStars(speakerScale.style)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-800 font-medium">Impact:</span>
                      {renderStars(speakerScale.impact)}
                    </div>
                    <hr className="border-blue-200" />
                    <div className="flex items-center justify-between">
                      <span className="text-blue-900 font-bold">Overall:</span>
                      {renderStars(speakerScale.overall)}
                    </div>
                    <div className="text-center mt-2">
                      <p className="text-blue-800 font-medium">
                        {getFeedbackMessage(speakerScale.overall)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Fallacy Detection Callouts */}
            {detectedFallacies.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-yellow-900">🧠 Fallacy Detection</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={isSpeaking ? stopSpeaking : speakFallacies}
                      className="flex items-center space-x-1 px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition text-xs"
                    >
                      <span>{isSpeaking ? "🔇" : "🔊"}</span>
                    </button>
                    <button 
                      onClick={() => setShowFallacyDetection(!showFallacyDetection)}
                      className="text-yellow-600 hover:text-yellow-800 font-bold text-xl"
                    >
                      {showFallacyDetection ? "−" : "+"}
                    </button>
                  </div>
                </div>
                {showFallacyDetection && (
                  <>
                    <div className="space-y-2">
                      {detectedFallacies.map((fallacy, index) => (
                        <div key={index} className="flex items-start bg-yellow-100 border border-yellow-200 rounded-lg p-2">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-yellow-800">{fallacy.name}</p>
                            <p className="text-xs text-yellow-700">{fallacy.description}</p>
                            <p className="text-xs text-yellow-600 mt-1">{fallacy.example}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 p-2 bg-yellow-100 rounded-lg">
                      <p className="text-xs text-yellow-800">
                        💡 <strong>Tip:</strong> Try to avoid these fallacies in your next speech for stronger arguments!
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* No Fallacies Detected */}
            {detectedFallacies.length === 0 && speakerScale && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        ✅ Great job! No logical fallacies detected in your speech.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowFallacyDetection(!showFallacyDetection)}
                    className="text-green-600 hover:text-green-800 font-bold text-xl"
                  >
                    {showFallacyDetection ? "−" : "+"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 