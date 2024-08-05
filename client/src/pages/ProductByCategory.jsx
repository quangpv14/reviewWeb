import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from 'flowbite-react';
import ProductDetail from '../components/ProductDetail';
import { BiCategory } from "react-icons/bi";
import { RiPhoneFindLine } from "react-icons/ri";

export default function ProductByCategory() {
    const { categoryName } = useParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState('');
    const [clickedIndex, setClickedIndex] = useState(null);

    const handleButtonClick = (index) => {
        setClickedIndex(index);
    };

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
        const fetchProductsByCategory = async () => {
            try {
                const res = await fetch(`/api/product/getproductsbycategory?categoryName=${categoryName}`);
                const data = await res.json();
                if (res.ok) {
                    setProducts(data.products);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        fetchProductsByCategory();
    }, [categoryName]);

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
                                        style={{
                                            backgroundColor: clickedIndex === index ? '#ca0000' : '#e2e8f0',
                                            color: clickedIndex === index ? 'White' : 'inherit',
                                            border: 'none'
                                        }}
                                        onClick={() => handleButtonClick(index)}
                                        className='uppercase rounded-sm bg-gray-300 hover:bg-red-600 hover:text-white text-current w-full p-1 '>
                                        {item && item.categoryName}
                                    </Button>
                                </Link>

                            )}
                        </div>
                        <div className='text-xl p-1 text-center font-bold bg-gray-400 text-white w-full hover:text-white hover:bg-red-600'>
                            <button> <BiCategory className='inline mr-2 mb-1' />All brand</button>
                        </div>
                    </div>

                    <div className='w-3/4 ml-10 relative'>
                        <img className="h-[300px] w-full" src="https://fdn.gsmarena.com/imgroot/static/headers/makers/samsung-2024-1.jpg" alt="Product Review" />
                        <div className='absolute top-0 left-0 w-full h-[40px] flex font-medium'>
                            <div className='flex w-full'>
                                <div className='bg-gray-500 bg-opacity-70 w-full'></div>
                            </div>
                        </div>
                        <div className='absolute bottom-10 left-0 w-full flex mb-5'>
                            <img
                                className='ml-5'
                                src="https://fdn.gsmarena.com/vv/assets12/i/pattern-diag-dark-2.gif"
                                alt="Background pattern"
                            />
                            <div className='text-white text-4xl font-bold' style={{ background: 'rgba(0, 0, 0, 0.5)' }}>
                                {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} Phones
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='max-w-7xl mx-auto p-3 flex flex-col gap-8 py-7'>
                <div className='flex'>
                    <div className='w-1/4 p-3'>
                        <div className='ml-5 font-bold text-lg'>
                            {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} Reviews
                        </div>
                    </div>
                    <div className='w-3/4 ml-10'>
                        <div className='flex'>
                            {products.length > 0 ? (
                                <>
                                    <div className='grid grid-cols-5 gap-4'>

                                        {products.map((product) => (
                                            <ProductDetail key={product._id} product={product} />
                                        ))}

                                    </div>
                                </>
                            ) : (
                                <p className='text-center'>No products found in this category.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
