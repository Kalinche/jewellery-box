import 'bootstrap/dist/css/bootstrap.min.css';
import { Jewellery } from '../../model/jewellery.model';
import '../styles/JewelleryCard.css';

const JewelleryCard = ({ jewellery }: { jewellery: Jewellery }) => {
    return (
        <div className="card card-style mb-3" style={{ maxWidth: '540px' }}>
            <div className="row g-0">
                <div className="col-md-4">
                    <img
                        src={jewellery.photos?.[0] || 'placeholder-image-url.jpg'}
                        alt={jewellery.name || `Serial Number: ${jewellery.serialNumber}`}
                        className="img-fluid rounded-start img-style"
                    />
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title title-style">{jewellery.name || `Serial Number: ${jewellery.serialNumber}`}</h5>
                        <p className="card-text">{jewellery.description}</p>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item list-item-style">Type: {jewellery.type}</li>
                            <li className="list-group-item list-item-style">Collection: {jewellery.collection}</li>
                            <li className="list-group-item list-item-style">Style: {jewellery.style}</li>
                            <li className="list-group-item list-item-style">Gender: {jewellery.gender}</li>
                            <li className="list-group-item list-item-style">Crafting Time: {jewellery.craftingTime} mins</li>
                            <li className="list-group-item last-list-item-style">Price: {jewellery.price} {jewellery.currency}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JewelleryCard;
