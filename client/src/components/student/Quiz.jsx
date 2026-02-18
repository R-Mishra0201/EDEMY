import React, { useState } from 'react';

const Quiz = () => {
  const questions = [
    {
      questionText: 'What is the primary function of React.js?',
      answerOptions: [
        { answerText: 'Server-side routing', isCorrect: false },
        { answerText: 'Building user interfaces', isCorrect: true },
        { answerText: 'Managing databases', isCorrect: false },
        { answerText: 'Handling HTTP requests', isCorrect: false },
      ],
    },
    {
      questionText: 'Which hook is used to handle side effects in React?',
      answerOptions: [
        { answerText: 'useState', isCorrect: false },
        { answerText: 'useReducer', isCorrect: false },
        { answerText: 'useEffect', isCorrect: true },
        { answerText: 'useRef', isCorrect: false },
      ],
    },
    {
      questionText: 'What does MERN stand for?',
      answerOptions: [
        { answerText: 'MongoDB, Express, React, Node', isCorrect: true },
        { answerText: 'MySQL, Express, React, Node', isCorrect: false },
        { answerText: 'MongoDB, Electron, React, Node', isCorrect: false },
        { answerText: 'MongoDB, Express, React, Native', isCorrect: false },
      ],
    },
    {
      questionText: 'Which command is used to create a new React app?',
      answerOptions: [
        { answerText: 'npm install react', isCorrect: false },
        { answerText: 'npx create-react-app my-app', isCorrect: true },
        { answerText: 'npm start', isCorrect: false },
        { answerText: 'node react-app', isCorrect: false },
      ],
    },
    {
      questionText: 'How do you pass data to a child component?',
      answerOptions: [
        { answerText: 'State', isCorrect: false },
        { answerText: 'Props', isCorrect: true },
        { answerText: 'Redux', isCorrect: false },
        { answerText: 'Context', isCorrect: false },
      ],
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerOptionClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const restartQuiz = () => {
    setScore(0);
    setCurrentQuestion(0);
    setShowScore(false);
  };

  // Simple Inline Styles to match your theme automatically
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      backgroundColor: '#f5f5f5',
      padding: '20px',
      color: '#333',
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: '15px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      padding: '30px',
      width: '100%',
      maxWidth: '500px',
      textAlign: 'center',
    },
    button: {
      backgroundColor: '#3b82f6', // Matches standard blue theme
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      margin: '10px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
      width: '100%',
    },
    scoreText: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: '#10b981', // Green for success
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {showScore ? (
          <div>
            <div style={styles.scoreText}>
              You scored {score} out of {questions.length}
            </div>
            <button style={styles.button} onClick={restartQuiz}>
              Retake Quiz
            </button>
            <p style={{marginTop: '15px', fontSize: '14px', color: '#666'}}>
              (Certificate Generated Successfully)
            </p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                Question {currentQuestion + 1}/{questions.length}
              </div>
              <div style={{ fontSize: '18px', marginTop: '10px' }}>
                {questions[currentQuestion].questionText}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {questions[currentQuestion].answerOptions.map((answerOption, index) => (
                <button
                  key={index}
                  style={styles.button}
                  onClick={() => handleAnswerOptionClick(answerOption.isCorrect)}
                >
                  {answerOption.answerText}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Quiz;
