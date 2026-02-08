import React, { useState } from 'react';
import cryLogo from '../assets/Child_Rights_and_You_(CRY)_Organization_logo.png';
import villainImg from '../assets/level3/images/villian.png';

const StartScreen = ({ onStart }) => {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = () => {
        if (formData.name && formData.age && formData.gender) {
            onStart(formData);
        } else {
            alert('Please fill in all fields!');
        }
    };

    const backgroundRed = '#a52b2b';
    const cardBorderGold = '#d4af37';
    const buttonGreen = '#8cb63d';
    const ochreCircle = '#d4a017';

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: backgroundRed,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: '"Outfit", sans-serif',
            zIndex: 200,
            overflow: 'hidden'
        }}>
            {/* Logo at the top */}
            <div style={{ position: 'absolute', top: '30px', zIndex: 10 }}>
                <img src={cryLogo} alt="CRY Logo" style={{ height: '90px', objectFit: 'contain' }} />
            </div>

            {/* Main Form Card */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '20px',
                width: '90%',
                maxWidth: '900px',
                height: 'auto',
                minHeight: '500px',
                boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
                display: 'flex',
                zIndex: 20,
                overflow: 'hidden',
                animation: 'floatUp 0.6s ease-out'
            }}>
                {/* Left Side: Form */}
                <div style={{
                    flex: 1,
                    padding: '40px 60px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center'
                }}>
                    {/* Star Icon */}
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        border: `3px solid ${ochreCircle}`,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: '15px'
                    }}>
                        <svg width="35" height="35" viewBox="0 0 24 24" fill={ochreCircle}>
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                    </div>

                    <h1 style={{
                        color: backgroundRed,
                        fontSize: '3.5rem',
                        fontWeight: '900',
                        marginBottom: '20px',
                        margin: 0,
                    }}>Hello!!</h1>

                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {/* Name Input */}
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '12px 25px',
                                borderRadius: '30px',
                                border: `2px solid ${cardBorderGold}`,
                                fontSize: '1.2rem',
                                outline: 'none',
                                color: '#333',
                                boxSizing: 'border-box',
                                fontWeight: '500'
                            }}
                        />

                        <div style={{ display: 'flex', gap: '15px', width: '100%' }}>
                            {/* Age Input */}
                            <input
                                type="number"
                                name="age"
                                placeholder="Age"
                                value={formData.age}
                                onChange={handleChange}
                                style={{
                                    width: '40%',
                                    padding: '12px 25px',
                                    borderRadius: '30px',
                                    border: `2px solid ${cardBorderGold}`,
                                    fontSize: '1.2rem',
                                    outline: 'none',
                                    color: '#333',
                                    boxSizing: 'border-box',
                                    fontWeight: '500'
                                }}
                            />

                            {/* Gender Dropdown */}
                            <div style={{ position: 'relative', width: '60%' }}>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px 25px',
                                        borderRadius: '30px',
                                        border: `2px solid ${cardBorderGold}`,
                                        fontSize: '1.2rem',
                                        outline: 'none',
                                        color: '#333',
                                        background: 'white',
                                        appearance: 'none',
                                        cursor: 'pointer',
                                        boxSizing: 'border-box',
                                        fontWeight: '500'
                                    }}
                                >
                                    <option value="" disabled>Gender</option>
                                    <option value="Male">Boy</option>
                                    <option value="Female">Girl</option>
                                    <option value="Other">Other</option>
                                </select>
                                <div style={{
                                    position: 'absolute',
                                    right: '20px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    pointerEvents: 'none'
                                }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#333">
                                        <path d="M7 10l5 5 5-5z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={handleNext}
                        style={{
                            marginTop: '40px',
                            padding: '12px 80px',
                            backgroundColor: buttonGreen,
                            color: 'white',
                            border: 'none',
                            borderRadius: '40px',
                            fontSize: '2rem',
                            fontWeight: '900',
                            cursor: 'pointer',
                            transition: 'transform 0.1s',
                            outline: 'none'
                        }}
                        onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'}
                        onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
                    >
                        Next
                    </button>
                </div>

                {/* Right Side: Visual */}
                <div style={{
                    flex: 1,
                    position: 'relative',
                    backgroundColor: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden'
                }}>
                    {/* Ochre Circle Background */}
                    <div style={{
                        position: 'absolute',
                        width: '600px',
                        height: '600px',
                        backgroundColor: ochreCircle,
                        borderRadius: '50%',
                        right: '-100px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 1
                    }} />

                    {/* Villain Monster */}
                    <img
                        src={villainImg}
                        alt="Villain"
                        style={{
                            position: 'relative',
                            height: '80%',
                            objectFit: 'contain',
                            zIndex: 2,
                            marginRight: '-50px',
                            filter: 'drop-shadow(10px 10px 30px rgba(0,0,0,0.2))'
                        }}
                    />
                </div>
            </div>

            <style>{`
                @keyframes floatUp {
                    from { transform: translateY(30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                input::-webkit-outer-spin-button,
                input::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                input[type=number] {
                    -moz-appearance: textfield;
                }
            `}</style>
        </div>
    );
};

export default StartScreen;
