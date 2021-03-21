import Placeholder from '../../../assets/images/clip-art/placeholder.png';
import React, { Fragment, useState, useEffect } from 'react'
import CircleLoader from 'react-spinners/ClipLoader';
import ImageLoad from '../../Components/ImageLoad';
import { config } from '../../../config';
import Cookie from 'universal-cookie';
import Select from 'react-select';
import Axios from 'axios';
var cookies = new Cookie();

const Settings = () => {
  const [store, setStore] = useState([]);
  const [allCity, setAllCity] = useState([]);
  const [groupedOptions, setGroupedOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingStore, setLoadingStore] = useState(false);
  const [render, setRender] = useState(0);
  const [success, setSuccess] = useState();
  const [inputName, setInputName] = useState('');
  const [city_id, setCity_id] = useState();
  const [city_name, setCity_name] = useState();

  const getStore = async (unmounted, token) => {
    const url = `${config.api_host}/api/seller/store/${cookies.get('user').id}`;
    const header = {'Authorization': `Bearer ${cookies.get('user_token')}`}

    setLoadingStore(true);
    try {
      const response = await Axios.get(url, {headers:header, cancelToken: token});
      if (!unmounted) {
        setStore(response.data.data);
      }
    } catch (error) {
      console.log('error get seller store', error);
    }
    setLoadingStore(false);
  }

  const getCity = async (token, unmounted) => {
    // own Proxy Server
    const url = `${config.api_host}/api/cities`;
    try {
      let response = await Axios.get(url, {cancelToken: token});

      var contain = response.data.cities.map((city) => ({
        value: city.city_id,
        label: city.city_name,
        province: city.province,
      }));
      setAllCity(contain);
      
      var provinsi = response.data.cities.map((city) => ({
        label: city.province,
      }));
      
      removeDuplicate(provinsi, contain);
    } catch (e) {
      if (!unmounted) {
        if (Axios.isCancel(e)) {
        } else {
          throw e;
        }
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
    console.log('city_id', addressVal.value)
  };

  const formatGroupLabel = (data) => (
    <div style={groupStyles}>
      <span>{data.label}</span>
      <span style={groupBadgeStyles}>{data.options.length}</span>
    </div>
  );

  const dismissPopup = () => {
    document.getElementsByClassName('alert-dismissible')[0].classList.remove('show');
  }

  const updateStore = async () => {
    const url = `${config.api_host}/api/update-store/${store.id}`;
    const header = {'Authorization': `Bearer ${cookies.get('user_token')}`}
    let body = {};

    if (inputName !== '') {
      body = {...body, name: inputName}
    }

    if (city_id !== undefined) {
      body = {...body, city_id, city_name}
    }

    try {
      await Axios.put(url, body, {headers: header});
      setLoading(false)
      setSuccess(true)
      setRender(render => render + 1)
      setTimeout(() => {
        setSuccess(undefined)
      }, 3000);
    } catch (error) {
      console.log('error', error)
      setSuccess(false)
      setRender(render => render + 1)
    }
  }

  useEffect(() => {
    let unmounted = false;
    let source = Axios.CancelToken.source();
    getStore(unmounted, source.token);
    return () => {
      unmounted = true;
      source.cancel('cleaning up the request');
    }
  }, [render]);

  useEffect(() => {
    let unmounted = false;
    let source = Axios.CancelToken.source();
    getCity(unmounted, source.token);
    return () => {
      unmounted = true;
      source.cancel('cleaning up the request');
    }
  }, []);

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

  return (
    <Fragment>
      <div className="container store-settings">
        <div className={success===undefined ? "alert alert-primary alert-dismissible fade show" : success ? "alert alert-success alert-dismissible fade show" : "alert alert-danger alert-dismissible fade show"} role="alert">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={dismissPopup}>
            <span aria-hidden="true">&times;</span>
            <span className="sr-only">Close</span>
          </button>
          {success===undefined ? "Store image is Synced with user profile image." : success ? "Store profile successfuly change." : "Store failed to change. Try again"}
        </div>
        <div className="row d-flex justify-content-center align-items-start">
          <div className="col-lg-2 col-sm-12">
            <div className="avatar-wrapper" style={{ width: '100px', overflow: 'hidden' }}>
              {loadingStore ? <CircleLoader color="#fff" /> : <ImageLoad src={`${config.api_host}/api/image/${cookies.get('user').image.id}`} className="img-scale" placeholder={Placeholder}/>}
            </div>
          </div>
          <div className="col-lg-6 col-sm-12 d-flex flex-column">
            <div className="input-profile-wrapper d-flex w-100">
              <div className="row w-100 h-100 d-flex align-items-center">
                <div className="col-4">
                  <label className="profile-label">Shop name</label>
                </div>
                <div className="col">
                  <input type="text" className="input-profile pl-3" onChange={e => setInputName(e.target.value)} style={{ width: '86%' }} defaultValue={store.name} />
                </div>
              </div>
            </div>        
            <div className="input-profile-wrapper d-flex w-100">
              <div className="row w-100 h-100 d-flex align-items-center">
                <div className="col-4">
                  <label className="profile-label">Shop City</label>
                </div>
                <div className="col-7 mt-2">
                  <Select options={groupedOptions} defaultValue={store.city_id ? allCity.filter(city => parseInt(city.value) === store.city_id)[0] : ''} formatGroupLabel={formatGroupLabel} onChange={handleSelect}/>
                </div>
              </div>
            </div>
            <div className="input-profile-wrapper w-100">
              <div className="row h-100 d-flex justify-content-end" style={{ width: '88%' }}>
                <div className="mt-2">
                  <button className="submit-profile" disabled={loading} onClick={updateStore}>{loading ? <CircleLoader size="15" color="#fff" /> : 'Save Changes'}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}
  
export default Settings;

{/* <div className="row">
  <div className="col-lg-8 col-sm-12 d-flex justify-content-center">
    <div className="input-profile-wrapper d-flex flex-column w-100">
      <label htmlFor="" className="profile-label">Shop name</label>
      <input type="text" className="input-profile" style={{ width: '50%' }} />
    </div>
  </div>
  <div className="col-lg-8 col-sm-12 d-flex justify-content-center">
  </div>
</div> */}