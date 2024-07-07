import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '..style/GeminiResponse.css'; // Create a CSS file for styling

function GeminiResponsePage() {
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGeminiResponse = async () => {
      try {
        const res = await axios.get('/get_gemini_response');
        const { response } = res.data;

        setResponse(response);
        setLoading(false);
        console.log(response)
      } catch (err) {
        setError(err.response ? err.response.data.error : 'Error fetching Gemini response.');
        setLoading(false);
      }
    };

    fetchGeminiResponse();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="gemini-response-container">
      <h1>Gemini API Response</h1>
      <div className="gemini-response">
        <h2>Response:</h2>
        <p>{response}</p>
      </div>
    </div>
  );
}

export default GeminiResponsePage;
