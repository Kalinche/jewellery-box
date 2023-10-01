import { IdentifiableJewellery } from '../../model/jewellery.model';
import '../styles/MiniCard.css'

const JewelleryMiniCard = ({ jewellery, onOpenPopup }: { jewellery: IdentifiableJewellery, onOpenPopup: (jewellery: IdentifiableJewellery) => void }) => {

    const jewelleryName = jewellery.name || `Serial Number: ${jewellery.serialNumber}`

    return (
        <div className="mini-card" onClick={() => onOpenPopup(jewellery)}>
            <img src={jewellery.photoUrls?.[0] || `https://t3.ftcdn.net/jpg/03/80/50/90/360_F_380509039_Sxu7EBlre1HeJGJ02aihDbzWHMlqCoSV.jpg`} alt={jewelleryName} />
            <div className="mini-card-content">
                <span className="mini-card-title">{jewelleryName}</span>
            </div>
        </div>
    );
};

export default JewelleryMiniCard;
