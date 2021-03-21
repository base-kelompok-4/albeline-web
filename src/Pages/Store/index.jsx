import Axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { config } from '../../config';
import { CardList, SkeletonCard } from '../Components/Card';

export const Store = () => {
  const { id } = useParams();
  const [store, setStore] = useState([]);
  const [user, setUser] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalSold, setTotalSold] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(false);

  const getStore = async (unmounted, token) => {
    const url = `${config.api_host}/api/store/${id}`;

    try {
      setLoading(true);
      const response = await Axios.get(url, {cancelToken: token});
      if (!unmounted) {
        setStore(response.data.store);
        setProducts(response.data.store.products);
        setTotalSold(response.data.store.product_stats.total_sold);
        setAvatar(response.data.store.user.image.id);
        setUser(response.data.store.user);
        setReviews(response.data.store.reviews);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    let unmounted = false;
    let source = Axios.CancelToken.source();

    getStore(unmounted, source.token);

    return () => {
      unmounted = true;
      source.cancel("cancelling request in cleanup");
    }
  }, []);

  return (
    <Fragment>
      {console.log(`store`, store)}
      <section className="store-sect" style={{ minHeight: '100vh', paddingBottom: '80px' }}>
        <div className="container">
          <div className="store-header">
            {loading ? 
            <Fragment>
              <div className="store-logo loading"></div>
            </Fragment>
            :
            !store.length > 0 ?
            <Fragment>
              <div className="store-logo">
                <img src={`${config.api_host}/api/image/${avatar}`} alt="logo" srcset=""/>
              </div>
              <div className="store-info ml-3">
                <div className="store-header-title">
                  {store.name}
                </div>
                <div className="store-owner">
                  {user.name}
                </div>
              </div>
              <div className="store-located ml-5p">
                <div className="store-header-title">
                  Located City
                </div>
                <div className="store-total-products">
                  {store.city_name}
                </div>
              </div>
              <div className="store-statistic ml-5p">
                <div className="store-header-title">
                  Total Products
                </div>
                <div className="store-total-products">
                  {products.length}
                </div>
              </div>
              <div className="store-statistic ml-5p">
                <div className="store-header-title">
                  Product Reviews
                </div>
                <div className="store-total-products">
                  {reviews.total}
                </div>
              </div>
              <div className="store-statistic ml-5p">
                <div className="store-header-title">
                  Products Sold
                </div>
                <div className="store-total-products">
                  {totalSold}
                </div>
              </div>
            </Fragment>
            : null
            }
          </div>
          <div className="products-box">
            <div className="list-products">
              {
                loading ? 
                SkeletonCard(5) :
                products.map((product, i) => 
                  <CardList image={product.images[0].id} name={product.name} productId={product.id} price={product.price} sold={product.sold} rate={product.rate}/>
                )
              }
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
}

export default Store;