import React from "react";
import { useNavigate } from "react-router-dom";

const Logout: React.FC = () => {
    const navigate = useNavigate();

    React.useEffect(() => {
        sessionStorage.clear();
        console.log("Removed token to user: ", sessionStorage.getItem('token'));
        navigate("/");
    }, [navigate]);

    return (
        <div>
            <p>Logging out...</p>
        </div>
    );
};

export default Logout;
