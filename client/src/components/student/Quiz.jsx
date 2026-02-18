import React, { useState, useEffect, useRef } from 'react';

const Quiz = () => {
  const [studentName, setStudentName] = useState('');
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const canvasRef = useRef(null);

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
      questionText: 'Which command is used to create a new React app?',
      answerOptions: [
        { answerText: 'npm install react', isCorrect: false },
        { answerText: 'npx create-react-app my-app', isCorrect: true },
        { answerText: 'npm start', isCorrect: false },
        { answerText: 'node react-app', isCorrect: false },
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
      questionText: 'How do you pass data to a child component?',
      answerOptions: [
        { answerText: 'State', isCorrect: false },
        { answerText: 'Props', isCorrect: true },
        { answerText: 'Redux', isCorrect: false },
        { answerText: 'Context', isCorrect: false },
      ],
    },
  ];

  const handleAnswerOptionClick = (isCorrect) => {
    if (isCorrect) setScore(score + 1);
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  useEffect(() => {
    if (showScore && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 20;
      ctx.strokeRect(20, 20, width - 40, height - 40);

      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 5;
      ctx.strokeRect(45, 45, width - 90, height - 90);

      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 50px serif';
      ctx.textAlign = 'center';
      ctx.fillText('Certificate of Completion', width / 2, 120);

      ctx.font = '20px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('This is to certify that', width / 2, 180);

      ctx.font = 'bold italic 60px cursive';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(studentName || 'Student', width / 2, 260);

      ctx.font = '20px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Has successfully completed the Quiz Assessment', width / 2, 330);
      ctx.fillText(`with a score of ${score} out of ${questions.length}`, width / 2, 360);

      const date = new Date().toLocaleDateString();
      ctx.font = '18px sans-serif';
      ctx.fillStyle = '#334155';
      ctx.fillText(`Date: ${date}`, width / 2, 420);

      ctx.fillStyle = '#2563eb';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('E-Learning Management System', width / 2, 520);
      ctx.fillStyle = '#000';
      ctx.font = '16px sans-serif';
      ctx.fillText('by Rahul Mishra', width / 2, 550);
    }
  }, [showScore, score, studentName]);

  const handleStartQuiz = (e) => {
    e.preventDefault();
    if (studentName.trim()) setQuizStarted(true);
  };

  const restartQuiz = () => {
    setScore(0);
    setCurrentQuestion(0);
    setShowScore(false);
    setQuizStarted(false);
    setStudentName('');
  };

  // ✅ NEW: Download certificate as PNG
  const downloadCertificate = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `${studentName}_certificate.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      backgroundColor: '#f8fafc',
      padding: '20px',
      fontFamily: 'sans-serif',
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: '15px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      padding: '40px',
      width: '100%',
      maxWidth: '600px',
      textAlign: 'center',
    },
    input: {
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #cbd5e1',
      width: '80%',
      marginBottom: '20px',
      fontSize: '16px',
    },
    button: {
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      transition: 'background 0.3s',
      margin: '8px 0',
      width: '100%',
    },
    questionText: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#334155',
      marginBottom: '20px',
    },
    canvasContainer: {
      marginTop: '30px',
      maxWidth: '100%',
      overflow: 'auto',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    },
  };

  return (
    <div style={styles.container}>
      {!quizStarted ? (
        <div style={styles.card}>
          <h2 style={{ color: '#1e293b', marginBottom: '20px' }}>Student Assessment Module</h2>
          <p style={{ color: '#64748b', marginBottom: '20px' }}>
            Enter your name to begin the certification quiz.
          </p>
          <form onSubmit={handleStartQuiz}>
            <input
              type="text"
              placeholder="Enter your full name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              style={styles.input}
              required
            />
            <button type="submit" style={styles.button}>
              Start Quiz
            </button>
          </form>
        </div>
      ) : (
        <div style={styles.card}>
          {showScore ? (
            <div>
              <h2 style={{ color: '#10b981', marginBottom: '10px' }}>Assessment Completed!</h2>
              <p style={{ fontSize: '18px' }}>You scored {score} out of {questions.length}</p>

              <div style={styles.canvasContainer}>
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>

              {/* ✅ NEW: Download Button */}
              <button
                style={{ ...styles.button, backgroundColor: '#10b981', marginTop: '15px' }}
                onClick={downloadCertificate}
              >
                ⬇ Download Certificate
              </button>

              <button
                style={{ ...styles.button, backgroundColor: '#475569', marginTop: '8px' }}
                onClick={restartQuiz}
              >
                Take Quiz Again
              </button>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '25px' }}>
                <span style={{ fontSize: '14px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Question {currentQuestion + 1} / {questions.length}
                </span>
                <div style={styles.questionText}>
                  {questions[currentQuestion].questionText}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
      )}
    </div>
  );
};

export default Quiz;
