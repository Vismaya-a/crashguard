import React from 'react';
import { useNavigate } from 'react-router-dom';
import '..style/welcome.css'; // Import your custom CSS file

function WelcomePage() {
    const navigate = useNavigate();

    const handleStartNowClick = () => {
        navigate('/prediction'); // Navigate to '/inputpage' route
    };

    return (
        <div className="container">
            <div id="h1">CrashGuard</div>
            <div id="h2">Car Damage predictor & legal advisor</div>
            <div className="content">
                <img id="carImage" src='car_white.png' alt="Car Image" />
                <button className="btn-custom d-inline-flex align-items-center" type="button" onClick={handleStartNowClick}>
                    START NOW
                    <svg className="bi ms-1" width="20" height="20">
                        <use xlinkHref="#arrow-right-short"></use>
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default WelcomePage;
