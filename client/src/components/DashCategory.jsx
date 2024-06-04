import { Modal, Table, Button, TextInput, Alert, Label, Select } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { IoSearchSharp } from 'react-icons/io5';
import { FaPlus } from 'react-icons/fa';
import CreateCategory from '../pages/CreateCategory';

export default function DashCategory() {
    const { currentUser } = useSelector((state) => state.user);
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [categoryIdToDelete, setCategoryIdToDelete] = useState('');
    const [deleteSuccess, setDeleteSuccess] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [filters, setFilters] = useState('');

    const [showEditModal, setShowEditModal] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState(null);
    const [updateCateSuccess, setUpdateCateSuccess] = useState(null);
    const [updateCateError, setUpdateCateError] = useState(null);
    const [formData, setFormData] = useState({
        categoryName: '',
        description: '',
        status: ''
    });

    const fetchCategories = async () => {
        try {
            const res = await fetch(`/api/category/getallcategory`);
            const data = await res.json();
            if (res.ok) {
                setCategories(data.categories);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        if (currentUser?.isAdmin) {
            fetchCategories();
        }
    }, [currentUser]);

    const handleEditModalOpen = (category) => {
        setCategoryToEdit(category);
        setUpdateCateSuccess(null);
        setUpdateCateError(null);
        setFormData({
            categoryName: category.categoryName || '',
            description: category.description || '',
            status: category.status || '',
        });
        setShowEditModal(true);
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [id]: value,
        }));
    };

    const handleEditCategory = async (e) => {
        e.preventDefault();
        setUpdateCateError(null);
        setUpdateCateSuccess(null);
        try {
            dispatch(updateStart());
            const res = await fetch(`/api/category/update/${categoryToEdit._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const dataEdit = await res.json();
            if (!res.ok) {
                setUpdateCateError(dataEdit.message);

            } else {
                setUpdateCateSuccess("This category updated successfully");
            }
        } catch (error) {
            setUpdateCateError(error.message);
        }
    };


    const handleDeleteCategory = async () => {

        try {
            const res = await fetch(
                `/api/category/delete/${categoryIdToDelete}/${currentUser._id}`,
                {
                    method: 'DELETE',
                }
            );
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                setCategories((prev) =>
                    prev.filter((category) => category._id !== categoryIdToDelete)
                );
                setDeleteSuccess("Deleted this items successfully");
                setTimeout(() => {
                    setShowModal(false);
                }, 2000);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleFilterChange = (e) => {
        setFilters(e.target.value);
    };

    const handleFilter = async () => {
        const urlParams = new URLSearchParams();
        urlParams.set('searchtext', filters);
        try {
            const response = await fetch(`/api/category/filtercategory/search?${urlParams}`);
            const dataSearch = await response.json();
            if (response.ok) {
                setCategories(dataSearch);
            } else {
                console.error(dataSearch.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleRefresh = async () => {
        try {
            const res = await fetch(`/api/category/getallcategory`);
            const data = await res.json();
            if (res.ok) {
                setCategories(data.categories);
            }
        } catch (error) {
            console.log(error.message);
        }

        setFilters('');
    };

    const openDialog = () => setIsDialogOpen(true);
    const closeDialog = async () => {
        setIsDialogOpen(false);
        try {
            const res = await fetch(`/api/category/getallcategory`);
            const data = await res.json();
            if (res.ok) {
                setCategories(data.categories);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            <div>
                <h1 className='text-3xl font-semibold text-center my-7'>
                    Categories Management
                </h1>
            </div>

            <div className='w-[1200px]'>
                <div className='flex space-x-4 justify-between mb-5'>
                    <div className='flex space-x-4 justify-between mb-5'>
                        <TextInput type="text" placeholder="Please enter words to search" id="search" onChange={handleFilterChange} value={filters} aria-label="Search" style={{ width: '280px' }} />
                        <Button onClick={handleFilter}>
                            <IoSearchSharp className="mr-3 h-5 w-5" style={{ fontWeight: 'bold' }} />
                            Search
                        </Button>
                        <Button onClick={handleRefresh} className='bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-700'>
                            Refresh
                        </Button>
                    </div>
                    <div>
                        <Button className='text-white bg-green-700' onClick={openDialog}>
                            <FaPlus className="mr-3 h-5 w-5" style={{ fontWeight: 'bold' }} />
                            Create category
                        </Button>
                    </div>
                    <CreateCategory isOpen={isDialogOpen} onClose={closeDialog} />
                </div>
            </div>

            {currentUser.isAdmin && categories.length > 0 ? (
                <>
                    <Table hoverable className='shadow-md w-[1200px]'>
                        <Table.Head>
                            <Table.HeadCell>Category Name</Table.HeadCell>
                            <Table.HeadCell>Description</Table.HeadCell>
                            <Table.HeadCell>Status</Table.HeadCell>
                            <Table.HeadCell>Total Count</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                            <Table.HeadCell>Edit</Table.HeadCell>
                        </Table.Head>
                        {categories.map((category) => (
                            <Table.Body className='divide-y' key={category._id}>
                                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell>{category.categoryName}</Table.Cell>
                                    <Table.Cell>{category.description}</Table.Cell>
                                    <Table.Cell>{category.status.charAt(0).toUpperCase() + category.status.slice(1)}</Table.Cell>
                                    <Table.Cell>{category.totalCount}</Table.Cell>
                                    <Table.Cell>
                                        <span
                                            onClick={() => {
                                                setShowModal(true);
                                                setDeleteSuccess(null);
                                                setCategoryIdToDelete(category._id);
                                            }}
                                            className='font-medium text-red-500 hover:underline cursor-pointer'
                                        >
                                            Delete
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span
                                            onClick={() => { handleEditModalOpen(category) }}
                                            className='text-teal-500 hover:underline cursor-pointer'>
                                            Edit
                                        </span>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                </>
            ) : (
                <h1 className='text-center'>No categories available!</h1>
            )}


            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                popup
                size='md'
            >
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                            Are you sure you want to delete this category?
                        </h3>
                        <div className='flex justify-center gap-4'>
                            <Button color='failure' onClick={handleDeleteCategory}>
                                Yes, I'm sure
                            </Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                    {
                        deleteSuccess && (
                            <Alert color='success' className='mt-5'>
                                {deleteSuccess}
                            </Alert>
                        )
                    }
                </Modal.Body>
            </Modal>

            <Modal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                popup
                size='lg'

            >
                <Modal.Header />
                <Modal.Body>
                    <div>
                        <h1 className='mb-5 text-lg text-center font-bold text-gray-900 dark:text-white'>
                            Edit Category Information
                        </h1>
                        {categoryToEdit && (
                            <form onSubmit={handleEditCategory}>
                                <div className=' justify-center items-center'>
                                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                                        <div className='mb-2 ml-4 gap-6'>
                                            <Label htmlFor="categoryName" value="Category Name" className='mb-3 pb-3' />
                                            <TextInput
                                                type="text"
                                                placeholder="Category Name"
                                                id="categoryName"
                                                value={formData.categoryName}
                                                onChange={handleChange}
                                                aria-label="Category Name"
                                                style={{ width: '250px' }}
                                            />
                                        </div>
                                        <div className='mb-1 ml-[99px]'>
                                            <Label htmlFor="status" value="Status" className='mb-3' />
                                            <Select
                                                id="status"
                                                value={formData.status}
                                                onChange={handleChange}
                                                aria-label="Status"
                                                style={{ width: '100px' }}
                                            >
                                                <option value="">Select Status</option>
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className='mb-1 ml-4'>
                                        <Label htmlFor="description" value="Description" />
                                        <textarea
                                            id="description"
                                            placeholder="Description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            aria-label="Description"
                                            className='w-[400px] h-60 p-2 border border-gray-300 rounded'
                                            style={{ resize: 'none' }}
                                        />

                                    </div>
                                </div>
                                {/* Add input fields for other category information */}
                                <div className='flex justify-center gap-4 mt-4'>
                                    <Button type='submit' color='success'>
                                        Save Changes
                                    </Button>
                                    <Button
                                        type='button'
                                        color='gray'
                                        onClick={() => setShowEditModal(false)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>

                    {updateCateSuccess && (
                        <Alert color='success' className='mt-5'>
                            {updateCateSuccess}
                        </Alert>
                    )}
                    {updateCateError && (
                        <Alert color='failure' className='mt-5'>
                            {updateCateError}
                        </Alert>
                    )}
                    {/* {error && (
                        <Alert color='failure' className='mt-5'>
                            {error}
                        </Alert>
                    )} */}
                </Modal.Body>
            </Modal>

        </div >
    );
}
