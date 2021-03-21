import React, { Fragment, useEffect, useRef, useState } from "react";
import { Link, NavLink, Redirect, useHistory } from "react-router-dom";
import Loader from 'react-spinners/BeatLoader';
import Logo from "../assets/images/Logo.png";
import SignoutIco from "../assets/images/icons/signout.jpg";
import SearchIco from "../assets/images/icons/search-ico.webp";
import Cookies from "universal-cookie";
import { useDispatch, useSelector } from "react-redux";
import { config } from "../config";
import Axios from "axios";
import Swal from "sweetalert2";
const cookies = new Cookies();

const Navbar = () => {
  const CartReducer = useSelector(state => state.CartReducer);
  const RegisterShop = useSelector(state => state.RegisterShop);
  const RenderReducer = useSelector(state => state.RenderReducer);
  const dispatch = useDispatch();
  const [input, setInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [render, setRender] = useState(0);
  const [clicked, setClicked] = useState(false);
  const [search, setSearch] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [display, setDisplay] = useState(false);
  const [menu, setMenu] = useState(false);
  const [megamenu, setMegamenu] = useState(false);
  const [store, setStore] = useState();
  const [options, setOptions] = useState([]);
  const login = cookies.get("login");
  const searchRef = useRef(null);
  let node = useRef();
  let nodeMegamenu = useRef();
  let history = useHistory();
  
  const getCategories = async (token, unmounted) => {
    const url = `${config.api_host}/api/category`;
    
    try {
      const response = await Axios.get(url);
      if (!unmounted) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      if (!unmounted) {
        console.error(error.message);
        if(Axios.isCancel(error)) {
          console.log(`request cancelled: ${error.message}`);
        } else {
          console.log('Another error happened:' + error.message);
        }
      }
    }
  }

  const loginPopup = (truep) => {
    dispatch({ type: "CREDENTIAL_POPUP", open: truep });
  };

  const checkUserStore = async (token, unmounted) => {
    const url = `${config.api_host}/api/check-store`;
    const header = {'Authorization': `Bearer ${cookies.get('user_token')}`}
    
    try {
      const response = await Axios.get(url, {headers: header, cancelToken: token});
      if (!unmounted) {
        setStore(response.data.message);
      }
    } catch (e) {
      if (!unmounted) {
        console.error(e.message);
        if(Axios.isCancel(e)) {
          console.log(`request cancelled: ${e.message}`);
        } else {
          console.log('Another error happened:' + e.message);
        }
      }
    }
  }
  
  const handleCart = async (token, unmounted) => {
    const url = `${config.api_host}/api/get-cart`;
    const auth = {'Authorization': `Bearer ${cookies.get('user_token')}`}
    console.log('masuk sini');
    try {
      const response = await Axios.get(url, {headers: auth, cancelToken: token});
      if (!unmounted) {
        setTotal(response.data.data.products.length);
        console.log('response cart navbar', response);
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

  const logout = async () => {
    const url = `${config.api_host}/api/logout`;
    const header = {'Authorization': `Bearer ${cookies.get('user_token')}`}

    try {
      const response = await Axios.get(url, {headers: header});
      console.log('response logout', response)
      cookies.remove('user', {path: '/'});
      cookies.remove('user_token', {path: '/'});
      cookies.remove('login', {path: '/'});
      Swal.fire({icon: 'success', title: 'Success Logout!', text: 'Don\'t forget to come again next time!', allowOutsideClick: false}).then(() => {window.location.replace("http://localhost:3000/")});
    } catch (e) {
      console.error(e.message);
      Swal.fire({icon: 'error', title: 'Oops...', text: e.message});
    }
  }

  const keyDown = e => {
    e.preventDefault();
    const url = `${config.api_host}/api/search/products`;
    let name = document.getElementById('search-product').value;
    let payload = {name};

    console.log('payload', payload);
    Axios.post(url, payload)
    .then(response => {
      setOptions(response.data.products);
    }).catch(e => {
      console.error('Failure: ', e);
    })
  }

  const handleMenu = event => {
    if (cookies.get('login') === true) {
      if (node.current.contains(event.target)) {
        return;
      } 
      setMenu(false);
    }
    return;
  }

  const handleClick = event => {
    const {current: wrap} = searchRef;

    if (wrap && !wrap.contains(event.target)) {
      setDisplay(false);
    }
  }

  const setProduct = product => {
    setSearch(product);
    history.push({
      pathname: `/detail/${product}`,
    })
    setDisplay(false);
  }

  const handleDisplay = () => {
    let name = document.getElementById('search-product').value;
    if (name.length > 0) {
      setDisplay(true);
      return;
    }
    setDisplay(false);
  }

  const handleMegamenu = event => {
    if (nodeMegamenu.current.contains(event.target)) {
      return;
    } 
    setMegamenu(false);
  }

  useEffect(() => {
    let unmounted = false;
    let source = Axios.CancelToken.source();
    if (cookies.get('user_token') !== null) {
      checkUserStore(source.token, unmounted);
    }

    return () => {
      unmounted = true;
      source.cancel('Cancelling in cleanup');
    }
  }, [RegisterShop.registered, RenderReducer.render]);

  useEffect(() => {
    let unmounted = false;
    let source = Axios.CancelToken.source();
    handleCart(source.token, unmounted);

    return () => {
      unmounted = true;
      source.cancel('Cancelling in cleanup');
    }
  }, [CartReducer.render]);

  useEffect(() => {
    let unmounted = false;
    let source = Axios.CancelToken.source();
    getCategories(source.token, unmounted);

    return () => {
      unmounted = true;
      source.cancel('Cancelling in cleanup');
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('mousedown', handleMegamenu);
    if (login) {
      document.addEventListener('mousedown', handleMenu);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('mousedown', handleMenu);
      document.removeEventListener('mousedown', handleMegamenu);
    }
  }, []);

  return (
    <Fragment>
      <nav>
        <div className="container">
          <div className="nav-wrapper">
            <ul className="logo-wrapper">
              <Link to="/" style={{ textDecoration: "none" }} className="logo">
                <img src={Logo} alt="logo" />
              </Link>
              <li><Link to="/products" className="products-nav">Products</Link></li>
              <li className="dropdown">
                <label htmlFor="megamenu-check" className="megamenu-check-label">
                  Category
                </label>
                <div className="menu">
                  <input type="checkbox" id="megamenu-check" onChange={(e) => {setMegamenu(!megamenu);}}/>
                  <i className={megamenu ? "fas fa-chevron-down arrow-bawah rotate" : "fas fa-chevron-down arrow-bawah"}></i>
                </div>
              </li>
            </ul>

            <div className={login === undefined ? "guest-wrapper" : "addon-wrapper"}>
              <div className={input ? "search-input-wrapper active" : "search-input-wrapper"}>
                <div className="search-input">
                  <form onSubmit={search} className={input ? "active" : ""}>
                    <input type="text" placeholder="Search..." onChange={e => {keyDown(e);handleDisplay();}} className={input ? "active" : ""} id="search-product" />
                  </form>
                  <button className="search-btn" onClick={(e) => setInput(!input)}>
                    {input ? <i class="bi bi-x s-logo"></i> : <div className="s-logo-wrapper"><img src={SearchIco} /></div>} {/*<i className="bi bi-search s-logo"></i> <i class="fas fa-search s-logo"></i>*/}
                  </button>
                </div>
              </div>
              {login === undefined ? (
                <button className="nav-login-btn" onClick={() => {setClicked(true);loginPopup(true);}} > Login </button>
              ) : (
                <Fragment>
                  <NavLink className="cart" to="/cart">
                    {total > 0 ? (
                      <div className="badge-cart"><span>{total}</span></div>
                    ) : null}
                    <i className="bi bi-cart2"></i>
                  </NavLink>
                  <NavLink to="/user/wishlist" className="wishlist">
                    <i class="bi bi-heart"></i>
                  </NavLink>
                  <button className="account">
                    <div ref={node} className={menu ? "menu" : "menu hide"}>
                      <div className="user-banner">
                        <div className="user-img-round"><img src={`${config.api_host}/api/image/${cookies.get('user').image.id}`} alt="user"/></div>
                        <div className="user-greeting">
                          <span className="greeting">{cookies.get('user').username}</span>
                          <span className="email-user">{cookies.get('user').email}</span>
                        </div>
                      </div>
                      <div className="menu-action">
                        <div className="user-store">
                          {store ? <button><Link to="/seller/dashboard">Seller Dashboard</Link></button> : <button><Link to="/open-shop">Open Shop</Link></button>}
                        </div>
                        <div className="more">
                          <Link to="/user/track">Track Your Order</Link>
                          <Link to="/user/wishlist">Wishlist</Link>
                          <Link to="/user/settings">Settings</Link>
                          <div className="signout" onClick={logout}>Sign out <img src={SignoutIco} alt="ico"/></div>
                        </div>
                      </div>
                    </div>
                    <div className="account-img" onClick={() => setMenu(!menu)} >
                      <img src={`${config.api_host}/api/image/${cookies.get('user').image.id}`} alt="profile" />
                    </div>
                  </button>
                </Fragment>
              )}
            </div>
          </div>
        </div>
        {display && (
          <div ref={searchRef} className="auto-container">
            {options.slice(0, 5).map((v, i) =>{
              return (
                <div onClick={() => setProduct(v.id)} className="auto-option" key={i} tabIndex="0">
                  <div className="icon-option">
                    <img src={`${config.api_host}/api/image/${v.images[0].id}`} alt="img-ico"/>
                  </div>
                  <div className="name-option">
                    <span>{v.name}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        <div ref={nodeMegamenu} className={megamenu ? "megamenu" : "megamenu-hidden"}>
          <div className="container pt-4">
            <div className="megamenu-title">
              <div className="p-categories">
                <p className="popular-title">popular categories</p>
              </div>
              <div className="p-searches">
                <p className="popular-searches">popular searches</p>
              </div>
            </div>
            <div className="megamenu-main">
              {loading ? (
                <div className="loader-category">
                  <Loader type="ThreeDots" color="#439CEF" height="80" width="80" />
                </div>
              ) : (
              <div className="category-list">
              {categories.map((category, i) => 
                <div className="category-wrapper" key={i} onClick={() => history.push(`/products?category=${category.id}`)}>
                  <img src={`${config.api_host}/api/image/${category.image.id}`} alt="icon" />
                  <p>{category.name}</p>
                </div>
              )}
              </div>
              )}
              <div className="search-list">
                <Link className="search-wrapper" to="/detail/3">
                  <i className="fas fa-search"></i>
                  <p>Playstation 4</p>
                </Link>
                <Link className="search-wrapper" to="/detail/5">
                  <i className="fas fa-search"></i>
                  <p>Apple Iphone 12</p>
                </Link>
                <Link className="search-wrapper" to="/detail/4">
                  <i className="fas fa-search"></i>
                  <p>Adidas Alphabounce</p>
                </Link>
                <Link className="search-wrapper" to="/detail/8">
                  <i className="fas fa-search"></i>
                  <p>Oven Konka</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </Fragment>
  );
};

export default Navbar;
