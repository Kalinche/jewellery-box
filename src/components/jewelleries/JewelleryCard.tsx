import { useState } from 'react';
import { IdentifiableJewellery } from '../../model/jewellery.model';
import '../styles/Card.css';

const JewelleryCard = ({ jewellery }: { jewellery: IdentifiableJewellery }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handlePrevImage = () => {
        setCurrentImageIndex(prevIndex => (prevIndex - 1 + jewellery.photoUrls?.length) % (jewellery.photoUrls?.length || 1));
    };

    const handleNextImage = () => {
        setCurrentImageIndex(prevIndex => (prevIndex + 1) % (jewellery.photoUrls?.length || 1));
    };

    return (
        <div className="card mb-3">
            <div className="card-row">
                <div className="card-body">
                    <h5 className="card-title">{jewellery.name || `Serial Number: ${jewellery.serialNumber}`}</h5>
                    {jewellery.description && <p className="card-description">{jewellery.description}</p>}
                    <div className="card-details-img">
                        <div className="card-image-col">
                            <div className="image-container">
                                <img
                                    src={jewellery.photoUrls?.[currentImageIndex] || 'default_image_url'}
                                    alt={jewellery.name || `Serial Number: ${jewellery.serialNumber}`}
                                    className="card-image"
                                />
                                <div className="buttons-container">
                                    {jewellery.photoUrls && jewellery.photoUrls.length > 1 && (
                                        <>
                                            <button onClick={handlePrevImage}><i>{'<'}</i></button>
                                            <button onClick={handleNextImage}><i>{'>'}</i></button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="card-content-col">
                            <ul className="card-details">
                                {jewellery.type && <li className="card-list-item">Type: {jewellery.type}</li>}
                                {jewellery.collection && <li className="card-list-item">Collection: {jewellery.collection}</li>}
                                {jewellery.style && <li className="card-list-item">Style: {jewellery.style}</li>}
                                {jewellery.gender && <li className="card-list-item">Gender: {jewellery.gender}</li>}
                                {jewellery.craftingTime && <li className="card-list-item">Crafting Time: {jewellery.craftingTime} mins</li>}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JewelleryCard;