import { useState, useEffect, useRef } from 'react';
import AddJewelleryPopUpForm from './AddJewelleryPopUpForm';
import '../styles/PopUp.css';

const AddNewJewelleryCard = ({ onAdd }: { onAdd: (newJewellery: string) => void }) => {
    const [showForm, setShowForm] = useState(false);
    const popupRef = useRef<HTMLDivElement | null>(null);

    const handleOpenForm = () => {
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
    };

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
                        <AddJewelleryPopUpForm onCloseForm={handleCloseForm} onAdd={onAdd} />
                    </div>
                </div>
            )}
        </>
    );
};

export default AddNewJewelleryCard;
