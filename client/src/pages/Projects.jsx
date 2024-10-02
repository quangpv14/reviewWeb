import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PostDetail from '../components/PostDetail';
import { Button } from 'flowbite-react';

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [displayedPosts, setDisplayedPosts] = useState([]);

  const [approvedPosts, setApprovedPosts] = useState([]);
  const [displayedApprovedPosts, setDisplayedApprovedPosts] = useState([]);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [displayedPendingPosts, setDisplayedPendingPosts] = useState([]);
  const [rejectedPosts, setRejectedPosts] = useState([]);
  const [displayedRejectedPosts, setDisplayedRejectedPosts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(null);
  const handleChangeDelete = () => {
    setShowModal(true);
  }
  const fetchPosts = async () => {
    setLoading(true);
    const res = await fetch(`/api/post/user/${currentUser._id}`);
    if (!res.ok) {
      setLoading(false);
      return;
    }
    const data = await res.json();

    const approved = data.posts.filter(post => post.status === 'approved');
    const pending = data.posts.filter(post => post.status === 'pending');
    const rejected = data.posts.filter(post => post.status === 'rejected');

    setApprovedPosts(approved);
    setPendingPosts(pending);
    setRejectedPosts(rejected);

    if (approved.length >= 0) {
      setDisplayedApprovedPosts(approved.slice(0, 8));
    }
    if (pending.length >= 0) {
      setDisplayedPendingPosts(pending.slice(0, 8));
    }
    if (rejected.length >= 0) {
      setDisplayedRejectedPosts(rejected.slice(0, 8));
    }

    setLoading(false);
    setShowMore(data.posts.length > 8);
  };

  useEffect(() => {
    if (currentUser && currentUser._id) {
      fetchPosts();
    }
  }, [currentUser]);

  const handleShowMore = (type) => {
    if (type === 'approved') {
      const currentLength = displayedApprovedPosts.length;
      const morePosts = approvedPosts.slice(currentLength, currentLength + 8);
      setDisplayedApprovedPosts([...displayedApprovedPosts, ...morePosts]);
    } else if (type === 'pending') {
      const currentLength = displayedPendingPosts.length;
      const morePosts = pendingPosts.slice(currentLength, currentLength + 8);
      setDisplayedPendingPosts([...displayedPendingPosts, ...morePosts]);
    } else if (type === 'rejected') {
      const currentLength = displayedRejectedPosts.length;
      const morePosts = rejectedPosts.slice(currentLength, currentLength + 8);
      setDisplayedRejectedPosts([...displayedRejectedPosts, ...morePosts]);
    }
  };

  const handleDeletePost = async (post) => {

    try {
      const res = await fetch(
        `/api/post/deletepost/${post._id}/${currentUser._id}`,
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
          fetchPosts();
          setDeleteSuccess(null);
        }, 2000);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => {
    setIsDialogOpen(false);
    fetchPosts();
  }

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between border-b border-gray-500'>
        <h1 className='text-3xl font-semibold p-5'>
          My posts:
        </h1>
        <div className='pr-10 mr-10' color="success">
          {
            currentUser && !currentUser?.isBlock && (
              <>
                <Link
                  to={`/create-new-post`}
                >
                  <Button color="success" size="lg" className='w-100'>
                    New
                  </Button>
                </Link>
              </>
            )
          }
        </div>

      </div>
      <div className=' min-h-screen flex flex-col'>

        {loading && <p className='text-xl text-gray-500'>Loading...</p>}

        {!loading && (
          <>
            <div>
              <h2 className='text-2xl font-semibold p-5'>Rejected Posts:</h2>
              <div className='pl-20'>
                <div className='flex flex-wrap gap-4'>
                  {displayedRejectedPosts.length === 0 && <p className='text-xl text-gray-500'>No rejected posts found.</p>}
                  {displayedRejectedPosts.map((post) => <PostDetail key={post._id} post={post} handleDeletePost={handleDeletePost}
                    showModal={showModal} deleteSuccess={deleteSuccess} handleChangeDelete={handleChangeDelete} setShowModal={setShowModal} setDeleteSuccess={setDeleteSuccess} />)}
                </div>
              </div>
              {displayedRejectedPosts.length < rejectedPosts.length && (
                <button
                  onClick={() => handleShowMore('rejected')}
                  className='text-teal-500 text-lg hover:underline p-7 w-full'
                >
                  Show More
                </button>
              )}
            </div>

            <div>
              <h2 className='text-2xl font-semibold p-5'>Pending Posts:</h2>
              <div className='pl-20'>
                <div className='flex flex-wrap gap-4'>
                  {displayedPendingPosts.length === 0 && <p className='text-xl text-gray-500'>No pending posts found.</p>}
                  {displayedPendingPosts.map((post) => <PostDetail key={post._id} post={post} handleDeletePost={handleDeletePost}
                    showModal={showModal} deleteSuccess={deleteSuccess} handleChangeDelete={handleChangeDelete} setShowModal={setShowModal} setDeleteSuccess={setDeleteSuccess} />)}
                </div>
              </div>
              {displayedPendingPosts.length < pendingPosts.length && (
                <button
                  onClick={() => handleShowMore('pending')}
                  className='text-teal-500 text-lg hover:underline p-7 w-full'
                >
                  Show More
                </button>
              )}
            </div>

            <div>
              <h2 className='text-2xl font-semibold p-5'>Approved Posts:</h2>
              <div className='pl-20 mb-10'>
                <div className='flex flex-wrap gap-4'>
                  {displayedApprovedPosts.length === 0 && <p className='text-xl text-gray-500'>No approved posts found.</p>}
                  {displayedApprovedPosts.map((post) => <PostDetail key={post._id} post={post} handleDeletePost={handleDeletePost}
                    showModal={showModal} deleteSuccess={deleteSuccess} handleChangeDelete={handleChangeDelete} setShowModal={setShowModal} setDeleteSuccess={setDeleteSuccess} />)}
                </div>
              </div>
              {displayedApprovedPosts.length < approvedPosts.length && (
                <button
                  onClick={() => handleShowMore('approved')}
                  className='text-teal-500 text-lg hover:underline p-7 w-full'
                >
                  Show More
                </button>
              )}
            </div>

          </>
        )}

      </div>

    </div>
  );
}
