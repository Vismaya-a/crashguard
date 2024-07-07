import React, { useState } from 'react';
import axios from 'axios';
import '..style/input.css';

function Input() {
  const [distance, setDistance] = useState('');
  const [mistake, setMistake] = useState('');
  const [vehicleCategory, setVehicleCategory] = useState('');
  const [hasHighestCategory, setHasHighestCategory] = useState('');
  const [situationalSeverity, setSituationalSeverity] = useState('');
  const [location, setLocation] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let determinedSeverity = 'Unknown';
    const dist = parseFloat(distance);
    const userHasHighestCategory = hasHighestCategory === 'yes';

    if (mistake === 'Invalid choice' || vehicleCategory === 'Invalid choice') {
      determinedSeverity = 'Invalid input provided.';
    } else {
      if (dist > 50) {
        if (mistake === "User's mistake" && vehicleCategory === 'Budget vehicles') {
          determinedSeverity = 'Minor';
        } else if (
          mistake === "Both parties' mistake" &&
          ['Midrange vehicles', 'Expensive vehicles'].includes(vehicleCategory)
        ) {
          determinedSeverity = 'Moderate';
        } else {
          determinedSeverity = 'Severe';
        }
      } else {
        if (mistake === "User's mistake" && vehicleCategory === 'Budget vehicles') {
          determinedSeverity = 'Minor';
        } else if (mistake === "Both parties' mistake") {
          determinedSeverity = 'Moderate';
        } else if (
          mistake === "Other vehicle's mistake" &&
          ['Midrange vehicles', 'Expensive vehicles'].includes(vehicleCategory)
        ) {
          determinedSeverity = 'Moderate';
        } else {
          determinedSeverity = 'Minor to Moderate';
        }
      }

      if (userHasHighestCategory && mistake === "Other vehicle's mistake") {
        determinedSeverity = increaseSeverity(determinedSeverity);
      }
    }

    setSituationalSeverity(determinedSeverity);
    setSubmitted(true);

    // Format the accident report
    const accidentReport = `
      Accident Report
      Distance from hometown: ${distance} kms
      Mistake caused by: ${mistake}
      Category of vehicles involved: ${vehicleCategory}
      Do you have the highest category of vehicle: ${hasHighestCategory === 'yes' ? 'Yes' : 'No'}
      Severity of the accident: ${determinedSeverity}
      Location: ${location}
    `;

    // Send data to backend
    try {
      await axios.post('http://localhost:5000/ask_gemini', {
        accidentReport,
        situationalSeverity :determinedSeverity// Ensure this matches what the backend expects
      });
    } catch (error) {
      console.error('Error sending data to backend:', error);
    }
  };

  const increaseSeverity = (currentSeverity) => {
    if (currentSeverity === 'Minor') return 'Moderate';
    if (currentSeverity === 'Moderate') return 'Moderate to Severe';
    if (currentSeverity === 'Severe') return 'Severe';
    return currentSeverity;
  };

  return (
    <div className="App">
      <h2>Accident Severity Predictor</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>How far did the accident happen from your hometown in kms?</label>
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Whose mistake caused the accident?</label>
          <select value={mistake} onChange={(e) => setMistake(e.target.value)} required>
            <option value="">Select an option</option>
            <option value="User's mistake">User's mistake</option>
            <option value="Both parties' mistake">Both parties' mistake</option>
            <option value="Other vehicle's mistake">Other vehicle's mistake</option>
          </select>
        </div>

        <div className="form-group">
          <label>Which category of vehicles were involved in the accident?</label>
          <select
            value={vehicleCategory}
            onChange={(e) => setVehicleCategory(e.target.value)}
            required
          >
            <option value="">Select an option</option>
            <option value="Budget vehicles">Budget vehicles</option>
            <option value="Midrange vehicles">Midrange vehicles</option>
            <option value="Expensive vehicles">Expensive vehicles</option>
          </select>
        </div>

        <div className="form-group">
          <label>Do you have the highest category of vehicle?</label>
          <select
            value={hasHighestCategory}
            onChange={(e) => setHasHighestCategory(e.target.value)}
            required
          >
            <option value="">Select an option</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        <div className="form-group">
          <label>Location of the user</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn">Submit</button>
      </form>

      {submitted && (
        <div className="result">
          <h3>Accident Report</h3>
          <p>Distance from hometown: {distance} kms</p>
          <p>Mistake caused by: {mistake}</p>
          <p>Category of vehicles involved: {vehicleCategory}</p>
          <p>Do you have the highest category of vehicle: {hasHighestCategory === 'yes' ? 'Yes' : 'No'}</p>
          <p>Location: {location}</p>
          <p>Situational Severity of the accident: {situationalSeverity}</p>
        </div>
      )}
    </div>
  );
}

export default Input;
