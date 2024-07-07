import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '.style/prediction.css'; // Import the CSS file

const PredictPage = () => {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null); // State to store image preview URL
  const navigate = useNavigate(); // Hook to navigate programmatically

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const file = event.target.elements.fileInput.files[0];

    if (!file) {
      setResult('Please select an image to upload');
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:5000/classify', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error('Error uploading image:', error);
      setResult('An error occurred during upload. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set the image preview URL
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null); // Reset image preview if no file is selected
    }
  };

  const handleNextClick = () => {
    // Navigate to the '/input' route (adjust as per your route configuration)
    navigate('/input');
  };

  return (
    <div className="container">
      <h1>Upload Car Accident Image</h1>
      <p>Please select an image of the car accident to upload:</p>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <div className="input-container">
            <input
              type="file"
              id="fileInput"
              name="file"
              accept="image/*"
              onChange={handleFileChange} // Handle file selection change
            />
            <label htmlFor="fileInput">Choose File</label>
          </div>
          <button type="submit" className="upload-button" disabled={isLoading}>
            {isLoading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </form>
      {imagePreview && (
        <div className="image-preview-container">
          <img src={imagePreview} alt="Preview" className="image-preview" />
        </div>
      )}
      {result && (
        <div className="result">
          <h2>Result</h2>
          <p>{result}</p>
        </div>
      )}
      {/* Next button */}
      <button type="button" className="next-button" onClick={handleNextClick}>
        Next
      </button>
    </div>
  );
};

export default PredictPage;
