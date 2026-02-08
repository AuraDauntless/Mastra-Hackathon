import React from 'react';

const HUD = ({ score, lives, levelName, threat }) => {
    return (
        <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            right: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            pointerEvents: 'none',
            fontFamily: '"Outfit", sans-serif',
            color: '#fff',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            zIndex: 50
        }}>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '10px 20px', borderRadius: '15px' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{levelName}</div>
                <div style={{ fontSize: '0.9rem' }}>Threat: {threat}</div>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '10px 20px', borderRadius: '15px' }}>
                    Score: {Math.floor(score)}
                </div>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '10px 20px', borderRadius: '15px' }}>
                    Lives: {Array(lives).fill('❤️').join(' ')}
                </div>
            </div>
        </div>
    );
};

export default HUD;
