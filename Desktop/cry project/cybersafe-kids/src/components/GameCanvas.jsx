import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useGameLoop } from '../engine/useGameLoop';
import Player from '../engine/Player';
import Enemy from '../engine/Enemy';
import { checkCollision } from '../engine/collision';

const GameCanvas = ({ level, isPaused, onLevelComplete, lives, onGameOver, onScoreUpdate }) => {
    const canvasRef = useRef(null);
    const gameRef = useRef({
        player: null,
        enemies: [],
        backgrounds: [],
        distanceTraveled: 0,
        mapWidth: 0,
        loopsCompleted: 0,
        isLevelFinishing: false,
        antagonistImg: null
    });

    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });
    const timeoutRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
            }
            if (gameRef.current.player) {
                gameRef.current.player.groundY = window.innerHeight - 400;
                gameRef.current.player.y = window.innerHeight - 400;
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Initialize game objects
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = dimensions.width;
        canvas.height = dimensions.height;

        // Reset game state for new level
        gameRef.current.player = new Player({
            imageArray: [
                '/src/assets/player/run_f1.png',
                '/src/assets/player/run_f2.png',
                '/src/assets/player/run_f3.png',
                '/src/assets/player/run_f4.png',
                '/src/assets/player/run_f5.png'
            ],
            x: 100,
            y: canvas.height - 400,
            width: 100,
            height: 100,
            frameCount: 5,
            frameRate: 8,
            scale: 1.2
        });

        gameRef.current.enemies = [];
        gameRef.current.distanceTraveled = 0;
        gameRef.current.loopsCompleted = 0;
        gameRef.current.isLevelFinishing = false;

        // Set backgrounds from level data
        gameRef.current.backgrounds = level.backgrounds.map(bg => {
            const img = new Image();
            img.src = bg.src;
            return { img, speedModifier: bg.speedModifier, x: 0 };
        });

        // Load antagonist
        const antImg = new Image();
        antImg.src = level.antagonist.src;
        gameRef.current.antagonistImg = antImg;

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [level]);

    // Handle character standing still when paused
    useEffect(() => {
        if (gameRef.current.player) {
            gameRef.current.player.setStill(isPaused || gameRef.current.isLevelFinishing);
        }
    }, [isPaused]);

    const update = useCallback((deltaTime) => {
        if (isPaused) return;

        const canvas = canvasRef.current;
        if (!canvas || !gameRef.current.player) return;

        if (gameRef.current.isLevelFinishing) return;

        // Update Position / Distance
        const speed = level.speed;
        gameRef.current.distanceTraveled += speed;

        // Update Player
        gameRef.current.player.update();

        // Update Backgrounds (Parallax)
        gameRef.current.backgrounds.forEach(bg => {
            const aspect = bg.img.naturalWidth / bg.img.naturalHeight || 1;
            const bgWidth = Math.max(canvas.width, canvas.height * aspect);

            // We use the last background (main layer) to determine loop completion
            if (bg.speedModifier === 1.0) {
                gameRef.current.mapWidth = bgWidth;
            }

            bg.x -= speed * bg.speedModifier;
            if (bg.x <= -bgWidth) {
                bg.x = 0;
                if (bg.speedModifier === 1.0) {
                    gameRef.current.loopsCompleted += 1;
                    if (gameRef.current.loopsCompleted >= 3) {
                        gameRef.current.isLevelFinishing = true;
                        if (gameRef.current.player) gameRef.current.player.setStill(true);
                        timeoutRef.current = setTimeout(onLevelComplete, 2000);
                    }
                }
            }
        });

        // Update Score based on distance
        onScoreUpdate(gameRef.current.distanceTraveled / 10);

    }, [level, onLevelComplete, onScoreUpdate, isPaused]);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Backgrounds
        gameRef.current.backgrounds.forEach(bg => {
            const aspect = (bg.img.naturalWidth && bg.img.naturalHeight)
                ? bg.img.naturalWidth / bg.img.naturalHeight
                : 1;
            const bgWidth = Math.max(canvas.width, canvas.height * aspect);
            ctx.drawImage(bg.img, bg.x, 0, bgWidth, canvas.height);
            ctx.drawImage(bg.img, bg.x + bgWidth, 0, bgWidth, canvas.height);
        });

        // Draw Player
        gameRef.current.player.draw(ctx);

        // Draw Antagonist if finishing or in quiz
        if ((gameRef.current.isLevelFinishing || isPaused) && gameRef.current.antagonistImg) {
            const ant = level.antagonist;
            const antHeight = 1400 * ant.scale; // VERY BIG
            const antWidth = (gameRef.current.antagonistImg.width / (gameRef.current.antagonistImg.height || 1)) * antHeight;

            // Floating animation
            const floatOffset = Math.sin(Date.now() / 350) * 25;

            ctx.drawImage(
                gameRef.current.antagonistImg,
                canvas.width - antWidth - 40,
                canvas.height - antHeight - 120 + floatOffset,
                antWidth,
                antHeight
            );
        }
    }, [level, isPaused]);

    useGameLoop((deltaTime) => {
        update(deltaTime);
        draw();
    }, false);

    // Input Handling
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                !isPaused && gameRef.current.player.jump();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <canvas
                ref={canvasRef}
                onClick={() => gameRef.current.player.jump()}
                style={{
                    display: 'block',
                    backgroundColor: '#87CEEB',
                    width: '100%',
                    height: '100%'
                }}
            />
            <button
                onClick={toggleFullScreen}
                style={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '20px',
                    padding: '10px',
                    background: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    zIndex: 100
                }}
            >
                Toggle Fullscreen
            </button>
        </div>
    );
};

export default GameCanvas;
