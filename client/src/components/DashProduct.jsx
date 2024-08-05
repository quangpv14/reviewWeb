import { Alert, Button, Modal, ModalBody, TextInput, Label, Select, FileInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Link } from 'react-router-dom';

export default function DashProduct() {
    const { currentUser } = useSelector((state) => state.user);
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [createProductSuccess, setCreateProductSuccess] = useState(null);
    const [createProductError, setCreateProductError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({});

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
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));
        }
    };

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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCreateProductSuccess(null);
        setCreateProductError(null);

        try {
            const res = await fetch(`/api/product/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                setCreateProductError(data.message);
            } else {
                setCreateProductSuccess("You have created successfully");
            }
        } catch (error) {
            setCreateProductError(error);
        }
    };

    return (
        <div className='max-w-full mx-auto p-3 w-full'>
            <div>
                <h1 className='my-7 text-center font-semibold text-3xl w-[3/4]'>Create Product</h1>
            </div>
            <div className='mx-auto my-4' >
                <div className='flex border-b'>
                    <h2 className='font-bold p-2'>Phone information</h2>

                </div>
                <div className='flex p-2'>
                    <div className='w-1/4'>
                        <h3 className='p-2'>Select a category for product</h3>
                    </div>
                    <Select
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

                <div className='p-2'>
                    <div className='flex p-2'>
                        <div className='w-1/4'>
                            <label for="title">Title</label>

                        </div>
                        <div>
                            <TextInput
                                type='text'
                                id='title'
                                onChange={handleChange}
                                style={{ width: '500px' }}
                            />
                        </div>
                    </div>
                </div>

                <div className='flex border-b mt-3 p-2'>
                    <div className='w-1/4'>
                        <h3 className='p-2'>Add image to this phone</h3>
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
                </div>
                {formData.image && (
                    <div className='flex justify-center'>
                        <img
                            src={formData.image}
                            alt='upload'
                            className=' h-48 w-48 object-cover p-2'
                        />

                    </div>
                )}

                <div className=' p-2'>
                    <form onSubmit={handleSubmit}>
                        <div>
                            {/* Launch... */}
                            <div>
                                <div className='flex border-b'>
                                    <h2 className='font-bold p-2'>LAUNCH</h2>
                                </div>
                                <div>
                                    <p className='p-2'>Optional description for this heading</p>
                                </div>

                                <div
                                    className="input-technology p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="technology" className='w-1/4'>Technology</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='technology'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>GSM/HSPA</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="input-announced p-2"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="announced" className='w-1/4'>Announced</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='announced'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>2015, August</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="input-status p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="status" className='w-1/4'>Status</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='status'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>Coming soon, Exp.release 2015 October</strong></em>
                                    </div>
                                </div>

                            </div>

                            {/* Platform... */}
                            <div>
                                <div className='flex border-b'>
                                    <h2 className='font-bold p-2'>PLATFORM</h2>
                                </div>
                                <div>
                                    <p className='p-2'>Optional description for this heading</p>
                                </div>

                                <div
                                    className="input-os p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="os" className='w-1/4'>OS</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='os'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>Tizen-based wearable platform</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="input-protection p-2"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="protection" className='w-1/4'>Protection</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='protection'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>Coming Gorilla Glass 4(To be confirmed)</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="input-cpu p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="cpu" className='w-1/4'>CPU</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='cpu'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>Dual-Core 1 Ghz</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="input-gpu p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="gpu" className='w-1/4'>GPU</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='gpu'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>Mali-T760MPB</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="input-chipset p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="cpu" className='w-1/4'>Chipset</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='chipset'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>Qualcomm MSM8x26</strong></em>
                                    </div>
                                </div>
                            </div>

                            {/* Body... */}
                            <div>
                                <div className='flex border-b'>
                                    <h2 className='font-bold p-2'>BODY</h2>
                                </div>
                                <div>
                                    <p className='p-2'>Optional description for this heading</p>
                                </div>

                                <div
                                    className="input-dimensions p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="dimensions" className='w-1/4'>Dimensions</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='dimensions'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>51.8x44x13.4 mm(2.01x1.73x0.53 in)</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="input-weight p-2"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="weight" className='w-1/4'>Weight</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='weight'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>51 g(1.80 oz)</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="input-sim p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="sim" className='w-1/4'>SIM</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='sim'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>Electronic SIM card(e-SIM)</strong></em>
                                    </div>
                                </div>
                            </div>

                            {/* Display... */}
                            <div>
                                <div className='flex border-b'>
                                    <h2 className='font-bold p-2'>DISPLAY</h2>
                                </div>
                                <div>
                                    <p className='p-2'>Optional description for this heading</p>
                                </div>

                                <div
                                    className="p-2"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="display" className='w-1/4'>Display</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='display'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>Contrast ratio =&gt; Infinite(nominal), 4.090(sunlight)</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="type" className='w-1/4'>Type</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='type'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>Super AMOLED capacitive touchscreen, 16M colors</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="size" className='w-1/4'>Size</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='size'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>1.2 inches(~40.2% screen-to-body ratio)</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="multitouch" className='w-1/4'>Multitouch</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='multitouch'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>Yes</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="resolution" className='w-1/4'>Resolution</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='resolution'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>360x360 pixels(~302 ppi pixel density)</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="build" className='w-1/4'>Build</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='build'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>Corning Gorilla Glass 4 back panel</strong></em>
                                    </div>
                                </div>
                            </div>

                            {/* Network... */}
                            <div>
                                <div className='flex border-b'>
                                    <h2 className='font-bold p-2'>NETWORK</h2>
                                </div>
                                <div>
                                    <p className='p-2'>Optional description for this heading</p>
                                </div>

                                <div
                                    className="p-2"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="speed" className='w-1/4'>Speed</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='speed'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>HSPA</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="gprs" className='w-1/4'>GPRS</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='gprs'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>Yes</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="edge" className='w-1/4'>EDGE</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='edge'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>Yes</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="band2g" className='w-1/4'>2G bands</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='band2g'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>GSM 900/1800</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="band3g" className='w-1/4'>3G bands</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='band3g'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>HSDPA 900/2100</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="band4g" className='w-1/4'>4G bands</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='band4g'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>LTE band 2(1900), 3(1800), 4(1700/2100), 7(2600), 13(700) - N920V </strong></em>
                                    </div>
                                </div>
                            </div>

                            {/* Camera... */}
                            <div>
                                <div className='flex border-b'>
                                    <h2 className='font-bold p-2'>CAMERA</h2>
                                </div>
                                <div>
                                    <p className='p-2'>Optional description for this heading</p>
                                </div>

                                <div
                                    className="p-2"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="camera" className='w-1/4'>Camera</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='camera'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>Photo / Video</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="video" className='w-1/4'>Video</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='video'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>2160p@30fps, 1080p@60fps, optical stabilization, dual-video rec</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="primary" className='w-1/4'>Primary</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='primary'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>16MP, 5312x2988 pixels, optical image stabilization, autofocus, LED flash</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="features" className='w-1/4'>Features</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='features'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>Dual Shot, Simultaneous HD video and image recording, geo-tagging, touch focus, face/smile detection</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="secondary" className='w-1/4'>Secondary</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='secondary'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>5MP</strong></em>
                                    </div>
                                </div>
                            </div>

                            {/* Memory... */}
                            <div>
                                <div className='flex border-b'>
                                    <h2 className='font-bold p-2'>MEMORY</h2>
                                </div>
                                <div>
                                    <p className='p-2'>Optional description for this heading</p>
                                </div>

                                <div
                                    className="p-2"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="callRecord" className='w-1/4'>Call records</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='callRecord'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>Yes</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="cardSlot" className='w-1/4'>Card Slot</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='cardSlot'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>No</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="phoneBook" className='w-1/4'>Phonebook</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='phoneBook'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>Yes</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="internal" className='w-1/4'>Internal</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='internal'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>4 GB, 512MB RAM</strong></em>
                                    </div>
                                </div>
                            </div>

                            {/* SOUND... */}
                            <div>
                                <div className='flex border-b'>
                                    <h2 className='font-bold p-2'>SOUND</h2>
                                </div>
                                <div>
                                    <p className='p-2'>Optional description for this heading</p>
                                </div>

                                <div
                                    className="p-2"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="alarm" className='w-1/4'>Alarm</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='alarm'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>Yes</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="alertType" className='w-1/4'>Alert Types</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='alertType'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>MP3, WAV ringtones</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="jack" className='w-1/4'>3.5mm jack</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='jack'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>No</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="audioQuality" className='w-1/4'>Audio quality</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='audioQuality'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>Noise-93.5dB / Crosstalk-94.7dB</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="loudSpeaker" className='w-1/4'>Loud Speaker</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='loudSpeaker'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>Yes</strong></em>
                                    </div>
                                </div>
                            </div>

                            {/* Battery... */}
                            <div>
                                <div className='flex border-b'>
                                    <h2 className='font-bold p-2'>BATTERY</h2>
                                </div>
                                <div>
                                    <p className='p-2'>Optional description for this heading</p>
                                </div>

                                <div
                                    className="p-2"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="musicPlay" className='w-1/4'>Music Play</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='musicPlay'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>Up to 57h</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="batteryLife" className='w-1/4'>Battery Life</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='batteryLife'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>Endurance rating 85h</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="standBy" className='w-1/4'>Stand By</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='standBy'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>Up to 48h(3G)</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="talkTime" className='w-1/4'>Talk Time</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='talkTime'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>67 Hours</strong></em>
                                    </div>
                                </div>
                            </div>

                            {/* Comms... */}
                            <div>
                                <div className='flex border-b'>
                                    <h2 className='font-bold p-2'>COMMS</h2>
                                </div>
                                <div>
                                    <p className='p-2'>Optional description for this heading</p>
                                </div>

                                <div
                                    className="p-2"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="bluetooth" className='w-1/4'>Bluetooth</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='bluetooth'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>v4.1, A2DP</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="gps" className='w-1/4'>GPS</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='gps'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>Yes, with A-GPS</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="nfc" className='w-1/4'>NFC</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='nfc'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>Yes</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="wlan" className='w-1/4'>WLAN</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='wlan'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>Wifi 802.11 b/g/n</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="radio" className='w-1/4'>Radio</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='radio'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>Yes</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="usb" className='w-1/4'>USB</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='usb'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>Yes</strong></em>
                                    </div>
                                </div>
                            </div>

                            {/* Features... */}
                            <div>
                                <div className='flex border-b'>
                                    <h2 className='font-bold p-2'>FEATURES</h2>
                                </div>
                                <div>
                                    <p className='p-2'>Optional description for this heading</p>
                                </div>

                                <div
                                    className="p-2"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="performance" className='w-1/4'>Performance</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='performance'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>Basemark OSII=&gt; 1852/Basemark X=&gt; 26281</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="keyboard" className='w-1/4'>Keyboard</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='keyboard'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>QWERTY</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="language" className='w-1/4'>Languages</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='language'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}> English, Spanish, French, Vietnamese</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="infraredPort" className='w-1/4'>Infrared Port</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='infraredPort'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>Yes</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="game" className='w-1/4'>Games</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='game'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>Downloadable</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="messaging" className='w-1/4'>Messaging</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='messaging'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>SMS(threaded view), MMS, Email</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="sensor" className='w-1/4'>Sensors</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='sensor'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>Accelerometer, gyro, heart rate, barometer</strong></em>
                                    </div>
                                </div>
                            </div>

                            {/* MISC... */}
                            <div>
                                <div className='flex border-b'>
                                    <h2 className='font-bold p-2'>MISC</h2>
                                </div>
                                <div>
                                    <p className='p-2'>Optional description for this heading</p>
                                </div>

                                <div
                                    className="p-2"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="colors" className='w-1/4'>Colors</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='colors'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>Dark Gray, Silver</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="sareu" className='w-1/4'>SAR EU</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='sareu'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>0.05 W/kg(head) =&gt; 0.30 W/kg(body)</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="sarus" className='w-1/4'>SAR US</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='sarus'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>1.16 W/kg(head) 1.48 W/kg(body)</strong></em>
                                    </div>
                                </div>
                                <div
                                    className="p-2 mt-1"
                                    style={{ display: 'flex' }}
                                >
                                    <label for="priceGroup" className='w-1/4'>Price Group</label>
                                    <div>
                                        <TextInput
                                            type='text'
                                            id='priceGroup'
                                            onChange={handleChange}
                                            style={{ width: '500px' }}
                                        />
                                        <em>Example value: <strong style={{ fontWeight: '630' }}>7/10 (About 350 EUR)</strong></em>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='flex justify-center mt-3'>
                            <Button
                                type='submit'
                                gradientDuoTone='purpleToBlue'
                                outline
                                style={{ width: '500px' }}
                            >Create new product
                            </Button>

                        </div>

                    </form>

                </div>
            </div >

            {
                createProductSuccess && (
                    <Alert color='success' className='mt-5'>
                        {createProductSuccess}
                    </Alert>
                )
            }
            {
                createProductError && (
                    <Alert color='failure' className='mt-5'>
                        {createProductError}
                    </Alert>
                )
            }
        </div >
    );
}
