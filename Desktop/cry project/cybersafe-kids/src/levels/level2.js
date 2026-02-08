export const level2 = {
    id: 2,
    name: "The Data Lake",
    threat: "Phishing",
    speed: 15,
    backgrounds: [
        { src: '/src/assets/level2/images/water.png', speedModifier: 0.5 },
        { src: '/src/assets/level2/images/trees.png', speedModifier: 0.8 },
        { src: '/src/assets/level2/images/Project (20260111045559).png', speedModifier: 1.0 }
    ],
    antagonist: {
        src: '/src/assets/antagonists/phishing.png',
        frameCount: 1,
        scale: 0.25
    },
    questions: [
        {
            question: "You get an email saying you won a free iPhone, but it asks for your password. What is this?",
            options: ["A lucky break", "A phishing scam", "A gift from a friend", "A software update"],
            correctIndex: 1
        },
        {
            question: "Should you click on links in emails from people you don't know?",
            options: ["Yes, always", "Only if it looks cool", "No, never", "Only on weekends"],
            correctIndex: 2
        }
    ]
};
