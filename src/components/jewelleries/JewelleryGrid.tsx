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
            window.location.replace("/");
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
                    throw Error('Network response was not ok: ' + response.status)
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
                if (error != null) {
                    toast.error(error);
                    setTimeout(() => window.location.replace("/"), 20);
                }
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

    const handleDelete = async (id: string) => {
        try {
            setJewelleries(jewelleries.filter(jewellery => jewellery._id !== id));
        } catch (error) {
            console.error("Error deleting jewellery:", error);
        }
    };

    const handleAdd = async (newJewelleryId: string) => {
        try {
            const token = sessionStorage.getItem("token");

            if (!token) {
                toast.error("No token found");
                return;
            }

            const response = await fetch(`http://localhost:2704/jewelleries/${newJewelleryId}`, {
                method: "GET",
                headers: {
                    'Authorization': 'Bearer ' + token
                },
            });

            if (!response.ok) {
                toast.error(`Failed to fetch the new jewellery. Status: ${response.statusText}`);
                return;
            }

            const newJewellery = await response.json();

            setJewelleries([...jewelleries, newJewellery]);
        } catch (error) {
            console.error("Error adding jewellery:", error);
        }
    };

    return (
        <div>
            <h1>Your Jewelleries</h1>
            <div className="grid">
                {jewelleries && jewelleries.map(jewellery => (
                    <JewelleryMiniCard key={jewellery._id} jewellery={jewellery} onOpenPopup={handleOpenPopup} />
                ))}
                <AddNewJewelleryCard onAdd={handleAdd} />
            </div>
            {selectedJewellery && (
                <JewelleryPopupCard jewellery={selectedJewellery} onClosePopup={handleClosePopup} onDelete={handleDelete} />
            )}
        </div>
    );
};

export default JewelleryGrid;
