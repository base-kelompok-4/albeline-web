import React, { Fragment, useEffect, useState } from 'react';
import Vector from '../../../assets/images/clip-art/dashboard_vector.png';
import Cookie from 'universal-cookie';
import Axios from 'axios';
import { config } from '../../../config';
import { useHistory } from 'react-router-dom';
import { useQuery } from '../../../utils';
const cookies = new Cookie();

const Dashboard = () => {
  const [totalReviews, setTotalReviews] = useState();
  const [totalProducts, setTotalProducts] = useState([]);
  const [popup, setPopup] = useState(false);
  let history = useHistory();
  let query = useQuery();

  const storeReviews = async (token, unmounted) => {
    const url = `${config.api_host}/api/store-reviews`;
    const url2 = `${config.api_host}/api/store-products`;
    const header = {'Authorization': `Bearer ${cookies.get('user_token')}`}

    try {
      const response = await Axios.get(url, {headers: header, cancelToken: token});
      if (!unmounted) {
        setTotalReviews(response.data.data.total);
      }

      const response2 = await Axios.get(url2, {headers: header, cancelToken: token});
      if (!unmounted) {
        setTotalProducts(response2.data.data);
      }
    } catch (e) {
      if (!unmounted) {
        if(Axios.isCancel(e)) {
          console.error(`request cancelled: ${e.message}`);
        } else {
          console.error('Another error happened:' + e.message);
        }
      }
    }
  }
  
  useEffect(() => {
    let unmounted = false;
    let source = Axios.CancelToken.source();
    storeReviews(source.token, unmounted);

    return () => {
      unmounted = true;
      source.cancel('Cancelling in cleanup');
    }
  }, []);

  useEffect(() => {
    if (query.get('seller')) {
      setPopup(true)
    }
  }, []);

  return (
    <Fragment>
      <div className="dashboard">
        <div className="panel-title"><span>Dashboard</span></div>
        <div className="greeting-seller">
          <h1>Welcome, {cookies.get('user').name ? cookies.get('user').name.split(' ').slice(0, 2).join(' ') : cookies.get('user').username}</h1>
          <span>If you are not making any mistake,<br/> It means you are not doing anything</span>
        </div>
        <div className="stats-space">
          <div className="stats-card">
            <h4>{totalProducts.total}</h4>
            <span>Total Products</span>
            <button onClick={() => history.push('/seller/products')}>Your Products</button>
          </div>
          <div className="stats-card">
            <h4>{totalReviews}</h4>
            <span>Total Reviews</span>
            <button onClick={() => history.push('/seller/products')}>Your Products</button>
          </div>
          <div className="stats-card">
            <h4>{totalProducts.total_sold}</h4>
            <span>Products Sold</span>
            <button onClick={() => history.push('/seller/products')}>Your Products</button>
          </div>
        </div>
        <div className="action-space">
          
        </div>
      </div>
    </Fragment>
  )
}

export default Dashboard;