import { useState, useEffect, useRef } from 'react';
import '../styles/PopUp.css';
import JewelleryForm from './JewelleryForm';
import { JewelleryDTO } from '../../model/jewellery.model';

const AddJewelleryMiniCard = ({ onAdd }: { onAdd: (newJewellery: string) => void }) => {
    const [showForm, setShowForm] = useState(false);
    const popupRef = useRef<HTMLDivElement | null>(null);

    const handleOpenForm = () => {
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
    };

    const handleAdd = async (jewellery: JewelleryDTO) => {
        const token = sessionStorage.getItem("token");

        if (!token) {
            throw Error("No token found");
        }

        try {
            const response = await fetch("http://localhost:2704/jewelleries/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(jewellery),
            });

            if (!response.ok) {
                throw Error(`Failed to add the jewellery. Please try again later. Status: ${response.statusText}`);
            } else {
                const addedJewellery = await response.json();

                onAdd(addedJewellery);
            }
        } catch (error) {
            throw error;
        }
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                handleCloseForm();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [handleCloseForm]);


    return (
        <>
            <div className="mini-card add-card" onClick={handleOpenForm}>
                <button>Add New</button>
            </div>
            {showForm && (
                <div className="popup-overlay">
                    <div className="popup-content form-card-wrapper" ref={popupRef}>
                        <JewelleryForm
                            onAdd={handleAdd}
                            onCloseForm={handleCloseForm}
                            submitButtonText={'Add Jewellery'}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default AddJewelleryMiniCard;
