import React, { Fragment, useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { countTotal, currencyFormatter, soldFormatter } from "../../../utils";
import { config } from "../../../config";
import { useDispatch, useSelector } from "react-redux";
import Axios from "axios";
import ImageLoad from "../../Components/ImageLoad";
import Placeholder from '../../../assets/images/clip-art/placeholder.png';
import { useHistory } from "react-router-dom";
const cookies = new Cookies();

const Cart = () => {
  const dispatch = useDispatch();
  const CartReducer = useSelector(state => state.CartReducer);
  const [products, setProducts] = useState([]);
  const [value, setValue] = useState();
  const [loading, setLoading] = useState(false);
  const [render, setRender] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItem, setTotalItem] = useState(0);

  let history = useHistory();

  const getCart = async (token, unmounted) => {
    const url = `${config.api_host}/api/get-cart`;
    const auth = { 'Authorization': `Bearer ${cookies.get('user_token')}` }
    console.log('masuk sini');
    try {
      const response = await Axios.get(url, { headers: auth, cancelToken: token });
      if (!unmounted) {
        let customResponse = response.data.data.products.map((product) => {
          product.amount = 1;
          return product;
        })
        console.log('customResponse', customResponse)
        setProducts(customResponse);

        amountItem(response.data.data.products);
        total(response.data.data.products);
      }
    } catch (e) {
      if (!unmounted) {
        console.error(e.message);
        if (Axios.isCancel(e)) {
          console.log(`request cancelled: ${e.message}`);
        } else {
          console.error('Another error happened: ' + e.message);
        }
      }
    }
  }

  const removeItem = async (product_id) => {
    const url = `${config.api_host}/api/remove-cart`
    const body = { product_id }
    const auth = { 'Authorization': `Bearer ${cookies.get('user_token')}` }

    setLoading(true)
    try {
      const response = await Axios.post(url, body, { headers: auth });
      console.log('response', response);
      dispatch({ type: "CART_RENDER" });
      setLoading(false)
    } catch (error) {
      console.error(error.message);
      setLoading(false)
    }
  }

  const inputChange = (value, product_id) => {
    let int = parseInt(value);
    products.map((product) => {
      if (value < 1) {
        if (product.id === product_id) {
          product.amount = product.amount;
          return;
        }
        
      }
      if (product.id === product_id) {
        product.amount = int;
      }
    })
    setRender(render => render + 1)
  }

  const count = (product_id, type) => {
    switch (type) {
      case 'plus':
        console.log('product_id', product_id);
        products.map((product) => {
          if (product.id === product_id) {
            product.amount++;
          }
        })
        setRender(render => render + 1)
        break;

      case 'minus':
        console.log('product_id', product_id);
        products.map((product) => {
          if (product.id === product_id) {
            if (product.amount < 2) {
              return;
            }
            product.amount--;
          }
        })
        setRender(render => render + 1)
        break;
    
      default:
        break;
    }

  }

  const amountItem = (list = products) => {
    var per_product = [];
    let final;

    list.map((product) => {
      per_product = [...per_product, product.amount];
    })
    
    final = per_product.reduce((a, b) => a + b, 0);
    setTotalItem(final);
  }

  const total = (list = products) => {
    var per_product = [];
    let final;

    list.map((product) => {
      let count = (product.price * product.amount);
      per_product = [...per_product, count];
    })
    console.log('counting', per_product);
    
    final = per_product.reduce((a, b) => a + b, 0).toString();
    setTotalPrice(final);
  }

  const validate = (user_id) => {
    console.log('user_id', user_id);
    const user = cookies.get('user');
    if (user.name === null || user.address === null || user.city_id === null) {
      alert('You must complete your data before going to the checkout section');
      history.push('/user/settings')
      return false;
    }
    return true;
  }

  const goCheckout = () => {
    const validation = validate(cookies.get('user').id);
    if (validation) {
      history.push('/order-checkout');
    }
    dispatch({type: 'CHECKOUT', products: products});
  }

  useEffect(() => {
    let unmounted = false;
    let source = Axios.CancelToken.source();
    getCart(source.token, unmounted);

    return () => {
      unmounted = true;
      source.cancel('Cancelling in cleanup');
    }
  }, [CartReducer.render]);

  useEffect(() => {
    total();
    amountItem();
  }, [render]);
  
  return (
    <Fragment>
      {console.log('products', products)}
      <section className="cart-sect">
        <div className="cart-cont">
          <div className="cart-title">
            <span>Shopping Cart</span>
          </div>
          <div className="cart-content">
            <div className="cart-main">
              <div className="cart-list">
                {products.map((product) => (
                  <div className="cart-card">
                    <div className="product-image">
                      <ImageLoad placeholder={Placeholder} src={`${config.api_host}/api/image/${product.image[0].id}`} alt="product"
                      />
                    </div>
                    <div className="product-name">
                      <div className="truncate" style={{ WebkitLineClamp: "1" }} >
                        <span className="name">{product.name}</span>
                      </div>
                      <span>{product.store}</span>
                    </div>
                    <div className="input-amount">
                      <button
                      onClick={() => count(product.id, 'minus')}
                      >
                        <i class="fas fa-minus"></i>
                      </button>
                      <input type="number" name="amount" id="quantity-input" min="1" onKeyPress={event => event.charCode >= 48} onChange={e => inputChange(e.target.value, product.id)} value={product.amount} />
                      <button
                      onClick={() => count(product.id, 'plus')}
                      >
                        <i class="fas fa-plus"></i>
                      </button>
                    </div>
                    <div className="total-price">
                      <span>{currencyFormatter(product.price)}</span>
                    </div>
                    <div className="remove-cart">
                      <button disabled={loading} style={{ cursor: loading ? 'not-allowed' : 'pointer' }} onClick={() => removeItem(product.id)}><i class="fas fa-times"></i></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="cart-checkout-wrapper">
              <div className="cart-checkout">
                <div className="pay-title">
                  <span>Shopping Summary</span>
                </div>
                <div className="detail-payment">
                  <div className="total-price">
                    <span>Total Price ({countTotal(products, 'amount')} item)</span>
                  </div>
                  <div className="price-amount">
                    <span>{currencyFormatter(totalPrice)}</span>
                  </div>
                </div>
                <hr className="payment-divider" />
                <div className="checkout-total">
                  <div className="total-price">Subtotal</div>
                  <div className="price-amount">{currencyFormatter(totalPrice)}</div>
                </div>
                <button className="cart-checkout-btn ripple" onClick={goCheckout}>Checkout</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};
export default Cart;
