import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function PublicSpeaking() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [stream, setStream] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [speechTopic, setSpeechTopic] = useState('Should social media be regulated to prevent the spread of misinformation?');
  const [showWebcam, setShowWebcam] = useState(false);
  const [aiFeedback, setAiFeedback] = useState('Your AI feedback will appear here after you finish recording and request feedback.');
  const [isLoadingWebcam, setIsLoadingWebcam] = useState(false);
  
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const router = useRouter();

  // Speech topics for practice
  const speechTopics = [
    "Should social media be regulated to prevent the spread of misinformation?",
    "Should social media be regulated more strictly?",
    "Is online education as effective as traditional classroom learning?",
    "Should students be required to wear uniforms?",
    "Is technology making us more or less social?",
    "Should homework be banned?",
    "Is climate change the biggest threat to humanity?",
    "Should voting be mandatory?",
    "Is artificial intelligence beneficial or dangerous?",
    "Should fast food be banned in schools?",
    "Is money the most important factor in career choice?"
  ];

  // Start webcam
  const startWebcam = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      setStream(mediaStream);
      setShowWebcam(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
      alert('Could not access webcam. Please check permissions.');
    }
  };

  // Stop webcam
  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setShowWebcam(false);
    }
  };

  // Start recording
  const startRecording = () => {
    if (!stream) return;
    
    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setRecordedVideo(url);
    };
    
    mediaRecorder.start();
    setIsRecording(true);
    startTimer();
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopTimer();
    }
  };

  // Timer functions
  const startTimer = () => {
    setIsTimerRunning(true);
    timerRef.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const resetTimer = () => {
    setTimer(0);
    stopTimer();
  };

  // Format timer
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Change topic
  const changeTopic = () => {
    const randomTopic = speechTopics[Math.floor(Math.random() * speechTopics.length)];
    setSpeechTopic(randomTopic);
  };

  // Get AI feedback
  const getAiFeedback = () => {
    if (recordedVideo) {
      setAiFeedback('Analyzing your speech... This feature will provide real-time feedback on your speaking pace, clarity, and overall presentation skills.');
    } else {
      setAiFeedback('Please record a speech first before requesting AI feedback.');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    // Auto-start webcam when page loads
    const startWebcamAuto = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        setStream(mediaStream);
        setShowWebcam(true);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.log('Auto-start failed, user will need to grant camera permissions');
      }
    };

    startWebcamAuto();

    // Add beforeunload event listener to stop camera when leaving page
    const handleBeforeUnload = () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };

    // Add router event listener to stop camera when navigating away
    const handleRouteChange = () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
        setShowWebcam(false);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      // Cleanup function that runs when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
        setShowWebcam(false);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, []); // Remove dependencies to prevent re-runs

  return (
    <>
      <Head>
        <title>Public Speaking Module - Debating App</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Public Speaking Module</h1>
              <p className="text-gray-600 mt-1">Practice your speech with real-time feedback.</p>
            </div>
            <Link href="/dashboard" className="text-pink-600 hover:text-pink-700 flex items-center">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </div>
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column - Webcam/Video Section */}
            <div className="space-y-6">
              {/* Video Frame */}
              <div className="bg-black rounded-2xl overflow-hidden relative h-96">
                {showWebcam ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <div className="text-white text-lg mb-2">🎥 Webcam Feed</div>
                    <div className="text-gray-400 text-sm text-center px-4">
                      Click "Start Webcam" below to activate your camera
                    </div>
                  </div>
                )}
                
                {/* Recording Indicator */}
                {isRecording && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                    REC
                  </div>
                )}
                
                {/* Timer */}
                <div className="absolute top-4 right-4 text-white text-lg font-mono">
                  {formatTime(timer)}
                </div>
              </div>

              {/* Control Buttons */}
              <div className="grid grid-cols-2 gap-4">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    disabled={!showWebcam}
                    className={`px-6 py-3 text-white rounded-lg transition font-medium ${
                      !showWebcam 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-pink-500 hover:bg-pink-600'
                    }`}
                  >
                    Start Recording
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
                  >
                    Stop Recording
                  </button>
                )}
                
                {recordedVideo && (
                  <>
                    <button
                      onClick={() => {
                        const video = document.createElement('video');
                        video.src = recordedVideo;
                        video.controls = true;
                        video.className = 'w-full h-96 object-cover rounded-2xl';
                        const container = document.querySelector('.video-container');
                        if (container) {
                          container.innerHTML = '';
                          container.appendChild(video);
                        }
                      }}
                      className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
                    >
                      Play Recorded Video
                    </button>
                    <a
                      href={recordedVideo}
                      download="speech-practice.webm"
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium text-center"
                    >
                      Download Video
                    </a>
                  </>
                )}
              </div>
            </div>

            {/* Right Column - Information/Feedback Section */}
            <div className="space-y-6">
              {/* Speech Topic Card */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Speech Topic</h2>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {speechTopic}
                </p>
                <button
                  onClick={changeTopic}
                  className="text-pink-600 border border-pink-600 rounded-lg px-4 py-2 hover:bg-pink-50 transition"
                >
                  Change Topic
                </button>
              </div>

              {/* AI Feedback Card */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">AI Feedback</h2>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {aiFeedback}
                </p>
                <button
                  onClick={getAiFeedback}
                  className="bg-pink-500 text-white rounded-lg px-4 py-2 hover:bg-pink-600 transition"
                >
                  Get AI Feedback
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Avatar and App Name */}
        <div className="fixed bottom-6 left-6 flex items-center">
          <div className="w-12 h-12 rounded-full border-2 border-black overflow-hidden bg-pink-500">
            <Image
              src="/Avatar.jpg"
              alt="Avatar"
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="ml-3 text-gray-700 font-medium">AI Debating App</span>
        </div>
      </div>
    </>
  );
} 