import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PostCard from '../components/PostCard';
import CreatePost from '../pages/CreatePost';
import { Button } from 'flowbite-react';

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser._id) {
      const fetchPosts = async () => {
        setLoading(true);
        const res = await fetch(`/api/post/user/${currentUser._id}`);
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const data = await res.json();
        setPosts(data.posts);
        if (data.posts.length > 0) {
          setDisplayedPosts(data.posts.slice(0, 9));
        }
        setLoading(false);
        setShowMore(data.posts.length > 9);
      };
      fetchPosts();
    }
  }, [currentUser]);

  const handleShowMore = () => {
    const currentLength = displayedPosts.length;
    const morePosts = posts.slice(currentLength, currentLength + 9);
    setDisplayedPosts([...displayedPosts, ...morePosts]);
    setShowMore(currentLength + 9 < posts.length);
  };

  const openDialog = () => setIsDialogOpen(true); // Function to open dialog
  const closeDialog = () => setIsDialogOpen(false); // Function to close dialog

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between border-b border-gray-500'>
        <h1 className='text-3xl font-semibold p-5'>
          My posts:
        </h1>
        <div className='pr-10 mr-10' color="success">
            {
              currentUser && !currentUser?.isBlock && (
                <Button color="success" size="lg" className='w-100' onClick={openDialog}>
                    New
                </Button>) 
            }
        </div>

      </div>
      <div className=' min-h-screen flex'>
        <div className='p-7 flex flex-wrap gap-4 '>
          {!loading && displayedPosts.length === 0 && (
            <p className='text-xl text-gray-500'>No posts found.</p>
          )}
          {loading && <p className='text-xl text-gray-500'>Loading...</p>}
          {!loading &&
            displayedPosts &&
            displayedPosts.map((post) => <PostCard key={post._id} post={post} />)}
          {showMore && (
            <button
              onClick={handleShowMore}
              className='text-teal-500 text-lg hover:underline p-7 w-full'
            >
              Show More
            </button>
          )}
        </div>
      </div>
      <CreatePost isOpen={isDialogOpen} onClose={closeDialog} />
    </div>
  );
}
