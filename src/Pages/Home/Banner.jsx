import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const Banner = () => {
  return (
    <Fragment>
          <div className="container con-banner">
            <div className="banner-wrapper">
              <Link to={`/products?category=3`} className="wearing"><div className="after">Stylish</div></Link>
              <Link to={`/products?category=5`} className="phone"><div className="after">Brand new phone</div></Link>
              <Link to={`/products?category=7`} className="food"><div className="after">Fast food</div></Link>
              <Link to={`/products?category=10`} className="deals"><div className="after">Electronic</div></Link>
            </div>
          </div>
    </Fragment>
  );
}
export default Banner;