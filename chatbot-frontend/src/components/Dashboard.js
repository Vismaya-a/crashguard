import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';

function Dashboard() {
    const [queries, setQueries] = useState([]);
    const [queryInput, setQueryInput] = useState('');
    const [error, setError] = useState('');
    const [showHistory, setShowHistory] = useState(true);

    useEffect(() => {
        const fetchQueries = async () => {
            try {
                const response = await axios.get('http://localhost:5000/dashboard');
                setQueries(response.data.queries.reverse());
            } catch (error) {
                setError(error.response?.data?.message || 'Error fetching queries');
            }
        };

        fetchQueries();
        const interval = setInterval(fetchQueries, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const handleQuerySubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/dashboard', {
                query: queryInput
            });
            setQueryInput('');
            // Optionally fetch queries again after submitting a new one
            const fetchResponse = await axios.get('http://localhost:5000/dashboard');
            setQueries(fetchResponse.data.queries.reverse());
        } catch (error) {
            setError(error.response?.data?.message || 'Error submitting query');
        }
    };

    const toggleHistory = () => {
        setShowHistory(!showHistory);
    };

    return (
        <div className="container">
            <h2>Dashboard</h2>
            <form onSubmit={handleQuerySubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        className="form-control"
                        value={queryInput}
                        onChange={(e) => setQueryInput(e.target.value)}
                        placeholder="Enter your query"
                    />
                </div>
                <button type="submit" className="btn btn-primary">Submit Query</button>
            </form>
            {error && <p className="error">{error}</p>}
            <div>
                <button onClick={toggleHistory} className="btn btn-secondary">
                    {showHistory ? 'Hide History' : 'Show History'}
                </button>
                {showHistory && (
                    <div className="chat-history">
                        <ul>
                            {queries.map((query, index) => (
                                <li key={index} className="card">
                                    <div className="card-body">
                                        <div className="card-title"><strong>Query:</strong> {query.query}</div>
                                        <div className="card-text"><strong>Response:</strong> {query.response}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
