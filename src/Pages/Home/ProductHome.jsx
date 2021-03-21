import React, { Fragment, useEffect, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Banner from './Banner';
import Product from './Product';
import Axios from 'axios';
import { config } from '../../config';
import { CustomArrow } from '../Components/SliderCustomized';
import { currencyFormatter, soldFormatter } from '../../utils';
import FeaturedProduct from './FeaturedProduct';
import { useDispatch, useSelector } from 'react-redux';
import { Card4, SkeletonCard } from '../Components/Card';
import Swal from 'sweetalert2';
import Cookie from 'universal-cookie';
var cookies = new Cookie();

const ProductHome = () => {
  const dispatch = useDispatch();
  const [wishlist, setWishlist] = useState(false);
  const [product, setProduct] = useState([]);
  const [id, setId] = useState(0);
  const [clicked, setClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [productId, setPorductId] = useState(0);

  useEffect(() => {
    let unmounted = false;
    let source = Axios.CancelToken.source();
    getData(source.token, unmounted);

    return function() {
      unmounted = true;
      source.cancel("Canceling in cleanup");
    };
  }, []);

  function getData(token, unmount) {
    const url = `${config.api_host}/api/products`;
    setLoading(true)
    Axios.get(url, {cancelToken: token})
    .then(res => {
      if(!unmount) {
        setProduct(res.data.products);
        setLoading(false);
      }
    })
    .catch(e => {
      if(!unmount) {
        console.error(e.message);
        if(Axios.isCancel(e)) {
          console.log(`request cancelled: ${e.message}`);
        } else {
          console.log('Another error happened:' + e.message);
        }
      }
      setLoading(false)
    });
  }

  const handleCart = async (id) => {
    const url = `${config.api_host}/api/get-cart`;
    const header = { 'Authorization': `Bearer ${cookies.get('user_token')}` }
    setLoading2(true);
    try {
      const response = await Axios.get(url, { headers: header });
      var list_cart = response.data.data.products;
      addToCart(id, list_cart);
    } catch (error) {
      console.error(error.message);
      if (error.response.status === 401) {
        Swal.fire({icon: 'warning', title: 'Unauthorized', text: 'Please login first'});
      }
      setLoading2(false)
    }
  }

  const addToCart = async (id, list) => {
    let list_id = [];
    list.map((product) => {
      list_id.push(product.id)
    });

    let check_id = list_id.includes(id);
    const url = `${config.api_host}/api/update-cart`;
    const header = { 'Authorization': `Bearer ${cookies.get('user_token')}` }
    const body = { product_id: [id] }
    console.log('check_id', check_id);
    if (check_id) {
      setLoading(false)
      alert('You\'ve added this product last time');
      return false;
    } else {
      try {
        const response_add = await Axios.post(url, body, { headers: header });
        dispatch({type: 'CART_RENDER'})
        console.log('response_add', response_add);
        setLoading2(false)
      } catch (error) {
        console.error(error.message);
        setLoading2(false)
      }
    }
  }

  useEffect(() => {
    Quickview();
  }, [productId]);

  const Quickview = () => {
    if(clicked) {
      dispatch({type: 'SET_QUICKVIEW', open: true, id: productId});
    }
  }

  var settings = {
    customPaging: function(i) {
      return (
        <a>
          <div className="circle-slick-dots"></div>
        </a>
      );
    },
    dots: true,
    dotsClass: "slick-dots bp-dots slick-thumb",
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    nextArrow: <CustomArrow prev={false} />,
    prevArrow: <CustomArrow prev={true}/>,
    initialSlide: 0,
    responsive: [{
      breakpoint: 700,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        initialSlide: 2,
        arrows: false,
        dots: false
      }
    }]
  };

  return (
    <Fragment>
      <section className="sect-product">
        <div className="container">
          <div className="best-price-wrapper">
            <div className="title-box">
              <div>
                <span className="bold-title">BEST</span> <span className="second-title">PRICE</span>
              </div>
            </div>
            <Slider {...settings} className="card-bp-wrapper">
              
              {loading ? 
                SkeletonCard(10)
                :
                product.map((product, i) =>
                  <Card4 
                    name={product.name}
                    image={product.images[0].id}
                    productId={product.id}
                    price={product.price}
                    sold={product.sold}
                    key={i}
                    onQuickview={() => {Quickview(product.id); setPorductId(product.id); setClicked(true)}}
                    onWishlist={() => setWishlist(!wishlist)}
                    onCart={() => handleCart(product.id)}
                    wishlist={wishlist}
                    loading={loading2}
                  />
                )
              }


            </Slider>
          </div>
        </div>
        <Banner />
        <FeaturedProduct />
        <Product />
      </section>
    </Fragment>
  );
}

export default ProductHome;