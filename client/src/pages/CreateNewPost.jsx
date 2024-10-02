import { Alert, Button, FileInput, Select, TextInput, Modal, Toast } from 'flowbite-react';
import { HiCheck } from "react-icons/hi";
import { GoTriangleDown } from "react-icons/go";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useState, useEffect } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';
import { ToolbarOptions } from "../common/quill.constant";

export default function CreateNewPost() {
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showMessageSuccess, setShowMessageSuccess] = useState(null);
    const navigate = useNavigate();
    const productLines = ['A', 'S', 'Z', 'M', 'F', 'Note'];
    const productModels = {
        A: ['Galaxy A54', 'Galaxy A34', 'Galaxy A73', 'Galaxy A52', 'Galaxy A72', 'Galaxy A32', 'Galaxy A22', 'Galaxy A12', 'Galaxy A02s', 'Galaxy A01'],
        S: ['Galaxy S23', 'Galaxy S22', 'Galaxy S21', 'Galaxy S20', 'Galaxy S20 FE', 'Galaxy S10', 'Galaxy S10+', 'Galaxy S9', 'Galaxy S9+', 'Galaxy S8'],
        Z: ['Galaxy Z Fold5', 'Galaxy Z Flip5', 'Galaxy Z Fold4', 'Galaxy Z Flip4', 'Galaxy Z Fold3', 'Galaxy Z Flip3', 'Galaxy Z Fold2', 'Galaxy Z Flip', 'Galaxy Z Fold', 'Galaxy Z Fold Lite'],
        M: ['Galaxy M14', 'Galaxy M33', 'Galaxy M53', 'Galaxy M12', 'Galaxy M21', 'Galaxy M31', 'Galaxy M22', 'Galaxy M02', 'Galaxy M42', 'Galaxy M32'],
        F: ['Galaxy F23', 'Galaxy F54', 'Galaxy F41', 'Galaxy F12', 'Galaxy F22', 'Galaxy F02s', 'Galaxy F62', 'Galaxy F52', 'Galaxy F42', 'Galaxy F51'],
        Note: ['Galaxy Note20', 'Galaxy Note10', 'Galaxy Note9', 'Galaxy Note8', 'Galaxy Note7', 'Galaxy Note5', 'Galaxy Note4', 'Galaxy Note3', 'Galaxy Note2', 'Galaxy Note Edge']
    };

    const [selectedLine, setSelectedLine] = useState('');
    const [models, setModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState('');

    const handleLineChange = (e) => {
        setSelectedLine(e.target.value);
        setSelectedModel(''); // Reset model khi thay đổi dòng sản phẩm
    };

    // Xử lý khi chọn model điện thoại
    const handleModelChange = (e) => {
        setSelectedModel(e.target.value);
    };

    const handleSelectChange = (e) => {
        const selected = e.target.value;
        setSelectedLine(selected);

        setModels(productModels[selected] || []);
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
        const fetchProducts = async () => {
            try {
                const res = await fetch(`/api/product/getallproducts`);
                const data = await res.json();
                if (res.ok) {
                    setProducts(data.products);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        fetchProducts();
    }, []);

    const handleUpdloadImage = async () => {
        try {
            if (!file) {
                setImageUploadError('Please select an image');
                return;
            }
            setImageUploadError(null);
            const storage = getStorage(app);
            const fileName = new Date().getTime() + '-' + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadProgress(progress.toFixed(0));
                },
                (error) => {
                    setImageUploadError('Image upload failed');
                    setImageUploadProgress(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageUploadProgress(null);
                        setImageUploadError(null);
                        setFormData({ ...formData, image: downloadURL });
                    });
                }
            );
        } catch (error) {
            setImageUploadError('Image upload failed');
            setImageUploadProgress(null);
            console.log(error);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/post/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                setPublishError(data.message);
                return;
            }

            if (res.ok) {
                setPublishError(null);
                setShowMessageSuccess(true);
                // setTimeout(() => {
                //   navigate(`/post/${data.slug}`);
                // }, 3000);

            }
        } catch (error) {
            setPublishError('Something went wrong');
        }
    };
    return (
        <div className='p-1 max-w-4xl mx-auto h-auto mb-5'>
            <h1 className='p-2 text-center font-bold text-3xl mb-5'>Create new Review's post </h1>
            <div>
                <form className='flex flex-col gap-4 p-5 bg-gray-100' onSubmit={handleSubmit}>
                    <div className='flex flex-col gap-4 sm:flex-row justify-between text-gray-700'>
                        <TextInput
                            type='text'
                            placeholder='Title'
                            required
                            id='title'
                            className='flex-1 font-semibold'
                            onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                            }
                        />
                        <Select
                            className='text-gray-400'
                            onChange={(e) =>
                                setFormData({ ...formData, category: e.target.value })
                            }
                        >
                            <option value='uncategorized'>Select a category</option>
                            {categories.map(category => (
                                <option key={category._id} value={category.categoryName}>
                                    {category.categoryName.charAt(0).toUpperCase() + category.categoryName.slice(1)}
                                </option>
                            ))}
                        </Select>
                    </div>

                    <div className='w-full text-gray-700'>
                        {/* <Select
                            onChange={(e) =>
                                setFormData({ ...formData, product: e.target.value })
                            }
                        >
                            <option value='uncategorized'>Select a phone</option>
                            {products.map(product => (
                                <option key={product._id} value={product.title}>
                                    <li>
                                        <img src={product.image} className='w-8 h-8 object-cover' />
                                        <span>{product.title}</span>
                                    </li>
                                </option>
                            ))}
                        </Select> */}
                        <div className='w-full relative rounded'>
                            <button
                                type='button'
                                onClick={() => setDropdownOpen(!dropdownOpen)}  // Toggle dropdown
                                className='w-full flex border border-gray-300 px-4 py-2 bg-white text-left font-semibold rounded-md'
                            ><span className='ml-1'>{formData.product ? (formData.product.category.charAt(0).toUpperCase() + formData.product.category.slice(1) + " " + formData.product.title) : 'Select a phone'}</span><GoTriangleDown className='inline w-6 h-6 ml-auto' /></button>

                            {dropdownOpen && (
                                <ul className='absolute z-10 w-full border border-gray-300 bg-white max-h-64 overflow-y-auto'>
                                    {products.map(product => (
                                        <div className='hover:text-red-700 hover:border-l-red-600 hover:border-4' style={{ marginLeft: '1px' }}>
                                            <li
                                                key={product._id}
                                                onClick={() => {
                                                    setFormData({ ...formData, product });
                                                    setDropdownOpen(false);  // Close dropdown after selecting
                                                }}
                                                className='flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer'
                                            >
                                                <img src={product.image} alt={product.title} className='w-12 h-12 object-cover' />
                                                <span className='font-semibold'>{product.category.charAt(0).toUpperCase() + product.category.slice(1) + " " + product.title}</span>
                                            </li>

                                        </div>
                                    ))}
                                </ul>
                            )}


                        </div>

                    </div>

                    <div className='flex items-center w-full'>
                        <div className='w-1/2'>
                            <Select
                                id="productLineSelect"
                                className="text-gray-400"
                                value={selectedLine}
                                onChange={handleLineChange}

                            >
                                <option value="">Select seri</option>
                                {productLines.map((line, index) => (
                                    <option key={index} value={line}>
                                        {line}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        <div className='w-1/2'>
                            {selectedLine && productModels[selectedLine] && (
                                <div className="ml-3">
                                    <Select
                                        id="modelSelect"
                                        className="text-gray-400"
                                        value={selectedModel}
                                        onChange={handleModelChange}
                                    >
                                        <option value="">Select model</option>
                                        {productModels[selectedLine].map((model, index) => (
                                            <option key={index} value={model}>
                                                {model}
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
                        <FileInput
                            type='file'
                            accept='image/*'
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                        <Button
                            type='button'
                            gradientDuoTone='purpleToBlue'
                            size='sm'
                            outline
                            onClick={handleUpdloadImage}
                            disabled={imageUploadProgress}
                        >
                            {imageUploadProgress ? (
                                <div className='w-16 h-16'>
                                    <CircularProgressbar
                                        value={imageUploadProgress}
                                        text={`${imageUploadProgress || 0}%`}
                                    />
                                </div>
                            ) : (
                                'Upload Image'
                            )}
                        </Button>
                    </div>
                    {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
                    {formData.image && (
                        <div className='flex items-center justify-center'>
                            <img
                                src={formData.image}
                                alt='upload'
                                className='w-60 h-72 object-cover'
                            />
                        </div>
                    )}
                    <ReactQuill
                        theme='snow'
                        placeholder='Write something...'
                        className='h-[800px] mb-12 bg-white'
                        required
                        modules={{ toolbar: ToolbarOptions }}
                        onChange={(value) => {
                            setFormData({ ...formData, content: value });
                        }}
                    />
                    <Button type='submit' gradientDuoTone='purpleToPink'>
                        Publish
                    </Button>
                    {publishError && (
                        <Alert className='mt-5' color='failure'>
                            {publishError}
                        </Alert>
                    )}

                    <Modal
                        show={showMessageSuccess}
                        size="md"
                        onClose={() => setShowMessageSuccess(false)}
                        popup
                    >

                        <Modal.Body className='p-0'>
                            <div className='text-center'>
                                <div className='flex items-center justify-center bg-green-500'>
                                    <HiCheck className="mx-auto mb-3 h-7 w-7 rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200 mt-3" />
                                </div>
                                <div className='flex items-center justify-center h-[70px]'>
                                    <h2 className="text-3xl font-bold text-green-500">Success!</h2>
                                </div>

                                <h3 className="mb-5 text-md font-normal text-gray-500 dark:text-gray-400">
                                    You have just created this post. Please wait for approval!
                                </h3>

                                <div className="flex justify-center gap-4">
                                    <Button color="success" className='w-[120px] mb-4'
                                        onClick={() => {
                                            setShowMessageSuccess(false);
                                            onClose();
                                        }}
                                    >
                                        {"Okay"}
                                    </Button>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>

                </form>

            </div>
        </div>

    );
}
