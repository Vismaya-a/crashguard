// import React, { useEffect, useState } from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import Signup from './components/Signup';
// import Login from './components/Login';
// import Logout from './components/Logout';
// import Dashboard from './components/Dashboard';
// import axios from 'axios';

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/check-auth', { withCredentials: true });
//         setIsLoggedIn(response.status === 200);
//       } catch (error) {
//         setIsLoggedIn(false);
//       }
//     };
//     checkAuth();
//   }, []);

//   return (
//     <Router>
//       <div className="container">
//         <Routes>
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/logout" element={<Logout />} />
//           {/* <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} /> */}
//           <Route path="/" element={<Navigate to="/login" />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Input from './components/Input';
import Prediction from './components/Prediction';
import WelcomePage from './components/Welcome';
import GeminiResponsePage from './components/GeminiResponse';

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/input" element={<Input/>} />
          <Route path="/prediction" element={<Prediction/>} />
          <Route path="/response" element={<GeminiResponsePage/>} />
          <Route path="/" element={<WelcomePage/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
