export const level3 = {
    id: 3,
    name: "The Digital Fortress",
    threat: "Virus",
    speed: 18,
    backgrounds: [
        { src: '/src/assets/level3/images/Project (20260114104737).png', speedModifier: 0.4 },
        { src: '/src/assets/level3/images/Project (20260114104746).png', speedModifier: 0.7 },
        { src: '/src/assets/level3/images/eyes.png', speedModifier: 1.0 }
    ],
    antagonist: {
        src: '/src/assets/level3/images/villian.png',
        frameCount: 1,
        scale: 0.35
    },
    questions: [
        {
            question: "What is a computer virus?",
            options: ["A flu for people", "Harmful software that can hide on your PC", "A type of mouse", "A screen cleaner"],
            correctIndex: 1
        },
        {
            question: "How can you protect your computer from viruses?",
            options: ["Wash it with soap", "Use strong passwords and antivirus software", "Cover it with a blanket", "Turn it off and never use it"],
            correctIndex: 1
        }
    ]
};
