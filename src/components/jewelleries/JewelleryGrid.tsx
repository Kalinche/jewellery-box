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
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const token = sessionStorage.getItem("token");

        if (!token) {
            toast("No token found");
            setTimeout(() => window.location.replace("/"), 20);
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

                const data: IdentifiableJewellery[] = await response.json();

                const filteredData = data.filter((jewellery: IdentifiableJewellery) => {
                    const name = jewellery.name || '';
                    const serialNumber = jewellery.serialNumber.toString(); // assuming serialNumber is a number
                    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        serialNumber.includes(searchTerm);
                });

                setJewelleries(filteredData);
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message);
                } else {
                    toast.error("An unexpected error occurred.");
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
    }, [searchTerm]);

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

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div>
            <h1>Your Jewelleries</h1>
            <div className="search-bar">
                <input type="text" placeholder="Search by name, serial number or tag..." onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
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
