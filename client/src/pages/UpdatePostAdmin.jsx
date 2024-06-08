import { Alert, Button, FileInput, Select, TextInput, Modal } from 'flowbite-react';
import ReactQuill from 'react-quill';
import { HiCheck } from "react-icons/hi";
import 'react-quill/dist/quill.snow.css';
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToolbarOptions } from "../common/quill.constant";


export default function UpdatePostAdmin() {
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);
    const { postId } = useParams();
    const [categories, setCategories] = useState([]);
    const [showMessageSuccess, setShowMessageSuccess] = useState(null);
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        try {
            const fetchPost = async () => {
                const res = await fetch(`/api/post/getpost/info?postId=${postId}`);
                const data = await res.json();
                if (!res.ok) {
                    console.log(data.message);
                    setPublishError(data.message);
                    return;
                }
                if (res.ok) {
                    setPublishError(null);
                    setFormData(data.posts[0]);
                }
            };

            fetchPost();
        } catch (error) {
            console.log(error.message);
        }

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

    }, [postId]);

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
            const res = await fetch(`/api/post/updatepost/${postId}/${currentUser._id}`, {
                method: 'PUT',
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
                setTimeout(() => {
                    navigate(`/dashboard?tab=posts`);
                }, 3000);

            }
        } catch (error) {
            setPublishError('Something went wrong');
        }
    };
    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>
            <h1 className='text-center text-3xl my-7 font-semibold'>Update post</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                    <TextInput
                        type='text'
                        placeholder='Title'
                        required
                        id='title'
                        className='flex-1'
                        onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                        }
                        value={formData.title}
                    />
                    <Select
                        onChange={(e) =>
                            setFormData({ ...formData, category: e.target.value })
                        }
                        value={formData.category}
                    >
                        <option value='uncategorized'>Select a category</option>
                        {categories.map(category => (
                            <option key={category._id} value={category.categoryName}>
                                {category.categoryName.charAt(0).toUpperCase() + category.categoryName.slice(1)}
                            </option>
                        ))}
                    </Select>
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
                    <img
                        src={formData.image}
                        alt='upload'
                        className='w-full h-72 object-cover'
                    />
                )}
                <ReactQuill
                    theme='snow'
                    value={formData.content}
                    placeholder='Write something...'
                    className='h-72 mb-12'
                    required
                    modules={{ toolbar: ToolbarOptions }}
                    onChange={(value) => {
                        setFormData({ ...formData, content: value });
                    }}
                />
                <Button type='submit' gradientDuoTone='purpleToPink'>
                    Update post
                </Button>
                {publishError && (
                    <Alert className='mt-5' color='failure'>
                        {publishError}
                    </Alert>
                )}

                <Modal
                    show={showMessageSuccess}
                    size="md"
                    onClose={() => {
                        setShowMessageSuccess(false);
                        navigate(`/dashboard?tab=posts`);
                    }}
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
                                Updated this post successfully. The system will automatically redirect to management page!
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
    );
}
