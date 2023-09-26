import { useState } from 'react';
import AddJewelleryForm from './AddJewelleryForm';
import '../styles/MiniCard.css'

const AddNewJewelleryCard = () => {
    const [showForm, setShowForm] = useState(false);

    const handleOpenForm = () => {
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
    };

    return (
        <div className="mini-card add-card">
            <button onClick={handleOpenForm}>Add New</button>

            {showForm && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <AddJewelleryForm onCloseForm={handleCloseForm} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddNewJewelleryCard;
