import { useState } from "react";
import { toast } from "react-toastify";

const DeleteJewelleryButton = ({ jewelleryId, onClosePopup, onDelete }: { jewelleryId: string, onClosePopup: () => void, onDelete: (id: string) => void }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const deleteJewellery = async () => {
        setIsSubmitting(true);

        const token = sessionStorage.getItem("token");
        console.log(token);

        if (!token) {
            toast.error("No token found");
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:2704/jewelleries/${jewelleryId}`, {
                method: "DELETE",
                headers: {
                    'Authorization': 'Bearer ' + token
                },
            });

            if (!response.ok) {
                toast.error(`Failed to delete jewellery with ID ${jewelleryId}. Status: ${response.statusText}`);
                setIsSubmitting(false);
                return;
            }

            console.log(`Jewellery with ID ${jewelleryId} deleted successfully`);
            onDelete(jewelleryId);
            onClosePopup();
        } catch (error) {
            toast.error(`Error deleting jewellery with ID ${jewelleryId}: ${error}`);
        }

        setIsSubmitting(false);
    };

    return (
        <button onClick={deleteJewellery} disabled={isSubmitting}>Delete</button>
    );
};

export default DeleteJewelleryButton;