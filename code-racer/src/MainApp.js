// src/App.js

import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { java } from '@codemirror/lang-java';
import { xcodeDark } from '@uiw/codemirror-theme-xcode';


import './MainApp.css';

const App = ({ socket }) => {
  const [userCode, setUserCode] = useState('');
  const [opponentCode, setOpponentCode] = useState('Te');
  const [prompt, setPrompt] = useState('');
  const [username, setUsername] = useState(sessionStorage.getItem('username') || '');

  // Fetch problem from the backend when the component mounts
  useEffect(() => {
    socket.emit('requestProblem', { username }, (problem) => {
      setPrompt(problem.description);
      setUserCode(problem.template);
      console.log('Problem:', problem);
    });

    // Listen for opponent's code updates from the server
    socket.on('receiveCodeUpdate', (data) => {
      setOpponentCode(data.code);
    });

    // On component mount, request the current state of the code for both users
    socket.emit('requestCodeState', { username });
    
    // Receive the initial code state (for spectators or reconnects)
    socket.on('initialCodeState', (data) => {
      setUserCode(data.userCode);
      setOpponentCode(data.opponentCode);
    });

    return () => {
      socket.off('receiveCodeUpdate');
      socket.off('initialCodeState');
    };
  }, [socket, username]);

  // Handle code execution event
  const executeCode = () => {
    socket.emit('executeCode', { language: 'java', code: userCode }, (response) => {
      if (response.success) {
        console.log('Execution Result:', response.result);
      } else {
        console.error('Execution Error:', response.error);
      }
    });
  };

  // Handle the user's code changes, emit the changes to the server
  const handleUserCodeChange = (value) => {
    setUserCode(value);
    socket.emit('codeUpdate', { username, code: value }); // Send username with code
  };

  return (
    <div className="app">
      <div className="header">
        <h1>Code Racer</h1>
        <p className="prompt">{prompt}</p>
      </div>
      <div className="editors">
        {/* User's code editor */}
        <div className="editor-section">
          <CodeMirror className='user-code-mirror'
            value={userCode}
            height='100%'
            onChange={handleUserCodeChange}
            extensions={[java()]}
            theme={xcodeDark}
            spellCheck={false} 
          />
        </div>

        {/* Opponent's code editor (read-only) */}
        <div className="editor-section">
          <CodeMirror className='opponent-code-mirror'
            value={opponentCode}
            height='100%'
            extensions={[java()]}
            theme={xcodeDark}
          />
          <button className="button-64" role="button" onClick={executeCode}>
            <span className="text">Test Code</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
