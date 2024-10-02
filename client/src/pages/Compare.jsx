import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RiPhoneFindLine } from "react-icons/ri";
import { BiCategory } from "react-icons/bi";
import { Button, TextInput, Dropdown } from 'flowbite-react';
import { GrConsole } from 'react-icons/gr';

export default function Compare() {
    const { productId } = useParams();
    const [categories, setCategories] = useState('');
    const [product, setProduct] = useState([]);
    const [product2, setProduct2] = useState([]);
    const [product3, setProduct3] = useState([]);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [initProducts, setInitProducts] = useState([]);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [isDropdownVisibleThree, setIsDropdownVisibleThree] = useState(false);

    const [searchInput, setSearchInput] = useState('');
    const [searchInputThree, setSearchInputThree] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filteredProductsThree, setFilteredProductsThree] = useState([]);

    const [isButtonCompareVisible, setButtonCompareVisible] = useState(false);
    const [clickedIndex1, setClickedIndex1] = useState(true); // compare full
    const [clickedIndex2, setClickedIndex2] = useState(false);// compare difference

    const [netWorkCompare, setNetWorkCompare] = useState(false);
    const [launchCompare, setLaunchCompare] = useState(false);
    const [bodyCompare, setBodyCompare] = useState(false);
    const [displayCompare, setDisplayCompare] = useState(false);
    const [platformCompare, setPlatformCompare] = useState(false);
    const [memoryCompare, setMemoryCompare] = useState(false);
    const [cameraCompare, setCameraCompare] = useState(false);
    const [soundsCompare, setSoundsCompare] = useState(false);
    const [commsCompare, setCommsCompare] = useState(false);
    const [featuresCompare, setFeaturesCompare] = useState(false);
    const [batteryCompare, setBatteryCompare] = useState(false);
    const [miscCompare, setMiscCompare] = useState(false);

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
        const fetchProductsByID = async () => {
            try {
                const res = await fetch(`/api/product/getproductsbyid?productId=${productId}`);
                const data = await res.json();
                if (res.ok) {
                    setProduct(data.product);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        fetchProductsByID();
    }, [productId]);

    const getStorageSummary = (internal, i) => {
        if (!internal) return '';
        const storageValues = internal.split(',').map(item => item.trim().split(' ')[i])
        const uniqueStorageValues = [...new Set(storageValues)];
        return `${uniqueStorageValues.join('/')}`;
    };

    const handleInputFocus = async () => {
        setIsDropdownVisible(true);
        try {
            const res = await fetch(`/api/product/getinitproducts?limit=5`);
            const data = await res.json();
            if (res.ok) {
                setInitProducts(data.products);
            } else {
                console.log('Failed to fetch products.');
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleInputFocusThree = async () => {

        try {
            const res = await fetch(`/api/product/getinitproducts?limit=5`);
            const data = await res.json();
            if (res.ok) {
                setInitProducts(data.products);
            } else {
                console.log('Failed to fetch products.');
            }
        } catch (error) {
            console.log(error.message);
        }
        setIsDropdownVisibleThree(true);
        setIsDropdownOpen(true);
    };


    const handleInputChange = async (e) => {
        try {
            const res = await fetch(`/api/product/search?searchText=${e.target.value}`);
            const data = await res.json();
            if (res.ok) {
                setFilteredProducts(data.products);
            } else {
                console.log('Failed to fetch filtered products.');
            }
        } catch (error) {
            console.log(error.message);
        }

        setSearchInput(e.target.value);
    };

    const handleInputChangeThree = async (e) => {
        try {
            const res = await fetch(`/api/product/search?searchText=${e.target.value}`);
            const data = await res.json();
            if (res.ok) {
                setFilteredProductsThree(data.products);
            } else {
                console.log('Failed to fetch filtered products.');
            }
        } catch (error) {
            console.log(error.message);
        }

        setSearchInputThree(e.target.value);
    };

    const handleProduct2 = async (id) => {
        setSearchInput('');
        setButtonCompareVisible(true);
        try {
            const res = await fetch(`/api/product/getproductsbyid?productId=${id}`);
            const data = await res.json();
            if (res.ok) {
                setProduct2(data.product);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleProduct3 = async (id) => {
        setSearchInputThree('');
        setButtonCompareVisible(true);
        try {
            const res = await fetch(`/api/product/getproductsbyid?productId=${id}`);
            const data = await res.json();
            if (res.ok) {
                setProduct3(data.product);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    //Full compare
    const changeMode1 = () => {
        setClickedIndex1(true);
        setClickedIndex2(false);

        setLaunchCompare(false);
        setNetWorkCompare(false);
        setBodyCompare(false);
        setDisplayCompare(false);
        setPlatformCompare(false);
        setMemoryCompare(false);
        setCameraCompare(false);
        setSoundsCompare(false);
        setCommsCompare(false);
        setFeaturesCompare(false);
        setBatteryCompare(false);
        setMiscCompare(false);
    }

    //Difference
    const changeMode2 = () => {
        setClickedIndex2(true);
        setClickedIndex1(false);

        setLaunchCompare(true);
        setNetWorkCompare(true);
        setBodyCompare(true);
        setDisplayCompare(true);
        setPlatformCompare(true);
        setMemoryCompare(true);
        setCameraCompare(true);
        setSoundsCompare(true);
        setCommsCompare(true);
        setFeaturesCompare(true);
        setBatteryCompare(true);
        setMiscCompare(true);
    }

    const compareAndHighlight = (str1, str2, str3) => {
        const arr1 = str1.split(',').map(item => item.trim());
        const arr2 = str2 ? str2.split(',').map(item => item.trim()) : [];
        const arr3 = str3 ? str3.split(',').map(item => item.trim()) : [];

        const highlightItem = (item, array1, array2) => {
            const normalizedItem = item.trim().toLowerCase();

            // Nếu array1 rỗng và array2 không rỗng, in mờ khi không có trong array2
            if (array1.length === 0) {
                return array2.some(arrayItem => arrayItem.trim().toLowerCase() === normalizedItem) ? "text-gray-400" : "";
            }

            // Nếu array2 rỗng và array1 không rỗng, in mờ khi không có trong array1
            if (array2.length === 0) {
                return array1.some(arrayItem => arrayItem.trim().toLowerCase() === normalizedItem) ? "text-gray-400" : "";
            }

            const foundInArray1 = array1.some(arrItem => arrItem.trim().toLowerCase() === normalizedItem);
            const foundInArray2 = array2.some(arrItem => arrItem.trim().toLowerCase() === normalizedItem);

            return (foundInArray1 && foundInArray2) ? "text-gray-400" : "";
        };

        const generateHighlightedResult = (arr, compareArr1, compareArr2) => {
            let result = [];
            for (let index = 0; index < arr.length; index++) {
                const item = arr[index];
                result.push(
                    <span key={index} className={highlightItem(item, compareArr1, compareArr2)}>
                        {item.trim()}
                        {index !== arr.length - 1 && <span key={`comma-${index}`}>, </span>}
                    </span>
                );
            }
            return result;
        };

        const result1 = generateHighlightedResult(arr1, arr2, arr3);
        const result2 = generateHighlightedResult(arr2, arr1, arr3);
        const result3 = generateHighlightedResult(arr3, arr1, arr2);

        return { result1, result2, result3 };
    }

    const compareAndHighlightTwo = (str1, str2, str3) => {
        const arr1 = str1.split('/').map(item => item.trim());
        const arr2 = str2 ? str2.split('/').map(item => item.trim()) : [];
        const arr3 = str3 ? str3.split('/').map(item => item.trim()) : [];

        const highlightItem = (item, array1, array2) => {
            const normalizedItem = item.trim().toLowerCase();

            // Nếu array1 rỗng và array2 không rỗng, in mờ khi không có trong array2
            if (array1.length === 0) {
                return array2.some(arrayItem => arrayItem.trim().toLowerCase() === normalizedItem) ? "text-gray-400" : "";
            }

            // Nếu array2 rỗng và array1 không rỗng, in mờ khi không có trong array1
            if (array2.length === 0) {
                return array1.some(arrayItem => arrayItem.trim().toLowerCase() === normalizedItem) ? "text-gray-400" : "";
            }

            const foundInArray1 = array1.some(arrItem => arrItem.trim().toLowerCase() === normalizedItem);
            const foundInArray2 = array2.some(arrItem => arrItem.trim().toLowerCase() === normalizedItem);

            return (foundInArray1 && foundInArray2) ? "text-gray-400" : "";
        };

        const generateHighlightedResult = (arr, compareArr1, compareArr2) => {
            let result = [];
            for (let index = 0; index < arr.length; index++) {
                const item = arr[index];
                result.push(
                    <span key={index} className={highlightItem(item, compareArr1, compareArr2)}>
                        {item.trim()}
                        {index !== arr.length - 1 && <span key={`slash-${index}`}> / </span>}
                    </span>
                );
            }
            return result;
        };

        const result1 = generateHighlightedResult(arr1, arr2, arr3);
        const result2 = generateHighlightedResult(arr2, arr1, arr3);
        const result3 = generateHighlightedResult(arr3, arr1, arr2);

        return { result1, result2, result3 };
    }

    const compareAndHighlightThree = (str1, str2, str3) => {
        const arr1 = str1.split('or');
        const arr2 = str2 ? str2.split('or') : [];
        const arr3 = str3 ? str3.split('or') : [];

        const highlightItem = (item, array1, array2) => {
            // Nếu array1 rỗng và array2 không rỗng, in mờ khi không có trong array2
            if (array1.length === 0) {
                return array2.includes(item) ? "text-gray-400" : "";
            }

            // Nếu array2 rỗng và array1 không rỗng, in mờ khi không có trong array1
            if (array2.length === 0) {
                return array1.includes(item) ? "text-gray-400" : "";
            }

            const foundInArray1 = array1.some(arrItem => arrItem.trim() === item.trim());
            const foundInArray2 = array2.some(arrItem => arrItem.trim() === item.trim());

            return (foundInArray1 && foundInArray2) ? "text-gray-400" : "";
        };

        const generateHighlightedResult = (arr, compareArr1, compareArr2) => {
            let result = [];
            for (let index = 0; index < arr.length; index++) {
                const item = arr[index];
                result.push(
                    <span key={index} className={highlightItem(item, compareArr1, compareArr2)}>
                        {item.trim()}
                        {index !== arr.length - 1 && <span style={{ color: '#374151' }}> or </span>}
                    </span>
                );
            }
            return result;
        };

        const result1 = generateHighlightedResult(arr1, arr2, arr3);
        const result2 = generateHighlightedResult(arr2, arr1, arr3);
        const result3 = generateHighlightedResult(arr3, arr1, arr2);

        return { result1, result2, result3 };
    }
    const compareAndHighlight1 = (str1, str2) => {
        const arr1 = str1.split(',');
        const arr2 = str2.split(',');
        let result1 = [];
        let result2 = [];

        // Loop through arr1 and compare each element with arr2
        arr1.forEach((item1) => {
            // Find the corresponding element in arr2
            const foundIndex = arr2.findIndex((item2) => item1.trim() === item2.trim());

            // If found, push both items with appropriate styling
            if (foundIndex !== -1) {
                result1.push(
                    <span key={item1} className="text-gray-400">{item1}</span>
                );

            } else {
                // If not found, push item1 as normal and an empty span for item2
                result1.push(
                    <span key={item1}>{item1}</span>
                );
            }
            // Add ',' after each item1 except the last one
            if (item1 !== arr1[arr1.length - 1]) {
                result1.push(<span key={`comma1-${item1}`}>,</span>);
            }
        });

        arr2.forEach((item2) => {
            // Find the corresponding element in arr2
            const foundIndex = arr1.findIndex((item1) => item1.trim() === item2.trim());

            // If found, push both items with appropriate styling
            if (foundIndex !== -1) {
                result2.push(
                    <span key={item2} className="text-gray-400">{item2}</span>
                );

            } else {
                // If not found, push item1 as normal and an empty span for item2
                result2.push(
                    <span key={item2}>{item2}</span>
                );
            }
            // Add ',' after each item1 except the last one
            if (item2 !== arr2[arr2.length - 1]) {
                result2.push(<span key={`comma2-${item2}`}>,</span>);
            }
        });

        return { result1, result2 };
    }


    const compareAndHighlight2 = (str1, str2) => {
        const arr1 = str1.split('/');
        const arr2 = str2.split('/');
        let result1 = [];
        let result2 = [];
        const maxLength = Math.max(arr1.length, arr2.length);
        for (let i = 0; i < Math.max(arr1.length, arr2.length); i++) {
            if (arr1[i] !== arr2[i]) {
                result1.push(
                    <span key={i} >{arr1[i]}</span>
                );
                result2.push(
                    <span key={i} >{arr2[i]}</span>
                );
            } else {
                result1.push(
                    <span key={i} className="text-gray-400">{arr1[i]}</span>
                );
                result2.push(
                    <span key={i} className="text-gray-400">{arr2[i]}</span>
                );
            }

            if (i < arr1.length - 1) {
                result1.push(<span key={`slash1-${i}`} className="text-gray-400"> / </span>);
            }
            if (i < arr2.length - 1) {
                result2.push(<span key={`slash2-${i}`} className="text-gray-400"> / </span>);
            }
        }

        return { result1, result2 };
    }

    return (
        <div className='pt-7'>
            <div className='max-w-7xl mx-auto p-3 flex flex-col gap-8'>
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
                        <div className='relative'>
                            <img className="h-[250px] w-[900px] bg-opacity-50" src="https://thakorlalhiralal.com/images/expert_img02.jpg" alt="Compare" />
                            <div className='absolute bottom-10 left-5 flex text-white text-5xl font-bold p-2' style={{ background: 'rgba(0, 0, 0, 0.5)' }}>
                                Compare specs
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='max-w-7xl mx-auto p-3 flex flex-col gap-8'>
                <div className='flex'>
                    <div className='w-1/6 w-max-full bg-gray-200 content-end'>
                        {isButtonCompareVisible && (
                            <>
                                <div className='flex ml-2 mb-2'>
                                    <Button className='w-1/3 text-sm text-white'
                                        onClick={changeMode1}
                                        style={{
                                            backgroundColor: clickedIndex1 ? '#ca0000' : '#404040',
                                            color: 'white',

                                        }}
                                    >FULL</Button>
                                    <Button
                                        className='ml-1 text-sm text-white'
                                        onClick={changeMode2}
                                        style={{
                                            backgroundColor: clickedIndex2 ? '#ca0000' : '#404040',
                                            color: 'white',

                                        }}
                                    >DIFFERENCE</Button>
                                </div>
                                <div className='italic text-center text-sm'>
                                    <span className='inline-flex items-center justify-center p-2 w-2 h-2 rounded-full border border-gray-600 bg-gray-600 text-white'>i</span>
                                    Change compare mode
                                </div>
                            </>
                        )}
                    </div>

                    <div className='w-5/6 flex'>
                        <div className='w-1/3 border-x ml-3'>
                            <div className='p-3'>
                                <div className='bg-gray-100'>
                                    <div className='p-3'>
                                        <strong className='text-sm'>COMPARE WITH</strong>
                                    </div>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='product'
                                            className='pb-3 pl-3'
                                            style={{ width: '250px', height: '40px' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {product.length > 0 && (
                                <>
                                    <div>
                                        <div className='ml-3 text-2xl font-bold text-gray-600 hover:text-red-600 hover:underline'>
                                            {product[0].category ? product[0].category.charAt(0).toUpperCase() + product[0].category.slice(1) : ''} {product[0].title}
                                        </div>

                                        <div className='flex'>
                                            <div className='w-2/3 left-0'>
                                                <Link to={`/product/${product[0]._id}`}>
                                                    <img className="h-60 w-50 mt-2" src={product[0].image} alt={product[0].title} />
                                                </Link>
                                            </div>

                                            <div className='w-1/3 pt-3'>
                                                <div className='ml-1 mr-1 bg-black hover:bg-red-600'>
                                                    <div className='font-semibold p-1 text-white'>REVIEW</div>
                                                </div>
                                                <div className='ml-1 mr-1 bg-gray-200 hover:bg-red-600 '>
                                                    <Link to={`/product/${product[0]._id}`}>
                                                        <div className='font-semibold p-1 text-gray-600 hover:text-white'>
                                                            Specifications
                                                        </div>
                                                    </Link>
                                                </div>
                                                <div className='ml-1 mr-1 bg-gray-200 hover:bg-red-600 border-y border-white'>
                                                    <div className='font-semibold p-1 text-gray-600 hover:text-white'>Opinions</div>
                                                </div>
                                                <div className='ml-1 mr-1 bg-gray-200 hover:bg-red-600 '>
                                                    <div className='font-semibold p-1 text-gray-600 hover:text-white'>Pictures</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className='w-1/3 border-x'>
                            <div className='p-3'>
                                <div className='bg-gray-100'>
                                    <div className='p-3'>
                                        <strong className='text-sm'>COMPARE WITH</strong>
                                    </div>
                                    <div className='flex'>
                                        <TextInput
                                            type='text'
                                            id='product'
                                            className='pb-3 pl-3'
                                            style={{ width: '250px', height: '40px' }}
                                            onFocus={handleInputFocus}
                                            onChange={handleInputChange}
                                        />
                                        <div className='relative ml-auto'>
                                            {isDropdownVisible && (
                                                <div className="flex flex-wrap gap-4 ml-auto">
                                                    <Dropdown className="w-fit mt-2 w-[300px] flex max-h-80 overflow-y-auto mt-10" placement="left-start" inline>
                                                        {searchInput && (
                                                            <div className="px-4 py-1 text-sm text-gray-700 font-bold">
                                                                Have {filteredProducts.length} products found
                                                            </div>
                                                        )}
                                                        {(searchInput ? filteredProducts : product).map((item, idx) => (

                                                            <Dropdown.Item key={item._id} className="flex p-2 items-stretch">
                                                                <div className='w-1/3'>
                                                                    <button onClick={() => handleProduct2(item._id)}>
                                                                        <img className="h-20 w-25 mt-2" src={item.image} alt={item.title} />
                                                                    </button>
                                                                </div>

                                                                <div className='w-2/3 w-full text-left mt-1'>
                                                                    <button className='font-semibold' onClick={() => handleProduct2(item._id)}>
                                                                        <span className='mt-2 text-left'>
                                                                            {item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : ''} {item.title}

                                                                        </span>
                                                                    </button>
                                                                </div>
                                                            </Dropdown.Item>
                                                        ))}
                                                    </Dropdown>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {product2.length > 0 && (
                                <>
                                    <div>
                                        <div className='ml-3 text-2xl font-bold text-gray-600 hover:text-red-600 hover:underline'>
                                            {product2[0].category ? product2[0].category.charAt(0).toUpperCase() + product2[0].category.slice(1) : ''} {product2[0].title}
                                        </div>

                                        <div className='flex'>
                                            <div className='w-2/3 left-0'>
                                                <Link to={`/product/${product2[0]._id}`}>
                                                    <img className="h-60 w-50 mt-2" src={product2[0].image} alt={product2[0].title} />
                                                </Link>
                                            </div>

                                            <div className='w-1/3 pt-3'>
                                                <div className='ml-1 mr-1 bg-black hover:bg-red-600'>
                                                    <div className='font-semibold p-1 text-white'>REVIEW</div>
                                                </div>
                                                <div className='ml-1 mr-1 bg-gray-200 hover:bg-red-600 '>
                                                    <Link to={`/product/${product2[0]._id}`}>
                                                        <div className='font-semibold p-1 text-gray-600 hover:text-white'>
                                                            Specifications
                                                        </div>
                                                    </Link>
                                                </div>
                                                <div className='ml-1 mr-1 bg-gray-200 hover:bg-red-600 border-y border-white'>
                                                    <div className='font-semibold p-1 text-gray-600 hover:text-white'>Opinions</div>
                                                </div>
                                                <div className='ml-1 mr-1 bg-gray-200 hover:bg-red-600 '>
                                                    <div className='font-semibold p-1 text-gray-600 hover:text-white'>Pictures</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}


                        </div>
                        <div className='w-1/3 border-x'>
                            <div className='p-3'>
                                <div className='bg-gray-100'>
                                    <div className='p-3'>
                                        <strong className='text-sm'>COMPARE WITH</strong>
                                    </div>
                                    <div className='flex'>
                                        <TextInput
                                            type='text'
                                            id='product'
                                            className='pb-3 pl-3'
                                            style={{ width: '250px', height: '40px' }}
                                            onFocus={handleInputFocusThree}
                                            onChange={handleInputChangeThree}
                                        />

                                        <div className='relative ml-auto'>
                                            {isDropdownVisibleThree && (
                                                <div className="flex flex-wrap gap-4 ml-auto">
                                                    <Dropdown className="w-fit mt-2 w-[300px] flex max-h-80 overflow-y-auto mt-10" placement="left-start" inline open={isDropdownOpen}>
                                                        {searchInputThree && (
                                                            <div className="px-4 py-1 text-sm text-gray-700 font-bold">
                                                                Have {filteredProductsThree.length} products found
                                                            </div>
                                                        )}
                                                        {(searchInputThree ? filteredProductsThree : initProducts).map((item, idx) => (

                                                            <Dropdown.Item key={item._id} className="flex p-2 items-stretch">
                                                                <div className='w-1/3'>
                                                                    <button onClick={() => handleProduct3(item._id)}>
                                                                        <img className="h-20 w-25 mt-2" src={item.image} alt={item.title} />
                                                                    </button>
                                                                </div>

                                                                <div className='w-2/3 w-full text-left mt-1'>
                                                                    <button className='font-semibold' onClick={() => handleProduct3(item._id)}>
                                                                        <span className='mt-2 text-left'>
                                                                            {item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : ''} {item.title}

                                                                        </span>
                                                                    </button>
                                                                </div>
                                                            </Dropdown.Item>
                                                        ))}
                                                    </Dropdown>
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            </div>

                            {product3.length > 0 && (
                                <>
                                    <div>
                                        <div className='ml-3 text-2xl font-bold text-gray-600 hover:text-red-600 hover:underline'>
                                            {product3[0].category ? product3[0].category.charAt(0).toUpperCase() + product3[0].category.slice(1) : ''} {product3[0].title}
                                        </div>

                                        <div className='flex'>
                                            <div className='w-2/3 left-0'>
                                                <Link to={`/product/${product3[0]._id}`}>
                                                    <img className="h-60 w-50 mt-2" src={product3[0].image} alt={product3[0].title} />
                                                </Link>
                                            </div>

                                            <div className='w-1/3 pt-3'>
                                                <div className='ml-1 mr-1 bg-black hover:bg-red-600'>
                                                    <div className='font-semibold p-1 text-white'>REVIEW</div>
                                                </div>
                                                <div className='ml-1 mr-1 bg-gray-200 hover:bg-red-600 '>
                                                    <Link to={`/product/${product3[0]._id}`}>
                                                        <div className='font-semibold p-1 text-gray-600 hover:text-white'>
                                                            Specifications
                                                        </div>
                                                    </Link>
                                                </div>
                                                <div className='ml-1 mr-1 bg-gray-200 hover:bg-red-600 border-y border-white'>
                                                    <div className='font-semibold p-1 text-gray-600 hover:text-white'>Opinions</div>
                                                </div>
                                                <div className='ml-1 mr-1 bg-gray-200 hover:bg-red-600 '>
                                                    <div className='font-semibold p-1 text-gray-600 hover:text-white'>Pictures</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            <div className='max-w-7xl mx-auto p-3'>
                <div>
                    {product.length > 0 && (
                        <>
                            {!netWorkCompare ? (
                                <>
                                    <table className='border-t-4 border-x-2'>
                                        <tbody className='text-gray-700'>
                                            <tr className='border-b'>
                                                <th rowSpan="5" className='w-[100px] text-left text-red-600 text-lg align-top uppercase border-x-2' style={{ minWidth: '93px' }}>Network</th>
                                                <td className='text-left font-bold hover:underline text-sm border-r-2' style={{ width: '109px' }}>Technology</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].technology}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].technology}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].technology}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>2G bands</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].band2g}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].band2g}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].band2g}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>3G bands</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].band3g}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].band3g}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].band3g}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>4G bands</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].band4g}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].band4g}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].band4g}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>Speed</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].speed}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].speed}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].speed}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </>
                            ) : (
                                <table className='border-t-4 border-x-2'>
                                    <tbody className='text-gray-700'>
                                        <tr className='border-b'>
                                            <th rowSpan="5" className='w-[100px] text-left text-red-600 text-lg align-top uppercase border-x-2' style={{ minWidth: '93px' }}>Network</th>
                                            <td className='text-left font-bold hover:underline text-sm border-r-2' style={{ width: '109px' }}>Technology</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlightTwo(product[0].technology, product2[0]?.technology, product3[0]?.technology).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlightTwo(product[0].technology, product2[0]?.technology, product3[0]?.technology).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlightTwo(product[0].technology, product2[0]?.technology, product3[0]?.technology).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className='border-b'>
                                            <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>2G bands</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlightTwo(product[0].band2g, product2[0]?.band2g, product3[0]?.band2g).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlightTwo(product[0].band2g, product2[0]?.band2g, product3[0]?.band2g).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlightTwo(product[0].band2g, product2[0]?.band2g, product3[0]?.band2g).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className='border-b'>
                                            <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>3G bands</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlightTwo(product[0].band3g, product2[0]?.band3g, product3[0]?.band3g).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlightTwo(product[0].band3g, product2[0]?.band3g, product3[0]?.band3g).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlightTwo(product[0].band3g, product2[0]?.band3g, product3[0]?.band3g).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className='border-b'>
                                            <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>4G bands</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlight(product[0].band4g, product2[0]?.band4g, product3[0]?.band4g).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlight(product[0].band4g, product2[0]?.band4g, product3[0]?.band4g).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlight(product[0].band4g, product2[0]?.band4g, product3[0]?.band4g).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className='border-b'>
                                            <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>Speed</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlight(product[0].speed, product2[0]?.speed, product3[0]?.speed).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlight(product[0].speed, product2[0]?.speed, product3[0]?.speed).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlight(product[0].speed, product2[0]?.speed, product3[0]?.speed).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            )}

                            {!launchCompare ? (
                                <>
                                    <table className='border-t-4 border-x-2 table-fixed'>
                                        <tbody className='text-gray-700'>
                                            <tr className='border-b'>
                                                <th rowSpan="2" className=' w-[100px] uppercase border-x-2 align-top' style={{ minWidth: '93px' }}>
                                                    <div className='text-left text-red-600 text-lg'>Launch</div>

                                                </th>
                                                <td className='text-left font-bold hover:underline text-sm border-r-2' style={{ width: '109px' }}>Announced</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].announced}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].announced}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].announced}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>Status</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].status}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].status}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].status}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </>
                            ) : (
                                <table className='border-t-4 border-x-2 table-fixed'>
                                    <tbody className='text-gray-700'>
                                        <tr className='border-b'>
                                            <th rowSpan="2" className=' w-[100px] uppercase border-x-2 align-top' style={{ minWidth: '93px' }}>
                                                <div className='text-left text-red-600 text-lg'>Launch</div>

                                            </th>
                                            <td className='text-left font-bold hover:underline text-sm border-r-2' style={{ width: '109px' }}>Announced</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlight(product[0].announced, product2[0]?.announced, product3[0]?.announced).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlight(product[0].announced, product2[0]?.announced, product3[0]?.announced).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlight(product[0].announced, product2[0]?.announced, product3[0]?.announced).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className='border-b'>
                                            <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>Status</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlight(product[0].status, product2[0]?.status, product3[0]?.status).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlight(product[0].status, product2[0]?.status, product3[0]?.status).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlight(product[0].status, product2[0]?.status, product3[0]?.status).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            )}

                            {!bodyCompare ? (
                                <>
                                    <table className='border-t-4 border-x-2'>
                                        <tbody className='text-gray-700'>
                                            <tr className='border-b'>
                                                <th rowSpan="5" className='w-[100px] text-left text-red-600 text-lg align-top uppercase border-x-2' style={{ minWidth: '93px' }}>Body</th>
                                                <td className='text-left font-bold hover:underline text-sm border-r-2' style={{ width: '109px' }}>Dimensions</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].dimensions}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].dimensions}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].dimensions}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>Weight</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].weight}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].weight}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].weight}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>Build</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].build}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].build}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].build}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>SIM</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].sim}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].sim}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].sim}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>

                                        </tbody>
                                    </table>
                                </>
                            ) : (
                                <table className='border-t-4 border-x-2'>
                                    <tbody className='text-gray-700'>
                                        <tr className='border-b'>
                                            <th rowSpan="5" className='w-[100px] text-left text-red-600 text-lg align-top uppercase border-x-2' style={{ minWidth: '93px' }}>Body</th>
                                            <td className='text-left font-bold hover:underline text-sm border-r-2' style={{ width: '109px' }}>Dimensions</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlight(product[0].dimensions, product2[0]?.dimensions, product3[0]?.dimensions).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlight(product[0].dimensions, product2[0]?.dimensions, product3[0]?.dimensions).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlight(product[0].dimensions, product2[0]?.dimensions, product3[0]?.dimensions).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className='border-b'>
                                            <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>Weight</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlight(product[0].weight, product2[0]?.weight, product3[0]?.weight).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlight(product[0].weight, product2[0]?.weight, product3[0]?.weight).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlight(product[0].weight, product2[0]?.weight, product3[0]?.weight).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className='border-b'>
                                            <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>Build</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlight(product[0].build, product2[0]?.build, product3[0]?.build).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlight(product[0].build, product2[0]?.build, product3[0]?.build).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlight(product[0].build, product2[0]?.build, product3[0]?.build).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className='border-b'>
                                            <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>SIM</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlightThree(product[0].sim, product2[0]?.sim, product3[0]?.sim).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlightThree(product[0].sim, product2[0]?.sim, product3[0]?.sim).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlightThree(product[0].sim, product2[0]?.sim, product3[0]?.sim).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            )}

                            {!displayCompare ? (
                                <>
                                    <table className='border-t-4 border-x-2'>
                                        <tbody className='text-gray-700'>
                                            <tr className='border-b'>
                                                <th rowSpan="5" className='w-[100px] text-left text-red-600 text-lg align-top uppercase border-x-2' style={{ minWidth: '93px' }}>DISPLAY</th>
                                                <td className='text-left font-bold hover:underline text-sm border-r-2' style={{ width: '109px' }}>Type</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].type}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].type}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].type}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>Size</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].size}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].size}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].size}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>Resolution</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].resolution}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].resolution}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].resolution}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>

                                        </tbody>
                                    </table>
                                </>
                            ) : (
                                <table className='border-t-4 border-x-2'>
                                    <tbody className='text-gray-700'>
                                        <tr className='border-b'>
                                            <th rowSpan="5" className='w-[100px] text-left text-red-600 text-lg align-top uppercase border-x-2' style={{ minWidth: '93px' }}>DISPLAY</th>
                                            <td className='text-left font-bold hover:underline text-sm border-r-2' style={{ width: '109px' }}>Type</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlight(product[0].type, product2[0]?.type, product3[0]?.type).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlight(product[0].type, product2[0]?.type, product3[0]?.type).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlight(product[0].type, product2[0]?.type, product3[0]?.type).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className='border-b'>
                                            <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>Size</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlight(product[0].size, product2[0]?.size, product3[0]?.size).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlight(product[0].size, product2[0]?.size, product3[0]?.size).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlight(product[0].size, product2[0]?.size, product3[0]?.size).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className='border-b'>
                                            <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>Resolution</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlight(product[0].resolution, product2[0]?.resolution, product3[0]?.resolution).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlight(product[0].resolution, product2[0]?.resolution, product3[0]?.resolution).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlight(product[0].resolution, product2[0]?.resolution, product3[0]?.resolution).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            )}

                            {!platformCompare ? (
                                <>
                                    <table className='border-t-4 border-x-2'>
                                        <tbody className='text-gray-700'>
                                            <tr className='border-b'>
                                                <th rowSpan="5" className='w-[100px] text-left text-red-600 text-lg align-top uppercase border-x-2' style={{ minWidth: '93px' }}>Platform</th>
                                                <td className='text-left font-bold hover:underline text-sm border-r-2' style={{ width: '109px' }}>OS</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].os}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].os}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].os}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>Chipset</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].chipset}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].chipset}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].chipset}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>CPU</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].cpu}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].cpu}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].cpu}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>GPU</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].gpu}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].gpu}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].gpu}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </>
                            ) : (
                                <table className='border-t-4 border-x-2'>
                                    <tbody className='text-gray-700'>
                                        <tr className='border-b'>
                                            <th rowSpan="5" className='w-[100px] text-left text-red-600 text-lg align-top uppercase border-x-2' style={{ minWidth: '93px' }}>Platform</th>
                                            <td className='text-left font-bold hover:underline text-sm border-r-2' style={{ width: '109px' }}>OS</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlight(product[0].os, product2[0]?.os, product3[0]?.os).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlight(product[0].os, product2[0]?.os, product3[0]?.os).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlight(product[0].os, product2[0]?.os, product3[0]?.os).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className='border-b'>
                                            <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>Chipset</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlight(product[0].chipset, product2[0]?.chipset, product3[0]?.chipset).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlight(product[0].chipset, product2[0]?.chipset, product3[0]?.chipset).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlight(product[0].chipset, product2[0]?.chipset, product3[0]?.chipset).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className='border-b'>
                                            <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>CPU</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlight(product[0].cpu, product2[0]?.cpu, product3[0]?.cpu).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlight(product[0].cpu, product2[0]?.cpu, product3[0]?.cpu).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlight(product[0].cpu, product2[0]?.cpu, product3[0]?.cpu).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className='border-b'>
                                            <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>GPU</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlight(product[0].gpu, product2[0]?.gpu, product3[0]?.gpu).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlight(product[0].gpu, product2[0]?.gpu, product3[0]?.gpu).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlight(product[0].gpu, product2[0]?.gpu, product3[0]?.gpu).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            )}

                            {!memoryCompare ? (
                                <>
                                    <table className='border-t-4 border-x-2 table-fixed'>
                                        <tbody className='text-gray-700'>
                                            <tr className='border-b'>
                                                <th rowSpan="2" className=' w-[100px] uppercase border-x-2 align-top' style={{ minWidth: '93px' }}>
                                                    <div className='text-left text-red-600 text-lg'>Memory</div>

                                                </th>
                                                <td className='text-left font-bold hover:underline text-sm border-r-2' style={{ width: '109px' }}>Card slot</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].cardSlot}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].cardSlot}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].cardSlot}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>Internal</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].internal}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].internal}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].internal}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </>
                            ) : (
                                <table className='border-t-4 border-x-2 table-fixed'>
                                    <tbody className='text-gray-700'>
                                        <tr className='border-b'>
                                            <th rowSpan="2" className=' w-[100px] uppercase border-x-2 align-top' style={{ minWidth: '93px' }}>
                                                <div className='text-left text-red-600 text-lg'>Memory</div>

                                            </th>
                                            <td className='text-left font-bold hover:underline text-sm border-r-2' style={{ width: '109px' }}>Card slot</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlight(product[0].cardSlot, product2[0]?.cardSlot, product3[0]?.cardSlot).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlight(product[0].cardSlot, product2[0]?.cardSlot, product3[0]?.cardSlot).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlight(product[0].cardSlot, product2[0]?.cardSlot, product3[0]?.cardSlot).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className='border-b'>
                                            <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>Internal</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlight(product[0].internal, product2[0]?.internal, product3[0]?.internal).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlight(product[0].internal, product2[0]?.internal, product3[0]?.internal).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlight(product[0].internal, product2[0]?.internal, product3[0]?.internal).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            )}

                            {!cameraCompare ? (
                                <>
                                    <table className='border-t-4 border-x-2'>
                                        <tbody className='text-gray-700'>
                                            <tr className='border-b'>
                                                <th rowSpan="5" className='w-[100px] text-left text-red-600 text-lg align-top uppercase border-x-2' style={{ minWidth: '93px' }}>Camera</th>
                                                <td className='text-left font-bold hover:underline text-sm border-r-2' style={{ width: '109px' }}>Single</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].camera}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].camera}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].camera}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>Features</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].features}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].features}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].features}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>Video</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].video}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].video}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].video}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>

                                        </tbody>
                                    </table>
                                </>
                            ) : (
                                <table className='border-t-4 border-x-2'>
                                    <tbody className='text-gray-700'>
                                        <tr className='border-b'>
                                            <th rowSpan="5" className='w-[100px] text-left text-red-600 text-lg align-top uppercase border-x-2' style={{ minWidth: '93px' }}>Camera</th>
                                            <td className='text-left font-bold hover:underline text-sm border-r-2' style={{ width: '109px' }}>Single</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlight(product[0].camera, product2[0]?.camera, product3[0]?.camera).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlight(product[0].camera, product2[0]?.camera, product3[0]?.camera).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlight(product[0].camera, product2[0]?.camera, product3[0]?.camera).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className='border-b'>
                                            <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>Features</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlight(product[0].features, product2[0]?.features, product3[0]?.features).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlight(product[0].features, product2[0]?.features, product3[0]?.features).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlight(product[0].features, product2[0]?.features, product3[0]?.features).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className='border-b'>
                                            <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>Video</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlight(product[0].video, product2[0]?.video, product3[0]?.video).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlight(product[0].video, product2[0]?.video, product3[0]?.video).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlight(product[0].video, product2[0]?.video, product3[0]?.video).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            )}

                            {!soundsCompare ? (
                                <>
                                    <table className='border-t-4 border-x-2'>
                                        <tbody className='text-gray-700'>
                                            <tr className='border-b'>
                                                <th rowSpan="5" className='w-[100px] text-left text-red-600 text-lg align-top uppercase border-x-2' style={{ minWidth: '93px' }}>Sounds</th>
                                                <td className='text-left font-bold hover:underline text-sm border-r-2' style={{ width: '109px' }}>Loudspeaker</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].loudSpeaker}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].loudSpeaker}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].loudSpeaker}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>3.5mm jack</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].jack}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].jack}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].jack}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>Audio quality</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].audioQuality}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].audioQuality}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].audioQuality}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>

                                        </tbody>
                                    </table>
                                </>
                            ) : (
                                <table className='border-t-4 border-x-2'>
                                    <tbody className='text-gray-700'>
                                        <tr className='border-b'>
                                            <th rowSpan="5" className='w-[100px] text-left text-red-600 text-lg align-top uppercase border-x-2' style={{ minWidth: '93px' }}>Sounds</th>
                                            <td className='text-left font-bold hover:underline text-sm border-r-2' style={{ width: '109px' }}>Loudspeaker</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlight(product[0].loudSpeaker, product2[0]?.loudSpeaker, product3[0]?.loudSpeaker).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlight(product[0].loudSpeaker, product2[0]?.loudSpeaker, product3[0]?.loudSpeaker).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlight(product[0].loudSpeaker, product2[0]?.loudSpeaker, product3[0]?.loudSpeaker).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className='border-b'>
                                            <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>3.5mm jack</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlight(product[0].jack, product2[0]?.jack, product3[0]?.jack).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlight(product[0].jack, product2[0]?.jack, product3[0]?.jack).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlight(product[0].jack, product2[0]?.jack, product3[0]?.jack).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className='border-b'>
                                            <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>Audio quality</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlightTwo(product[0].audioQuality, product2[0]?.audioQuality, product3[0]?.audioQuality).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlightTwo(product[0].audioQuality, product2[0]?.audioQuality, product3[0]?.audioQuality).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlightTwo(product[0].audioQuality, product2[0]?.audioQuality, product3[0]?.audioQuality).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            )}

                            {!commsCompare ? (
                                <>
                                    <table className='border-t-4 border-x-2'>
                                        <tbody className='text-gray-700'>
                                            <tr className='border-b'>
                                                <th rowSpan="6" className='w-[100px] text-left text-red-600 text-lg align-top uppercase border-x-2' style={{ minWidth: '93px' }}>Comms</th>
                                                <td className='text-left font-bold hover:underline text-sm border-r-2' style={{ width: '109px' }}>Bluetooth</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].bluetooth}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].bluetooth}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].bluetooth}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>GPS</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].gps}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].gps}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].gps}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>NFC</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].nfc}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].nfc}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].nfc}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>WLAN</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].wlan}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].wlan}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].wlan}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>Radio</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].radio}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].radio}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].radio}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>USB</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].usb}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].usb}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].usb}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </>
                            ) : (
                                <table className='border-t-4 border-x-2'>
                                    <tbody className='text-gray-700'>
                                        <tr className='border-b'>
                                            <th rowSpan="6" className='w-[100px] text-left text-red-600 text-lg align-top uppercase border-x-2' style={{ minWidth: '93px' }}>Coms</th>
                                            <td className='text-left font-bold hover:underline text-sm border-r-2' style={{ width: '109px' }}>Bluetooth</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlight(product[0].bluetooth, product2[0]?.bluetooth, product3[0]?.bluetooth).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlight(product[0].bluetooth, product2[0]?.bluetooth, product3[0]?.bluetooth).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlight(product[0].bluetooth, product2[0]?.bluetooth, product3[0]?.bluetooth).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className='border-b'>
                                            <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>GPS</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlight(product[0].gps, product2[0]?.gps, product3[0]?.gps).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlight(product[0].gps, product2[0]?.gps, product3[0]?.gps).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlight(product[0].gps, product2[0]?.gps, product3[0]?.gps).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className='border-b'>
                                            <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>NFC</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlight(product[0].nfc, product2[0]?.nfc, product3[0]?.nfc).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlight(product[0].nfc, product2[0]?.nfc, product3[0]?.nfc).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlight(product[0].nfc, product2[0]?.nfc, product3[0]?.nfc).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className='border-b'>
                                            <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>WLAN</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlight(product[0].wlan, product2[0]?.wlan, product3[0]?.wlan).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlight(product[0].wlan, product2[0]?.wlan, product3[0]?.wlan).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlight(product[0].wlan, product2[0]?.wlan, product3[0]?.wlan).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className='border-b'>
                                            <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>Radio</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlight(product[0].radio, product2[0]?.radio, product3[0]?.radio).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlight(product[0].radio, product2[0]?.radio, product3[0]?.radio).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlight(product[0].radio, product2[0]?.radio, product3[0]?.radio).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className='border-b'>
                                            <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>USB</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlight(product[0].usb, product2[0]?.usb, product3[0]?.usb).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlight(product[0].usb, product2[0]?.usb, product3[0]?.usb).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlight(product[0].usb, product2[0]?.usb, product3[0]?.usb).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            )}

                            {!featuresCompare ? (
                                <>
                                    <table className='border-t-4 border-x-2'>
                                        <tbody className='text-gray-700'>
                                            <tr className='border-b'>
                                                <th rowSpan="5" className='w-[100px] text-left text-red-600 text-lg align-top uppercase border-x-2' style={{ minWidth: '93px' }}>Features</th>
                                                <td className='text-left font-bold hover:underline text-sm border-r-2' style={{ width: '109px' }}>Performance</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].performance}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].performance}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].performance}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>Sensor</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].sensor}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].sensor}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].sensor}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>Messaging</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].messaging}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].messaging}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].messaging}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>

                                        </tbody>
                                    </table>
                                </>
                            ) : (
                                <table className='border-t-4 border-x-2'>
                                    <tbody className='text-gray-700'>
                                        <tr className='border-b'>
                                            <th rowSpan="5" className='w-[100px] text-left text-red-600 text-lg align-top uppercase border-x-2' style={{ minWidth: '93px' }}>Features</th>
                                            <td className='text-left font-bold hover:underline text-sm border-r-2' style={{ width: '109px' }}>Performance</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlight(product[0].performance, product2[0]?.performance, product3[0]?.performance).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlight(product[0].performance, product2[0]?.performance, product3[0]?.performance).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlight(product[0].performance, product2[0]?.performance, product3[0]?.performance).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className='border-b'>
                                            <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>Sensor</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlight(product[0].sensor, product2[0]?.sensor, product3[0]?.sensor).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlight(product[0].sensor, product2[0]?.sensor, product3[0]?.sensor).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlight(product[0].sensor, product2[0]?.sensor, product3[0]?.sensor).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className='border-b'>
                                            <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>Messaging</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlight(product[0].messaging, product2[0]?.messaging, product3[0]?.messaging).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlight(product[0].messaging, product2[0]?.messaging, product3[0]?.messaging).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlight(product[0].messaging, product2[0]?.messaging, product3[0]?.messaging).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            )}

                            {!batteryCompare ? (
                                <>
                                    <table className='border-t-4 border-x-2 table-fixed'>
                                        <tbody className='text-gray-700'>
                                            <tr className='border-b'>
                                                <th rowSpan="2" className=' w-[100px] uppercase border-x-2 align-top' style={{ minWidth: '93px' }}>
                                                    <div className='text-left text-red-600 text-lg'>Battery</div>

                                                </th>
                                                <td className='text-left font-bold hover:underline text-sm border-r-2' style={{ width: '109px' }}>Type</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].batteryLife}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].batteryLife}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].batteryLife}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>StandBy</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].standBy}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].standBy}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].standBy}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </>
                            ) : (
                                <table className='border-t-4 border-x-2 table-fixed'>
                                    <tbody className='text-gray-700'>
                                        <tr className='border-b'>
                                            <th rowSpan="2" className=' w-[100px] uppercase border-x-2 align-top' style={{ minWidth: '93px' }}>
                                                <div className='text-left text-red-600 text-lg'>Battery</div>

                                            </th>
                                            <td className='text-left font-bold hover:underline text-sm border-r-2' style={{ width: '109px' }}>Type</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlight(product[0].batteryLife, product2[0]?.batteryLife, product3[0]?.batteryLife).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlight(product[0].batteryLife, product2[0]?.batteryLife, product3[0]?.batteryLife).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlight(product[0].batteryLife, product2[0]?.batteryLife, product3[0]?.batteryLife).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className='border-b'>
                                            <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>StandBy</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlight(product[0].standBy, product2[0]?.standBy, product3[0]?.standBy).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlight(product[0].standBy, product2[0]?.standBy, product3[0]?.standBy).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlight(product[0].standBy, product2[0]?.standBy, product3[0]?.standBy).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            )}

                            {!miscCompare ? (
                                <>
                                    <table className='border-t-4 border-x-2'>
                                        <tbody className='text-gray-700'>
                                            <tr className='border-b'>
                                                <th rowSpan="5" className='w-[100px] text-left text-red-600 text-lg align-top uppercase border-x-2' style={{ minWidth: '93px' }}>Misc</th>
                                                <td className='text-left font-bold hover:underline text-sm border-r-2' style={{ width: '109px' }}>Colors</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].colors}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].colors}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].colors}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>SAR US</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].sarus}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].sarus}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].sarus}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>SAR EU</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].sareu}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].sareu}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].sareu}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>Price</td>
                                                <td className='text-left text-sm'>
                                                    <div className='flex w-[1032px]'>
                                                        <div className='w-1/3 text-left text-sm border-r-2'>{product[0].priceGroup}</div>
                                                        {product2.length > 0 ? (
                                                            <>
                                                                <div className='w-1/3 text-left text-sm border-r-2'>{product2[0].priceGroup}</div>
                                                            </>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm border-r-2'></div>
                                                        )}
                                                        {product3.length > 0 ? (
                                                            <div className='w-1/3 text-left text-sm'>{product3[0].priceGroup}</div>
                                                        ) : (
                                                            <div className='w-1/3 text-left text-sm'></div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </>
                            ) : (
                                <table className='border-t-4 border-x-2'>
                                    <tbody className='text-gray-700'>
                                        <tr className='border-b'>
                                            <th rowSpan="5" className='w-[100px] text-left text-red-600 text-lg align-top uppercase border-x-2' style={{ minWidth: '93px' }}>Misc</th>
                                            <td className='text-left font-bold hover:underline text-sm border-r-2' style={{ width: '109px' }}>Colors</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlight(product[0].colors, product2[0]?.colors, product3[0]?.colors).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlight(product[0].colors, product2[0]?.colors, product3[0]?.colors).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlight(product[0].colors, product2[0]?.colors, product3[0]?.colors).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className='border-b'>
                                            <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>SAR US</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlight(product[0].sarus, product2[0]?.sarus, product3[0]?.sarus).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlight(product[0].sarus, product2[0]?.sarus, product3[0]?.sarus).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlight(product[0].sarus, product2[0]?.sarus, product3[0]?.sarus).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className='border-b'>
                                            <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>SAR EU</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlight(product[0].sareu, product2[0]?.sareu, product3[0]?.sareu).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlight(product[0].sareu, product2[0]?.sareu, product3[0]?.sareu).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlight(product[0].sareu, product2[0]?.sareu, product3[0]?.sareu).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className='border-b'>
                                            <td className='w-1/6 text-left font-bold hover:underline text-md border-r-2'>Price</td>
                                            <td className='text-left text-sm'>
                                                <div className='flex w-[1032px]'>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>{compareAndHighlight(product[0].priceGroup, product2[0]?.priceGroup, product3[0]?.priceGroup).result1}</div>
                                                    <div className='w-1/3 text-left text-sm border-r-2'>
                                                        {product2.length > 0 ? compareAndHighlight(product[0].priceGroup, product2[0]?.priceGroup, product3[0]?.priceGroup).result2 : ''}
                                                    </div>
                                                    <div className='w-1/3 text-left text-sm'>
                                                        {product3.length > 0 ? compareAndHighlight(product[0].priceGroup, product2[0]?.priceGroup, product3[0]?.priceGroup).result3 : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            )}

                        </>
                    )}
                </div>
            </div>
        </div >

    );
}