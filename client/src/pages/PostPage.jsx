import { Button, Spinner, Rating } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';
import { FaEdit } from "react-icons/fa";

export default function PostPage() {
  const { currentUser } = useSelector((state) => state.user);
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  const [tableOfContents, setTableOfContents] = useState([]);
  const approvedPosts = "approved";

  const [userRating, setUserRating] = useState(0);

  const [hasRated, setHasRated] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getpost/info?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);

          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await fetch(`/api/post/getposts?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      };
      fetchRecentPosts();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  useEffect(() => {
    const modifyPostContent = () => {
      let index = 1;
      if (post) {
        const modifiedContent = post.content.replace(/<h[1-3]/g, (match) => {
          const modifiedHeader = `${match} id="header${index}"`;
          index++;
          return modifiedHeader;
        });
        post.content = modifiedContent;

        const headers = post.content.match(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/gi);
        if (headers) {
          const toc = headers.map((header) => {
            const tag = header.substr(1, 2);
            const text = header.replace(/<\/?h[1-3][^>]*>/g, '');
            return { tag, text };
          });
          setTableOfContents(toc);
        } else {
          setTableOfContents([]);
        }
      }
    };

    modifyPostContent();
  }, [post]);

  useEffect(() => {
    // Check if the user has already rated this post: getItem from LocalStorage
    const ratedPosts = JSON.parse(localStorage.getItem('ratedPosts')) || [];
    if (ratedPosts.includes(postSlug)) {
      setHasRated(true);
      setUserRating(ratedPosts.find(post => post.slug === postSlug)?.rating || 0);
    }
  }, [postSlug]);

  const handleRatingChange = async (rating) => {
    if (hasRated) return;

    setUserRating(rating);
    try {
      const res = await fetch(`/api/rating/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUser._id, postId: post._id, rating }),
      });
      if (res.ok) {
        const data = await res.json();

        // Save data LocalStorage
        const ratedPosts = JSON.parse(localStorage.getItem('ratedPosts')) || [];
        ratedPosts.push({ slug: postSlug, rating });
        localStorage.setItem('ratedPosts', JSON.stringify(ratedPosts));
        setHasRated(true);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  if (loading)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    );
  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <div className='flex justify-center items-center'>
        {post && post.status === 'rejected' && (
          <div className='flex justify-center items-center p-1 mx-auto w-full text-center text-2xl'>
            <h1 className='mr-2'>Bài viết đã bị từ chối!</h1>
            <span className='text-red-500'>{""}</span>
            <Link
              to={`/update-post/${post._id}`}
              className='ml-5 flex items-center text-xl border'
            >
              <FaEdit />
              Chỉnh sửa
            </Link>
          </div>
        )}
      </div>
      <h1 className='text-3xl mt-10 p-3 text-center max-w-3xl mx-auto lg:text-4xl'>
        {post && post.title}
      </h1>
      <Link
        to={`/search?category=${post && post.category}`}
        className='self-center mt-1'
      >
        <Button color='gray' pill size='xs'>
          {post && post.category}
        </Button>
      </Link>
      {post && post.status === 'pending' && (
        <h1 className='p-3 max-w-2xl mx-auto w-full text-center text-2xl text-red-500'>
          Bài viết đang chờ phê duyệt!
        </h1>
      )}
      {tableOfContents.length > 0 && (
        <div className='p-3 max-w-2xl mx-auto w-full text-left'>
          <h2 className='text-lg font-semibold mb-2'>Table of Contents</h2>
          <ul className='pl-4'>
            {tableOfContents.map((item, index) => (
              <li key={index} className='mb-1'>
                <a
                  href={`#header${index + 1}`}
                  className='text-blue-500 hover:underline'
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <img
        src={post && post.image}
        alt={post && post.title}
        className='mt-10 p-3 max-h-[600px] w-[500px] object-cover mx-auto'
      />
      <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className='italic'>
          {post && (post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div
        className='p-3 max-w-2xl mx-auto w-full post-content text-left'
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>

      <div className='p-3 max-w-2xl mx-auto w-full text-center justify-center'>
        <h2 className='text-lg font-semibold'>Rating post</h2>
        <Rating size="md" className='justify-center'>
          {[...Array(Math.floor(post.rating))].map((_, index) => (
            <Rating.Star key={index} filled />
          ))}
          {post.rating % 1 >= 0.5 ? <Rating.Star halfFilled /> : null}
          {[...Array(5 - Math.ceil(post.rating))].map((_, index) => (
            <Rating.Star key={index + Math.ceil(post.rating)} filled={false} />
          ))}
          <p className="ml-2 text-md font-medium">
            {post.rating ? post.rating : 0.0}
          </p>
          <p className='text-md font-medium'>/5</p>
        </Rating>
      </div>


      <div className='p-3 max-w-2xl mx-auto w-full text-center flex justify-center'>
        <h2 className='text-lg font-semibold mr-4'>Bài viết có hữu ích không?</h2>
        <Rating size="md">
          {Array.from({ length: 5 }, (_, index) => (
            <Rating.Star
              key={index}
              filled={index < userRating}
              onClick={() => handleRatingChange(index + 1)}
            />
          ))}
        </Rating>
      </div>

      {post.status === approvedPosts && (
        <CommentSection postId={post._id} />

      )}

      <div className='max-w-4xl mx-auto w-full'>
        <CallToAction />
      </div>

      <div className='flex flex-col justify-center items-center mb-5'>
        <h1 className='text-xl mt-5'>Recent articles</h1>
        <div className='flex flex-wrap gap-5 mt-5 justify-center'>
          {recentPosts &&
            recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </main>
  );
}
