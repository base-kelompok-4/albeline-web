import React, { Fragment } from 'react';
import Header from './Header';
import ProductHome from './ProductHome';
import Quickview from '../Components/Quickview';

const Home = () => {
  return (
    <div className="overlay-popup">
      <Header />
      <ProductHome />
    </div>
  );
}
export default Home;