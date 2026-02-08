import React, { useState, useEffect } from 'react';

const frames = [
    '/src/assets/frames/Frame 8.png',
    '/src/assets/frames/Frame 9.png',
    '/src/assets/frames/Frame 10.png',
    '/src/assets/frames/Frame 11.png',
    '/src/assets/frames/Frame 12.png',
    '/src/assets/frames/Frame 13.png',
    '/src/assets/frames/Frame 14.png',
    '/src/assets/frames/Frame 15.png',
    '/src/assets/frames/Frame 16.png',
];

const IntroStory = ({ onComplete }) => {
    const [currentFrame, setCurrentFrame] = useState(0);
    const [isFading, setIsFading] = useState(false);

    const handleNext = () => {
        if (isFading) return;

        setIsFading(true);
        setTimeout(() => {
            if (currentFrame < frames.length - 1) {
                setCurrentFrame(prev => prev + 1);
                setIsFading(false);
            } else {
                onComplete();
            }
        }, 500); // Wait for fade out
    };

    // Auto-advance every 5 seconds
    useEffect(() => {
        const timer = setTimeout(handleNext, 5000);
        return () => clearTimeout(timer);
    }, [currentFrame]);

    return (
        <div
            onClick={handleNext}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'black',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 400,
                cursor: 'pointer',
                overflow: 'hidden'
            }}
        >
            <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'opacity 0.5s ease-in-out',
                opacity: isFading ? 0 : 1
            }}>
                <img
                    src={frames[currentFrame]}
                    alt={`Story frame ${currentFrame + 8}`}
                    style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain'
                    }}
                />
            </div>

            {/* Click Indicator */}
            <div style={{
                position: 'absolute',
                bottom: '30px',
                right: '40px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '20px',
                fontFamily: '"Outfit", sans-serif',
                pointerEvents: 'none',
                opacity: isFading ? 0 : 1,
                transition: 'opacity 0.3s'
            }}>
                {currentFrame === frames.length - 1 ? 'START GAME' : 'NEXT >'}
            </div>

            {/* Skip Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onComplete();
                }}
                style={{
                    position: 'absolute',
                    top: '30px',
                    right: '30px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(5px)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    padding: '8px 24px',
                    borderRadius: '20px',
                    fontFamily: '"Outfit", sans-serif',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    zIndex: 500,
                    transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            >
                SKIP STORY
            </button>

            {/* Auto-play status bar (optional visual cue) */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '4px',
                backgroundColor: '#D48A1D',
                width: '100%',
                transformOrigin: 'left',
                animation: !isFading ? 'progress 5s linear forwards' : 'none'
            }} />

            <style>{`
                @keyframes progress {
                    from { transform: scaleX(0); }
                    to { transform: scaleX(1); }
                }
            `}</style>
        </div>
    );
};

export default IntroStory;
