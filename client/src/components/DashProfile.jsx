import { Alert, Button, Modal, ModalBody, TextInput, Label, Select } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
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
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';
const vietnamProvinces = [
  'An Giang', 'Bà Rịa - Vũng Tàu', 'Bạc Liêu', 'Bắc Kạn', 'Bắc Giang', 'Bắc Ninh', 'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước',
  'Bình Thuận', 'Cà Mau', 'Cao Bằng', 'Cần Thơ', 'Đà Nẵng', 'Đắk Lắk', 'Đắk Nông', 'Điện Biên', 'Đồng Nai', 'Đồng Tháp',
  'Gia Lai', 'Hà Giang', 'Hà Nam', 'Hà Nội', 'Hà Tĩnh', 'Hải Dương', 'Hải Phòng', 'Hậu Giang', 'Hòa Bình', 'Hưng Yên',
  'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu', 'Lâm Đồng', 'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định', 'Nghệ An',
  'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Phú Yên', 'Quảng Bình', 'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị', 'Sóc Trăng',
  'Sơn La', 'Tây Ninh', 'Thái Bình', 'Thái Nguyên', 'Thanh Hóa', 'Thừa Thiên Huế', 'Tiền Giang', 'TP. Hồ Chí Minh', 'Trà Vinh', 'Tuyên Quang',
  'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái'
];
export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const formattedDate = currentUser.dateOfBirth ? new Date(currentUser.dateOfBirth).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if
    //       request.resource.size < 2 * 1024 * 1024 &&
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          'Could not upload image (File must be less than 2MB)'
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    // if (Object.keys(formData).length === 0) {
    //   setUpdateUserError('No changes made');
    //   return;
    // }
    if (imageFileUploading) {
      setUpdateUserError('Please wait for image to upload');
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        //dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      setUpdateUserError(null);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleChangeDate = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, dateOfBirth: e.target.value });
  };

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className='max-w-full mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl w-[3/4]'>Profile</h1>
      <div className='flex justify-center w-[3/4] mx-auto my-4' >
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-[770px]'>
          <input
            type='file'
            accept='image/*'
            onChange={handleImageChange}
            ref={filePickerRef}
            hidden
          />
          <div
            className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
            onClick={() => filePickerRef.current.click()}
          >
            {imageFileUploadProgress && (
              <CircularProgressbar
                value={imageFileUploadProgress || 0}
                text={`${imageFileUploadProgress}%`}
                strokeWidth={5}
                styles={{
                  root: {
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  },
                  path: {
                    stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100
                      })`,
                  },
                }}
              />
            )}
            <img
              src={imageFileUrl || currentUser.profilePicture}
              alt='user'
              className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadProgress &&
                imageFileUploadProgress < 100 &&
                'opacity-60'
                }`}
            />
          </div>
          {imageFileUploadError && (
            <Alert color='failure'>{imageFileUploadError}</Alert>
          )}
          <div className='flex w-full'>
            <div className='flex-1'>
              <div
                className="input-fullname"
                style={{ display: 'flex', alignItems: 'center', marginBottom: '18px' }}
              >
                <label for="fullname" style={{ marginRight: '18px' }}> Fullname</label>
                <TextInput
                  type='text'
                  id='fullname'
                  placeholder='fullname'
                  defaultValue={currentUser.fullname}
                  onChange={handleChange}
                  style={{ width: '280px' }}
                />
              </div>

              <div
                className="input-name"
                style={{ display: 'flex', alignItems: 'center', marginBottom: '18px' }}
              >
                <label for="username" style={{ marginRight: '10px' }}> Username</label>
                <TextInput
                  type='text'
                  id='username'
                  placeholder='username'
                  defaultValue={currentUser.username}
                  onChange={handleChange}
                  style={{ width: '280px' }}
                />
              </div>

              <div
                className="input-mail"
                style={{ display: 'flex', alignItems: 'center', marginBottom: '18px' }}
              >
                <label style={{ marginRight: '42px' }}> Email</label>
                <TextInput
                  type='email'
                  id='email'
                  placeholder='email'
                  value={currentUser.email}
                  onChange={handleChange}
                  style={{ width: '280px' }}

                />
              </div>

              <div
                className="input-place"
                style={{ display: 'flex', alignItems: 'center', marginBottom: '14px' }}
              >
                <label style={{ marginRight: '42px' }}> Place</label>
                <Select
                  id="place"
                  defaultValue={currentUser.place}
                  onChange={handleChange}
                  style={{ width: '280px' }}
                >
                  <option value="">Select Place</option>
                  {vietnamProvinces.map((province, index) => (
                    <option key={index} value={province}>{province}</option>
                  ))}
                </Select>
              </div>
            </div>

            <div className='flex-1'>
              <div
                className="input-gender"
                style={{ display: 'flex', alignItems: 'center', marginLeft: '30px', marginBottom: '18px' }}
              >
                <label for="gender" style={{ marginRight: '36px' }}> Gender</label>
                <Select
                  type='text'
                  id="gender"
                  defaultValue={currentUser.gender}
                  onChange={handleChange}
                  style={{ width: '180px' }}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Select>
              </div>

              <div
                className="input-date"
                style={{ display: 'flex', alignItems: 'center', marginLeft: '30px', marginBottom: '18px' }}
              >
                <label for="dateOfBirth" style={{ marginRight: '5px', width: '83px' }}> Date Birth</label>
                <input type="date" id="dateOfBirth" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Select date"
                  defaultValue={formattedDate}
                  onChange={handleChangeDate} style={{ width: '180px' }}>

                </input>
              </div>
              <div
                className="input-phone"
                style={{ display: 'flex', alignItems: 'center', marginLeft: '30px', marginBottom: '18px' }}
              >
                <label style={{ marginRight: '43px' }}> Phone </label>
                <TextInput
                  type='text'
                  id='phone'
                  placeholder='phone number'
                  defaultValue={currentUser.phone}
                  onChange={handleChange}
                  style={{ width: '180px' }}
                />
              </div>
              <div
                className="input-region"
                style={{ display: 'flex', alignItems: 'center', marginLeft: '30px', marginBottom: '18px' }}
              >
                <label for="gender" style={{ marginRight: '38px' }}> Region</label>
                <Select
                  type='text'
                  id="region"
                  onChange={handleChange}
                  defaultValue={currentUser.region}
                  style={{ width: '180px' }}

                >
                  <option value="Miền Bắc">Miền Bắc</option>
                  <option value="Miền Trung">Miền Trung</option>
                  <option value="Miền Nam">Miền Nam</option>
                </Select>
              </div>
            </div>
          </div>


          <Button
            type='submit'
            gradientDuoTone='purpleToBlue'
            outline
          >Update
          </Button>

        </form>
      </div >

      {
        updateUserSuccess && (
          <Alert color='success' className='mt-5'>
            {updateUserSuccess}
          </Alert>
        )
      }
      {
        updateUserError && (
          <Alert color='failure' className='mt-5'>
            {updateUserError}
          </Alert>
        )
      }
      {
        error && (
          <Alert color='failure' className='mt-5'>
            {error}
          </Alert>
        )
      }
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete your account?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div >
  );
}
