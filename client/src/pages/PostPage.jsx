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

  const [topCategory, setTopCategory] = useState([]);
  const [topRatedPosts, setTopRatedPosts] = useState([]);
  const [topPosts, setTopPosts] = useState([]);

  const [suggestPosts, setSuggestPosts] = useState([]);

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
        const res = await fetch(`/api/post/getpost/review/rating/suggest?userId=${currentUser._id}&postSlug=${postSlug}`);
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.recentposts);
          setTopCategory(data.topRatedCategories);
          setTopRatedPosts(data.topRatedPosts);
          setTopPosts(data.topSixPosts);
        }
      };
      fetchRecentPosts();
    } catch (error) {
      console.log(error.message);
    }

  }, []);

  useEffect(() => {
    const checkUserRating = async () => {
      if (currentUser && post) {
        try {
          const res = await fetch(`/api/rating/checkexist?userId=${currentUser._id}&postId=${post._id}`);
          const data = await res.json();
          if (res.ok) {
            setHasRated(data.hasRated);
          }
        } catch (error) {
          console.log(error.message);
        }
      }
    };
    checkUserRating();
    const fetchSuggestPosts = async () => {
      try {
        const res = await fetch(`/api/rating/getposts/suggest/cbnf?userId=${currentUser._id}`);
        const dataNbcf = await res.json();
        if (res.ok) {
          setSuggestPosts(dataNbcf.topThreePosts);
        }
      } catch (error) {
        console.log(error.message);
      }

    };
    fetchSuggestPosts();
  }, [currentUser, post]);

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
    <div className='flex'>
      <div className='w-[130px]'></div>
      <div className='w-[1050px]'>
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
            className='p-2 max-w-2xl mx-auto w-full post-content text-left'
            dangerouslySetInnerHTML={{ __html: post && post.content }}
          ></div>

          <div className="text-center mb-2">
            <h2 className="text-xl font-semibold italic underline">Các bài viết liên quan</h2>
          </div>
          <div className="flex flex-col items-center">
            {topRatedPosts && topRatedPosts.map((item, index) => (
              <Link
                key={index}
                to={`/post/${item && item.slug}`}
                className="mt-2 flex items-center p-2  rounded-lg w-full max-w-md"
              >
                <div className="flex">
                  <span className="mr-2 text-gray-500 font-bold">{index + 1}.</span>
                  <div className="text-gray-700 text-base font-medium italic underline">
                    {item && item.title}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className='p-3 max-w-2xl mx-auto w-full text-center justify-center mb-3'>
            <h2 className='text-lg font-semibold'>Post Rating</h2>
            <div class="flex justify-center">
              <svg class="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
              <p class="ms-2 text-sm text-gray-900 dark:text-white">{post.rating}/5</p>

            </div>
          </div>

          {post.status === "approved" && !hasRated && (
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
          )}
          {post.status === approvedPosts && (
            <CommentSection postId={post._id} />

          )}

          <div className='max-w-4xl mx-auto w-full'>
            <CallToAction />
          </div>

          <div className='flex flex-col justify-center items-center mb-5'>
            <h1 className='text-xl mt-5'>Recent articles</h1>
            <div className='flex flex-wrap  gap-2 mt-5 justify-center'>
              {recentPosts &&
                recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
            </div>
          </div>

          <div className='flex flex-col justify-center items-center mb-5'>
            <h1 className='text-xl mt-5'>Recomend posts</h1>
            <div className='flex flex-wrap  gap-2 mt-5 justify-center'>
              {suggestPosts &&
                suggestPosts.map((post) => <PostCard key={post._id} post={post} />)}
            </div>
          </div>
        </main>
      </div>
      <div className='w-[350px] mt-[200px]'>
        <div className='text-xl mb-3 text-center font-bold'>Xu hướng</div>
        <div className='grid grid-cols-3'>
          {topCategory && topCategory.map((item, index) =>
            <Link
              to={`/search?category=${item && item._id}`}
              className='self-center mt-2 flex items-center justify-center'
            >
              <Button color='gray' pill size='xs'>
                {item && item._id}
              </Button>
            </Link>
          )}
        </div>
        <div className="text-xl mb-3 text-center font-bold mt-[100px]">
          Top các bài viết theo tuần
        </div>
        {topPosts && topPosts.map((item, index) => (
          <Link
            key={index}
            to={`/post/${item && item.slug}`}
            className="self-center mt-4"
          >
            <div className="flex">
              <div className='w-1/10 mb-5'>
                <Link to={`/post/${item && item.slug}`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 object-cover bg-gray-500 rounded-md mr-4"
                  />
                </Link>
              </div>
              <div className="w-3/4 text-gray-700 font-medium italic underline">
                {item && item.title}
                <div class="flex items-center">
                  <svg class="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                  <p class="ms-2 text-sm text-gray-900 dark:text-white">{item.rating.toFixed(2)}/5</p>

                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
