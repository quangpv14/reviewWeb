import { Modal, Table, Button, TextInput, Alert, Dropdown, Radio, Label } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { IoSearchSharp, IoEyeSharp, IoFilter } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";

export default function DashAllProducts() {
    const { currentUser } = useSelector((state) => state.user);
    const [products, setProducts] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');
    const [postIdToDelete, setPostIdToDelete] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [filters, setFilters] = useState('');
    const [deleteSuccess, setDeleteSuccess] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`/api/product/getallproducts`);
                const data = await res.json();
                if (res.ok) {
                    setProducts(data.products);

                    if (data.products.length < 9) {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        if (currentUser.isAdmin) {
            fetchProducts();
        }
    }, [currentUser._id]);

    const handleShowMore = async () => {
        const startIndex = products.length;
        try {
            const res = await fetch(`/api/product/getallproducts?startIndex=${startIndex}`);
            const data = await res.json();
            if (res.ok) {
                setProducts((prev) => [...prev, ...data.products]);
                if (data.products.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleDeletePost = async () => {

        try {
            const res = await fetch(
                `/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
                {
                    method: 'DELETE',
                }
            );
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                setDeleteSuccess("Deleted this posts successfully");

                setTimeout(() => {
                    setShowModal(false);
                    setUserPosts((prev) =>
                        prev.filter((post) => post._id !== postIdToDelete)
                    );
                    setDeleteSuccess(null);
                }, 2000);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleFilterChange = (e) => {
        setFilters(e.target.value);

    };

    const handleRadioChange = async (e) => {
        setSelectedValue(e.target.value);
        try {
            const res = await fetch(`/api/post/getpost/all/filters?status=${e.target.value}`);
            const data = await res.json();
            if (res.ok) {
                setShowMore(false);
                setUserPosts(data.posts);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleFilter = async () => {
        const urlParams = new URLSearchParams();
        urlParams.set('searchtext', filters);
        if (!filters) return;
        try {
            const response = await fetch(`/api/post/filterposts/search?${urlParams}`);
            const dataSearch = await response.json();
            if (response.ok) {
                setUserPosts(dataSearch);
                setShowMore(false);
            } else {
                console.error(dataSearch.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleRefresh = async () => {
        try {
            let start = 0;
            const res = await fetch(`/api/products/getallproducts`);
            const data = await res.json();
            if (res.ok) {
                setUserPosts((prev) => [...prev, ...data.products]);
                if (data.products.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
        setSelectedValue('');
        setFilters('');
    }


    const openDialog = () => setIsDialogOpen(true); // Function to open dialog
    const closeDialog = async () => {
        setIsDialogOpen(false);

        try {
            const res = await fetch(`/api/products/getallproducts`);
            const data = await res.json();
            if (res.ok) {
                setUserPosts(data.posts);
                if (data.posts.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    }


    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            <div>
                <h1 className='text-3xl font-semibold text-center my-7'>
                    Management All Products
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
                    <div className='flex h-[43px]'>
                        <Button className='text-white bg-green-700 mr-5' >
                            <FaPlus className="mr-3 h-5 w-5" style={{ fontWeight: 'bold' }} />
                            Create product
                        </Button>
                    </div>
                </div>
            </div>

            {currentUser.isAdmin && products.length > 0 ? (
                <>
                    <Table hoverable className='shadow-md w-[1200px]'>
                        <Table.Head>
                            <Table.HeadCell>Date Created</Table.HeadCell>
                            <Table.HeadCell>Product title</Table.HeadCell>
                            <Table.HeadCell>Image</Table.HeadCell>
                            <Table.HeadCell>Announced</Table.HeadCell>
                            <Table.HeadCell>Category</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                            <Table.HeadCell>
                                <span>Edit</span>
                            </Table.HeadCell>
                            <Table.HeadCell> </Table.HeadCell>
                        </Table.Head>
                        {products.map((product, index) => (
                            <Table.Body className='divide-y'>
                                <Table.Row
                                    key={product._id}
                                    className={index % 2 === 0 ? 'bg-white dark:border-gray-700 dark:bg-gray-800' : 'bg-gray-100 dark:border-gray-700 dark:bg-gray-900'}
                                >
                                    <Table.Cell className='w-[150px] ml-1'>
                                        {new Date(product.updatedAt).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell className='w-[300px]'>
                                        {product.category.charAt(0).toUpperCase() + product.category.slice(1)} {product.title}
                                    </Table.Cell>
                                    <Table.Cell className='w-[60px] h-[60px]'>
                                        <img src={product.image}></img>
                                    </Table.Cell>
                                    <Table.Cell className='w-[200px]'>
                                        {product.announced}
                                    </Table.Cell>

                                    <Table.Cell>{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</Table.Cell>
                                    <Table.Cell>
                                        <span
                                            onClick={() => {
                                                setShowModal(true);
                                                setPostIdToDelete(product._id);
                                            }}
                                            className='font-medium text-red-500 hover:underline cursor-pointer'
                                        >
                                            Delete
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link
                                            className='text-teal-500 hover:underline'
                                        >
                                            <span>Edit</span>
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link
                                            className='text-teal-500 hover:underline'
                                            to={`/product/${product._id}`}
                                        >
                                            <IoEyeSharp className="mr-3 h-5 w-5" style={{ fontWeight: 'bold' }} />
                                        </Link>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                    {showMore && (
                        <button
                            onClick={handleShowMore}
                            className='w-full text-teal-500 self-center text-sm py-7'
                        >
                            Show more
                        </button>
                    )}
                </>
            ) : (
                <h1 className='text-center'>You have no products yet!</h1>
            )}
            <Modal
                show={showModal}
                onClose={() => {
                    setShowModal(false);
                    setDeleteSuccess(null);
                }
                }
                popup
                size='md'
            >
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                            Are you sure you want to delete this products?
                        </h3>
                        <div className='flex justify-center gap-4'>
                            <Button color='failure' onClick={handleDeletePost}>
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
        </div>
    );
}
