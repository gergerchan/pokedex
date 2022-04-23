import Header from 'components/Header';
import Footer from './Footer';

const Layout = ({ children, title }) => {
  return (
    <>
      <Header title={title} />
      <div className='container'>
        <div className='mb-5'>{children}</div>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
