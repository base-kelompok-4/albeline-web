import React, { Fragment, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { currencyFormatter, countTotal } from '../../../utils';
import PulseLoader from 'react-spinners/PulseLoader';
import Cookie from 'universal-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { config } from '../../../config';
import Axios from 'axios';
import { store } from '../../../redux';
import Swal from 'sweetalert2';
var cookies = new Cookie();

export const Checkout = () => {
  const CheckoutReducer = useSelector(state => state.CheckoutReducer);
  const [loading, setLoading] = useState(false);
  const [render, setRender] = useState(0);
  const [renderPage, setRenderPage] = useState(0);
  const [groupedProducts, setGroupedProducts]= useState([]);
  const dispatch = useDispatch();
  let user = cookies.get('user');
  let history = useHistory();

  const order = async (e) => {
    e.preventDefault();

    const url = `${config.api_host}/api/order`
    const header = {'Authorization': `Bearer ${cookies.get('user_token')}`}
    let data = groupedProducts;
    let fd = new FormData();
    fd.append('data', JSON.stringify(data));

    setLoading(true);
    try {
      const response = await Axios.post(url, fd, {headers: header});
      setLoading(false);
      dispatch({type: 'CART_RENDER'})
      Swal.fire({icon: 'success', title: 'Success make an order', text: 'Your order has been processed. You will get an invoice on your mailbox'}).then(() => {history.push('/')});
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  const handleDown = (store) => {
    groupedProducts.map((item) => {
      if (item.store === store) {
        item.downed = !item.downed
        setRender(render => render + 1)
      }
    })
  }
  const handleDown2 = (store) => {
    groupedProducts.map((item) => {
      if (item.store === store) {
        item.downed2 = !item.downed2
        setRender(render => render + 1)
      }
    })
  }
  const handleBillInfo = (store) => {
    groupedProducts.map((item) => {
      if (item.store === store) {
        item.bill_window = !item.bill_window
        setRender(render => render + 1)
      }
    })
  }
  const handleCourier = (store, courier) => {
    var per_product = [];
    let weight;
    
    groupedProducts.map((item) => {  
      item.products.map((product) => {
        let count = (product.heavy * product.amount)
        per_product = [...per_product, count]
      })
      
      weight = per_product.reduce((a, b) => a + b, 0).toString();
      
      if (item.store === store) {
        item.courier = courier
        getCost(store, item.store_address, item.courier, weight)
        setRender(render => render + 1)
      }
    })
  }
  const handleSelectedService = (store, service, cost, est) => {
    var per_product = [];
    var subtotal;
    groupedProducts.map((item) => {
      if (item.store === store) {
        item.selected_service = service;
        item.courier_cost = cost;
        item.estimated_time = est;

        item.products.map((product) => {
          let count = (product.price * product.amount)
          per_product = [...per_product, count]
        })
        
        subtotal = per_product.reduce((a, b) => a + b, 0);
        item.subtotal = subtotal + cost;
        subtotal = null;
        setRender(render => render + 1)
      }
    })
  }

  const getCost = async (store, store_address, courier, weight) => {
    const url = `${config.api_host}/api/cost`;
    const body = {
      origin: store_address,
      destination: cookies.get('user').city_id,
      weight: weight,
      courier: courier
    }

    try {
      const response = await Axios.post(url, body);
      groupedProducts.map((item) => {
        if (item.store === store) {
          item.services = response.data.result[0].costs
        }
      })
      setRender(render => render + 1)
    } catch(error) {
      console.error('Fail get cost: ', error);
    }
  }

  function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }

  const grouped = groupBy(CheckoutReducer.products, product => product.store);

  useEffect(() => {
    setLoading(true);

    let list = [];
    var result = CheckoutReducer.products.map((product) => {
      list.push(product.store);
    });

    let unique = [...new Set(list)]
    var grouped_products = [];
    var per_product = [];
    let subtotal,
        total_product_price,
        heavy;

    unique.map((store) => {

      grouped.get(store).map((product) => {
        let count = (product.price * product.amount)
        per_product = [...per_product, count]
      })
      subtotal = per_product.reduce((a, b) => a + b, 0);
      total_product_price = per_product.reduce((a, b) => a + b, 0);
      per_product = [];
      
      grouped.get(store).map((product) => {
        let count = (product.heavy * product.amount)
        per_product = [...per_product, count]
      })
      heavy = per_product.reduce((a, b) => a + b, 0);
      per_product = [];

      let store_resource = {store: store, store_address: grouped.get(store)[0].store_address, store_city_name: grouped.get(store)[0].store_city_name, downed: false, downed2: false, bill_window: false, courier: '', courier_cost: 0, services: [], selected_service: '', estimated_time: '', products: grouped.get(store), weight: heavy,total_product_price: total_product_price,subtotal: subtotal};
      grouped_products.push(store_resource);
    });

    const handleCourier = (store, courier) => {
      var per_product = [];
      let weight;
      
      groupedProducts.map((item) => {  
        item.products.map((product) => {
          let count = (product.heavy * product.amount)
          per_product = [...per_product, count]
        })
        
        weight = per_product.reduce((a, b) => a + b, 0).toString();
        
        if (item.store === store) {
          item.courier = courier
          getCost(store, item.store_address, item.courier, weight)
          setRender(render => render + 1)
        }
      })
    }
    setGroupedProducts(grouped_products);
    
    setLoading(false);
  }, [])


  return (
    <Fragment>
      <section className="checkout-sect" style={{ minHeight: '110vh', paddingBottom: '50px' }}>
        <div className="container">
          <div className="inner-box">
            <div className="checkout-title"><h4>Checkout</h4></div>
            <div className="checkout-grid mt-4">
              <div className="checkout-main">
                <div className="box-address">
                  <div className="box-heading"><h6 style={{ fontWeight: 'bold' }}>Destination Address</h6></div>
                  <div className="box-main-content">
                    <div>
                      <div className="box-content-parag"><b>{cookies.get('user').name}</b></div>
                      <div className="box-content-parag phones">{cookies.get('user').hp}</div>
                      <div className="box-content-parag">
                        <div className="address-desc" style={{ wordBreak: 'break-word', fontSize: '0.928571rem', color: 'rgb(0 0 0 / 54%)' }}>{cookies.get('user').address}</div>
                        <div className="address-desc--city-pos" style={{ fontSize: '0.928571rem', color: 'rgb(0 0 0 / 54%)' }}>{cookies.get('user').city_name}</div>
                      </div>
                    </div>
                  </div>
                  <div className="box-footer">
                    {/* {groupedProducts.map((store, i) => <button onClick={() => setStoreProducts(groupedProducts[i])}>{i+1}</button>)} */}
                    <button onClick={() => history.push('/user/settings')}>Change Address</button>
                  </div>
                </div>
                <div>
                  {groupedProducts.map((store, i) => 

                    <div className="loop-here">
                      <div className="unf-heading">Pesanan {i+1}</div>
                      <div className="shop-group">
                        <div>
                          <div className="shop-heading">
                            <div className="shop-heading__flex">
                              <div className="shop-name-heading">{store.store}</div>
                              <div className="shop-address-wrapper">
                                <div className="shop-address-heading unf-heading-four"><p>{store.store_city_name}</p></div>
                              </div>
                            </div>
                          </div>
                          <div className="shop-body-content">
                            <div className="shop-body-left">
                              {groupedProducts[i].products.map((product, a) =>
                              <div className="shop-product">
                                <div className="shop-product-left">
                                  <div className="shop-product-img">
                                    <img src={`${config.api_host}/api/image/${product.image[0].id}`} alt="item"/>
                                  </div>
                                </div>
                                <div className="shop-product-right">
                                  <p className="unf-heading-two shop-product-name">{product.name}</p>
                                  <p className="variant-quantity unf-heading-three">
                                    <span>{product.amount} barang</span>
                                    <span> ({product.heavy} gr)</span>
                                  </p>
                                  <div className="shop-product-price">
                                    <p className="unf-heading">{currencyFormatter((product.price * product.amount))}</p>
                                  </div>
                                </div>
                              </div>
                              )}
                            </div>
                            <div className="shop-body-right">
                              <div style={{ zIndex: '2' }} className={store.downed ? "courier-selection cart-checkout-btn downed" : "courier-selection cart-checkout-btn"} onClick={() => {handleDown(store.store)}}>
                                <span>{store.courier !== '' ? store.courier.toUpperCase() : 'Choose Courier'}</span><i class="fas fa-chevron-down"></i>
                                <div className={store.downed ? "courier-options downed" : "courier-options"}>
                                  <div className="courier" onClick={() => {handleCourier(store.store, 'tiki')}}><div className="line-divider"><span>TIKI</span>{store.courier === 'tiki' ? <i class="bi bi-check2-circle"></i> : null}</div></div>
                                  <div className="courier" onClick={() => {handleCourier(store.store, 'pos')}}><div className="line-divider"><span>POS</span>{store.courier === 'pos' ? <i class="bi bi-check2-circle"></i> : null}</div></div>
                                  <div className="courier" onClick={() => {handleCourier(store.store, 'jne')}}><div className="line-divider"><span>JNE</span>{store.courier === 'jne' ? <i class="bi bi-check2-circle"></i> : null}</div></div>
                                </div>
                              </div>
                              <div style={{ zIndex: '1' }} className={store.downed2 ? "service-selection mt-2 downed" : "service-selection mt-2"} onClick={() => handleDown2(store.store)} disabled={store.courier===''}>
                                <div className="inner-service"><span>{store.selected_service !== '' ? store.selected_service : 'Choose Services'}</span><i class="fas fa-chevron-down"></i></div>
                                {store.services.length > 0 && 
                                <div className={store.downed2 ? "service-options downed" : "service-options"}>
                                  {store.services.map((service, i) =>
                                  <div className="service" onClick={() => handleSelectedService(store.store, service.service, service.cost[0].value, service.cost[0].etd.replace('HARI', '').trim())} key={i}>
                                    <div className="service-name">
                                      <span>{service.service}</span>
                                      <p>{service.description}</p>
                                    </div>
                                    <div className="service-info">
                                      <span>{currencyFormatter(service.cost[0].value)}</span>
                                      <p>{service.cost[0].etd.replace('HARI', '').trim()} day(s)</p>
                                    </div>
                                  </div>
                                  )}
                                </div>
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="shop-footer">
                          <div className="shop-footer-row">
                            <div className={!store.bill_window ? "shop-subtotal" : "shop-subtotal expand"}><span>Subtotal</span><p onClick={() => handleBillInfo(store.store)}>{currencyFormatter((store.subtotal))}  <i class="fas fa-caret-down"></i></p></div>
                            <div className={!store.bill_window ? "shop-price hide" : "shop-price"}><span>Price</span><p>{currencyFormatter(store.total_product_price)}</p></div>
                            <div className={!store.bill_window ? "shop-courier-cost hide" : "shop-courier-cost"}><span>Courier Cost</span><p>{currencyFormatter(store.courier_cost)}</p></div>
                          </div>
                        </div>
                      </div>
                    </div>

                  )}
                </div>
              </div>
              <div className="cart-checkout-wrapper">
                <div className="cart-checkout" style={{ marginTop: '0' }}>
                  <div className="pay-title">
                    <span>Shopping Summary</span>
                  </div>
                  <div className="detail-payment">
                    <div className="total-price">
                      <span>Product Price ({countTotal(CheckoutReducer.products, 'amount')} item)</span>
                    </div>
                    <div className="price-amount">
                      <span>{currencyFormatter(countTotal(groupedProducts, 'total_product_price'))}</span>
                    </div>
                  </div>
                  <hr className="payment-divider" />
                  <div className="pay-title">
                    <span>Courier Cost</span>
                  </div>
                  {groupedProducts.map((store, i) => 
                  <div className="detail-payment" key={i}>
                    <div className="total-price">
                      <span>{store.store} ({store.weight} gram)</span>
                    </div>
                    <div className="price-amount">
                      <span>{currencyFormatter(store.courier_cost)}</span>
                    </div>
                  </div>
                  )}

                  <hr className="payment-divider" />
                  <div className="checkout-total">
                    <div className="total-price">Payment Bill</div>
                    <div className="price-amount">{currencyFormatter(countTotal(groupedProducts, 'subtotal'))}</div>
                  </div>
                  <button style={{ cursor: loading ? 'not-allowed' : 'pointer' }} className="cart-checkout-btn ripple" onClick={order}>{loading ? <PulseLoader color="#ffffff" size="12"/> : 'Buat Pesanan'}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
}

export default Checkout;