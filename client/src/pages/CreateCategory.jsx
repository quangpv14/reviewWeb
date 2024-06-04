import { Modal, TextInput, Button, Alert } from 'flowbite-react';
import { useState, useEffect } from 'react';

export default function CreateCategory({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        categoryName: '',
        description: '',
        status: 'active', // default status is active
    });
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [createMessageError, setCreateMessageError] = useState(null);

    useEffect(() => {

        setFormData({
            categoryName: '',
            description: '',
            status: 'active',
        });
        setErrorMessage(null);
        setSuccessMessage(null);
        setSuccessMessage(null);

    }, [isOpen]);
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [e.target.id]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);
        setCreateMessageError(null);

        if (!formData.categoryName || !formData.description) {
            setErrorMessage('Please fill out all fields.');
        }

        if (formData.categoryName && formData.description) {
            try {
                const response = await fetch('/api/category/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
                const data = await response.json();
                if (!response.ok) {
                    setCreateMessageError(data.message);
                } else {
                    setSuccessMessage('Category created successfully.');
                }
            } catch (error) {
                console.error(error);
                setCreateMessageError(error.message);
            }
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose} size="md">
            <Modal.Header className='p-4'>Create New Category</Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700" style={{ marginLeft: '9px' }}>
                            Category Name
                        </label>
                        <TextInput
                            type="text"
                            id="categoryName"
                            value={formData.categoryName}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700" style={{ marginLeft: '9px' }}>
                            Description
                        </label>
                        <TextInput
                            type="text"
                            id="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full"
                        />
                    </div>
                    <div className="flex items-center justify-center mt-4 mb-2">
                        <Button type="submit" className="w-[352px]">Create</Button>
                    </div>
                </form>
                {errorMessage && (
                    <Alert color="failure" className="mt-4">
                        {errorMessage}
                    </Alert>
                )}
                {successMessage && (
                    <Alert color="success" className="mt-4">
                        {successMessage}
                    </Alert>
                )}

                {createMessageError && (
                    <Alert color="success" className="mt-4">
                        {createMessageError}
                    </Alert>
                )}

            </Modal.Body>
        </Modal>
    );
}
