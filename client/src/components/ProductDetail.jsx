import { Button, Card } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function ProductDetail({ product }) {
    return (
        <div className='w-[150px]'>
            <div className='h-[180px] rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800'>
                <div className='flex items-center justify-center'>
                    <div>
                        <Link to={`/product/${product._id}`}>
                            <img
                                src={product.image}
                                alt={product.title}
                                className='w-[120px] h-[140px] p-2 items-center justify-center'
                            />
                        </Link>
                    </div>
                </div>
                <div className='flex items-center justify-center text-center bg-gray-100 h-[46px] rounded-lg hover:bg-red-600 hover:text-white'>
                    <Link
                        to={`/product/${product._id}`}
                        className='text-lg font-semibold'
                    >
                        {product.title}
                    </Link>
                </div>

            </div>

        </div >


    );
}