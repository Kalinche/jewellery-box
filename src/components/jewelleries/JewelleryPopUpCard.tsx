import { IdentifiableJewellery } from '../../model/jewellery.model';
import JewelleryCard from './JewelleryCard';
import '../styles/PopUp.css';
import { useEffect, useRef } from 'react';

const JewelleryPopupCard = ({ jewellery, onClosePopup }: { jewellery: IdentifiableJewellery, onClosePopup: () => void }) => {
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
                <button onClick={onClosePopup}>Close</button>
            </div>
        </div>
    );
};

export default JewelleryPopupCard;
