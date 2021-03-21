import Axios from 'axios';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Slider from 'react-slick';
import { config } from '../../config';
import { currencyFormatter, ratingFormatter, soldFormatter } from '../../utils';
import PulseLoader from 'react-spinners/PulseLoader';
import { CustomArrow } from './SliderCustomized';
import Cookie from 'universal-cookie';
import Swal from 'sweetalert2';
var cookies = new Cookie();

const Quickview = () => {
  //^ Redux 
  const QReducer = useSelector(state => state.QReducer);
  const dispatch = useDispatch();

  //^ Local State
  const [product, setProduct] = useState([]);
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  //^ Ref node
  const node = useRef();

  useEffect(() => {
    const source = Axios.CancelToken.source();
    getProduct(source.token);

    return () => {
      source.cancel();
    }
  }, [QReducer.id]);

  async function getProduct(source) {
    if (QReducer.open) {
      const url = `${config.api_host}/api/product/${QReducer.id}`;
      try {
      const response = await Axios.get(url, {cancelToken: source});
      setProduct(response.data.product);
      setImages(response.data.product.image);
      const cat = response.data.product.categories.map(item => {
        let container = [];
        container = item.name;
        return container;
      })

      setCategories(cat);
      } catch(e) {
        console.error("Failure ", e);
      }
    }
  }
  

  var settings = {
    customPaging: function(i) {
      if(i !== null) {
        for(var a = -1; a < i; a++) {
          var imageCount = images[0].id + a;
        }
      }

      return (
        <a>
          <img className="image-dots" src={`${config.api_host}/api/image/${imageCount + 1}`}></img>
        </a>
      );
    },
    dots: true,
    dotsClass: "slick-dots quickview-dots slick-thumb",
    arrows: true,
    nextArrow: <CustomArrow prev={false} />,
    prevArrow: <CustomArrow prev={true}/>,
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
  }

  const handleClick = (e) => {
    if(node.current.contains(e.target)) {
      return;
    }
    
    dispatch({type: 'SET_POPUP', open: false});
  }

  const addWishlist = async () => {
    if (cookies.get('user_token')) {
      const url = `${config.api_host}/api/add-wishlist/${product.id}`;
      const header = {'Authorization': `Bearer ${cookies.get('user_token')}`}

      setLoadingWishlist(true)
      try {
        await Axios.get(url, {headers: header});
        Swal.fire({icon: 'success', title: 'Success', text: 'Success adding to your wishlist'})
      } catch (error) {
        if (error.response.status === 422) {
          Swal.fire({icon: 'warning', title: 'Added last time', text: 'You\'ve been added this product to your wishlist last time'})
        }
        Swal.fire({icon: 'error', title: 'Oops...', text: 'An error occured. Try again later'})
      }
      setLoadingWishlist(false)
    } else {
      Swal.fire({icon: 'warning', title: 'Login first', text: 'You must be logged in to add your wishlist'})
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  useEffect(() => {
    var overlay_popup = document.getElementsByClassName("overlay-popup");
    if(QReducer.open === true) {
      document.getElementsByTagName("html")[0].style.overflowY = "hidden";
      for (let i = 0; i < overlay_popup.length; i++) {
        document.getElementsByClassName("overlay-popup")[i].classList.add("popup-open");
      }
    } else if(overlay_popup.length && QReducer.open === false) {
      document.getElementsByTagName("html")[0].style.overflowY = "scroll";
      for (let i = 0; i < overlay_popup.length; i++) {
        document.getElementsByClassName("overlay-popup")[i].classList.remove("popup-open");
      }
    }
  }, [QReducer.open]);

  return (
    <Fragment>
      <div ref={node} className="quickview-node">
        {QReducer.open && (
          <div className="quickview-modal">
            <div className="quickview-slider">
              <Slider {...settings}>

                {images.map((image, i) =>
                  <div key={i} className="quickview-image">
                    <div style={{backgroundImage: `url(${config.api_host}/api/image/${image.id})`, backgroundPosition: "center"}}></div>
                  </div>
                )}

              </Slider>
            </div>
            <div className="quickview-inline">
              <div className="quickview-info">
                <div className="quickview-name"><span>{product.name}</span></div>
                <div className="quickview-scale">
                  <div className="quickview-rating" style={ product.rate===null ? { width: '50%', display: 'flex', alignItems: 'center', fontFamily: "Roboto-Regular", fontSize: '13px', color: 'var(--secondary-color)' } : null}>{ratingFormatter(product.rate)}</div>
                  <div className="quickview-sold">{soldFormatter(product.sold)}</div>
                </div>
                <div className="quickview-price-title">Our Price</div>
                <div className="quickview-price">{currencyFormatter(product.price)}</div>
                <div className="quickview-description"><p>{product.description}</p></div>

                <div className="quickview-action">
                  <div className="q-action-title">available :</div>
                  <div className="q-action">
                    <input type="number" name="quantity" id="quantity" disabled value={product.stock}/>
                    <button className="q-cart">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bag-check" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                        <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/>
                      </svg>
                      Add To Cart
                    </button>
                    <button className="q-wishlist" onClick={addWishlist}>
                      {loadingWishlist ? <PulseLoader size="8px" color="var(--primary-color)" /> :
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart-fill" viewBox="0 0 16 16">
                          <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                        </svg>
                      }
                    </button>
                  </div>
                </div>

                <div className="quickview-category">
                  <span className="quickview-category-title">Categories: &nbsp;</span>
                  {categories.join(', ')}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
}

export default Quickview;