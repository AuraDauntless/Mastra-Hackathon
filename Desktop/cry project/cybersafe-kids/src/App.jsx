import React, { useState, useCallback } from 'react';
import GameCanvas from './components/GameCanvas';
import StartScreen from './components/StartScreen';
import LandingScreen from './components/LandingScreen';
import IntroStory from './components/IntroStory';
import QuestionPanel from './components/QuestionPanel';
import HUD from './components/HUD';
import LevelSuccess from './components/LevelSuccess';
import { generateSafetyReport } from './utils/pdfGenerator';
import cryLogo from './assets/Child_Rights_and_You_(CRY)_Organization_logo.png';
import { level1 } from './levels/level1';
import { level2 } from './levels/level2';
import { level3 } from './levels/level3';
import { level4 } from './levels/level4';
import { level5 } from './levels/level5';
import { questions as questionsData } from './data/questions';

const levels = [level1, level2, level3, level4, level5];

// PASTE YOUR WEB APP URL HERE
const SHEET_URL = "https://script.google.com/macros/s/AKfycbz1oK5mByUcmvvvlp7qTzvsm0q8PRHfOQyJJcqgAD5G4bDYmBv6a1oNxVKThwdXbSAezg/exec";

function App() {
  const [gameState, setGameState] = useState('LANDING'); // LANDING, START, STORY, PLAYING, QUIZ, GAMEOVER, VICTORY, LEVEL_FAIL
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [activeEnemy, setActiveEnemy] = useState(null);
  const [playerInfo, setPlayerInfo] = useState(null);
  const [questionQueue, setQuestionQueue] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [questionHistory, setQuestionHistory] = useState([]);
  const [levelCycle, setLevelCycle] = useState(0);
  const [lastCorrectCount, setLastCorrectCount] = useState(0);
  const [hasShared, setHasShared] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  /* Removed useEffect for submission to allow manual triggering */

  const submitToSheet = (data) => {
    console.log("Submitting:", JSON.stringify(data));
    fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(data)
    }).then(() => {
      console.log("Data submitted successfully");
    }).catch(err => console.error("Error submitting to sheet:", err));
  };

  const level = levels[currentLevelIdx];

  const handleStart = (info) => {
    setPlayerInfo(info);
    setGameState('STORY');
    setLives(3);
    setScore(0);
    setCurrentLevelIdx(0);
    setCorrectCount(0);
    setQuestionQueue([]);
    setHasShared(false);

    // Generate unique session ID for this game
    const newSessionId = Date.now().toString();
    setSessionId(newSessionId);

    // Record initial player entry
    submitToSheet({
      ...info,
      score: 0,
      finished: false,
      shared: false,
      sessionId: newSessionId
    });
  };

  const handleLevelFinished = useCallback(() => {
    const levelKey = `level${currentLevelIdx + 1}`;
    setQuestionQueue([...questionsData[levelKey]]);
    setGameState('QUIZ');
    setCorrectCount(0);
  }, [currentLevelIdx]);

  const handleAnswer = (isCorrect) => {
    const currentQ = questionQueue[0];
    const newCorrectCount = isCorrect ? correctCount + 1 : correctCount;

    // Add to history
    setQuestionHistory(prev => [...prev, {
      question: currentQ.question,
      userAnswer: currentQ.options[isCorrect ? currentQ.correctIndex : (currentQ.correctIndex + 1) % currentQ.options.length], // This is a bit simplified, but accurate if we knew choice index
      // Improvement: Pass the actual choice index to handleAnswer
      isCorrect: isCorrect,
      correctAnswer: currentQ.options[currentQ.correctIndex],
      level: level.name
    }]);

    if (isCorrect) {
      setScore(prev => prev + 100);
      setCorrectCount(newCorrectCount);
    }

    const remainingQuestions = questionQueue.slice(1);

    if (remainingQuestions.length > 0) {
      setQuestionQueue(remainingQuestions);
    } else {
      // End of level quiz
      if (newCorrectCount >= 3) {
        setGameState('LEVEL_SUCCESS');
      } else {
        // Did not pass the level quiz
        setGameState('LEVEL_FAIL');
        setLives(prev => Math.max(0, prev - 1));
      }
      setQuestionQueue([]);
      setLastCorrectCount(newCorrectCount);
      setCorrectCount(0);
    }
  };

  const handleLevelSuccessNext = () => {
    if (currentLevelIdx < levels.length - 1) {
      setCurrentLevelIdx(prev => prev + 1);
      setGameState('PLAYING');
    } else {
      setGameState('VICTORY');
      // Submit Finish Data
      if (playerInfo) {
        submitToSheet({
          ...playerInfo,
          score: Math.floor(score),
          finished: true,
          shared: hasShared,
          sessionId: sessionId
        });
      }
    }
  };

  const handleGameOver = () => {
    setGameState('GAMEOVER');
    // Submit Data (Finished = False)
    if (playerInfo) {
      submitToSheet({
        ...playerInfo,
        score: Math.floor(score),
        finished: false,
        shared: hasShared,
        sessionId: sessionId
      });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'I am a Cyber Safety Hero!',
      text: `I just scored ${Math.floor(score)} points in CyberSafe Kids! Can you beat my score?`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(`I just scored ${Math.floor(score)} points in CyberSafe Kids! Play here: ${window.location.href}`);
        alert("Link copied to clipboard! Share it with your friends.");
      }

      if (!hasShared) {
        setHasShared(true);
        // Update Sheet with Shared = True
        if (playerInfo) {
          submitToSheet({
            ...playerInfo,
            score: Math.floor(score),
            finished: true,
            shared: true,
            sessionId: sessionId
          });
        }
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleRestart = () => {
    setGameState('START');
    setQuestionHistory([]);
    setHasShared(false);
  };

  const handleDownloadReport = () => {
    // Convert logo to base64 for PDF
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = cryLogo;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/png');
      generateSafetyReport(playerInfo, score, questionHistory, dataURL);
    };
  };

  const handleRetryLevel = () => {
    setGameState('PLAYING');
    setCorrectCount(0);
    setQuestionQueue([]);
    setLevelCycle(prev => prev + 1);
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#333',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Global CRY Logo */}
      {gameState !== 'LANDING' && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          pointerEvents: 'none',
          animation: 'fadeIn 1s ease-out'
        }}>
          <img src={cryLogo} alt="CRY Logo" style={{ height: '100px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }} />
        </div>
      )}
      {gameState === 'LANDING' && <LandingScreen onFinishLoading={() => setGameState('START')} />}
      {gameState === 'START' && <StartScreen onStart={handleStart} />}
      {gameState === 'STORY' && <IntroStory onComplete={() => setGameState('PLAYING')} />}

      {(gameState === 'PLAYING' || gameState === 'QUIZ') && (
        <>
          <HUD
            score={score}
            lives={lives}
            levelName={level.name}
            threat={level.threat}
          />
          <GameCanvas
            key={`level-${currentLevelIdx}-${levelCycle}`}
            level={level}
            isPaused={gameState === 'QUIZ' || gameState === 'LEVEL_FAIL'}
            onLevelComplete={handleLevelFinished}
            lives={lives}
            onGameOver={handleGameOver}
            onScoreUpdate={setScore}
          />
        </>
      )}

      {gameState === 'QUIZ' && questionQueue.length > 0 && (
        <QuestionPanel
          question={questionQueue[0]}
          onAnswer={handleAnswer}
          currentQuestionIndex={5 - questionQueue.length + 1}
          totalQuestions={5}
          levelIdx={currentLevelIdx}
        />
      )}

      {gameState === 'LEVEL_SUCCESS' && (
        <LevelSuccess
          levelIdx={currentLevelIdx}
          stars={lastCorrectCount}
          score={score}
          onNext={handleLevelSuccessNext}
          onRetry={handleRetryLevel}
          onExit={handleRestart}
        />
      )}

      {gameState === 'LEVEL_FAIL' && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(59, 29, 95, 0.96)', color: '#fff',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          zIndex: 500, fontFamily: '"Outfit", sans-serif', textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '4.5rem', fontWeight: '900', color: '#FF9900', marginBottom: '20px' }}>DON'T GIVE UP!</h1>
          <p style={{ fontSize: '1.8rem', marginBottom: '40px', maxWidth: '600px', lineHeight: '1.4' }}>
            That was a tough one, but every Hero learns from their mistakes. <br />
            <b>Let's try again!</b>
          </p>

          <div style={{ display: 'flex', gap: '20px' }}>
            <button
              onClick={handleRetryLevel}
              style={{
                padding: '20px 60px',
                fontSize: '1.5rem',
                cursor: 'pointer',
                borderRadius: '50px',
                border: 'none',
                fontWeight: '900',
                backgroundColor: '#8CB63D',
                color: '#fff',
                boxShadow: '0 8px 0 #6B8E2D, 0 10px 20px rgba(0,0,0,0.3)',
                transition: 'transform 0.1s'
              }}
              onMouseDown={(e) => e.target.style.transform = 'translateY(4px)'}
              onMouseUp={(e) => e.target.style.transform = 'translateY(0)'}
            >
              RETRY LEVEL
            </button>
          </div>
        </div>
      )}

      {gameState === 'GAMEOVER' && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(59, 29, 95, 0.95)', color: '#fff',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          zIndex: 300, fontFamily: '"Outfit", sans-serif', textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '4rem', fontWeight: '900', color: '#ff4444' }}>MISSION FAILED</h1>
          <p style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Don't give up, {playerInfo?.name}!</p>
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: '20px 40px',
            borderRadius: '20px',
            marginBottom: '30px',
            border: '2px solid rgba(255,255,255,0.2)'
          }}>
            <p style={{ fontSize: '1.4rem' }}>You got <b>{questionHistory.filter(h => h.isCorrect).length}</b> safety questions right!</p>
            <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>Score: {Math.floor(score)}</p>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <button onClick={handleRestart} style={{ padding: '15px 40px', fontSize: '1.2rem', cursor: 'pointer', borderRadius: '50px', border: 'none', fontWeight: 'bold', backgroundColor: '#FF9900', color: '#fff' }}>
              RETRY MISSION
            </button>
            <button onClick={handleDownloadReport} style={{ padding: '15px 40px', fontSize: '1.2rem', cursor: 'pointer', borderRadius: '50px', border: '2px solid #fff', fontWeight: 'bold', backgroundColor: 'transparent', color: '#fff' }}>
              GET SAFETY REPORT
            </button>
          </div>
        </div>
      )}

      {gameState === 'VICTORY' && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(59, 29, 95, 0.95)', color: '#fff',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          zIndex: 300, fontFamily: '"Outfit", sans-serif', textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '4.5rem', fontWeight: '900', color: '#8CB63D', textShadow: '0 4px 20px rgba(140,182,61,0.4)' }}>CYBER CHAMPION!</h1>
          <p style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Outstanding work, {playerInfo?.name}!</p>
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: '25px 50px',
            borderRadius: '25px',
            marginBottom: '40px',
            border: '2px solid #8CB63D'
          }}>
            <p style={{ fontSize: '1.5rem' }}>Final Score: <b>{Math.floor(score)}</b></p>
            <p style={{ fontSize: '1.3rem' }}>Safety Master: <b>{questionHistory.filter(h => h.isCorrect).length}/{questionHistory.length}</b> Correct</p>
          </div>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '800px' }}>
            <button onClick={handleShare} style={{ padding: '18px 40px', fontSize: '1.3rem', cursor: 'pointer', borderRadius: '50px', border: 'none', fontWeight: 'bold', backgroundColor: '#0288d1', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>SHARE ACHIEVEMENT</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.66 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" /></svg>
            </button>
            <button onClick={handleDownloadReport} style={{ padding: '18px 40px', fontSize: '1.3rem', cursor: 'pointer', borderRadius: '50px', border: '2px solid #fff', fontWeight: 'bold', backgroundColor: 'transparent', color: '#fff' }}>
              DOWNLOAD CERTIFICATE
            </button>
            <button onClick={handleRestart} style={{ padding: '18px 40px', fontSize: '1.3rem', cursor: 'pointer', borderRadius: '50px', border: 'none', fontWeight: 'bold', backgroundColor: '#8CB63D', color: '#fff' }}>
              PLAY AGAIN
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
