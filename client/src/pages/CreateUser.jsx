import { Alert, Button, Label, TextInput, Select, Modal } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const vietnamProvinces = [
    'An Giang', 'Bà Rịa - Vũng Tàu', 'Bạc Liêu', 'Bắc Kạn', 'Bắc Giang', 'Bắc Ninh', 'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước',
    'Bình Thuận', 'Cà Mau', 'Cao Bằng', 'Cần Thơ', 'Đà Nẵng', 'Đắk Lắk', 'Đắk Nông', 'Điện Biên', 'Đồng Nai', 'Đồng Tháp',
    'Gia Lai', 'Hà Giang', 'Hà Nam', 'Hà Nội', 'Hà Tĩnh', 'Hải Dương', 'Hải Phòng', 'Hậu Giang', 'Hòa Bình', 'Hưng Yên',
    'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu', 'Lâm Đồng', 'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định', 'Nghệ An',
    'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Phú Yên', 'Quảng Bình', 'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị', 'Sóc Trăng',
    'Sơn La', 'Tây Ninh', 'Thái Bình', 'Thái Nguyên', 'Thanh Hóa', 'Thừa Thiên Huế', 'Tiền Giang', 'TP. Hồ Chí Minh', 'Trà Vinh', 'Tuyên Quang',
    'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái'
];

function checkRegion(city, region) {
    const northernVietnamProvinces = ['Hà Giang', 'Cao Bằng', 'Lào Cai', 'Bắc Kạn', 'Lạng Sơn', 'Tuyên Quang', 'Yên Bái', 'Thái Nguyên', 'Phú Thọ', 'Bắc Giang',
        'Quảng Ninh', 'Bắc Ninh', 'Hà Nội', 'Vĩnh Phúc', 'Hưng Yên', 'Hải Dương', 'Hải Phòng', 'Thái Bình', 'Hà Nam', 'Nam Định',
        'Ninh Bình'
    ];
    const centralVietnamProvinces = ['Đà Nẵng', 'Huế', 'Quảng Nam', 'Quảng Bình', 'Quảng Trị', 'Thừa Thiên Huế', 'Bình Định', 'Phú Yên', 'Khánh Hòa', 'Ninh Thuận', 'Bình Thuận', 'Kon Tum', 'Gia Lai', 'Đắk Lắk', 'Đắk Nông', 'Lâm Đồng', 'Thanh Hóa', 'Nghệ An', 'Hà Tĩnh', 'Quảng Ngãi'];
    const southernVietnamProvinces = ['TP.Hồ Chí Minh', 'Cần Thơ', 'Bình Dương', 'Đồng Nai', 'Long An', 'Tiền Giang', 'Bến Tre', 'Vĩnh Long', 'Trà Vinh', 'Tây Ninh', 'Bà Rịa - Vũng Tàu', 'An Giang', 'Bạc Liêu', 'Bình Phước', 'Bình Thuận', 'Cà Mau', 'Đắk Nông', 'Đồng Tháp', 'Hậu Giang', 'Kiên Giang', 'Lâm Đồng', 'Ninh Thuận', 'Sóc Trăng', 'Tây Ninh', 'Vĩnh Long'];

    let provinceList = [];
    if (region.toLowerCase() === 'miền bắc') {
        provinceList = northernVietnamProvinces;
    } else if (region.toLowerCase() === 'miền trung') {
        provinceList = centralVietnamProvinces;
    } else if (region.toLowerCase() === 'miền nam') {
        provinceList = southernVietnamProvinces;
    } else {
        console.log("Không thuộc miền nào cả");
    }

    return provinceList.includes(city);
}

export default function CreateUser({ isOpen, onClose }) {
    const [createUserSuccess, setCreateUserSuccess] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    //const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullname: '',
        gender: '',
        dateOfBirth: '',
        phone: '',
        username: '',
        email: '',
        password: '',
        place: '',
        region: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [e.target.id]: e.target.value });
        if (id === 'place') {
            formData.place = e.target.value;
        }
        if (id === 'region') {
            formData.region = e.target.value;
        }
    };

    //console.log(formData);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(null);

        if (!formData.username || !formData.email || !formData.password || !formData.dateOfBirth ||
            !formData.fullname || !formData.phone || !formData.place || !formData.region) {
            return setErrorMessage('Please fill out all fields.');
        }

        if (!checkRegion(formData.place, formData.region)) {
            return setErrorMessage('Please choose place or region again.')
        }

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                return setErrorMessage(data.message);
            }
            else {
                setCreateUserSuccess("Created User successfully");
            }

        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const handleChangeDate = (e) => {
        setFormData({ ...formData, dateOfBirth: e.target.value });
    };

    return (
        <Modal show={isOpen} onClose={onClose} size="xl">
            <Modal.Header className='p-4'>Create new account</Modal.Header>
            <Modal.Body className='p-2'>
                <div className='flex items-center justify-center'>
                    <div className='w-[500px]'>
                        <div className='flex-1 rounded-lg p-1'>
                            <form onSubmit={handleSubmit}>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                                    <div className="sm:col-span-2 gap-4">
                                        <Label htmlFor="fullname" value="Full Name" />
                                        <TextInput
                                            type="text"
                                            placeholder="Full Name"
                                            id="fullname"
                                            value={formData.fullname}
                                            onChange={handleChange}
                                            aria-label="Full Name"
                                            style={{ height: '41.4px' }}
                                        />
                                    </div>
                                    <div className="sm:col-span-1 gap-4">
                                        <div className="flex-1">
                                            <Label htmlFor="gender" value="Gender" />
                                            <Select
                                                id="gender"
                                                value={formData.gender}
                                                onChange={handleChange}
                                                aria-label="Gender"
                                                style={{ height: '41.4px' }}
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <div>
                                            <Label htmlFor="dateOfBirth" value="Date of Birth" />
                                            <input type="date" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date" value={formData.dateOfBirth} onChange={handleChangeDate} style={{ height: '41.4px' }}></input>
                                        </div>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <Label htmlFor="phone" value="Phone Number" />
                                        <TextInput
                                            type="tel"
                                            placeholder="Phone Number"
                                            id="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            aria-label="Phone Number"
                                            style={{ height: '41.4px' }}
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <Label value='Your username' />
                                        <TextInput
                                            type='text'
                                            placeholder='Username'
                                            id='username'
                                            defaultValue={"@gmail.com"}
                                            onChange={handleChange}
                                            style={{ height: '41.4px' }}
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <Label value='Your email' />
                                        <TextInput
                                            type='email'
                                            placeholder='name@gmail.com'
                                            id='email'

                                            onChange={handleChange}
                                            style={{ height: '41.4px' }}
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <Label value='Your password' />
                                        <TextInput
                                            type='password'
                                            placeholder='Password'
                                            id='password'
                                            onChange={handleChange}
                                            style={{ height: '41.4px' }}
                                        />
                                    </div>
                                    <div className="sm:col-span-1">
                                        <Label htmlFor="place" value="Place of Residence" />
                                        <Select
                                            id="place"
                                            value={formData.place}
                                            onChange={handleChange}
                                            aria-label="Place of Residence"
                                            className="w-full"
                                            style={{ height: '41.4px' }}
                                        >
                                            <option value="">Select Place</option>
                                            {vietnamProvinces.map((province, index) => (
                                                <option key={index} value={province}>{province}</option>
                                            ))}
                                        </Select>
                                    </div>
                                    <div className="flex-1">
                                        <Label htmlFor="region" value="Region" />
                                        <Select
                                            id="region"
                                            value={formData.region}
                                            onChange={handleChange}
                                            aria-label="Region"
                                            style={{ height: '41.4px' }}
                                        >
                                            <option value="">Select region</option>
                                            <option value="Miền Bắc">Miền Bắc</option>
                                            <option value="Miền Trung">Miền Trung</option>
                                            <option value="Miền Nam">Miền Nam</option>
                                        </Select>
                                    </div>
                                </div>
                                <div className='flex items-center justify-center mt-4 mb-2'>
                                    <Button
                                        gradientDuoTone='greenToBlue'
                                        type='submit'
                                        outline
                                        style={{ width: '492px' }}
                                    >
                                        Create
                                    </Button>
                                </div>
                            </form>
                            {errorMessage && (
                                <Alert className='mt-5' color='failure'>
                                    {errorMessage}
                                </Alert>
                            )}
                        </div>
                    </div>
                </div>

                <div className='flex items-center justify-center'>
                    {
                        createUserSuccess && (
                            <Alert color='success' className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96'>
                                {createUserSuccess}
                            </Alert>
                        )
                    }
                    {
                        errorMessage && (
                            <Alert color='failure' className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96'>
                                {errorMessage}
                            </Alert>
                        )
                    }
                </div>
            </Modal.Body>
        </Modal>
    );
}
