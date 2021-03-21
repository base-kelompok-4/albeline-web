import React, { Fragment, useState, useEffect } from 'react';
import NewOrder from '../../../assets/images/icons/seller/new_order.svg';
import ReadyToShip from '../../../assets/images/icons/seller/ready_to_ship.svg';
import Shipping from '../../../assets/images/icons/seller/shipping.svg';
import Delivered from '../../../assets/images/icons/seller/delivered.svg';
import Destination from '../../../assets/images/icons/destination.svg';
import { OrderCard } from '../../Components/Card';
import { useSelector, useDispatch } from 'react-redux';
import { config } from '../../../config';
import Cookie from 'universal-cookie';
import Axios from 'axios';
var cookies = new Cookie();

const Order = () => {
  const dispatch = useDispatch();
  const RenderReducer = useSelector(state => state.RenderReducer);
  const [trackopt, setTrackopt] = useState(1);
  const [packages, setPackages] = useState([]);
  const [order_id, setOrder_id] = useState(0);
  const [loading, setLoading] = useState(false);
  const [render, setRender] = useState(0);
  const [popup, setPopup] = useState(false);
  const [popupData, setPopupData] = useState([]);

  const getTrack = async (unmounted, token) => {
    let url = `${config.api_host}/api/orders/${trackopt}`;
    let header = {'Authorization': `Bearer ${cookies.get('user_token')}`}
    
    try {
      const response = await Axios.get(url, {headers: header, cancelToken: token});
      if (!unmounted) {
        console.log('response track', response);
        setPackages(response.data.packages);
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

  const handleOrderStatus = async (order_id, nextStatus) => {
    let url = `${config.api_host}/api/handle-order/${order_id}/status/${nextStatus}`;
    let header = {'Authorization': `Bearer ${cookies.get('user_token')}`}

    setOrder_id(order_id);
    setLoading(true);
    try {
      let response = await Axios.get(url, {headers: header});
      console.log('response acc order', response);
      setRender(render => render + 1);
      setLoading(false);
    } catch (error) {
      console.error(`Fail acc order: ${error}`);
      setLoading(false);
    }
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
                <div className={trackopt === 1 ? "track-option seller selected" : "track-option seller"} onClick={() => handleTrackopt(1, trackopt)}>
                  <div className="track-logo-wrapper"><img src={NewOrder} alt="awaiting"/></div>
                  <span>New Order</span>
                </div>
                <div className={trackopt === 2 ? "track-option seller selected" : "track-option seller"} onClick={() => handleTrackopt(2, trackopt)}>
                  <div className="track-logo-wrapper"><img src={ReadyToShip} alt="processed"/></div>
                  <span>Ready To Ship</span>
                </div>
                <div className={trackopt === 3 ? "track-option seller selected" : "track-option seller"} onClick={() => handleTrackopt(3, trackopt)}>
                  <div className="track-logo-wrapper"><img src={Shipping} alt="shipping"/></div>
                  <span>Shipping</span>
                </div>
                <div className={trackopt === 4 ? "track-option seller selected" : "track-option seller"} onClick={() => handleTrackopt(4, trackopt)}>
                  <div className="track-logo-wrapper"><img src={Delivered} alt="finish"/></div>
                  <span>Finish</span>
                </div>
              </div>
            </div>
            <div className="order-list">
              {packages.map((order, i) =>
                <Fragment key={i}>
                  <OrderCard key={i} productId={order.product.id} image={order.product.images[0].id} name={order.product.name} price={order.product.price} orderAmount={order.order_amount} totalProductPrice={order.total_product_price} weight={order.product.weight} onClick={() => handleOrderStatus(order.id, parseInt(order.status) + 1)} loading={loading} orderId={order.id} currOrderId={order_id} type="seller" trackOpt={trackopt} onPopup={() => {setPopup(true); setPopupData(order.user)}} />
                </Fragment>
              )}
            </div>
          </div>
        </div>
      {console.log('popupData', popupData)}
      </section>

      {/*^ Destination Popup */}
      {popup && 
      <div className="destination-info-popup">
        <div className="destination-info">
        <button onClick={() => setPopup(false)}><i class="fas fa-times"></i></button>
          <div className="destination-vector">
            <img src={Destination} alt="vector"/>
          </div>
          <div className="destination-detail">
            <div className="info-label">
              <p>Name</p>
              <p>Phone</p>
              <p>Address</p>
              <p>City</p>
            </div>
            <div className="info-detail">
              <p>{popupData.name}</p>
              <p>{popupData.hp}</p>
              <p>{popupData.address}</p>
              <p>{popupData.city_name}</p>
            </div>
          </div>
        </div>
      </div>
      }
    </Fragment>
  )
}

export default Order;