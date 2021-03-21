import Axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { config } from '../../config';
import { useQuery } from '../../utils';
import { CardList, SkeletonCard } from '../Components/Card';

const ListProduct = () => {

  const [products, setProducts] = useState([]);
  const [type, setType] = useState('');
  const [filterWindow, setFilterWindow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [condition, setCondition] = useState('');
  const [render, setRender] = useState(0);
  const [max, setMax] = useState();
  const [min, setMin] = useState();
  let query = useQuery();

  const getProducts = (token, unmounted) => {
    setLoading(true);
    var url = `${config.api_host}/api/search/products`;
    var body = {}
    if (type !== '' || condition !== '' || min !== undefined || max !== undefined) {
      if (condition !== '' || min !== undefined || max !== undefined) {
        if (condition !== '') {
          body = {...body, condition}
        }
        if (min !== undefined || max !== undefined) {
          let prices = {};
          if (max !== undefined && min !== undefined) {
            prices = {...prices, min, max}
            body = {...body, price: prices}
          }
          if (min !== undefined) {
            prices = {...prices, min: min};
            body = {...body, price: prices}
          }
          if (max !== undefined) {
            prices = {...prices, max: max};
            body = {...body, price: prices}
          }
        }
      }

      if (type !== '') {
        body = {...body, sort_by: type};
      }
      console.log('body', body)
      Axios.post(url, body)
      .then(response => {
        setProducts(response.data.products);
        setLoading(false)
      })
      .catch(e => {
        console.error('Another error happened:' + e);
        setLoading(false)
      });
    } else {
      let url = `${config.api_host}/api/products`;
      if (query.get('category')) {
        url = `${config.api_host}/api/category/${query.get('category')}`
      }
      
      Axios.get(url, {cancelToken: token})
      .then(response => {
        if(!unmounted) {
          if (query.get('category')) {
            setProducts(response.data.products.products);
          } else {
            setProducts(response.data.products);
          }
        }
        setLoading(false)
      })
      .catch(e => {
        if(!unmounted) {
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
  }

  const handlePrice = (value, type) => {
    if (type === 'min') {
      if (value === '') {
        setMin(undefined);
        return;
      }
      setMin(value);
    }
    if (type === 'max') {
      if (value === '') {
        setMax(undefined);
        return;
      }
      setMax(value);
    }
  }

  useEffect(() => {
    let unmounted = false;
    let source = Axios.CancelToken.source();
    getProducts(source.token, unmounted);

    return function() {
      unmounted = true;
      source.cancel("cancelling in cleanup");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, render, query.get('category')]);

  const activeBtn = {
    background: 'var(--secondary-color)',
    color: '#fff'
  }

  return (
    <Fragment>
      <div className="overlay-popup">
        <section className="products-sect" style={{ minHeight: '100vh', paddingBottom: '80px' }}>
          <div className="container">
            <div className="products-box">
              <div className="list-header">
                <div className="filter">
                  <span className="title">Filter</span>
                  <input type="checkbox" id="filter-toggle" />
                  <label htmlFor="filter-toggle" onClick={e => {setFilterWindow(!filterWindow)}}>
                    <span className="fil-span"></span>
                  </label>
                </div>
                <div className="sortby">
                  <div className="sortby-title"><span>Sort by</span></div>
                  <button className={type === 'name' ? "sortby-name active" : "sortby-name"} onClick={e => setType('name')}>A - Z</button>
                  <button className={type === 'rating' ? "sortby-rating active" : "sortby-rating"} onClick={e => setType('rating')}>Rating</button>
                  <div className="sortby-dropdown">
                    <select name="sortby" onChange={e => setType(e.target.value)}>
                      <option selected disabled>Price</option>
                      <option value="max_price">most expensive</option>
                      <option value="min_price">cheapest</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="list-products">
                <div className={filterWindow ? "filter-window show" : "filter-window hide"}>
                  <div className="conditions">
                    <div className="filter-title">Conditions</div>
                    <div className="filter-main">
                      <button className="new-btn" onClick={e => setCondition(true)} style={condition ? activeBtn : null}>New</button>
                      <button className="second-btn" onClick={e => setCondition(false)} style={ condition===false ? activeBtn : null}>Second</button>
                    </div>
                  </div>
                  <div className="pricing">
                    <div className="filter-title">Pricing</div>
                    <div className="filter-main">
                      <input type="number" onChange={e => handlePrice(e.target.value, 'min')} placeholder="min" />
                      <span>to</span>
                      <input type="number" onChange={e => handlePrice(e.target.value, 'max')} placeholder="max" />
                    </div>
                  </div>
                  <button onClick={() => setRender(render => render + 1)} className="filter-btn">Filter</button>
                </div>
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
      </div>
    </Fragment>
  )
}

export default ListProduct;