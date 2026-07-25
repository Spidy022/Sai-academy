import React, { useState, useEffect } from 'react';
import { Database, FileText, CheckCircle, Clock, Award, RotateCcw, HelpCircle, ArrowRight } from 'lucide-react';

const sampleQuizzes = [
  {
    id: 1,
    subject: "Indian Penal Code (IPC) & Law",
    question: "Which Section of the Indian Penal Code (IPC) defines 'Culpable Homicide'?",
    options: [
      "A. Section 299",
      "B. Section 300",
      "C. Section 302",
      "D. Section 304"
    ],
    correctOption: 0,
    explanation: "Section 299 of the Indian Penal Code defines Culpable Homicide. Section 300 defines Murder."
  },
  {
    id: 2,
    subject: "General Intelligence & Reasoning",
    question: "If POLICE is coded as QPMJDF in a secret cipher, what is the code for ACADEMY?",
    options: [
      "A. BDBEFNZ",
      "B. ZBZDDKX",
      "C. CACEFNZ",
      "D. BDBEEFY"
    ],
    correctOption: 0,
    explanation: "Each letter is shifted forward by +1 in the alphabetical sequence: A->B, C->D, A->B, D->E, E->F, M->N, Y->Z."
  },
  {
    id: 3,
    subject: "Police Administration & Security",
    question: "Who is the highest-ranking executive police officer in an Indian State Police Force?",
    options: [
      "A. Superintendent of Police (SP)",
      "B. Director General of Police (DGP)",
      "C. Inspector General of Police (IGP)",
      "D. Deputy Commissioner of Police (DCP)"
    ],
    correctOption: 1,
    explanation: "The Director General of Police (DGP) is a three-star rank officer and the highest-ranking police official in a state."
  },
  {
    id: 4,
    subject: "Physical Efficiency & General Aptitude",
    question: "In the Police Sub-Inspector Physical Efficiency Test (PET), what is the qualifying standard time for the 1500m run for male candidates?",
    options: [
      "A. 4 Minutes 30 Seconds",
      "B. 5 Minutes 00 Seconds",
      "C. 7 Minutes 00 Seconds",
      "D. 9 Minutes 30 Seconds"
    ],
    correctOption: 2,
    explanation: "The standard qualifying time for the 1500 meters endurance run in State Police SI recruitment is 7 minutes."
  }
];

const QuestionBank = () => {
  const [activeTab, setActiveTab] = useState('quiz'); // 'quiz' or 'papers'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minute timer
  const [timerRunning, setTimerRunning] = useState(true);

  useEffect(() => {
    let interval = null;
    if (timerRunning && timeLeft > 0 && !quizSubmitted) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !quizSubmitted) {
      setQuizSubmitted(true);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft, quizSubmitted]);

  const handleSelectOption = (qIndex, optionIndex) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [qIndex]: optionIndex
    }));
  };

  const calculateScore = () => {
    let score = 0;
    sampleQuizzes.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctOption) {
        score += 1;
      }
    });
    return score;
  };

  const restartQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setCurrentQuestionIndex(0);
    setTimeLeft(300);
    setTimerRunning(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = sampleQuizzes[currentQuestionIndex];

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Database size={28} color="var(--primary)" />
            Question Bank & Interactive Mock Tests
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            Practice official Police SI & Constable entrance exam questions with instant scoring.
          </p>
        </div>

        {/* View Switcher */}
        <div style={{ display: 'flex', background: 'var(--bg-secondary)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
          <button 
            className="btn" 
            onClick={() => setActiveTab('quiz')}
            style={{
              background: activeTab === 'quiz' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'quiz' ? 'white' : 'var(--text-secondary)',
              border: 'none',
              padding: '8px 16px',
              fontSize: '0.9rem',
              fontWeight: 600
            }}
          >
            Interactive Exam Player
          </button>
          <button 
            className="btn" 
            onClick={() => setActiveTab('papers')}
            style={{
              background: activeTab === 'papers' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'papers' ? 'white' : 'var(--text-secondary)',
              border: 'none',
              padding: '8px 16px',
              fontSize: '0.9rem',
              fontWeight: 600
            }}
          >
            Download PDF Papers
          </button>
        </div>
      </div>

      {activeTab === 'quiz' ? (
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          {/* Header Card with Timer & Score */}
          <div className="glass-card" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px' }}>
            <div>
              <span className="badge badge-paid" style={{ marginBottom: '6px', display: 'inline-block' }}>Live Practice Exam</span>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>SI Police Sub-Inspector Aptitude & IPC Test</h3>
            </div>

            {!quizSubmitted ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(239, 68, 68, 0.1)', padding: '10px 16px', borderRadius: '10px', color: '#ef4444', fontWeight: 700 }}>
                <Clock size={20} />
                <span>Timer: {formatTime(timeLeft)}</span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Final Score</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
                    {calculateScore()} / {sampleQuizzes.length} ({Math.round((calculateScore()/sampleQuizzes.length)*100)}%)
                  </div>
                </div>
                <button className="btn btn-secondary" onClick={restartQuiz} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <RotateCcw size={16} /> Retake
                </button>
              </div>
            )}
          </div>

          {/* Question Card */}
          <div className="glass-card" style={{ padding: '32px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
              <span>Question {currentQuestionIndex + 1} of {sampleQuizzes.length}</span>
              <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{currentQ.subject}</span>
            </div>

            <h3 style={{ fontSize: '1.25rem', lineHeight: 1.5, marginBottom: '24px', color: 'var(--text-primary)' }}>
              {currentQ.question}
            </h3>

            {/* Options List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === oIdx;
                const isCorrect = oIdx === currentQ.correctOption;
                
                let btnStyle = {
                  padding: '16px 20px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-glass)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  textAlign: 'left',
                  fontSize: '1rem',
                  cursor: quizSubmitted ? 'default' : 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.2s ease'
                };

                if (isSelected) {
                  btnStyle.border = '2px solid var(--primary)';
                  btnStyle.background = 'rgba(59, 130, 246, 0.1)';
                }

                if (quizSubmitted) {
                  if (isCorrect) {
                    btnStyle.border = '2px solid #10b981';
                    btnStyle.background = 'rgba(16, 185, 129, 0.15)';
                    btnStyle.color = '#10b981';
                  } else if (isSelected && !isCorrect) {
                    btnStyle.border = '2px solid #ef4444';
                    btnStyle.background = 'rgba(239, 68, 68, 0.15)';
                    btnStyle.color = '#ef4444';
                  }
                }

                return (
                  <button 
                    key={oIdx}
                    style={btnStyle}
                    onClick={() => handleSelectOption(currentQuestionIndex, oIdx)}
                  >
                    <span>{opt}</span>
                    {quizSubmitted && isCorrect && <CheckCircle size={20} color="#10b981" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after submission */}
            {quizSubmitted && (
              <div style={{ background: 'var(--bg-secondary)', padding: '16px 20px', borderRadius: '10px', borderLeft: '4px solid var(--primary)', marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <HelpCircle size={16} color="var(--primary)" /> Answer Explanation
                </h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {currentQ.explanation}
                </p>
              </div>
            )}

            {/* Question Navigation Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-glass)', paddingTop: '20px' }}>
              <button 
                className="btn btn-secondary" 
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
              >
                Previous
              </button>

              <div style={{ display: 'flex', gap: '12px' }}>
                {currentQuestionIndex < sampleQuizzes.length - 1 ? (
                  <button 
                    className="btn btn-primary"
                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                  >
                    Next Question <ArrowRight size={16} />
                  </button>
                ) : (
                  !quizSubmitted && (
                    <button 
                      className="btn btn-primary"
                      style={{ background: '#10b981', borderColor: '#10b981' }}
                      onClick={() => setQuizSubmitted(true)}
                    >
                      Submit Exam
                    </button>
                  )
                )}
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* PDF Papers List */
        <div className="grid-cols-2">
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '8px' }}>State Police SI Prelims Question Paper (2025)</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Official solved exam question paper with detailed answer key for Sub-Inspector recruitment.
            </p>
            <a href="/sample-paper.pdf" target="_blank" download className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <FileText size={18} /> Download Question Paper (PDF)
            </a>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '8px' }}>Constable Recruitment Model Paper (2026)</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Curated by retired ACP faculty focusing on general knowledge and spatial reasoning.
            </p>
            <a href="/sample-paper.pdf" target="_blank" download className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <FileText size={18} /> Download Model Paper (PDF)
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionBank;
