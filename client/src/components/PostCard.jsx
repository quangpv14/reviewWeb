import { Link } from 'react-router-dom';
import { FaEdit } from "react-icons/fa";

export default function PostCard({ post }) {
  return (
    <div className='group relative w-full border border-teal-500 hover:border-2 h-[280px] overflow-hidden rounded-lg sm:w-[320px] transition-all'>
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt='post cover'
          className='h-[150px] w-full object-cover group-hover:h-40 transition-all duration-300 z-20'
        />
      </Link>
      <div className='p-2 flex flex-col gap-2'>
        <p className='text-lg font-semibold line-clamp-2 mr-10'>{post.title}</p>
        <span className='italic text-sm'>{post.category}</span>
        <div class="flex items-center">
          <svg class="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
          <p id="rating-value" class="ms-2 text-sm text-gray-900 dark:text-white">{post.rating.toFixed(2)}/5.0</p>

        </div>
        <Link
          to={`/post/${post.slug}`}
          className='z-10 group-hover:bottom-0 absolute bottom-[-400px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2'
        >
          Read article
        </Link>
      </div>

    </div>
  );
}
