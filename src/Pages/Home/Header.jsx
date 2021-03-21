import React, { Fragment, useEffect, useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CustomArrow } from '../Components/SliderCustomized';
import { config } from '../../config';
import Axios from 'axios';
import ImageLoad from '../Components/ImageLoad';
import PulseLoader from 'react-spinners/PulseLoader';
import Placeholder from '../../assets/images/placeholder.jpg';
import { useHistory } from 'react-router-dom';

const Header = () => {
  const [bigBanner, setBigBanner] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loop, setLoop] = useState([1,2,3,4,5]);
  let history = useHistory()

  const getCategories = async (unmounted, token) => {
    const url = `${config.api_host}/api/category`;

    try {
      const response = await Axios.get(url);
      if (!unmounted) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      if (!unmounted) {
        console.error(error.message);
        if (Axios.isCancel(error)) {
          console.log(`request cancelled: ${error.message}`);
        } else {
          console.error('Another error happened: ' + error.message);
        }
      }
    }
  }

  useEffect(() => {
    let unmounted = false;
    let source = Axios.CancelToken.source();
    getBigBanner(unmounted, source.token);

    return () => {
      unmounted = true;
      source.cancel('cleaning up request');
    }
  }, []);

  useEffect(() => {
    let unmounted = false;
    let source = Axios.CancelToken.source();
    getCategories(unmounted, source.token);

    return () => {
      unmounted = true;
      source.cancel('Cancelling in cleanup');
    }
  }, []);

  async function getBigBanner(unmounted, token) {
    const url = `${config.api_host}/api/banners/big`;
    setLoading(true)
    try {
      const response = await Axios.get(url, {cancelToken: token});
      if (!unmounted) {
        setBigBanner(response.data.banners);
      }
      setLoading(false)
    } catch (error) {
      if (Axios.isCancel(error)) {
        console.error('request cancelled', error);
      } else {
        console.error('another error happened', error);
      }
      setLoading(false)
    }
  }

  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "220px",
    slidesToShow: 1,
    speed: 800,
    autoplay: true,
    autoplaySpeed: 4000,
    nextArrow: <CustomArrow prev={false} />,
    prevArrow: <CustomArrow prev={true}/>,
    responsive: [{
      breakpoint: 700,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1,
        centerPadding: "0px",
      }
    }]
  };

  var settings2 = {
    dots: false,
    slidesToShow: 11,
    slidesToScroll: 1,
    nextArrow: <CustomArrow prev={false} />,
    prevArrow: <CustomArrow prev={true}/>,
    initialSlide: 0,
    responsive: [{
      breakpoint: 700,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 1,
        initialSlide: 5
      }
    }]
  };
  
  return (
    <Fragment>
      {console.log("CATEGORIES", categories)}
      <section className="home-header">
        <div className="container">
          <div className="content-header">
            <Slider {...settings} className="content3-item">
              {
                loading ?
                loop.map((l,i) => 
                <div className="big-banner-wrapper" key={i}>
                  <div className="big-banner h-100 d-flex justify-content-center align-items-center" style={{ background: "linear-gradient(to right, #ddd, #eee)" }}>
                    <PulseLoader color="#ff581a" size="12" />
                  </div>
                </div>
                )
                :
                bigBanner.map((image, i) =>
                <div key={i} className="big-banner-wrapper">
                  <div className="big-banner">
                    <ImageLoad placeholder={Placeholder} src={`${config.api_host}/api/image/${image.image.id}`} alt="banner"/>
                  </div>
                </div>
                )
              }
            </Slider>
          </div>
          <div className="category-grid-ico">

            <Slider {...settings2} className="categories-slider">

              {
                categories.map((category, i) =>
                  <div className="cat-ico-wrapper" key={i} onClick={() => history.push(`/products?category=${category.id}`)}>
                    <div className="cat-ico">
                      <img src={`${config.api_host}/api/image/${category.image.id}`} alt="ico"/>
                    </div>
                    <span style={{ color: '#8296ab' }}>{category.name}</span>
                  </div>
                )
              }

            </Slider>

          </div>
        </div>
      </section>
    </Fragment>
  );
}
export default Header;