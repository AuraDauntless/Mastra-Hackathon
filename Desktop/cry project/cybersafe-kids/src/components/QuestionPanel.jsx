import React, { useState, useEffect } from 'react';

// Import frame images
import frameYellow from '../assets/questions_panel/questions panel.png';
import frameBlue from '../assets/questions_panel/questions panel-6.png';
import frameRed from '../assets/questions_panel/questions panel-8.png';
import frameDark from '../assets/questions_panel/questions panel-4.png';

const QuestionPanel = ({ question, onAnswer, currentQuestionIndex, totalQuestions, levelIdx }) => {
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [isLocked, setIsLocked] = useState(false);

    // Reset state when question changes
    useEffect(() => {
        setSelectedIndex(null);
        setIsLocked(false);
    }, [question]);

    const handleOptionClick = (index) => {
        if (isLocked) return;

        setSelectedIndex(index);
        setIsLocked(true);

        const isCorrect = index === question.correctIndex;

        // Delay proceeding so player can see feedback
        setTimeout(() => {
            onAnswer(isCorrect);
        }, 1000);
    };

    // Level-specific configurations
    const getLevelConfig = (idx) => {
        switch (idx) {
            case 0: // Level 1
                return {
                    frame: frameYellow,
                    textColor: '#4e342e',
                    accentColor: '#FF9900',
                    buttonBg: 'rgba(255, 255, 255, 0.9)',
                    buttonBorder: '#ffe082',
                    filter: 'none'
                };
            case 1: // Level 2
                return {
                    frame: frameBlue,
                    textColor: '#0d47a1',
                    accentColor: '#0288d1',
                    buttonBg: 'rgba(255, 255, 255, 0.9)',
                    buttonBorder: '#90caf9',
                    filter: 'none'
                };
            case 2: // Level 3
                return {
                    frame: frameRed,
                    textColor: '#ffffff',
                    accentColor: '#f44336',
                    buttonBg: 'rgba(0, 0, 0, 0.7)',
                    buttonBorder: '#ef5350',
                    filter: 'none'
                };
            case 3: // Level 4
                return {
                    frame: frameBlue, // Tinting the blue frame to green
                    textColor: '#ffffff',
                    accentColor: '#4caf50',
                    buttonBg: 'rgba(0, 40, 0, 0.75)',
                    buttonBorder: '#81c784',
                    filter: 'hue-rotate(90deg) saturate(1.5)'
                };
            case 4: // Level 5
                return {
                    frame: frameDark,
                    textColor: '#00e5ff',
                    accentColor: '#00e5ff',
                    buttonBg: 'rgba(0, 0, 0, 0.85)',
                    buttonBorder: '#00e5ff',
                    filter: 'none',
                    glow: '0 0 15px rgba(0, 229, 255, 0.4)'
                };
            default:
                return {
                    frame: frameYellow,
                    textColor: '#333',
                    accentColor: '#FF9900',
                    buttonBg: 'white',
                    buttonBorder: '#ddd'
                };
        }
    };

    const config = getLevelConfig(levelIdx);

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'black',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 500,
            overflow: 'hidden',
            fontFamily: '"Outfit", sans-serif'
        }}>
            {/* The Designer Border Frame */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url("${config.frame}")`,
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
                filter: config.filter,
                zIndex: 1
            }} />

            {/* Central Content Area (Transparent to show frame) */}
            <div style={{
                position: 'relative',
                zIndex: 10,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '40px 100px',
                boxSizing: 'border-box',
                animation: 'fadeIn 0.5s ease-out'
            }}>
                {/* Progress Indicator */}
                <div style={{
                    position: 'absolute',
                    top: '50px',
                    right: '80px',
                    color: config.accentColor,
                    fontWeight: '900',
                    fontSize: '1.8rem',
                    textShadow: '0 0 10px rgba(0,0,0,0.5)'
                }}>
                    QUESTION {currentQuestionIndex} / {totalQuestions}
                </div>

                <div style={{ maxWidth: '1000px', width: '100%', textAlign: 'center' }}>
                    <h2 style={{
                        fontSize: '3.2rem',
                        marginBottom: '60px',
                        fontWeight: '900',
                        lineHeight: '1.2',
                        color: config.textColor,
                        textShadow: levelIdx >= 2 ? '3px 3px 8px rgba(0,0,0,0.8)' : '1px 1px 2px rgba(255,255,255,0.8)'
                    }}>
                        {question.question}
                    </h2>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '30px',
                        width: '100%'
                    }}>
                        {question.options.map((option, index) => {
                            const isSelected = selectedIndex === index;
                            const isCorrect = index === question.correctIndex;
                            const showResult = selectedIndex !== null;

                            let bgColor = config.buttonBg;
                            let borderColor = config.buttonBorder;
                            let textColor = config.textColor;

                            if (showResult) {
                                if (isCorrect) {
                                    bgColor = '#4caf50';
                                    borderColor = '#2e7d32';
                                    textColor = '#ffffff';
                                } else if (isSelected) {
                                    bgColor = '#f44336';
                                    borderColor = '#b71c1c';
                                    textColor = '#ffffff';
                                } else {
                                    bgColor = 'rgba(255, 255, 255, 0.1)';
                                    borderColor = 'rgba(0, 0, 0, 0.1)';
                                    textColor = 'rgba(0, 0, 0, 0.3)';
                                }
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleOptionClick(index)}
                                    disabled={isLocked}
                                    style={{
                                        padding: '30px 40px',
                                        fontSize: '1.4rem',
                                        backgroundColor: bgColor,
                                        border: `3px solid ${borderColor}`,
                                        borderRadius: '60px',
                                        cursor: isLocked ? 'default' : 'pointer',
                                        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                        fontWeight: '700',
                                        color: textColor,
                                        textAlign: 'left',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '20px',
                                        boxShadow: (isSelected || (showResult && isCorrect)) ? '0 0 20px rgba(0,0,0,0.3)' : config.glow ? `0 0 15px ${config.accentColor}, 0 6px 15px rgba(0,0,0,0.3)` : '0 8px 15px rgba(0,0,0,0.2)',
                                        width: '100%',
                                        outline: 'none',
                                        transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                                        animation: (isSelected && !isCorrect) ? 'shake 0.4s ease-in-out' : (isSelected && isCorrect) ? 'correctPop 0.5s ease-out' : 'none'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (isLocked) return;
                                        e.target.style.transform = 'scale(1.04)';
                                        e.target.style.borderColor = config.accentColor;
                                        e.target.style.boxShadow = config.glow ? `0 0 25px ${config.accentColor}, 0 10px 20px rgba(0,0,0,0.4)` : '0 12px 25px rgba(0,0,0,0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        if (isLocked) return;
                                        e.target.style.transform = 'scale(1)';
                                        e.target.style.borderColor = borderColor;
                                        e.target.style.boxShadow = config.glow ? `0 0 15px ${config.accentColor}, 0 6px 15px rgba(0,0,0,0.3)` : '0 8px 15px rgba(0,0,0,0.2)';
                                    }}
                                >
                                    <span style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '50%',
                                        backgroundColor: showResult ? (isCorrect ? '#2e7d32' : isSelected ? '#b71c1c' : '#ccc') : config.accentColor,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        fontSize: '1.3rem',
                                        color: 'white',
                                        flexShrink: 0,
                                        fontWeight: '900',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
                                    }}>
                                        {String.fromCharCode(65 + index)}
                                    </span>
                                    {option}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-10px); }
                    75% { transform: translateX(10px); }
                }
                @keyframes correctPop {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1.05); }
                }
            `}</style>
        </div>
    );
};

export default QuestionPanel;
