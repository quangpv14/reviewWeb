import { Sidebar } from 'flowbite-react';
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
} from 'react-icons/hi';
import { GrTechnology } from "react-icons/gr";
import { BiSolidCategory } from "react-icons/bi";
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
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

  const selectedButtonStyle = {
    backgroundColor: '#7e6af7',
    color: 'white'
  };

  return (
    <Sidebar className='w-full md:w-59'>
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
          {currentUser && currentUser.isAdmin && (
            <Link to='/dashboard?tab=dash'>
              <Sidebar.Item
                style={tab === 'dash' ? selectedButtonStyle : {}}
                active={tab === 'dash' || !tab}
                icon={HiChartPie}
                as='div'
              >
                Dashboard
              </Sidebar.Item>
            </Link>
          )}
          <Link to='/dashboard?tab=profile'>
            <Sidebar.Item
              style={tab === 'profile' ? selectedButtonStyle : {}}
              active={tab === 'profile'}
              icon={HiUser}
              label={currentUser.isAdmin ? 'Admin' : 'User'}
              labelColor='dark'
              as='div'
            >
              Profile
            </Sidebar.Item>
          </Link>

          {currentUser.isAdmin && (
            <>
              <Sidebar.Collapse
                icon={GrTechnology}
                label="Products Management"
                as='div'
              >
                <Link to='/dashboard?tab=product'>
                  <Sidebar.Item
                    style={tab === 'product' ? selectedButtonStyle : {}}
                    active={tab === 'product'}
                    as='div'
                  >
                    Create Product
                  </Sidebar.Item>
                </Link>
                {/* <Link to='/dashboard?tab=publishedposts'>
                  <Sidebar.Item
                    style={tab === 'publishedposts' ? selectedButtonStyle : {}}
                    active={tab === 'publishedposts'}
                    as='div'
                  >
                    All Product
                  </Sidebar.Item>
                </Link> */}
              </Sidebar.Collapse>
            </>

          )}

          {currentUser.isAdmin && (
            <>
              <Sidebar.Collapse
                icon={HiDocumentText}
                label="Posts Management"
                as='div'
              >
                <Link to='/dashboard?tab=posts'>
                  <Sidebar.Item
                    style={tab === 'posts' ? selectedButtonStyle : {}}
                    active={tab === 'posts'}
                    as='div'
                  >
                    All Posts
                  </Sidebar.Item>
                </Link>
                <Link to='/dashboard?tab=publishedposts'>
                  <Sidebar.Item
                    style={tab === 'publishedposts' ? selectedButtonStyle : {}}
                    active={tab === 'publishedposts'}
                    as='div'
                  >
                    Published Posts
                  </Sidebar.Item>
                </Link>
                <Link to='/dashboard?tab=pendingposts'>
                  <Sidebar.Item
                    style={tab === 'pendingposts' ? selectedButtonStyle : {}}
                    active={tab === 'pendingposts'}
                    as='div'
                  >
                    Pending Posts
                  </Sidebar.Item>
                </Link>
                <Link to='/dashboard?tab=rejectedposts'>
                  <Sidebar.Item
                    style={tab === 'rejectedposts' ? selectedButtonStyle : {}}
                    active={tab === 'rejectedposts'}
                    as='div'
                  >
                    Rejected Posts
                  </Sidebar.Item>
                </Link>
              </Sidebar.Collapse>
            </>
          )}
          {currentUser.isAdmin && (
            <>
              <Link to='/dashboard?tab=users'>
                <Sidebar.Item
                  style={tab === 'users' ? selectedButtonStyle : {}}
                  active={tab === 'users'}
                  icon={HiOutlineUserGroup}
                  as='div'
                >
                  Users Management
                </Sidebar.Item>
              </Link>
              <Link to='/dashboard?tab=category'>
                <Sidebar.Item
                  style={tab === 'category' ? selectedButtonStyle : {}}
                  active={tab === 'category'}
                  icon={BiSolidCategory}
                  as='div'
                >
                  Category
                </Sidebar.Item>
              </Link>
              <Link to='/dashboard?tab=comments'>
                <Sidebar.Item
                  style={tab === 'comments' ? selectedButtonStyle : {}}
                  active={tab === 'comments'}
                  icon={HiAnnotation}
                  as='div'
                >
                  Comments
                </Sidebar.Item>
              </Link>
              <Link to='/dashboard?tab=author'>
                <Sidebar.Item
                  style={tab === 'author' ? selectedButtonStyle : {}}
                  active={tab === 'author'}
                  icon={HiAnnotation}
                  as='div'
                >
                  Authorization
                </Sidebar.Item>
              </Link>
            </>
          )}
          <Sidebar.Item
            icon={HiArrowSmRight}
            className='cursor-pointer'
            onClick={handleSignout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
