import { useState, useEffect } from 'react';
import { IdentifiableJewellery } from '../../model/jewellery.model';
import { toast } from 'react-toastify';
import JewelleryMiniCard from './JewelleryMiniCard';
import JewelleryPopupCard from './JewelleryPopUpCard';
import '../styles/Grid.css'
import AddJewelleryMiniCard from './AddJewelleryMiniCard';

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

    const handleEdit = (editedJewellery: IdentifiableJewellery) => {
        try {
            const indexToUpdate = jewelleries.findIndex(jewellery => jewellery._id === editedJewellery._id);

            if (indexToUpdate !== -1) {
                const updatedJewelleries = [...jewelleries];
                updatedJewelleries[indexToUpdate] = editedJewellery;
                setJewelleries(updatedJewelleries);
            } else {
                console.error("Could not find jewellery item with the specified ID");
            }
        } catch (error) {
            toast.error("Error editing jewellery:" + error);
        }
    };


    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div>
            <h1>Your Jewelleries</h1>
            <div className="search-bar">
                <input type="text" placeholder="Search by name, serial number or tag..." onChange={handleSearchChange} />
            </div>
            <div className="grid">
                {jewelleries && jewelleries.map(jewellery => (
                    <JewelleryMiniCard key={jewellery._id} jewellery={jewellery} onOpenPopup={handleOpenPopup} />
                ))}
                <AddJewelleryMiniCard onAdd={handleAdd} />
            </div>
            {selectedJewellery && (
                <JewelleryPopupCard jewellery={selectedJewellery} onClosePopup={handleClosePopup} onDelete={handleDelete} onEdit={handleEdit} />
            )}
        </div>
    );
};

export default JewelleryGrid;
