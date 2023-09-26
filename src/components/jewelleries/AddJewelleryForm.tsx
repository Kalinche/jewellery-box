import React, { useState } from "react";
import "../styles/Form.css";
import { useNavigate } from 'react-router-dom';
import { Currency, JewelleryDTO, JewelleryType, validateRequiredFields } from "../../model/jewellery.model";
import { toast } from 'react-toastify';

const AddJewellery = ({ onCloseForm }: { onCloseForm: () => void }) => {
    const initialJewelleryState = new JewelleryDTO({
        name: "",
        type: JewelleryType.BRACELET,
        collection: "",
        material: "",
        description: "",
        price: 0,
        currency: Currency.BGN,
        imageUrl: ""
    });

    const [jewellery, setJewellery] = useState<JewelleryDTO>(initialJewelleryState);
    const [errors, setErrors] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setJewellery((prevJewellery: JewelleryDTO) => ({ ...prevJewellery, [name]: value }));
        setErrors([]);  // clear previous errors on input change
    };

    const navigate = useNavigate();

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsSubmitting(true);

        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        const token = sessionStorage.getItem("token");

        if (!token) {
            setErrors(errors => [...errors, "No token found"]);
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
                setTimeout(() => {
                    setIsSubmitting(false);
                }, 2000);

            } else {

                const data = await response.json();
                console.log(data);
                toast.success("Jewellery added successfully!");

                setTimeout(() => {
                    navigate('/jewelleries');
                }, 2000);

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
            <form onSubmit={handleAdd}>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={jewellery.name}
                    onChange={handleChange}
                    required
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

                    <label htmlFor="currency"></label>
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


                <label htmlFor="imageUrl">Image URL:</label>
                <input
                    type="url"
                    id="imageUrl"
                    name="imageUrl"
                    value={jewellery.imageUrl}
                    onChange={handleChange}
                />

                {errors.map((error, index) => (
                    <p key={index} className="error-message">{error}</p>
                ))}
                <input type="submit" value="Add Jewellery" disabled={isSubmitting} />
                <button onClick={onCloseForm}>Cancel</button>
            </form>
        </div>
    );
};

export default AddJewellery;