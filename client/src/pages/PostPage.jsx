import { Button, Spinner, Rating } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';
import { FaEdit } from "react-icons/fa";
import { RiPhoneFindLine } from "react-icons/ri";
import { BiCategory } from "react-icons/bi";
import { BsFillChatSquareTextFill } from "react-icons/bs";
import { GoTriangleDown, GoTriangleLeft, GoTriangleRight } from "react-icons/go";
import { MdSmartphone } from "react-icons/md";
import { RiUserStarFill } from "react-icons/ri";

export default function PostPage() {
  const { currentUser } = useSelector((state) => state.user);
  const { postSlug } = useParams();
  const [categories, setCategories] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('');
  const [tableOfContents, setTableOfContents] = useState([]);
  const approvedPosts = "approved";

  const [userRating, setUserRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);

  const [topCategory, setTopCategory] = useState([]);
  const [topRatedPosts, setTopRatedPosts] = useState([]);
  const [topPosts, setTopPosts] = useState([]);

  const [suggestPosts, setSuggestPosts] = useState([]);

  useEffect(() => {
    const fetchCategory = async () => {
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
    fetchCategory();
  }, []);

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
    if (tableOfContents.length > 0) {
      const firstItem = `${1}. ${tableOfContents[0].text}`;
      setSelectedSection(firstItem);
      const firstHeaderElement = document.getElementById('header1');
      if (firstHeaderElement) {
        firstHeaderElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [tableOfContents]);

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

  const scrollComment = () => {
    const firstHeaderElement = document.getElementById('comment-container');
    if (firstHeaderElement) {
      firstHeaderElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    );
  return (
    <div>
      <div className='max-w-7xl mx-auto p-3 flex flex-col gap-8 py-7'>
        <div className='flex'>
          <div className='w-1/4 w-max-full'>
            <div className='text-xl p-1 text-center font-bold bg-gray-400 text-white w-full hover:text-white hover:bg-red-600'>
              <RiPhoneFindLine className='inline mb-1 mr-1 h-4' />Find phone</div>
            <div className='grid grid-cols-3 bg-gray-300 relative text-sm w-full'>
              {categories && categories.map((item, index) =>
                <Link
                  to={`/productbycategory/${item.categoryName}`}
                  className='self-center flex items-center justify-center border-r border-gray'
                >
                  <Button size='xs' gradientDuoTone="cyanToRed"
                    className='uppercase rounded-sm bg-gray-300 hover:bg-red-600 hover:text-white text-current w-full p-1'>
                    {item && item.categoryName}
                  </Button>
                </Link>

              )}
            </div>
            <div className='text-xl p-1 text-center font-bold bg-gray-400 text-white w-full hover:text-white hover:bg-red-600'>
              <button> <BiCategory className='inline mr-2 mb-1' />All brand</button>
            </div>
          </div>

          {1 && (
            <>
              <div className='w-3/4 ml-10 w-[780px] relative'>
                <div className='flex items-center justify-center bg-gray-300'>
                  <img className="h-72 w-[300px]" src={post && post.image} alt="Product Review" />
                </div>
                <div className='absolute top-0 left-0 w-full h-[40px] flex font-medium'>
                  <div className='flex w-full'>
                    <div className='bg-gray-400 bg-opacity-70 w-full'></div>
                  </div>
                </div>
                <div className='absolute bottom-6 left-0 w-full flex mb-10'>
                  <img
                    className='ml-5'
                    src="https://fdn.gsmarena.com/vv/assets12/i/pattern-diag-dark-2.gif"
                    alt="Background pattern"
                  />
                  <div className='text-white text-4xl font-bold' style={{ background: 'rgba(0, 0, 0, 0.5)' }}>
                    {post && post.title} Review
                  </div>
                </div>
                <div className='absolute w-full bottom-0 h-[50px]'>
                  <div className='bg-gray-500 bg-opacity-60 h-full w-full flex'>
                    <div className='w-1/4 flex'>
                      <Rating>
                        {[...Array(5)].map((_, index) => (
                          <Rating.Star key={index} filled={index < post.rating} />
                        ))}
                        <p className="ml-2 text-sm font-medium text-white">
                          {post.rating.toFixed(1)} / 5.0
                        </p>
                      </Rating>
                    </div>
                    <div className='w-3/4 flex text-white text-base'>
                      <button className='hover:bg-red-600 font-semibold w-full h-full'><MdSmartphone className='inline mb-1 mr-1 h-5 w-5' />Devices</button>
                      <button className='hover:bg-red-600 font-semibold w-full h-full'><RiUserStarFill className='inline mb-1 mr-1 h-5 w-5' />USER REVIEW</button>
                      <button className='hover:bg-red-600 font-semibold w-full h-full' onClick={scrollComment}><BsFillChatSquareTextFill className='inline mr-1 mb-1 h-5 w-5' />COMMENTS</button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className='max-w-7xl mx-auto p-3 flex flex-col gap-8 py-7'>
        <div className='flex'>
          <div className='w-1/4 w-max-full'>
            <div className='flex flex-col justify-center items-center mb-5'>
              <h1 className='text-xl font-semibold'>Recent articles</h1>
              <div className='flex flex-wrap  gap-2 mt-5 justify-center'>
                {recentPosts &&
                  recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
              </div>
            </div>

            <div className='flex flex-col justify-center items-center mt-40'>
              <h1 className='text-xl mt-20 font-semibold'>Recomend posts</h1>
              <div className='flex flex-wrap  gap-2 mt-5 justify-center'>
                {suggestPosts &&
                  suggestPosts.map((post) => <PostCard key={post._id} post={post} />)}
              </div>
            </div>
          </div>



          {/* Right content */}
          <div className='w-3/4 ml-10 w-[780px] border-2 border-x-gray-300'>
            <div className='w-[130px]'></div>
            <div>
              <main className='flex flex-col max-w-6xl mx-auto min-h-screen '>
                <div className='flex'>
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
                {/* <h1 className='text-2xl max-w-3xl mx-auto lg:text-3xl font-semibold'>
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
                <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
                  <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
                  <span className='italic'>
                    {post && (post.content.length / 1000).toFixed(0)} mins read
                  </span>
                </div> */}
                {post && post.status === 'pending' && (
                  <h1 className='p-3 max-w-2xl mx-auto w-full text-center text-2xl text-red-500'>
                    Bài viết đang chờ phê duyệt!
                  </h1>
                )}

                {tableOfContents.length > 0 && (
                  <div className="bg-gray-100 p-2">
                    <div className="flex relative w-full text-left py-2">
                      {/* Custom dropdown button */}
                      <div className="border rounded-md w-full font-semibold bg-white relative ml-1">
                        {/* Toggle dropdown button */}
                        <button
                          className="w-full flex items-center text-left focus:outline-none"
                          onClick={() => setDropdownOpen(!dropdownOpen)} // Toggle dropdown
                        >
                          {/* Dynamically show selected section or default text */}
                          <span className='ml-1 mt-1 py-2'>{selectedSection ? selectedSection : 'Select a section...'}</span><GoTriangleDown className='inline w-6 h-6 mt-1 ml-auto' />
                        </button>

                        {/* Dropdown list */}
                        {dropdownOpen && (
                          <ul className="absolute z-10 mt-2 bg-white border border-gray-300 rounded-md shadow-lg w-full">
                            {tableOfContents.map((item, index) => (
                              <li
                                key={index}
                                className="p-2 hover:bg-gray-200 hover:text-red-600 hover:underline cursor-pointer transition-all"
                                onClick={() => {
                                  const headerElement = document.getElementById(`header${index + 1}`);
                                  if (headerElement) {
                                    headerElement.scrollIntoView({ behavior: 'smooth' });
                                  }
                                  // Update selected section and close dropdown
                                  setSelectedSection(`${index + 1}. ${item.text}`);
                                  setDropdownOpen(false);
                                }}
                              >
                                {(index + 1) + ". " + item.text}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <div className='ml-10'>
                        <button
                          className="p-2 text-gray-600 bg-white hover:bg-gray-400 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
                          onClick={() => {
                            const currentIndex = tableOfContents.findIndex(item => `${tableOfContents.indexOf(item) + 1}. ${item.text}` === selectedSection);
                            if (currentIndex > 0) {
                              const newIndex = currentIndex - 1;
                              const headerElement = document.getElementById(`header${newIndex + 1}`);
                              if (headerElement) {
                                headerElement.scrollIntoView({ behavior: 'smooth' });
                              }
                              setSelectedSection(`${newIndex + 1}. ${tableOfContents[newIndex].text}`);
                            }
                          }}
                          disabled={selectedSection.charAt(0) === '1'}
                        >
                          <span className="text-xl"><GoTriangleLeft className='inline w-7 h-7 ml-auto' /></span> {/* Left arrow */}
                        </button>
                      </div>
                      <div className='ml-2'>
                        <button
                          className="p-2 text-gray-600 bg-white hover:bg-gray-400 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
                          onClick={() => {
                            const currentIndex = tableOfContents.findIndex(item => `${tableOfContents.indexOf(item) + 1}. ${item.text}` === selectedSection);
                            if (currentIndex < tableOfContents.length - 1) {
                              const newIndex = currentIndex + 1;
                              const headerElement = document.getElementById(`header${newIndex + 1}`);
                              if (headerElement) {
                                headerElement.scrollIntoView({ behavior: 'smooth' });
                              }
                              setSelectedSection(`${newIndex + 1}. ${tableOfContents[newIndex].text}`);
                            }
                          }}
                          disabled={selectedSection.charAt(0) === (tableOfContents.length.toString())}
                        >
                          <span className="text-xl"><GoTriangleRight className='inline w-7 h-7 ml-auto' /></span> {/* Left arrow */}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div
                  className='p-2 ml-2 mr-1 mx-auto w-full post-content'
                  dangerouslySetInnerHTML={{ __html: post && post.content }}
                ></div>

                <div className='px-20'>
                  <div className="text-center mb-2">
                    <h2 className="text-base font-semibold italic underline">Các bài viết liên quan</h2>
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
                          <div className="text-gray-700 text-sm font-medium italic underline">
                            {item && item.title}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {post.status === "approved" && !hasRated && (
                  <div className='p-3 mt-5 mb-5 max-w-2xl mx-auto w-full text-center flex justify-center'>
                    <h2 className='text-2xl font-semibold mr-4'>Bài viết có hữu ích không?</h2>
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
                <hr className='mt-3' />

                {/* Comment */}
                {post.status === approvedPosts && (
                  <CommentSection postId={post._id} />

                )}

                {/* <div className='flex flex-col justify-center items-center mb-5'>
                  <h1 className='text-xl mt-5'>Recent articles</h1>
                  <div className='flex flex-wrap  gap-2 mt-5 justify-center'>
                    {recentPosts &&
                      recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
                  </div>
                </div> */}

                {/* <div className='flex flex-col justify-center items-center mb-5'>
                  <h1 className='text-xl mt-5'>Recomend posts</h1>
                  <div className='flex flex-wrap  gap-2 mt-5 justify-center'>
                    {suggestPosts &&
                      suggestPosts.map((post) => <PostCard key={post._id} post={post} />)}
                  </div>
                </div> */}
              </main>
            </div>
            <div>
              {/* <div className='text-xl mb-3 text-center font-bold'>Xu hướng</div>
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
              </div> */}
              {/* <div className="text-xl mb-3 text-center font-bold mt-[100px]">
                Top các bài viết theo tuần
              </div> */}
              {/* {topPosts && topPosts.map((item, index) => (
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
              ))} */}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
