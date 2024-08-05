import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashPosts from '../components/DashPosts';
import DashUsers from '../components/DashUsers';
import DashCategory from '../components/DashCategory';
import DashComments from '../components/DashComments';
import DashboardComp from '../components/DashboardComp';
import DashPublishedPosts from '../components/DashPublishedPost';
import DashPendingPosts from '../components/DashPendingPost';
import DashRejectedPosts from '../components/DashRejectedPost';
import DashProduct from '../components/DashProduct';
//import ApprovedPost from '../components/ApprovedPost';
import DashAuthor from '../components/DashAuthor';

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-59'>
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* profile... */}
      {tab === 'profile' && <DashProfile />}
      {/* product... */}
      {tab === 'product' && <DashProduct />}
      {/* posts... */}
      {tab === 'posts' && <DashPosts />}
      {/* published posts... */}
      {tab === 'publishedposts' && <DashPublishedPosts />}
      {/* pending posts... */}
      {tab === 'pendingposts' && <DashPendingPosts />}
      {/* pending posts... */}
      {tab === 'rejectedposts' && <DashRejectedPosts />}

      {/* users */}
      {tab === 'users' && <DashUsers />}
      {/* category... */}
      {tab === 'category' && <DashCategory />}
      {/* comments  */}
      {tab === 'comments' && <DashComments />}
      {/* dashboard comp */}
      {tab === 'dash' && <DashboardComp />}

      {tab === 'author' && <DashAuthor />}
    </div>
  );
}
