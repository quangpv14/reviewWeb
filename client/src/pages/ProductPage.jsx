import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, Tooltip } from 'flowbite-react';
import { FaWeight, FaMicrochip, FaMobileAlt, FaCamera } from 'react-icons/fa';
import { FaCalendarDays } from "react-icons/fa6";
import { GrSystem } from "react-icons/gr";
import { SlScreenSmartphone } from "react-icons/sl";
import { MdBatteryCharging80 } from "react-icons/md";
import { BiCategory } from "react-icons/bi";
import { RiPhoneFindLine } from "react-icons/ri";
import { IoEyeSharp } from "react-icons/io5";
import { MdOutlineCompare } from "react-icons/md";
import { BsFillChatSquareTextFill } from "react-icons/bs";
import { BsImage } from "react-icons/bs";



export default function ProductByCategory() {
    const { productId } = useParams();
    const [product, setProduct] = useState([]);
    const [categories, setCategories] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

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

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

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

                    {product.length > 0 && (
                        <>
                            <div className='w-3/4 ml-10 w-auto'>
                                <div className=' w-full font-medium'>
                                    <div className='flex items-center text-white text-4xl font-bold w-[900px] bg-gray-500 p-1' >
                                        {product[0].category ? product[0].category.charAt(0).toUpperCase() + product[0].category.slice(1) : ''} {product[0].title}
                                    </div>
                                </div>
                                <div className='flex border-2 border-gray-100'>
                                    <div className='w-1/5'>
                                        <img className="h-50 w-40 mt-2" src={product[0].image} alt={product[0].title} />
                                    </div>

                                    <div className='w-3/5'>
                                        <div className='h-[100px] mt-2 ml-2 border-r-2 border-indigo-400 text-sm'>
                                            <div><FaCalendarDays className='inline mr-2 mb-1 h-3' />{product[0].status}</div>
                                            <div className='mt-1'><FaMobileAlt className='inline mr-2 mb-1 h-3' />{product[0].weight}</div>
                                            <div className='mt-1'><GrSystem className='inline mr-2 mb-1 h-3' />{product[0].os}</div>
                                            <div className='mt-1'>
                                                <FaMicrochip className='inline mr-2 mb-1 h-3' />
                                                {getStorageSummary(product[0].internal, 0)} Storage, {product[0].cardSlot}
                                            </div>
                                        </div>
                                        <div className='flex'>
                                            <div className='w-1/2 mt-2 border-r-2 border-indigo-400'>
                                                <Tooltip className='ml-[72px] mt-[40px] w-[120px] bg-yellow-50 text-xs text-black' content="Display size and resolution">
                                                    <SlScreenSmartphone className='inline w-8 h-8' />
                                                    <strong className='text-lg items-center'>{product[0].size.match(/(\d+(\.\d+)?)/)[0]}''</strong>
                                                    <div className='ml-2 text-sm'>{product[0].resolution.split(',')[0]}</div>
                                                </Tooltip>
                                            </div>
                                            <div className='w-1/2 mt-2 border-r-2 border-indigo-400'>
                                                <Tooltip className='ml-[105px] mt-[40px] w-[110px] bg-yellow-50 text-xs text-black'
                                                    content="Camera: photo and video"
                                                >
                                                    <div className='flex'>
                                                        <FaCamera className='ml-2 inline w-6 h-8' />
                                                        <strong className='text-lg items-center justify-center ml-2 mt-1'>{product[0].primary.split(',')[0]}</strong>
                                                    </div>
                                                    <div className='ml-2 text-sm'>{product[0].video}</div>
                                                </Tooltip>

                                            </div>
                                        </div>
                                    </div>

                                    <div className='w-2/5'>
                                        <Tooltip className='ml-[105px] mt-[40px] w-[120px] bg-yellow-50 text-xs text-black'
                                            content="Battery capacity"
                                        >
                                            <div className='h-[100px]'>
                                                <div className='flex mt-2'>
                                                    <MdBatteryCharging80 className='ml-1 mt-2 inline w-9 h-8' />
                                                    <strong className='text-lg items-center justify-center mt-3'>Battery</strong>
                                                </div>
                                                <div className='ml-4 text-sm'>{product[0].batteryLife.split(',')[0]}</div>
                                            </div>
                                        </Tooltip>

                                        <Tooltip className='ml-[10px] mb-1 bg-yellow-50 text-xs text-black'
                                            content="RAM and chipset"
                                        >
                                            <div className='mt-2'>
                                                <div className='flex mt-2'>
                                                    <FaMicrochip className='ml-3 mt-2 inline w-6 h-6' />
                                                    <strong className='text-lg items-center justify-center ml-2 mt-2'>
                                                        {getStorageSummary(product[0].internal, 1)} RAM
                                                    </strong>
                                                </div>
                                                <div className='ml-4 text-sm'>{product[0].chipset.split(' (')[0]}</div>
                                            </div>
                                        </Tooltip>
                                    </div>

                                </div>
                                <div className='grid grid-cols-5 bg-gray-400 text-white h-11 font-bold items-center'>
                                    <button className='text-lg hover:bg-red-600 w-full h-full'><IoEyeSharp className='inline mb-1 mr-1' />REVIEW</button>
                                    <button className='text-lg hover:bg-red-600 w-full h-full'>Spec</button>
                                    <button className='text-lg hover:bg-red-600 w-full h-full'><BsFillChatSquareTextFill className='inline mb-1 mr-1' />Opinion</button>
                                    <button className='text-lg hover:bg-red-600 w-full h-full'>Images</button>
                                    <Link to={`/compare/${productId}`}
                                        className='w-full h-full flex items-center justify-center hover:bg-red-600'>
                                        <button className='text-lg'>
                                            <MdOutlineCompare className='inline mb-1 mr-1' />
                                            COMPARE
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className='max-w-7xl mx-auto p-3 flex flex-col gap-8'>
                <div className='flex'>
                    <div className='w-1/4 w-max-full'>
                        <h3 className='font-bold'>RELATED DEVICES</h3>
                    </div>
                    {product.length > 0 && (
                        <>
                            <div className='w-3/4 ml-10'>
                                <div className='border border-y-gray border-y-3 ml-3'>

                                    <table className='min-w-full bg-white border-t-4'>
                                        <tbody className='text-gray-700'>
                                            <tr className='border-b'>
                                                <th rowSpan="5" className='w-1/6 text-left text-red-600 text-xl align-top uppercase'>Network</th>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md'>Technology</td>
                                                <td className='w-2/3 w-full text-md flex'>
                                                    <span>{product[0].technology}</span>
                                                    <button onClick={toggleExpand} className='text-gray-500 hover:underline ml-auto pr-1'>
                                                        {isExpanded ? 'Collapse' : 'Expand'}
                                                    </button>
                                                </td>
                                            </tr>
                                            {isExpanded && (
                                                <>
                                                    <tr className='border-b'>
                                                        <td className='w-1/6 text-left font-bold hover:underline text-md'>2G bands</td>
                                                        <td className='w-2/3 text-left text-md'>{product[0].band2g}</td>
                                                    </tr>
                                                    <tr className='border-b'>
                                                        <td className='w-1/6 text-left font-bold hover:underline text-md'>3G bands</td>
                                                        <td className='w-2/3 text-left text-md'>{product[0].band3g}</td>
                                                    </tr>
                                                    <tr className='border-b'>
                                                        <td className='w-1/6 text-left font-bold hover:underline text-md'>4G bands</td>
                                                        <td className='w-2/3 text-left text-md'>{product[0].band4g}</td>
                                                    </tr>
                                                    <tr className='border-b'>
                                                        <td className='w-1/6 text-left font-bold hover:underline text-md'>Speed</td>
                                                        <td className='w-2/3 text-left text-md'>{product[0].speed}</td>
                                                    </tr>
                                                </>
                                            )}
                                        </tbody>
                                    </table>

                                    <table className='min-w-full bg-white border-t-4'>
                                        <tbody className='text-gray-700'>
                                            <tr className='border-b'>
                                                <th rowSpan="5" className='w-1/6 text-left text-red-600 text-xl align-top uppercase'>Launch</th>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md'>Announced</td>
                                                <td className='w-2/3 text-left text-md'>{product[0].announced}</td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md'>Status</td>
                                                <td className='w-2/3 text-left text-md'>{product[0].status}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <table className='min-w-full bg-white border-t-4'>
                                        <tbody className='text-gray-700'>
                                            <tr className='border-b'>
                                                <th rowSpan="5" className='w-1/6 text-left text-red-600 text-xl align-top uppercase'>Body</th>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md'>Dimensions</td>
                                                <td className='w-2/3 text-left text-md'>{product[0].dimensions}</td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md'>Weight</td>
                                                <td className='w-2/3 text-left text-md'>{product[0].weight}</td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md'>Build</td>
                                                <td className='w-2/3 text-left text-md'>{product[0].build}</td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md'>SIM</td>
                                                <td className='w-2/3 text-left text-md'>{product[0].sim}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <table className='min-w-full bg-white border-t-4'>
                                        <tbody className='text-gray-700'>
                                            <tr className='border-b'>
                                                <th rowSpan="5" className='w-1/6 text-left text-red-600 text-xl align-top uppercase'>Display</th>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md'>Type</td>
                                                <td className='w-2/3 text-left text-md'>{product[0].type}</td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md'>Size</td>
                                                <td className='w-2/3 text-left text-md'>{product[0].size}</td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md'>Resolution</td>
                                                <td className='w-2/3 text-left text-md'>{product[0].resolution}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <table className='min-w-full bg-white border-t-4'>
                                        <tbody className='text-gray-700'>
                                            <tr className='border-b'>
                                                <th rowSpan="5" className='w-1/6 text-left text-red-600 text-xl align-top uppercase'>Platform</th>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md'>OS</td>
                                                <td className='w-2/3 text-left text-md'>{product[0].os}</td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md'>Chipset</td>
                                                <td className='w-2/3 text-left text-md'>{product[0].chipset}</td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md'>CPU</td>
                                                <td className='w-2/3 text-left text-md'>{product[0].cpu}</td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md'>GPU</td>
                                                <td className='w-2/3 text-left text-md'>{product[0].gpu}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <table className='min-w-full bg-white border-t-4'>
                                        <tbody className='text-gray-700'>
                                            <tr className='border-b'>
                                                <th rowSpan="5" className='w-1/6 text-left text-red-600 text-xl align-top uppercase'>Memory</th>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md'>Card slot</td>
                                                <td className='w-2/3 text-left text-md'>{product[0].cardSlot}</td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md'>Internal</td>
                                                <td className='w-2/3 text-left text-md'>{product[0].internal}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <table className='min-w-full bg-white border-t-4'>
                                        <tbody className='text-gray-700'>
                                            <tr className='border-b'>
                                                <th rowSpan="5" className='w-1/6 text-left text-red-600 text-xl align-top uppercase'>Camera</th>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md'>Single</td>
                                                <td className='w-2/3 text-left text-md'>{product[0].camera}</td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md'>Features</td>
                                                <td className='w-2/3 text-left text-md'>{product[0].features}</td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md'>Video</td>
                                                <td className='w-2/3 text-left text-md'>{product[0].video}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <table className='min-w-full bg-white border-t-4'>
                                        <tbody className='text-gray-700'>
                                            <tr className='border-b'>
                                                <th rowSpan="5" className='w-1/6 text-left text-red-600 text-xl align-top uppercase'>Sounds</th>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md'>Loudspeaker</td>
                                                <td className='w-2/3 text-left text-md'>{product[0].loudSpeaker}</td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md'>3.5mm jack</td>
                                                <td className='w-2/3 text-left text-md'>{product[0].jack}</td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md'>Audio quality</td>
                                                <td className='w-2/3 text-left text-md'>{product[0].audioQuality}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <table className='min-w-full bg-white border-t-4'>
                                        <tbody className='text-gray-700'>
                                            <tr className='border-b'>
                                                <th rowSpan="6" className='w-1/6 text-left text-red-600 text-xl align-top uppercase'>Comms</th>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md'>Bluetooth</td>
                                                <td className='w-2/3 text-left text-md'>{product[0].bluetooth}</td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md'>GPS</td>
                                                <td className='w-2/3 text-left text-md'>{product[0].gps}</td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md'>NFC</td>
                                                <td className='w-2/3 text-left text-md'>{product[0].nfc}</td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md'>WLAN</td>
                                                <td className='w-2/3 text-left text-md'>{product[0].wlan}</td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md'>Radio</td>
                                                <td className='w-2/3 text-left text-md'>{product[0].radio}</td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md'>Usb</td>
                                                <td className='w-2/3 text-left text-md'>{product[0].usb}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <table className='min-w-full bg-white border-t-4'>
                                        <tbody className='text-gray-700'>
                                            <tr className='border-b'>
                                                <th rowSpan="3" className='w-1/6 text-left text-red-600 text-xl align-top uppercase'>Features</th>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md'>Performance</td>
                                                <td className='w-2/3 text-left text-md'>{product[0].performance}</td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md'>Sensor</td>
                                                <td className='w-2/3 text-left text-md'>{product[0].sensor}</td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md'>Messaging</td>
                                                <td className='w-2/3 text-left text-md'>{product[0].messaging}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <table className='min-w-full bg-white border-t-4'>
                                        <tbody className='text-gray-700'>
                                            <tr className='border-b'>
                                                <th rowSpan="3" className='w-1/6 text-left text-red-600 text-xl align-top uppercase'>Battery</th>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md'>Type</td>
                                                <td className='w-2/3 text-left text-md'>{product[0].batteryLife}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <table className='min-w-full bg-white border-y-4'>
                                        <tbody className='text-gray-700'>
                                            <tr className='border-b'>
                                                <th rowSpan="4" className='w-1/6 text-left text-red-600 text-xl align-top uppercase'>Misc</th>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md'>Colors</td>
                                                <td className='w-2/3 text-left text-md'>{product[0].colors}</td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md'>SAR US</td>
                                                <td className='w-2/3 text-left text-md'>{product[0].sarus}</td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md'>SAR EU</td>
                                                <td className='w-2/3 text-left text-md'>{product[0].sareu}</td>
                                            </tr>
                                            <tr className='border-b'>
                                                <td className='w-1/6 text-left font-bold hover:underline text-md'>Price</td>
                                                <td className='w-2/3 text-left text-md'>{product[0].priceGroup}</td>
                                            </tr>

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className='flex'>
                    <div className='w-1/4 w-max-full'></div>
                    <div className='w-3/4 ml-10'>
                        <p className='ml-10'>
                            <strong>Disclaimer.</strong>
                            {" We cannot guarantee that the information on this page is 100% correct. "}
                            <a className='underline' href="#">Read more</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
