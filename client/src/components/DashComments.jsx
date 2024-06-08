import { Modal, Table, Button, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { IoSearchSharp, IoEyeSharp } from "react-icons/io5";
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState('');
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getcomments`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.commentsWithInfo);
          if (data.commentsWithInfo.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(
        `/api/comment/getcomments?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.commentsWithInfo]);
        if (data.commentsWithInfo.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/comment/deleteComment/${commentIdToDelete}`,
        {
          method: 'DELETE',
        }
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
        );
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>

      <div>
        <h1 className='text-3xl font-semibold text-center my-7'>
          Management all comments
        </h1>
      </div>

      <div className='w-full w-[1200px]'>
        <div className='flex space-x-4 justify-between mb-5'>
          <div className='flex space-x-4 justify-between mb-5'>
            <TextInput type="text" placeholder="Filter" id="search" aria-label="Search" style={{ width: '280px' }} />
            <Button>
              <IoSearchSharp className="mr-3 h-5 w-5" style={{ fontWeight: 'bold' }} />
              Search
            </Button>
            <Button className='bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-700'>
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className='shadow-md w-[1200px]'>
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Commenter</Table.HeadCell>
              <Table.HeadCell>Post</Table.HeadCell>
              <Table.HeadCell className='w-[120px] text-center '>Total likes</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {comments.map((comment, index) => (
              <Table.Body className='divide-y' key={comment._id}>
                <Table.Row
                  key={comment._id}
                  className={index % 2 === 0 ? 'bg-white dark:border-gray-700 dark:bg-gray-800' : 'bg-gray-100 dark:border-gray-700 dark:bg-gray-900'}
                >
                  <Table.Cell>
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell className='w-[360px]'>{comment.content}</Table.Cell>
                  <Table.Cell>{comment.user && comment.user.fullname}</Table.Cell>
                  <Table.Cell className='w-[250px]'>
                    <Link
                      className='font-medium text-gray-900 dark:text-white'
                      to={`/post/${comment.post.slug}`}
                    >
                      {comment.post && comment.post.title}
                    </Link>

                  </Table.Cell>
                  <Table.Cell className='text-center w-[120px]'>{comment.numberOfLikes}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setCommentIdToDelete(comment._id);
                      }}
                      className='font-medium text-red-500 hover:underline cursor-pointer'
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {
            showMore && (
              <button
                onClick={handleShowMore}
                className='w-full text-teal-500 self-center text-sm py-7'
              >
                Show more
              </button>
            )
          }
        </>
      ) : (
        <p>You have no comments yet!</p>
      )
      }
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
              Are you sure you want to delete this comment?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteComment}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div >
  );
}
