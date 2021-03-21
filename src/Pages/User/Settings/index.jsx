import Axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { config } from '../../../config';
import ImageLoad from '../../Components/ImageLoad';
import Placeholder from '../../../assets/images/clip-art/placeholder.png';
import CircleLoader from 'react-spinners/ClipLoader';
import Select from 'react-select';
import Cookie from 'universal-cookie';
import { useHistory } from 'react-router-dom';
var cookies = new Cookie();

const Settings = () => {
  const [user, setUser] = useState([]);
  const [allCity, setAllCity] = useState([]);
  const [userImage, setUserImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [groupedOptions, setGroupedOptions] = useState([]);
  const [render, setRender] = useState(0);
  const [inputemail, setInputemail] = useState('');
  const [inputname, setInputname] = useState('');
  const [inputusername, setInputusername] = useState('');
  const [inputgender, setInputgender] = useState('');
  const [inputphone, setInputphone] = useState('');
  const [inputaddress, setInputaddress] = useState('');
  const [city_id, setCity_id] = useState([]);
  const [city_name, setCity_name] = useState([]);
  const [inputbirthdate, setInputbirthdate] = useState('');
  const [inputprofile, setInputprofile] = useState('');
  const [inputavatar, setInputavatar] = useState('');
  const [validFileExt, setValidFileExt] = useState(['webp', 'jpg', 'jpeg', 'png', 'jfif']);
  const [validMail, setValidMail] = useState();
  let history = useHistory();
  
  const validate = (e) => {
    var imageName = document.getElementById('input-avatar').value;
    var blnValid = false;
    for (let j = 0; j < validFileExt.length; j++) {
      var imageCurExtension = validFileExt[j];
      if (imageName.substr(imageName.length - imageCurExtension.length, imageCurExtension.length).toLowerCase() == imageCurExtension.toLowerCase()) {
        blnValid = true;
        let form = document.getElementById('avatar-form');
        let event = new Event('submit');
        form.dispatchEvent(event)
        addFormData(event, e);
        break;
      }
    }

    if (!blnValid) {
      alert("Sorry, " + imageName.substr(12, imageName.length) + " is invalid, allowed extensions are " + validFileExt.join(', '));
      return false;
    }
  }

  const getUser = async (token, unmounted) => {
    const url = `${config.api_host}/api/user-detail`;
    const header = {'Authorization': `Bearer ${cookies.get('user_token')}`}
    setLoading(true)
    try {
      const response = await Axios.get(url, {headers: header, cancelToken: token});
      if(!unmounted) {
        setUser(response.data.user);
        setUserImage(response.data.user.image.id);
        cookies.set('user', response.data.user);
        console.log('response user', response);
        setLoading(false);
      }
    } catch (e) {
      if(!unmounted) {
        console.error(e.message);
        if(Axios.isCancel(e)) {
          console.log(`request cancelled: ${e.message}`);
        } else {
          console.log('Another error happened:' + e.message);
        }
      }
      setLoading(false)
    }
  }

  const getCity = async (token, unmounted) => {
    // own Proxy Server
    const url = `${config.api_host}/api/cities`;
    try {
      let response = await Axios.get(url, {
        cancelToken: token,
      });
      if (!unmounted) { 
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
      }
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

  async function addFormData(e, files) {
    e.preventDefault();
    const url = `${config.api_host}/api/update-avatar`;
    const header = {'Authorization': `Bearer ${cookies.get('user_token')}`}
    const fd = new FormData();
    
    fd.append("image", files[0]);

    setLoading(true);
    try {
      const response = await Axios.post(url, fd, {headers: header});
      setUserImage(response.data.user.image.id);
      setLoading(false)
      window.location.reload();
    } catch (error) {
      console.error('Fail update avatar');
      setLoading(false)
    }
  }

  function updateUser(e) {
    e.preventDefault();

    const url = `${config.api_host}/api/user-update`;
    const header = {'Authorization': `Bearer ${cookies.get('user_token')}`}
    let body = {}

    if (inputname.length > 0) {
      body = {...body, name: inputname}
    }
    if (inputusername.length > 0) {
      body = {...body, username: inputusername}
    }
    if (inputgender.length > 0) {
      body = {...body, gender: inputgender}
    }
    if (inputphone.length > 0) {
      body = {...body, hp: inputphone}
    }
    if (inputaddress.length > 0) {
      body = {...body, address: inputaddress}
    }
    console.log('city_name', city_name)
    if (city_id.length > 0) {
      body = {...body, city_id, city_name}
    }
    if (inputbirthdate.length > 0) {
      body = {...body, dob: inputbirthdate}
    }
    if (inputprofile.length > 0) {
      body = {...body, profile: inputprofile}
    }
    if (inputemail.length > 0) {
      body = {...body, profile: inputemail}
    }

    Axios.post(url, body, {headers: header})
    .then(() => {
      setRender(render => render + 1);
    })
    .catch(e => {
      console.error('Fail update user : ', e);
    })
  }

  useEffect(() => {
    let unmounted = false;
    let source = Axios.CancelToken.source();
    getUser(source.token, unmounted);
    getCity(source.token, unmounted);

    return () => {
      unmounted = true;
      source.cancel("Cancelling request in cleanup");
    }
  }, [render]);

  const emailValidation = (email) => {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidMail(true);
      return;
    }
    setValidMail(false);
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

  return (
    <Fragment>
      <div className="profile-sect" style={{ paddingLeft: '7%' }}>
        <div className="container">
          <div className="row d-flex">
            <div className="col-12">
              <div className="row d-flex w-100 align-items-center justify-content-center">
                <div className="col-lg-2">
                  <div className="avatar-wrapper" style={{ width: '100px', overflow: 'hidden' }}>
                    {loading ? <CircleLoader color="#123123" /> : <ImageLoad src={`${config.api_host}/api/image/${userImage}`} placeholder={Placeholder}/>}
                    <form id="avatar-form" onSubmit={addFormData}>
                      <label htmlFor="input-avatar"><i class="bi bi-pencil-fill"></i></label>
                      <input type="file" id="input-avatar" onChange={e => validate(e.target.files)}/>
                    </form>
                  </div>
                </div>
                <div className="col-lg-10">
                  <div className="d-flex flex-column w-100">
                    {
                      loading ?
                        <Fragment>
                          <div className="line-loading loading" style={{ width: '30%', height: '23px' }}></div>
                          <div className="line-loading loading mt-2" style={{ width: '20%', height: '20px' }}></div>
                        </Fragment>
                      :
                        <Fragment>
                          {user.name ? <h4>{user.name}</h4> : <h5>Oops... let's fill your name</h5>}
                          {user.email ? <span className="profile-email mt-2">{user.email}</span> : <Fragment><input type="email" placeholder="email address" onChange={e => {emailValidation(e.target.value); setInputemail(e.target.value)}} className="email-profile-input"/><span>{inputemail !== '' ? validMail.toString() : null}</span></Fragment>}
                        </Fragment>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          <form onSubmit={updateUser}>

            <div className="row mt-5">
              <div className="col-6 input-profile-wrapper d-flex flex-column"><label className="profile-label">Fullname</label><input onChange={e => setInputname(e.target.value)} className="input-profile text-center" type="text" defaultValue={user.name}/></div>
              <div className="col-6 input-profile-wrapper d-flex flex-column"><label className="profile-label">Username</label><input onChange={e => setInputusername(e.target.value)} className="input-profile text-center" type="text" defaultValue={user.username}/></div>
            </div>

            <div className="row mt-4">
              <div className="col-6 input-profile-wrapper d-flex flex-column">
                <label className="profile-label">Gender</label>
                <select name="gender" id="" className="input-profile text-center" onChange={e => setInputgender(e.target.value)}>
                  <option className="text-center" value="" selected disabled>Choose</option>
                  <option className="text-center" selected={user.gender === 'Male'} value="Male">Male</option>
                  <option className="text-center" selected={user.gender === 'Female'} value="Female">Female</option>
                </select>
              </div>
              <div className="col-6 input-profile-wrapper d-flex flex-column"><label className="profile-label">Phone</label><input onChange={e => setInputphone(e.target.value)} className="input-profile text-center" type="text" defaultValue={user.hp}/></div>
            </div>

            <div className="row mt-4">
              <div className="col-6 input-profile-wrapper d-flex flex-column"><label className="profile-label">Bithdate</label><input onChange={e => setInputbirthdate(e.target.value)} className="input-profile text-center" type="date" defaultValue={user.dob}/></div>
              <div className="col-6 input-profile-wrapper d-flex flex-column"><label className="profile-label">Profile</label><input onChange={e => setInputprofile(e.target.value)} className="input-profile text-center" type="text" defaultValue={user.profile} placeholder="short profile of yourself"/></div>
            </div>

            <div className="row mt-4">
              <div className="col-6 input-profile-wrapper d-flex flex-column"><label className="profile-label">Address</label><input onChange={e => setInputaddress(e.target.value)} className="input-profile text-center" type="text" defaultValue={user.address}/></div>
              
              <div className="col-6 input-profile-wrapper d-flex flex-column"><label className="profile-label">City</label><div style={{ width: '75%' }}><Select options={groupedOptions} defaultValue={user.city_id ? allCity.filter(city => parseInt(city.value) === user.city_id)[0] : ''} formatGroupLabel={formatGroupLabel} onChange={handleSelect}/></div></div>
            </div>
            <div className="row mt-4 justify-content-center">
              <div className="col-4">
                <button className="submit-profile" disabled={loading} type="submit" onClick={updateUser}>{loading ? <CircleLoader size="15" color="#fff" /> : 'Save Changes'}</button>
              </div>
            </div>
            
          </form>
        </div>
      </div>
    </Fragment>
  )
}

export default Settings;