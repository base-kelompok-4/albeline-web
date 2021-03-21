import React, { Fragment, useState, useEffect } from 'react';
import { SkeletonCard, CardList } from '../../Components/Card';
import { config } from '../../../config';
import Cookie from 'universal-cookie';
import Axios from 'axios';
var cookies = new Cookie();

const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getWishlist = async (unmounted, token) => {
    const url = `${config.api_host}/api/get-wishlist`;
    const header = {'Authorization': `Bearer ${cookies.get('user_token')}`}

    setLoading(true)
    try {
      const response = await Axios.get(url, {headers: header, cancelToken: token});
      if (!unmounted) {
        setProducts(response.data.wishlists);
      }
    } catch (error) {
      console.error('failed get wishlist');
    }
    setLoading(false)
  }

  useEffect(() => {
    let unmounted = false;
    let source = Axios.CancelToken.source();
    getWishlist(unmounted, source.token);

    return function() {
      unmounted = true;
      source.cancel("cancelling in cleanup");
    }
  }, []);

  return (
    <Fragment>
      {console.log('products', products)}
      <section className="wishlist-sect">
        <div className="container">
          <div className="products-box">
            <div className="list-products">
              {
                loading ? 
                SkeletonCard(8) :
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

export default Wishlist;