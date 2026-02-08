import React, { useEffect, useState } from 'react';
import cryLogo from '../assets/Child_Rights_and_You_(CRY)_Organization_logo.png';
import heroGirl from '../assets/girl.png';
import homeBg from '../assets/home_bg.png';

// Friends
import f1 from '../assets/friends/friend_f1.png';
import f2 from '../assets/friends/friend_f2.png';
import f3 from '../assets/friends/friend_f3.png';
import f4 from '../assets/friends/friend_f4.png';
import f5 from '../assets/friends/friend_f5.png';

// Villains for background
import v1 from '../assets/level1/images/level 1 villain.png';
import v2 from '../assets/antagonists/phishing.png';
import v3 from '../assets/level3/images/villian.png';
import v4 from '../assets/level4/images/villain.png';
import v5 from '../assets/level5/images/gaming_villain.png';

const LandingScreen = ({ onFinishLoading }) => {
    const [progress, setProgress] = useState(0);
    const [phase, setPhase] = useState('LOADING'); // LOADING, INTRO

    useEffect(() => {
        if (phase === 'LOADING') {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setTimeout(() => setPhase('INTRO'), 800);
                        return 100;
                    }
                    return prev + 1;
                });
            }, 30);
            return () => clearInterval(interval);
        }
    }, [phase]);

    // Define colors
    const deepPurple = '#3b1d5f';
    const accentYellow = '#FF9900';

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#2d1440',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontFamily: '"Outfit", sans-serif',
            zIndex: 300,
            overflow: 'hidden',
            color: 'white'
        }}>
            {/* Background with blurred villains */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                overflow: 'hidden',
                filter: 'blur(15px) brightness(0.5) opacity(0.7)'
            }}>
                <img src={v1} style={{ position: 'absolute', top: '10%', left: '5%', height: '400px' }} alt="" />
                <img src={v2} style={{ position: 'absolute', top: '20%', right: '10%', height: '350px' }} alt="" />
                <img src={v3} style={{ position: 'absolute', bottom: '15%', left: '20%', height: '450px' }} alt="" />
                <img src={v4} style={{ position: 'absolute', bottom: '10%', right: '25%', height: '400px' }} alt="" />
                <img src={v5} style={{ position: 'absolute', top: '40%', left: '45%', height: '380px' }} alt="" />
                {/* Overlay scribbles if we had them, or just a dark tint */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(45, 20, 64, 0.4)'
                }} />
            </div>

            {/* Logo */}
            <div style={{ marginTop: '40px', zIndex: 10 }}>
                <img src={cryLogo} alt="CRY Logo" style={{ height: '110px', objectFit: 'contain' }} />
            </div>

            {/* Main Title Area */}
            <div style={{
                marginTop: '40px',
                textAlign: 'center',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                lineHeight: '0.85'
            }}>
                <h1 style={{
                    fontSize: '7.5rem',
                    color: accentYellow,
                    margin: 0,
                    fontWeight: '900',
                    textTransform: 'none',
                    letterSpacing: '-2px',
                    textShadow: '4px 4px 15px rgba(0,0,0,0.5)'
                }}>Cyber</h1>
                <h1 style={{
                    fontSize: '7.5rem',
                    color: accentYellow,
                    margin: 0,
                    fontWeight: '900',
                    textTransform: 'none',
                    letterSpacing: '-2px',
                    textShadow: '4px 4px 15px rgba(0,0,0,0.5)'
                }}>Champs</h1>
            </div>

            {/* Content Area */}
            <div style={{
                marginTop: '30px',
                width: '80%',
                maxWidth: '700px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 20,
                minHeight: '150px'
            }}>
                {phase === 'LOADING' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
                        <div style={{
                            width: '350px',
                            height: '24px',
                            backgroundColor: 'rgba(255, 153, 0, 0.1)',
                            border: '1.5px solid #FF9900',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            position: 'relative',
                            padding: '3px'
                        }}>
                            <div style={{
                                width: `${progress}%`,
                                height: '100%',
                                backgroundColor: '#FF9900',
                                borderRadius: '10px',
                                transition: 'width 0.1s linear'
                            }} />
                        </div>
                        <span style={{ marginTop: '12px', color: 'white', fontSize: '1.4rem', fontWeight: '500', opacity: 0.9 }}>loading</span>
                    </div>
                ) : (
                    <div style={{
                        textAlign: 'center',
                        animation: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <p style={{ fontSize: '1.4rem', marginBottom: '18px', fontWeight: '500', lineHeight: '1.4', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                            From <strong style={{ color: accentYellow }}>Captain Hack</strong> to the <strong style={{ color: accentYellow }}>Phish-King</strong>, they want your data! Do you have the skills to outsmart them and protect your digital world?
                        </p>
                        <p style={{ fontSize: '1.2rem', marginBottom: '25px', color: 'rgba(255,255,255,0.95)', fontWeight: '400', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                            CRY (Child Rights and You) is on a mission to keep every Indian child safe online.
                        </p>
                        <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '30px', color: 'white' }}>Are you ready to become a Champion?</h3>
                        <button
                            onClick={onFinishLoading}
                            style={{
                                padding: '16px 60px',
                                backgroundColor: '#8CB63D',
                                color: 'white',
                                border: 'none',
                                borderRadius: '40px',
                                fontSize: '1.6rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                boxShadow: '0 8px 0 #6B8E2D, 0 10px 25px rgba(0,0,0,0.4)',
                                outline: 'none'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'scale(1.05) translateY(-2px)';
                                e.target.style.boxShadow = '0 10px 0 #6B8E2D, 0 12px 30px rgba(0,0,0,0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'scale(1) translateY(0)';
                                e.target.style.boxShadow = '0 8px 0 #6B8E2D, 0 10px 25px rgba(0,0,0,0.4)';
                            }}
                            onMouseDown={(e) => {
                                e.target.style.transform = 'scale(0.98) translateY(2px)';
                                e.target.style.boxShadow = '0 2px 0 #6B8E2D, 0 4px 10px rgba(0,0,0,0.2)';
                            }}
                        >
                            LET'S GO!
                        </button>
                    </div>
                )}
            </div>

            {/* Main Character Hero Girl (Priya) - Left */}
            <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '20px',
                zIndex: 25,
                animation: 'slideInLeft 1s cubic-bezier(0.16, 1, 0.3, 1)',
                filter: 'drop-shadow(5px 5px 15px rgba(0,0,0,0.4))'
            }}>
                <img src={heroGirl} alt="Priya" style={{ height: '550px', objectFit: 'contain' }} />
            </div>

            {/* Five Friends - Right */}
            <div style={{
                position: 'absolute',
                bottom: '50px',
                right: '40px',
                zIndex: 20,
                display: 'flex',
                alignItems: 'flex-end',
                gap: '-25px',
                animation: 'slideInRight 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                filter: 'drop-shadow(2px 2px 10px rgba(0,0,0,0.3))'
            }}>
                <img src={f1} alt="Friend 1" style={{ height: '180px', objectFit: 'contain' }} />
                <img src={f2} alt="Friend 2" style={{ height: '190px', objectFit: 'contain' }} />
                <img src={f3} alt="Friend 3" style={{ height: '175px', objectFit: 'contain' }} />
                <img src={f4} alt="Friend 4" style={{ height: '210px', objectFit: 'contain' }} />
                <img src={f5} alt="Friend 5" style={{ height: '200px', objectFit: 'contain' }} />
            </div>

            {/* Wavy Ground Layer */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '160px',
                backgroundColor: '#3b1d5f',
                borderRadius: '100% 100% 0 0 / 100% 100% 0 0',
                transform: 'scaleX(1.15) translateY(40px)',
                zIndex: 5,
                boxShadow: '0 -10px 30px rgba(0,0,0,0.3)'
            }} />

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideInLeft {
                    from { transform: translateX(-200px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideInRight {
                    from { transform: translateX(200px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default LandingScreen;

