import { Alert, Button, Label, Spinner, TextInput, Select } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
//import { Datepicker } from 'flowbite-datepicker/Datepicker';

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
  const northernVietnamProvinces = [
    'Hà Giang', 'Cao Bằng', 'Lào Cai', 'Bắc Kạn', 'Lạng Sơn', 'Tuyên Quang', 'Yên Bái', 'Thái Nguyên', 'Phú Thọ', 'Bắc Giang',
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

  return provinceList.includes(city) ? true : false;

}
export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password || !formData.dateOfBirth ||
      !formData.fullname || !formData.phone || !formData.place || !formData.region) {
      return setErrorMessage('Please fill out all fields.');
    }

    if (!checkRegion(formData.place, formData.region)) {
      return setErrorMessage('Please choose place or region again.')
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      //setLoading(false);
      if (res.ok) {
        navigate('/sign-in');
      }
    } catch (error) {
      setErrorMessage(error.message);
      //setLoading(false);
    }
  };

  const handleChangeDate = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, dateOfBirth: e.target.value });
  };


  return (
    <div className='min-h-screen mt-10'>
      <div className='flex p-3 max-w-7xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* left */}
        <div className='flex-1 md:w-2/5 items-center md:justify-start pl-10'>
          <div className="flex md:w-2/5 items-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2e/Microsoft_Account_Logo.svg" alt="Product's Review" className="mr-1 w-40 h-40 rounded-full flex-1" />
            <Link to='/' className='font-bold dark:text-white text-4xl mr-500px'>
              <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
                Product's
              </span>
              Review
            </Link>

          </div>
          <div className="flex items-center justify-center">
            <p className='text-sm mt-5'>
              You can sign up with your email and password
              or with Google account.
            </p>
          </div>
        </div>
        {/* right */}

        <div className='flex-1  bg-gray-200 p-4 rounded-lg' style={{ maxWidth: '45%' }}>
          <h1 className="text-xl font-bold mb-5 text-center">Sign up Account</h1>
          <form className='grid grid-cols-1 sm:grid-cols-2 gap-2' onSubmit={handleSubmit}>
            <div className="sm:col-span-2 gap-4">
              <Label htmlFor="fullname" value="Full Name" />
              <TextInput
                type="text"
                placeholder="Full Name"
                id="fullname"
                value={formData.fullname}
                onChange={handleChange}
                aria-label="Full Name"

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
                <input type="date" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Select date" value={formData.dateOfBirth} onChange={handleChangeDate}></input>
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

              />
            </div>
            <div className="sm:col-span-2">
              <Label value='Your username' />
              <TextInput
                type='text'
                placeholder='Username'
                id='username'
                onChange={handleChange}
              />
            </div>
            <div className="sm:col-span-2">
              <Label value='Your email' />
              <TextInput
                type='email'
                placeholder='name@company.com'
                id='email'
                onChange={handleChange}
              />
            </div>
            <div className="sm:col-span-2">
              <Label value='Your password' />
              <TextInput
                type='password'
                placeholder='Password'
                id='password'
                onChange={handleChange}
              />
            </div>

            <div className="sm:col-span-1 gap-4">
              <Label htmlFor="place" value="Place of Residence" />
              <Select
                id="place"
                value={formData.place}
                onChange={handleChange}
                aria-label="Place of Residence"
                className="w-full"
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

              >
                <option value="">Select region</option>
                <option value="Miền Bắc">Miền Bắc</option>
                <option value="Miền Trung">Miền Trung</option>
                <option value="Miền Nam">Miền Nam</option>
              </Select>
            </div>


            <Button
              gradientDuoTone='purpleToPink'
              type='submit'
              //disabled={loading}
              className="col-span-2"
            >
              Sign Up
            </Button>

            <OAuth />



          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Have an account?</span>
            <Link to='/sign-in' className='text-blue-500'>
              Sign In
            </Link>
          </div>
          {errorMessage && (
            <Alert className='mt-5' color='failure'>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
