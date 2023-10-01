import { IdentifiableJewellery } from '../../model/jewellery.model';
import '../styles/Card.css';

const JewelleryCard = ({ jewellery }: { jewellery: IdentifiableJewellery }) => {
    return (
        <div className="card mb-3">
            <div className="card-row">
                <div className="card-body">
                    <h5 className="card-title">{jewellery.name || `Serial Number: ${jewellery.serialNumber}`}</h5>
                    <p className="card-description">{jewellery.description}</p>
                    <div className="card-details-img">
                        <div className="card-image-col">
                            <img
                                src={jewellery.photoUrls?.[0] || 'https://t3.ftcdn.net/jpg/03/80/50/90/360_F_380509039_Sxu7EBlre1HeJGJ02aihDbzWHMlqCoSV.jpg'}
                                alt={jewellery.name || `Serial Number: ${jewellery.serialNumber}`}
                                className="card-image"
                            />
                        </div>
                        <div className="card-content-col">
                            <ul className="card-details">
                                <li className="card-list-item">Type: {jewellery.type}</li>
                                <li className="card-list-item">Collection: {jewellery.collection}</li>
                                <li className="card-list-item">Style: {jewellery.style}</li>
                                <li className="card-list-item">Gender: {jewellery.gender}</li>
                                <li className="card-list-item">Crafting Time: {jewellery.craftingTime} mins</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JewelleryCard;