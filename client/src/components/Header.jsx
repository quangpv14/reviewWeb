import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { HiDotsCircleHorizontal } from "react-icons/hi";
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';
import { useEffect, useState } from 'react';
import { IoIosNotifications } from "react-icons/io";
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';


export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState('');
  const [countNotify, setCountNotify] = useState(0);
  const [notifications, setNotifications] = useState([]);  // Danh sách thông báo
  const [showDropdownNotify, setShowDropdownNotify] = useState(false);  // Hiển thị dropdown
  //const [showLoginDialog, setShowLoginDialog] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    if (currentUser) {
      fetchUnreadNotificationsCount();
    }
  }, [currentUser]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const fetchUnreadNotificationsCount = async () => {
    if (!currentUser) {
      return;
    }

    try {
      const res = await fetch(`/api/notification/getcountnotify?userId=${currentUser._id}`);
      const data = await res.json();
      if (res.ok) {
        setCountNotify(data.notify);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchNotifications = async () => {
    if (!currentUser) return;

    try {
      const res = await fetch(`/api/notification/update/${currentUser._id}`);
      const data = await res.json();
      if (res.ok) {
        setNotifications(data.notify);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleNotificationClick = async () => {
    await fetchNotifications();
    await fetchUnreadNotificationsCount();
    setShowDropdownNotify(!showDropdownNotify);  // Toggle dropdown
  };

  const formatTime = (time) => {
    const now = new Date();
    const notificationTime = new Date(time);
    const diff = now - notificationTime; // Lấy chênh lệch thời gian

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} ngày trước`;
    } else if (hours > 0) {
      return `${hours} giờ trước`;
    } else if (minutes > 0) {
      return `${minutes} phút trước`;
    } else {
      return `${seconds} giây trước`;
    }
  };

  return (
    <Navbar className='border-b-2'>
      <Link
        to='/'
        className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'
      >
        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
          Product's
        </span>
        Review
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
          type='text'
          placeholder='Search...'
          rightIcon={AiOutlineSearch}
          className='hidden lg:inline'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <Button className='w-12 h-10 lg:hidden' color='gray' pill>
        <AiOutlineSearch />
      </Button>
      <div className='flex gap-2 md:order-2'>
        <IoIosNotifications className='w-6 h-6 mt-2 items-center'
          onClick={handleNotificationClick} />
        {countNotify > 0 && (
          <span className='absolute top-[10px] right-[210px] text-xs text-white bg-red-500 rounded-full w-5 h-5 flex items-center justify-center'>
            {countNotify}
          </span>
        )}
        {showDropdownNotify && (
          <div className="absolute top-[64px] right-[120px] w-[250px] bg-white shadow-md rounded-md border p-2">
            <div className="text-center font-semibold text-sm mb-2 bg-gray-100 p-2">Notifications</div>
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <div className='p-2'>
                  <div
                    key={index}
                    className="flex justify-between items-center cursor-pointer hover:bg-gray-100"
                  >
                    <span className='text-sm'>{notification.content}</span>
                    <span>
                      {notification.status ? (
                        <FaCheckCircle className="text-green-500" />
                      ) : (
                        <FaTimesCircle className="text-red-500" />
                      )}
                    </span>

                  </div>
                  <div className="text-xs text-gray-500">
                    {formatTime(notification.createdAt)}  {/* Hiển thị thời gian */}
                  </div>
                </div>

              ))
            ) : (
              <div className="text-center p-2 text-sm">No new notifications</div>
            )}
          </div>
        )}
        {currentUser && currentUser.isAdmin && (
          <Dropdown inline className='mr-5'>
            <Link to={'/dashboard?tab=dash'}>
              <Dropdown.Item>Dashboard</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Link to='/dashboard?tab=pendingposts'>
              <Dropdown.Item>Posts Management</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Link to='/dashboard?tab=users'>
              <Dropdown.Item>Users Management</Dropdown.Item>
            </Link>
          </Dropdown>
        )}
        <Button
          className='w-12 h-10 hidden sm:inline'
          color='gray'
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === 'light' ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt='user' img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className='block text-sm'>@{currentUser.username}</span>
              <span className='block text-sm font-medium truncate'>
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={'/dashboard?tab=profile'}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Link to='/changepassword'>
              <Dropdown.Item>Change Password</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to='/sign-in'>
            <Button gradientDuoTone='purpleToBlue' outline>
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === '/'} as={'div'}>
          <Link to='/'>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/about'} as={'div'}>
          <Link to='/about'>About</Link>
        </Navbar.Link>
        {currentUser ? (
          <Navbar.Link active={path === '/my-posts'} as={'div'}>
            <Link to='/my-posts'>My Posts</Link>
          </Navbar.Link>
        ) : (
          <Navbar.Link active={path === '/your-posts'} as={'div'}>
            <Link to='/your-posts'>Your Posts</Link>
          </Navbar.Link>
        )}
        <Navbar.Link active={path === '/faqs'} as={'div'}>
          <Link to='/faqs'>FAQs</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
