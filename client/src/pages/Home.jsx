import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import { BiCategory } from "react-icons/bi";
import { RiPhoneFindLine } from "react-icons/ri";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [postDisplay, setPostDisplay] = useState([]);


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
    const fetchPosts = async () => {
      const res = await fetch('/api/post/getposts');
      const data = await res.json();
      setPosts(data.posts);
      //setPostDisplay(posts[0]);
    };
    fetchPosts();
  }, []);


  return (
    <div>
      <div className='flex flex-col gap-6 p-28 px-3 max-w-7xl mx-auto '>
        <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to Web Review</h1>
        <p className='text-gray-500 text-xs sm:text-sm'>
          Here you'll discover an array of articles and tutorials covering product reviews,
          offering insights into various products and services available online.
        </p>
        <Link
          to='/search'
          className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'
        >
          View all posts
        </Link>

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

          <div className='w-3/4 ml-10 w-auto'>
            <img className="h-[222px] w-[500px]" src="https://cdn.tgdd.vn/Files/2018/08/12/1108714/technology_800x450.jpg" alt="Product Review" />
          </div>

        </div>
      </div>

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {posts && posts.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
            <div className='flex flex-wrap gap-4'>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to={'/search'}
              className='text-lg text-teal-500 hover:underline text-center'
            >
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div >
  );
}
