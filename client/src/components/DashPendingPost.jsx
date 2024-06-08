import { Modal, Table, Button, TextInput, Alert } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { IoSearchSharp } from "react-icons/io5";
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashPendingPosts() {
    const { currentUser } = useSelector((state) => state.user);
    const [approvedPosts, setApprovedPosts] = useState([]);
    const [postStatus, setPostStatus] = useState('pending');
    const [showModal, setShowModal] = useState(false);
    const [showMore, setShowMore] = useState(true);
    const [postIdToDelete, setPostIdToDelete] = useState('');
    const [filters, setFilters] = useState('');
    const [deleteSuccess, setDeleteSuccess] = useState(null);


    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(`/api/post/getpostsbystatus?status=${postStatus}`);
                const data = await res.json();
                if (res.ok) {
                    const approvedPosts = data.posts;
                    setApprovedPosts(approvedPosts);
                    if (approvedPosts.length < 9) {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        if (currentUser.isAdmin) {
            fetchPosts();
        }
    }, [currentUser._id]);

    const handleShowMore = async () => {
        const startIndex = approvedPosts.length;
        try {
            const res = await fetch(`/api/post/getpostsbystatus?startIndex=${startIndex}`);
            const data = await res.json();
            if (res.ok) {
                const approvedPosts = data.posts;
                setApprovedPosts((prev) => [...prev, ...approvedPosts]);
                if (approvedPosts.length < 9) {
                    setShowMore(false);
                }
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
        urlParams.set('status', postStatus);
        try {
            const response = await fetch(`/api/post/filterpostsbystatus/search?${urlParams}`);
            const dataSearch = await response.json();
            if (response.ok) {
                setApprovedPosts(dataSearch);
                setShowMore(false);
            } else {
                console.error(dataSearch.message);
            }
        } catch (error) {
            console.log(error);
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
                setApprovedPosts((prev) =>
                    prev.filter((post) => post._id !== postIdToDelete)
                );
                setDeleteSuccess("Deleted this posts successfully");

                setTimeout(() => {
                    setShowModal(false);
                }, 2000);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleRefresh = async () => {
        try {
            const res = await fetch(`/api/post/getpostsbystatus?status=${postStatus}`);
            const data = await res.json();
            if (res.ok) {
                const approvedPosts = data.posts;
                setApprovedPosts(approvedPosts);
                if (approvedPosts.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }

        setFilters('');
    }

    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            <div>
                <h1 className='text-3xl font-semibold text-center my-7'>
                    Management of pending posts
                </h1>
            </div>

            <div className='w-[1100px]'>
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
                </div>
            </div>

            {
                approvedPosts.length > 0 ? (
                    <>
                        <Table hoverable className='shadow-md w-[1100px]'>
                            <Table.Head>
                                <Table.HeadCell>Post title</Table.HeadCell>
                                <Table.HeadCell className='w-[250px]'>Author</Table.HeadCell>
                                <Table.HeadCell className='text-center'>Date Created</Table.HeadCell>

                                <Table.HeadCell>Category</Table.HeadCell>
                                <Table.HeadCell>Status</Table.HeadCell>
                                <Table.HeadCell>Delete</Table.HeadCell>
                                <Table.HeadCell>Edit</Table.HeadCell>
                            </Table.Head>
                            {approvedPosts.map((post, index) => (
                                <Table.Body className='divide-y'>
                                    <Table.Row
                                        key={post._id}
                                        className={index % 2 === 0 ? 'bg-white dark:border-gray-700 dark:bg-gray-800' : 'bg-gray-100 dark:border-gray-700 dark:bg-gray-900'}
                                    >
                                        <Table.Cell className='w-[400px]'>
                                            <Link
                                                className='font-medium text-gray-900 dark:text-white'
                                                to={`/approvedpost/${post.slug}`}
                                            >
                                                {post.title}
                                            </Link>
                                        </Table.Cell>
                                        <Table.Cell className='w-max-[300px]'>
                                            {post.userId && post.userId.fullname}
                                        </Table.Cell>
                                        <Table.Cell className='w-[140px] text-center'>
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </Table.Cell>

                                        <Table.Cell>{post.category.charAt(0).toUpperCase() + post.category.slice(1)}</Table.Cell>
                                        <Table.Cell style={{ color: 'orange' }}>{post.status.charAt(0).toUpperCase() + post.status.slice(1)}</Table.Cell>
                                        <Table.Cell>
                                            <span
                                                onClick={() => {
                                                    setShowModal(true);
                                                    setPostIdToDelete(post._id);
                                                }}
                                                className='font-medium text-red-500 hover:underline cursor-pointer'
                                            >
                                                Delete
                                            </span>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Link
                                                className='text-teal-500 hover:underline'
                                                to={`/approvedpost/${post.slug}`}
                                            >
                                                <span>Edit</span>
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
                    <h1 className='text-center'>There are no pending posts yet!</h1>
                )
            }
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
                            Are you sure you want to delete this post?
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
        </div >
    );
}
