import Axios from 'axios';
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from "react-select";
import Swal from 'sweetalert2';
import Cookie from 'universal-cookie';
import Shop from '../../../assets/images/clip-art/shop.png';
import { config } from '../../../config';
const cookies = new Cookie();

export const Register = () => {
  const [groupedOptions, setGroupedOptions] = useState([]);
  const [city_id, setCity_id] = useState('');
  const [city_name, setCity_name] = useState('');
  const node = useRef();
  const dispatch = useDispatch();
  let history = useHistory();

  const getCity = async (token) => {
    // own Proxy Server
    const url = `${config.api_host}/api/cities`;
    try {
      let response = await Axios.get(url, {
        cancelToken: token,
      });

      var contain = response.data.cities.map((result) => ({
        value: result.city_id,
        label: result.city_name,
        province: result.province,
      }));

      var provinsi = response.data.cities.map((result) => ({
        label: result.province,
      }));

      removeDuplicate(provinsi, contain);
    } catch (e) {
      if (Axios.isCancel(e)) {
      } else {
        throw e;
      }
    }
  };

  function removeDuplicate(p, c) {
    let uniqueProvince = Array.from(new Set(p.map((a) => a.label)));
    var i = 0;
    var groupedOptions = [];
    for (i = 0; i < uniqueProvince.length; i++) {
      const filteredCity = c.filter(
        (city) => city.province == uniqueProvince[i]
      );
      groupedOptions[i] = {
        label: uniqueProvince[i],
        options: [...filteredCity, filteredCity],
      };
      groupedOptions[i]["options"].pop();
    }
    setGroupedOptions(groupedOptions);
  }

  const handleSelect = (addressVal) => {
    setCity_id(addressVal.value);
    setCity_name(addressVal.label);
  };
  
  const formatGroupLabel = (data) => (
    <div style={groupStyles}>
      <span>{data.label}</span>
      <span style={groupBadgeStyles}>{data.options.length}</span>
    </div>
  );

  const openShop = async (e) => {
    e.preventDefault();

    const url = `${config.api_host}/api/open-store`;
    let name = document.getElementsByName('shopname')[0].value;
    let header = {
      'Authorization': `Bearer `.concat(cookies.get('user_token'))
    }

    let body = {
      name,
      city_id,
      city_name
    }
    console.log('body', body);
    try {
      const response = await Axios.post(url, body, {headers: header});
      dispatch({type: "REGISTER_SHOP", registered: true});
      Swal.fire({icon: 'success', title: 'your shop has been created', text: 'Let\'s fill up your store with your products!'}).then(() => {history.push('/seller/dashboard?seller=new')});
    } catch(e) {
      Swal.fire({icon: 'error', title: 'Oops...', text: 'An error Occured'});
      console.error('Failure created a store: ', e);
    }
  }

  const groupStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const groupBadgeStyles = {
    backgroundColor: "#EBECF0",
    borderRadius: "2em",
    color: "#172B4D",
    display: "inline-block",
    fontSize: 12,
    fontWeight: "normal",
    lineHeight: "1",
    minWidth: 1,
    padding: "0.16666666666667em 0.5em",
    textAlign: "center",
  };

  useEffect(() => {
    const source = Axios.CancelToken.source();
    getCity(source.token);
    return () => {
      source.cancel();
    };
  }, []);

  return (
    <Fragment>
      <section className="op-shop" style={{ paddingBottom: '50px' }}>
        <div className="container">
          <div className="open-shop-grid">
            <div className="vector-art">
              <div className="vector-title">
                <span>Make a unique shop name, always looks good</span>
                <p>Use a short and simple name to make your shop easy for buyers to remember.</p>
              </div>
              <div className="vector-image">
                <img src={Shop} alt="shop"/>
              </div>
            </div>
            <form onSubmit={openShop} className="open-shop-input">
              <span className="greeting_2">Hello, <b className="bold">{cookies.get('user').name ? cookies.get('user').name.split(' ').slice(0, 2).join(' ') : cookies.get('user').username}</b> let's fill in your shop details!</span>

              <div className="name-shop-input">
                <h4>Enter Your Shop Name</h4>
                <label htmlFor="shopname">Shop Name</label>
                <input type="text" name="shopname" id="shopname"/>
                <small>Make sure your store name is entered correctly</small>
              </div>

              <div className="address-shop-input">
                <h4>Enter Your Shop City Address</h4>
                <label htmlFor="shopcity">City Address</label>
                <Select
                  options={groupedOptions}
                  formatGroupLabel={formatGroupLabel}
                  onChange={handleSelect}
                  autoFocus={true}
                />
              </div>

              <button type="submit">create your shop</button>
            </form>
          </div>
        </div>
      </section>
    </Fragment>
  )
}

export default Register;