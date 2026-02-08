export const level1 = {
    id: 1,
    name: "The Scribble Fields",
    threat: "Cyberbullying",
    speed: 12,
    backgrounds: [
        { src: '/src/assets/level1/images/bg1.png', speedModifier: 0.5 },
        { src: '/src/assets/level1/images/bg2-1.png', speedModifier: 0.8 },
        { src: '/src/assets/level1/images/bg 3 scribbles.png', speedModifier: 1.0 }
    ],
    antagonist: {
        src: '/src/assets/level1/images/level 1 villain.png',
        frameCount: 1,
        scale: 0.25
    },
    questions: [
        {
            question: "Someone is being mean to your friend in a group chat. What should you do?",
            options: ["Join in and be mean too", "Tell a trusted adult", "Ignore it and hope it stops", "Delete the chat"],
            correctIndex: 1
        },
        {
            question: "What is cyberbullying?",
            options: ["A type of video game", "Using the internet to be mean to others", "A computer virus", "A way to make new friends"],
            correctIndex: 1
        }
    ]
};
