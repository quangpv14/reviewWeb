import { Link } from 'react-router-dom';
import { Modal, Button, Alert } from 'flowbite-react';
import { useState } from 'react';
import { FaEdit } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
export default function PostDetail({ post, handleDeletePost, showModal, setShowModal, setDeleteSuccess, deleteSuccess, handleChangeDelete }) {
    const { currentUser } = useSelector((state) => state.user);


    return (
        <div className='group relative w-full border border-teal-500 hover:border-2 h-[280px] overflow-hidden rounded-lg sm:w-[320px] transition-all'>
            <Link to={`/post/${post.slug}`}>
                <img
                    src={post.image}
                    alt='post cover'
                    className='h-[150px] w-full object-cover group-hover:h-0 transition-all duration-300 z-20'
                />
            </Link>
            <div className='p-2 flex flex-col gap-2'>
                <p className='text-lg font-semibold line-clamp-2 mr-10'>{post.title}</p>
                <span className='italic text-sm'>{post.category}</span>
                <div class="flex items-center">
                    <svg class="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                    </svg>
                    <p class="ms-2 text-sm text-gray-900 dark:text-white">{post.rating.toFixed(2)}/5</p>

                </div>
                <Link
                    to={`/post/${post.slug}`}
                    className='z-10 group-hover:bottom-11 absolute bottom-[-400px] left-0 right-0 border border-teal-500 bg-teal-500 text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2'
                >
                    Read article
                </Link>
                <Link
                    onClick={handleChangeDelete}
                    className='z-10 group-hover:bottom-0 absolute bottom-[-400px] left-0 right-0 border border-teal-500 bg-red-500 text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2'
                >
                    Delete article
                </Link>
            </div>
            <div>
                <Link
                    to={`/update-post/${post._id}`}
                    className='absolute bottom-[78px] right-[0rem] p-3 z-30 bg-teal-500 text-black rounded'
                >
                    <FaEdit />
                </Link>
            </div>
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
                            <Button color='failure' onClick={() => handleDeletePost(post)}>
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
