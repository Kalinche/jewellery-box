import { useState, useEffect } from 'react';
import { User } from '../model/user.model';

function ProfileView() {
    const [userData, setUserData] = useState<User | null>(null);
    const [loading, setLoading] = useState<Boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        const userId = sessionStorage.getItem("userId");

        if (!token) {
            setError("No token found");
            return;
        }

        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:2704/users/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': token
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.status);
                }

                const data = await response.json();
                setUserData(data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("An unexpected error occurred.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            {userData ? (
                <>
                    <h1>{userData.username}'s Profile</h1>
                </>
            ) : (
                <p>User data not available</p>
            )}
        </div>
    );

}

export default ProfileView;
