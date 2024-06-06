import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';
import { FaEdit } from "react-icons/fa";

export default function ApprovedPost() {
    const { postSlug } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [post, setPost] = useState(null);
    const [recentPosts, setRecentPosts] = useState(null);
    const [tableOfContents, setTableOfContents] = useState([]);
    const approvedPosts = "approved";

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

    if (loading)
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <Spinner size='xl' />
            </div>
        );
    return (
        <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
            <div className='flex p-3 border-b border-gray-300'>
                {/* Phần bên trái */}
                <div className='flex-1 items-center justify-between'>
                    <h1 className='text-2xl font-bold ml-3'>Chi tiết bài viết: Chờ phê duyệt</h1>
                </div>

                {/* Phần bên phải */}
                <div className='flex items-center space-x-4'>
                    <button className='bg-red-500 text-white px-4 py-2 rounded'>Từ chối</button>
                    <button className='bg-green-500 text-white px-4 py-2 rounded'>Phê duyệt</button>
                </div>
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
