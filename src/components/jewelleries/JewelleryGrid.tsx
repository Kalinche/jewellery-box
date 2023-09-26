import { useState, useEffect } from 'react';
import { IdentifiableJewellery } from '../../model/jewellery.model';
import { toast } from 'react-toastify';
import JewelleryMiniCard from './JewelleryMiniCard';
import AddNewJewelleryCard from './AddJewelleryCard';
import JewelleryPopupCard from './JewelleryPopUpCard';
import '../styles/Grid.css'

const JewelleryGrid = () => {
    const [selectedJewellery, setSelectedJewellery] = useState<IdentifiableJewellery | null>(null);
    const [jewelleries, setJewelleries] = useState<IdentifiableJewellery[]>([]);
    const [loading, setLoading] = useState<Boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = sessionStorage.getItem("token");

        if (!token) {
            setError("No token found");
            return;
        }

        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:2704/jewelleries`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                });

                if (!response.ok) {
                    toast.error('Network response was not ok: ' + response.status);
                }

                const data = await response.json();
                setJewelleries(data);
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

    const handleOpenPopup = (jewellery: IdentifiableJewellery) => {
        setSelectedJewellery(jewellery);
    };

    const handleClosePopup = () => {
        setSelectedJewellery(null);
    };

    return (
        <div>
            <h1>Your Jewelleries</h1>
            <div className="grid">
                {jewelleries && jewelleries.map(jewellery => (
                    <JewelleryMiniCard key={jewellery._id} jewellery={jewellery} onOpenPopup={handleOpenPopup} />
                ))}
                <AddNewJewelleryCard />
            </div>
            {selectedJewellery && (
                <JewelleryPopupCard jewellery={selectedJewellery} onClosePopup={handleClosePopup} />
            )}
        </div>
    );
};

export default JewelleryGrid;
