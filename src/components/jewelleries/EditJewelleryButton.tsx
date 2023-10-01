import React, { useState, useEffect, useRef } from 'react';
import '../styles/PopUp.css';
import JewelleryForm from './JewelleryForm';
import { IdentifiableJewellery, JewelleryDTO } from '../../model/jewellery.model';

interface EditJewelleryButtonProps {
    jewellery: IdentifiableJewellery;
    onClosePopup: () => void;
    onEdit: (editedJewellery: IdentifiableJewellery) => void;
}

const EditJewelleryButton: React.FC<EditJewelleryButtonProps> = ({ jewellery, onClosePopup, onEdit }) => {
    const [showForm, setShowForm] = useState(false);
    const popupRef = useRef<HTMLDivElement | null>(null);

    const handleOpenForm = () => {
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
    };

    const handleEdit = async (editedJewellery: JewelleryDTO) => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            throw Error("No token found");
        }

        try {
            const response = await fetch(`http://localhost:2704/jewelleries/${jewellery._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(editedJewellery),
            });

            if (!response.ok) {
                throw Error(`Failed to edit the jewellery. Please try again later. Status: ${response.statusText}`);
            } else {
                const updatedJewellery = await response.json();
                onEdit(updatedJewellery);
                onClosePopup();
            }
        } catch (error) {
            throw error;
        }
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                handleCloseForm();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [handleCloseForm]);

    return (
        <>
            <button onClick={handleOpenForm}>Edit</button>
            {showForm && (
                <div className="popup-overlay">
                    <div className="popup-content form-card-wrapper" ref={popupRef}>
                        <JewelleryForm
                            initialJewellery={jewellery}
                            onEdit={handleEdit}
                            onCloseForm={handleCloseForm}
                            submitButtonText={'Edit Jewellery'}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default EditJewelleryButton;
