import Axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import Slider from 'react-slick';
import { config } from '../../config';
import { Card2, SkeletonCard } from '../Components/Card';
import { CustomArrow } from '../Components/SliderCustomized';
import tallbanner from '../../assets/images/banner/tallbanner.png';
import tallbanner2 from '../../assets/images/banner/tallbanner2.png';
import tallbanner3 from '../../assets/images/banner/tallbanner3.png';
import tallbanner4 from '../../assets/images/banner/tallbanner4.png';

function FeaturedProduct() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ud, setUd] = useState(0);
  
  useEffect(() => {
    let unmounted = false;
    let source = Axios.CancelToken.source();
    GetProducts(unmounted, source.token);

    return () => {
      unmounted = true;
      source.cancel('Cancelling request in cleanup')
    }
  }, [ud]);
  
  const GetProducts = async (unmounted, token) => {
    const url = `${config.api_host}/api/products`;
    setLoading(true);
    try {
      const respons = await Axios.get(url, {cancelToken: token});
      if (!unmounted) {
        setProducts(respons.data.products);
      }
    } catch(e) {
      console.error('Fail ', e);
    }
    setLoading(false);
  }

  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    rows: 2,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <CustomArrow prev={false} />,
    prevArrow: <CustomArrow prev={true}/>,
    initialSlide: 0,
    responsive: [{
      breakpoint: 700,
      settings: {
        rows: 1,
        slidesToShow: 2,
        initialSlide: 2
      }
    }]
  };
  
  var settings2 = {
    arrows: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
  }

  return (
    <Fragment>
      {console.log('products featured', products)}
      <div className="container spacing-section">
      {/* featured-wrapper */}
        <div className="featured-wrapper">
          
          <Slider {...settings2} className="tall-banner">
            <div className="tallbanner-wrapper tb-one">
              {/* <img src={tallbanner} alt="banner"/> */}
            </div>
            <div className="tallbanner-wrapper tb-two">
              {/* <img src={tallbanner2} alt="banner"/> */}
            </div>
            <div className="tallbanner-wrapper tb-three">
              {/* <img src={tallbanner3} alt="banner"/> */}
            </div>
            <div className="tallbanner-wrapper tb-four">
              {/* <img src={tallbanner4} alt="banner"/> */}
            </div>
          </Slider>
          <Slider {...settings} className="rows-slider">
              
              {loading ? 
                SkeletonCard(8) : 
                products.map((product, i) => 
                  <Card2 key={i} name={product.name} image={product.images[0].id} harga={product.price} />
                )
              }

            </Slider>
        </div>
      </div>
    </Fragment>
  );
}
export default FeaturedProduct;