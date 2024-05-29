import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';

export default function YourPost() {
    return (
        <div className='min-h-screen max-w-2xl mx-auto flex justify-center items-center flex-col gap-6 p-3'>
            <h1 className='text-3xl font-semibold'>Your posts</h1>
            <p className='text-md text-gray-500'>You need to sign in to see your posts</p>
            <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
                <div className="flex-1 justify-center flex flex-col">
                    <h2 className='text-2xl'>
                        Discover the latest tech reviews and
                        find the perfect gadgets for your needs.
                    </h2>
                    <p className='text-gray-500 my-2'>
                        Unbiased, in-depth reviews on the newest tech
                        products to help you make informed decisions
                    </p>
                    <Button gradientDuoTone='greenToBlue' outline className='rounded-tl-xl rounded-bl-none'>
                        <Link to="/sign-in">Sign in</Link>
                    </Button>
                </div>
                <div className="p-7 flex-1">
                    <img src="https://cdn.tgdd.vn/Files/2018/08/12/1108714/technology_800x450.jpg" alt="Product Review" />
                </div>
            </div>
        </div>
    )
}