import React, { Fragment, useState, useEffect } from 'react';
import Awaiting from '../../../assets/images/icons/awaiting_confirmation.svg';
import Processed from '../../../assets/images/icons/processed.svg';
import Shipping from '../../../assets/images/icons/shipping.svg';
import Delivered from '../../../assets/images/icons/delivered.svg';
import Rating from 'react-rating';
import PulseLoader from 'react-spinners/PulseLoader';
import { OrderCard } from '../../Components/Card';
import { config } from '../../../config';
import Cookie from 'universal-cookie';
import Axios from 'axios';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
var cookies = new Cookie();

const Track = () => {
  const dispatch = useDispatch();
  const [popupReview, setPopupReview] = useState(false);
  const [trackopt, setTrackopt] = useState(1);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [product_id, setProduct_id] = useState(0);
  const [order_id, setOrder_id] = useState(0);
  const [render, setRender] = useState(0);
  const [rate, setRate] = useState();
  const [comment, setComment] = useState('');

  const handleCart = async (id) => {
    const url = `${config.api_host}/api/get-cart`;
    const header = { 'Authorization': `Bearer ${cookies.get('user_token')}` }
    setLoading(true);
    setProduct_id(id);
    try {
      const response = await Axios.get(url, { headers: header });
      var list_cart = response.data.data.products;
      addToCart(id, list_cart);
    } catch (error) {
      console.error(error.message);
      if (error.response.status === 401) {
        Swal.fire({icon: 'warning', title: 'Unauthorized', text: 'Please login first'});
      }
      setLoading(false)
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
        setLoading(false)
      } catch (error) {
        console.error(error.message);
        setLoading(false)
      }
    }
  }

  const getTrack = async (unmounted, token) => {
    let url = `${config.api_host}/api/track/${trackopt}`;
    let header = {'Authorization': `Bearer ${cookies.get('user_token')}`}
    
    try {
      const response = await Axios.get(url, {headers: header, cancelToken: token});
      if (!unmounted) {
        console.log('response track', response);
        setPackages(response.data.packages)
      }
    } catch (error) {
      if (!unmounted) {
        if (Axios.isCancel(error)) {
          console.log(`Request cancelled ${error.message}`);
        } else {
          console.log(`Another error happened: ${error}`);
        }
      }
    }
  }

  const handleTrackopt = (value, prev) => {
    if (value === prev) {
      return;
    }
    setTrackopt(value);
  }

  const handleArrivedOrder = async (order_id) => {
    let url = `${config.api_host}/api/arrived-order/${order_id}`;
    let header = {'Authorization': `Bearer ${cookies.get('user_token')}`}

    setOrder_id(order_id);
    setLoading(true);
    try {
      let response = await Axios.get(url, {headers: header});
      console.log('response arrived order', response);
      setRender(render => render + 1);
      setLoading(false);
    } catch (error) {
      console.error(`Fail update order status : ${error}`);
      setLoading(false);
    }
  }

  const addReview = () => {
    let url = `${config.api_host}/api/add-review`;
    let header = {'Authorization': `Bearer ${cookies.get('user_token')}`}

    let body = {
      rate,
      comment,
      order_id,
      product_id
    }

    if (comment.length < 1) {
      Swal.fire({icon: 'error', title: 'cannot be empty', text: 'Comment field cannot be null'});
      return false;
    } else if (rate === undefined) {
      Swal.fire({icon: 'error', title: 'cannot be empty', text: 'Rate cannot be null'});
      return false;
    }

    setLoading(true);
    Axios.post(url, body, {headers: header})
    .then(response => {
      Swal.fire({icon: 'success', title: 'Thank you', text: response.data.message}).then(() => setPopupReview(false));
      setLoading(false);
      setComment('');
      setRate();
      setRender(render => render + 1);
    }).catch(error => {
      if (error.response) {
        console.log('error.response.data', error.response.data);
        console.log('error.response.status', error.response.status);
        console.log('error.response.headers', error.response.headers);
        Swal.fire({icon: 'error', title: 'Can\'t do that', text: `${error.response.data.message}`}).then(() => setPopupReview(false));
      }
      setLoading(false);
    })
  }

  useEffect(() => {
    let unmounted = false;
    let source = Axios.CancelToken.source();
    getTrack(unmounted, source.token);

    return () => {
      unmounted = true;
      source.cancel('Cancelling request in cleanup');
    }
  }, [trackopt, render]);

  return (
    <Fragment>
      <section className="track-sect">
        <div className="container">
          <div className="track-box">
            <div className="track-header">
              <div className="track-option-list">
                <div className={trackopt === 1 ? "track-option selected" : "track-option"} onClick={() => handleTrackopt(1, trackopt)}>
                  <div className="track-logo-wrapper"><img src={Awaiting} alt="awaiting"/></div>
                  <span>Awaiting Seller Response</span>
                </div>
                <div className={trackopt === 2 ? "track-option selected" : "track-option"} onClick={() => handleTrackopt(2, trackopt)}>
                  <div className="track-logo-wrapper"><img src={Processed} alt="processed"/></div>
                  <span>In Process</span>
                </div>
                <div className={trackopt === 3 ? "track-option selected" : "track-option"} onClick={() => handleTrackopt(3, trackopt)}>
                  <div className="track-logo-wrapper"><img src={Shipping} alt="shipping"/></div>
                  <span>Shipping</span>
                </div>
                <div className={trackopt === 4 ? "track-option selected" : "track-option"} onClick={() => handleTrackopt(4, trackopt)}>
                  <div className="track-logo-wrapper"><img src={Delivered} alt="finish"/></div>
                  <span>Finish</span>
                </div>
              </div>
            </div>
            <div className="order-list">
              {packages.map((order, i) =>
                <Fragment key={i}>
                  <OrderCard key={i} productId={order.product.id} image={order.product.images[0].id} name={order.product.name} price={order.product.price} orderAmount={order.order_amount} totalProductPrice={order.total_product_price} weight={order.product.weight} onClick={() => {trackopt===3 ? handleArrivedOrder(order.id) : handleCart(order.product.id)}} loading={loading} trackOpt={trackopt} orderId={order_id} currProductId={product_id} type="buyer" onReview={() => {setPopupReview(true); setOrder_id(order.id); setProduct_id(order.product.id)}}/>
                </Fragment>
              )}
            </div>
          </div>
        </div>
      </section>

      {popupReview && 
      <div className="bg-white review-popup">
        <div className="box-popup">
          <div className="popup-header">Your opinion matters to us</div>
          <div className="popup-content">
            <h5 className="content-title">How was quality of the product?</h5>
            <Rating  onChange={e => setRate(e)} emptySymbol="fas fa-star empty" fullSymbol="fas fa-star glow" /> 
            <textarea onChange={e => setComment(e.target.value)} placeholder="This product is awesome"></textarea>
            <button onClick={addReview} disabled={loading}>{loading ? <PulseLoader size="15" color="#ffffff"/> : 'Rate now'}</button> {/* //TODO kasih validasi klo empty, klo success inputannya bersihin lagi */}
          </div>
          <button className="popup-footer" onClick={() => setPopupReview(false)}>Maybe later</button>
        </div>
      </div>
      }
    </Fragment>
  )
}

export default Track;