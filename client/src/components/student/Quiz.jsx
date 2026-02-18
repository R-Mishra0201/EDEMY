import React, { useState, useEffect, useRef } from 'react';

const Quiz = () => {
  const [studentName, setStudentName] = useState('');
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const canvasRef = useRef(null);

  const questionPool = [
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
      questionText: 'Which command creates a new React app?',
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
    {
      questionText: 'What is JSX?',
      answerOptions: [
        { answerText: 'A database query language', isCorrect: false },
        { answerText: 'JavaScript XML – a syntax extension for React', isCorrect: true },
        { answerText: 'A CSS framework', isCorrect: false },
        { answerText: 'A Node.js module', isCorrect: false },
      ],
    },
    {
      questionText: 'Which method updates state in a class component?',
      answerOptions: [
        { answerText: 'this.state()', isCorrect: false },
        { answerText: 'this.updateState()', isCorrect: false },
        { answerText: 'this.setState()', isCorrect: true },
        { answerText: 'this.changeState()', isCorrect: false },
      ],
    },
    {
      questionText: 'What does npm stand for?',
      answerOptions: [
        { answerText: 'Node Package Manager', isCorrect: true },
        { answerText: 'New Programming Method', isCorrect: false },
        { answerText: 'Node Process Manager', isCorrect: false },
        { answerText: 'Network Package Module', isCorrect: false },
      ],
    },
    {
      questionText: 'Which HTTP method sends data to a server?',
      answerOptions: [
        { answerText: 'GET', isCorrect: false },
        { answerText: 'DELETE', isCorrect: false },
        { answerText: 'POST', isCorrect: true },
        { answerText: 'FETCH', isCorrect: false },
      ],
    },
    {
      questionText: 'What is the virtual DOM?',
      answerOptions: [
        { answerText: 'A direct copy of the real DOM', isCorrect: false },
        { answerText: 'A lightweight in-memory representation of the real DOM', isCorrect: true },
        { answerText: 'A server-side rendering engine', isCorrect: false },
        { answerText: 'A CSS rendering tool', isCorrect: false },
      ],
    },
    {
      questionText: 'Which company developed React.js?',
      answerOptions: [
        { answerText: 'Google', isCorrect: false },
        { answerText: 'Microsoft', isCorrect: false },
        { answerText: 'Facebook (Meta)', isCorrect: true },
        { answerText: 'Twitter', isCorrect: false },
      ],
    },
    {
      questionText: 'What is MongoDB?',
      answerOptions: [
        { answerText: 'A relational database', isCorrect: false },
        { answerText: 'A NoSQL document database', isCorrect: true },
        { answerText: 'A front-end framework', isCorrect: false },
        { answerText: 'A CSS preprocessor', isCorrect: false },
      ],
    },
    {
      questionText: 'What is Express.js used for?',
      answerOptions: [
        { answerText: 'Styling React components', isCorrect: false },
        { answerText: 'Building server-side web applications with Node.js', isCorrect: true },
        { answerText: 'Managing state in React', isCorrect: false },
        { answerText: 'Creating mobile apps', isCorrect: false },
      ],
    },
    {
      questionText: 'Which keyword declares a constant in JavaScript?',
      answerOptions: [
        { answerText: 'var', isCorrect: false },
        { answerText: 'let', isCorrect: false },
        { answerText: 'const', isCorrect: true },
        { answerText: 'define', isCorrect: false },
      ],
    },
    {
      questionText: 'What does REST stand for?',
      answerOptions: [
        { answerText: 'Representational State Transfer', isCorrect: true },
        { answerText: 'Remote Execution of Server Tasks', isCorrect: false },
        { answerText: 'React Element State Tree', isCorrect: false },
        { answerText: 'Relational Endpoint Schema Transfer', isCorrect: false },
      ],
    },
    {
      questionText: 'What is the default port for a React development server?',
      answerOptions: [
        { answerText: '8080', isCorrect: false },
        { answerText: '5000', isCorrect: false },
        { answerText: '3000', isCorrect: true },
        { answerText: '4200', isCorrect: false },
      ],
    },
    {
      questionText: 'Which of these is used to manage global state in React?',
      answerOptions: [
        { answerText: 'useEffect', isCorrect: false },
        { answerText: 'useRef', isCorrect: false },
        { answerText: 'Context API / Redux', isCorrect: true },
        { answerText: 'useCallback', isCorrect: false },
      ],
    },
    {
      questionText: 'What is a React component?',
      answerOptions: [
        { answerText: 'A CSS class', isCorrect: false },
        { answerText: 'A reusable piece of UI', isCorrect: true },
        { answerText: 'A database model', isCorrect: false },
        { answerText: 'An HTTP request handler', isCorrect: false },
      ],
    },
    {
      questionText: 'Which hook lets you access a DOM element directly?',
      answerOptions: [
        { answerText: 'useState', isCorrect: false },
        { answerText: 'useEffect', isCorrect: false },
        { answerText: 'useRef', isCorrect: true },
        { answerText: 'useMemo', isCorrect: false },
      ],
    },
    {
      questionText: 'What does JSON stand for?',
      answerOptions: [
        { answerText: 'JavaScript Object Notation', isCorrect: true },
        { answerText: 'Java Serialized Object Network', isCorrect: false },
        { answerText: 'JavaScript Online Node', isCorrect: false },
        { answerText: 'Java Standard Object Naming', isCorrect: false },
      ],
    },
    {
      questionText: 'Which Node.js function is used to import modules?',
      answerOptions: [
        { answerText: 'import()', isCorrect: false },
        { answerText: 'fetch()', isCorrect: false },
        { answerText: 'require()', isCorrect: true },
        { answerText: 'load()', isCorrect: false },
      ],
    },
    {
      questionText: 'What is the purpose of the key prop in React lists?',
      answerOptions: [
        { answerText: 'To style list items', isCorrect: false },
        { answerText: 'To help React identify which items changed', isCorrect: true },
        { answerText: 'To pass data between components', isCorrect: false },
        { answerText: 'To trigger re-renders', isCorrect: false },
      ],
    },
    {
      questionText: 'What is Mongoose in the MERN stack?',
      answerOptions: [
        { answerText: 'A React UI library', isCorrect: false },
        { answerText: 'An ODM library for MongoDB and Node.js', isCorrect: true },
        { answerText: 'A CSS framework', isCorrect: false },
        { answerText: 'A testing framework', isCorrect: false },
      ],
    },
    {
      questionText: 'Which array method returns a new transformed array in JavaScript?',
      answerOptions: [
        { answerText: 'forEach()', isCorrect: false },
        { answerText: 'filter()', isCorrect: false },
        { answerText: 'map()', isCorrect: true },
        { answerText: 'reduce()', isCorrect: false },
      ],
    },
    {
      questionText: 'What does CORS stand for?',
      answerOptions: [
        { answerText: 'Cross-Origin Resource Sharing', isCorrect: true },
        { answerText: 'Client-Origin Request System', isCorrect: false },
        { answerText: 'Cross-Object Routing Schema', isCorrect: false },
        { answerText: 'Component-Origin React Service', isCorrect: false },
      ],
    },
  ];

  const shuffleAndPick = () => {
    const shuffled = [...questionPool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  };

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
    if (studentName.trim()) {
      setQuestions(shuffleAndPick());
      setQuizStarted(true);
    }
  };

  const restartQuiz = () => {
    setScore(0);
    setCurrentQuestion(0);
    setShowScore(false);
    setQuizStarted(false);
    setStudentName('');
    setQuestions([]);
  };

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
                  {questions[currentQuestion]?.questionText}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {questions[currentQuestion]?.answerOptions.map((answerOption, index) => (
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
