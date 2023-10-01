import { IdentifiableJewellery } from '../../model/jewellery.model';
import JewelleryCard from './JewelleryCard';
import '../styles/PopUp.css';
import { useEffect, useRef } from 'react';
import DeleteJewelleryButton from './DeleteJewelleryButton';
import EditJewelleryButton from './EditJewelleryButton';

const JewelleryPopupCard = ({ jewellery, onClosePopup, onDelete, onEdit }: { jewellery: IdentifiableJewellery, onClosePopup: () => void, onDelete: (id: string) => void, onEdit: (jewellery: IdentifiableJewellery) => void }) => {
    const popupRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onClosePopup();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClosePopup]);

    return (
        <div className="popup-overlay">
            <div className="popup-content" ref={popupRef}>
                <JewelleryCard jewellery={jewellery} />
                <div className="popup-buttons">
                    <button onClick={onClosePopup}>Close</button>
                    <DeleteJewelleryButton jewelleryId={jewellery._id} onClosePopup={onClosePopup} onDelete={onDelete} />
                    <EditJewelleryButton jewellery={jewellery} onClosePopup={onClosePopup} onEdit={onEdit} />
                </div>
            </div>
        </div>
    );
};

export default JewelleryPopupCard;
