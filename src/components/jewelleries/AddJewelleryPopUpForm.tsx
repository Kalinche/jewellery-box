import React, { useState } from "react";
import "../styles/Form.css";
import { useNavigate } from 'react-router-dom';
import { Currency, IdentifiableJewellery, JewelleryDTO, JewelleryType, validateRequiredFields } from "../../model/jewellery.model";
import { toast } from 'react-toastify';

const AddJewellery = ({ onCloseForm, onAdd }: { onCloseForm: () => void, onAdd: (newJewelleryId: string) => void }) => {
    const initialJewelleryState = new JewelleryDTO({
        name: "",
        type: JewelleryType.BRACELET,
        collection: "",
        material: "",
        description: "",
        price: 0,
        currency: Currency.BGN,
        photoUrls: []
    });

    const [jewellery, setJewellery] = useState<JewelleryDTO>(initialJewelleryState);
    const [errors, setErrors] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [photoUrls, setPhotoUrls] = useState<string[]>([]);
    const [newPhotoUrl, setNewPhotoUrl] = useState('');

    const handleAddPhotoUrl = () => {
        setPhotoUrls([...photoUrls, newPhotoUrl]);
        setNewPhotoUrl('');
    };

    const handleRemovePhotoUrl = (index: number) => {
        const newPhotoUrls = [...photoUrls];
        newPhotoUrls.splice(index, 1);
        setPhotoUrls(newPhotoUrls);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setJewellery((prevJewellery: JewelleryDTO) => ({ ...prevJewellery, [name]: value }));
        setErrors([]);
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();

        jewellery.photoUrls = photoUrls;

        setIsSubmitting(true);

        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            setIsSubmitting(false);
            return;
        }

        const token = sessionStorage.getItem("token");

        if (!token) {
            setErrors(errors => [...errors, "No token found"]);
            setIsSubmitting(false);
            return;
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

                toast.error(`Failed to add the jewellery. Please try again later. Status: ${response.statusText}`);
                setIsSubmitting(false);
                setTimeout(() => {
                    setIsSubmitting(false);
                }, 2000);

            } else {

                const addedJewellery = await response.json();
                console.log(addedJewellery);
                toast.success("Jewellery added successfully!");

                onAdd(addedJewellery);
                onCloseForm();
            }
        } catch (error) {
            throw new Error("Error:" + error);
        }
    };

    const validateForm: () => string[] = () => {
        const requiredFieldsErrors = validateRequiredFields(jewellery);

        return requiredFieldsErrors;
    }

    return (
        <div className="form-container">
            <h2 className="form-heading">Add New Jewellery</h2>
            <form className="large-form" onSubmit={handleAdd}>
                <div className="first-column">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={jewellery.name}
                        onChange={handleChange}
                    />

                    <label htmlFor="type">Type:<span className="required-star">*</span></label>
                    <select
                        id="type"
                        name="type"
                        value={jewellery.type}
                        onChange={handleChange}
                        required
                    >
                        {Object.values(JewelleryType).map(type => (
                            <option key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}  {/* Capitalize the first letter */}
                            </option>
                        ))}
                    </select>


                    <label htmlFor="collection">Collection:</label>
                    <input
                        type="text"
                        id="collection"
                        name="collection"
                        value={jewellery.collection}
                        onChange={handleChange}
                    />

                    <label htmlFor="material">Material:</label>
                    <input
                        type="text"
                        id="material"
                        name="material"
                        value={jewellery.material}
                        onChange={handleChange}
                    />
                </div>
                <div className="second-column">
                    <div>
                        <label htmlFor="photoUrl">Photo URL:</label>
                        <input
                            type="text"
                            id="photoUrl"
                            name="photoUrl"
                            value={newPhotoUrl}
                            onChange={e => setNewPhotoUrl(e.target.value)}
                        />
                        <button type="button" onClick={handleAddPhotoUrl}>Add Photo URL</button>
                    </div>

                    <ul className="photo-url-list">
                        {photoUrls.map((url, index) => (
                            <li key={index} className="photo-url-item">
                                <a href={url} target="_blank" rel="noopener noreferrer">
                                    {url.length > 30 ? `${url.substring(0, 30)}...` : url}
                                </a>
                                <button type="button" onClick={() => handleRemovePhotoUrl(index)}>Remove</button>
                            </li>
                        ))}
                    </ul>

                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={jewellery.description}
                        onChange={handleChange}
                    />

                    <div className="price-container">
                        <label htmlFor="price">Price:<span className="required-star">*</span></label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={jewellery.price}
                            onChange={handleChange}
                            required
                        />

                        <select
                            id="currency"
                            name="currency"
                            value={jewellery.currency}
                            onChange={handleChange}>
                            {Object.entries(Currency).map(([key, symbol]) => (
                                <option key={key} value={symbol}>
                                    {symbol}
                                </option>
                            ))}
                        </select>
                    </div>

                    {errors.map((error, index) => (
                        <p key={index} className="error-message">{error}</p>
                    ))}
                    <input type="submit" value="Add Jewellery" disabled={isSubmitting} />
                    <button onClick={onCloseForm}>Cancel</button>
                </div>
            </form>
        </div >
    );
};

export default AddJewellery;