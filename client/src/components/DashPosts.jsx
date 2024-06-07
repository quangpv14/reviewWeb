import { Modal, Table, Button, TextInput, Alert, Dropdown, Radio, Label } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { IoSearchSharp, IoEyeSharp, IoFilter } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { set } from 'mongoose';
import CreatePost from '../pages/CreatePost';

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedValue, setSelectedValue] = useState('pending');
  const [postIdToDelete, setPostIdToDelete] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filters, setFilters] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getallposts`);
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
    };
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(`/api/post/getallposts?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
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
        setUserPosts((prev) =>
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

  const handleFilterChange = (e) => {
    setFilters(e.target.value);

  };

  const handleRadioChange = (e) => {
    setSelectedValue(e.target.value);
  };

  const handleFilter = async () => {
    const urlParams = new URLSearchParams();
    urlParams.set('searchtext', filters);
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
      const res = await fetch(`/api/post/getallposts`);
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

    setFilters('');
  }


  const openDialog = () => setIsDialogOpen(true); // Function to open dialog
  const closeDialog = async () => {
    setIsDialogOpen(false);

    try {
      const res = await fetch(`/api/post/getallposts`);
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

  const getCategoryColor = (category) => {
    switch (category) {
      case 'approved':
        return 'green';
      case 'pending':
        return 'orange';
      case 'rejected':
        return 'red';
      default:
        return 'black';
    }
  }


  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      <div>
        <h1 className='text-3xl font-semibold text-center my-7'>
          Management all review posts
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
            <Button className='text-white bg-green-700 mr-5' onClick={openDialog}>
              <FaPlus className="mr-3 h-5 w-5" style={{ fontWeight: 'bold' }} />
              Create post
            </Button>
            <Dropdown label="Filter" size="lg">
              <Dropdown.Header className='w-[120px]'>Status Post</Dropdown.Header>
              <Dropdown.Divider />
              <fieldset className="flex flex-col gap-3 items-center">
                <div className="flex items-center gap-2 mt-3 ml-2">
                  <Radio id="approved" value="approved" name="bordered-radio" checked={selectedValue === 'approved'}
                    onChange={handleRadioChange} />
                  <Label htmlFor="approved">Approved</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Radio id="pending" value="pending" name="bordered-radio" checked={selectedValue === 'pending'}
                    onChange={handleRadioChange} />
                  <Label htmlFor="pending">Pending</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Radio id="rejected" value="rejected" name="bordered-radio" checked={selectedValue === 'rejected'}
                    onChange={handleRadioChange} />
                  <Label htmlFor="rejected">Rejected</Label>
                </div>
                <div className="flex items-center gap-2 mb-3 ml-1 mb-3">
                  <Radio id="rejected" value="" name="bordered-radio" checked={selectedValue === ''}
                    onChange={handleRadioChange} />
                  <Label>All posts</Label>
                </div>
              </fieldset>
            </Dropdown>
          </div>
          <CreatePost isOpen={isDialogOpen} onClose={closeDialog} />
        </div>
      </div>

      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className='shadow-md w-[1200px]'>
            <Table.Head>
              <Table.HeadCell>Date Submitted</Table.HeadCell>
              <Table.HeadCell>Author</Table.HeadCell>
              {/* <Table.HeadCell>Post image</Table.HeadCell> */}
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
              <Table.HeadCell> </Table.HeadCell>
            </Table.Head>
            {userPosts.map((post, index) => (
              <Table.Body className='divide-y'>
                <Table.Row
                  key={post._id}
                  className={index % 2 === 0 ? 'bg-white dark:border-gray-700 dark:bg-gray-800' : 'bg-gray-100 dark:border-gray-700 dark:bg-gray-900'}
                >
                  <Table.Cell className='w-[150px] ml-1'>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell className='w-[250px]'>
                    {post.userId && post.userId.fullname}
                  </Table.Cell>

                  {/* <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className='w-20 h-10 object-cover bg-gray-500'
                      />
                    </Link>
                  </Table.Cell> */}
                  <Table.Cell>
                    {post.status === 'pending' ? (
                      <Link
                        className='font-medium text-gray-900 dark:text-white'
                        to={`/approvedpost/${post.slug}`}
                      >
                        <span>{post.title}</span>
                      </Link>
                    ) : (
                      <Link
                        className='font-medium text-gray-900 dark:text-white'
                        to={`/post/${post.slug}`}
                      >
                        <span>{post.title}</span>
                      </Link>
                    )}
                  </Table.Cell>
                  <Table.Cell>{post.category.charAt(0).toUpperCase() + post.category.slice(1)}</Table.Cell>
                  <Table.Cell style={{ color: getCategoryColor(post.status) }}>{post.status.charAt(0).toUpperCase() + post.status.slice(1)}</Table.Cell>
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
                    {post.status === 'pending' ? (
                      <Link
                        className='text-teal-500 hover:underline'
                        to={`/approvedpost/${post.slug}`}
                      >
                        <span>Edit</span>
                      </Link>
                    ) : (
                      <Link
                        className='text-teal-500 hover:underline'
                        to={`/post/${post.slug}`}
                      >
                        <span>Edit</span>
                      </Link>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className='text-teal-500 hover:underline'
                      to={`/post/${post.slug}`}

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
        <h1 className='text-center'>You have no posts yet!</h1>
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
    </div>
  );
}
