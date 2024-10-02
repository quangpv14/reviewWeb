import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import FAQs from './pages/Faqs';
import SignUp from './pages/SignUp';
import Header from './components/Header';
import Footer from './components/Footer';
import ChangePassWord from './components/ChangePassword';
import PrivateRoute from './components/PrivateRoute';
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute';
import CreatePost from './pages/CreatePost';
import UpdatePost from './pages/UpdatePost';
import PostPage from './pages/PostPage';
import ScrollToTop from './components/ScrollToTop';
import Search from './pages/Search';
import YourPost from './pages/YourPost';
import MyPosts from './pages/Projects';
import ApprovedPost from './components/ApprovedPost';
import UpdatePostAdmin from './pages/UpdatePostAdmin';
import ProductByCategory from './pages/ProductByCategory';
import ProductPage from './pages/ProductPage';
import Compare from './pages/Compare';
import CreateNewPost from './pages/CreateNewPost';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/search' element={<Search />} />
        <Route path='/productbycategory/:categoryName' element={<ProductByCategory />} />
        <Route path='/product/:productId' element={<ProductPage />} />
        <Route path='/compare/:productId' element={<Compare />} />


        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />

        </Route>
        <Route path='/create-post' element={<CreatePost />} />
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />

          <Route path='/update-post-admin/:postId' element={<UpdatePostAdmin />} />
          <Route path='/approvedpost/:postSlug' element={<ApprovedPost />} />
        </Route>

        <Route path='/update-post/:postId' element={<UpdatePost />} />
        <Route path='/my-posts' element={<MyPosts />} />
        <Route path='/your-posts' element={<YourPost />} />
        <Route path='/create-new-post' element={<CreateNewPost />} />
        <Route path='/faqs' element={<FAQs />} />
        <Route path='/changepassword' element={<ChangePassWord />} />
        <Route path='/post/:postSlug' element={<PostPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
