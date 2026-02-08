export const level4 = {
    id: 4,
    name: "The Privacy Vault",
    threat: "Privacy Protection",
    speed: 21,
    backgrounds: [
        { src: '/src/assets/level4/images/bg1.png', speedModifier: 0.4 },
        { src: '/src/assets/level4/images/bg2.png', speedModifier: 0.7 },
        { src: '/src/assets/level4/images/bg3.png', speedModifier: 1.0 }
    ],
    antagonist: {
        src: '/src/assets/level4/images/villain.png',
        frameCount: 1,
        scale: 0.35
    },
    questions: [
        {
            question: "What is 'Two-Factor Authentication' (2FA)?",
            options: ["An extra layer of security", "Having two passwords", "Two people using one account", "A type of game"],
            correctIndex: 0
        },
        {
            question: "A 'Strong Password' should have:",
            options: ["Only numbers", "Your name and birth year", "Letters, numbers, and symbols", "Just '123456'"],
            correctIndex: 2
        }
    ]
};
