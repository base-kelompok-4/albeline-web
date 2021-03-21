import React, { Fragment, useEffect, useState } from 'react';
import { Card, SkeletonCard } from '../Components/Card';
import Axios from 'axios';
import { config } from '../../config';

const Product = () => {

  const [product, setProduct] = useState([]);
  //eslint-disable-next-line
  const [loading, setLoading] = useState(false);
  const [rekomendasi, setRekomendasi] = useState(true);
  const [gratisongkir, setGratisongkir] = useState(false);
  const [id, setId] = useState(0);

  useEffect(() => {
    let unmounted = false;
    let source = Axios.CancelToken.source();
    getData(unmounted, source.token);

    return () => {
      unmounted = true;
      source.cancel('cleaning up request');
    }
  }, []);

  function getData(unmounted, token) {
    const url = `${config.api_host}/api/products`;

    setLoading(true)
    Axios.get(url, {cancelToken: token})
    .then(res => {
      if (!unmounted) {
        setProduct(res.data.products);
      }
    })
    .catch(e => {
      console.error(e);
    });
    setLoading(false)
  }



  return (
    <Fragment>
      <div className="container spacing-section">
        <div className="product-wrapper">
          <div className="tab-bar">
            <ul>
              <li onClick={e => {setRekomendasi(true); setGratisongkir(false);}} className={rekomendasi ? "active-bar" : ""}>{rekomendasi ? <div className="line-bar"></div> : null}Rekomendasi</li>
            </ul>
          </div>
          <div className="card-wrapper">
            {
              loading ? SkeletonCard(10) :
              
              product.map((product, i) => 
                <Card key={i} image={product.images[0].id} name={product.name} rating={product.rate} sold={product.sold} productId={product.id} price={product.price} />
              )

            }
          </div>
        </div>
      </div>
    </Fragment>
  );
}
export default Product;