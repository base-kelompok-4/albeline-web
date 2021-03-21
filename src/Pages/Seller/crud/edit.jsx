import Axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react'
import GridLoader from 'react-spinners/GridLoader';
import BeatLoader from 'react-spinners/BeatLoader';
import { config } from '../../../config';
import Cookie from 'universal-cookie';
import { useHistory, useParams } from 'react-router-dom';
var cookies = new Cookie();

export const Edit = () => {
  let { id } = useParams();
  const [product, setProduct] = useState([]);
  const [name, setName] = useState('');
  const [condition, setCondition] = useState();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [categoriesOpt, setCategoriesOpt] = useState([]);
  const [price, setPrice] = useState();
  const [priceValidation, setPriceValidation] = useState();
  const [stock, setStock] = useState();
  const [stockValidation, setStockValidation] = useState();
  const [heavy, setHeavy] = useState();
  const [heavyValidation, setHeavyValidation] = useState();
  const [description, setDescription] = useState('');
  let history = useHistory();

  const getProduct = async (unmounted, token) => {
    const url = `${config.api_host}/api/product/${id}`;
    const urlCat = `${config.api_host}/api/category`;
    setLoading(true);
    try {
      const response = await Axios.get(url, {cancelToken: token});
      const responseCat = await Axios.get(urlCat, {cancelToken: token});
      if (!unmounted) {
        setProduct(response.data.product);

        let categories_id = [];
        response.data.product.categories.map((category) => {
          categories_id.push(category.id);
        });
        setCategories(categories_id);

        let customCategories = responseCat.data.categories.map((category, i) => {
          response.data.product.categories.map((product_category, a) => {
            if (category.id === product_category.id) {
              category = {...category, selected : true}
            }
          })
          return category;
        })

        setCategoriesOpt(customCategories);
      }
    } catch (e) {
      console.error(e.message);
      if (Axios.isCancel(e)) {
        console.error('request cancelled', e);
      } else {
        console.error('Another error happened', e.message);
      }
    }
    setLoading(false);
  }

  const editProduct = async (e) => {
    e.preventDefault();

    const url = `${config.api_host}/api/update-product/${id}`
    let body = {};

    if (name.length > 0) {
      body = {...body, name};
    }
    if (description.length > 0) {
      body = {...body, desc: description};
    }
    if (price !== undefined) {
      body = {...body, price};
    }
    if (stock !== undefined) {
      body = {...body, stock};
    }
    if (condition !== undefined) {
      body = {...body, condition};
    }
    if (heavy !== undefined) {
      body = {...body, heavy};
    }
    body = {...body, categories: categories}

    console.log('body', body);
    const header = {
      'Authorization': `Bearer ${cookies.get('user_token')}`
    }

    setLoading2(true);
    try {
      const response = await Axios.post(url, body, {headers: header});
      setLoading2(false);
      history.push(`/seller/products`);
    } catch (e) {
      console.error(e.message);
      setLoading2(false)
    }
  }

  const categoryHandle = (item) => {
    if (categories.includes(item)) {
      setCategories(categories.filter(cat => cat != item));
      categoriesOpt.map((categoryopt) => {
        if (categoryopt.id === item) {
          categoryopt = {...categoryopt, selected : false}
        }
      })
    } else {
      setCategories([...categories, item]);
    }
  }

  const checkHandler = (e) => {
    const value = parseInt(e.target.value);
    categoryHandle(value);
  }

  const integerHandle = (e, type) => {
    let value = e.target.value;
    if (value.length > 0) {
      if (value.includes(",") || value.includes(".")) {
        switch (type) {
          case 'price':
            setPriceValidation(false);
            break;
          case 'stock':
            setStockValidation(false);
            break;
          case 'heavy':
            setHeavyValidation(false);
            break;
        
          default:
            break;
        }
      } else {
        value = parseInt(value);
        switch (type) {
          case 'price':
            setPriceValidation(true);
            setPrice(value);
            break;
          case 'stock':
            setStockValidation(true);
            setStock(value);
            break;
          case 'heavy':
            setHeavyValidation(true);
            setHeavy(value);
            break;
        
          default:
            break;
        }
      }
    } else {
      switch (type) {
        case 'price':
          setPriceValidation(undefined);
          setPrice(undefined);
          break;
        case 'stock':
          setStockValidation(undefined);
          setStock(undefined);
          break;
        case 'heavy':
          setHeavyValidation(undefined);
          setHeavy(undefined);
          break;
      
        default:
          break;
      }
    }
  }

  const handleCondition = (value) => {
    let isSet = (value === 'true');
    if (isSet === true) {
      product.condition = 1;
    } else {
      product.condition = 0;
    }
    console.log('isSet', isSet)
    setCondition(isSet);
  }

  useEffect(() => {
    let unmounted = false;
    let source = Axios.CancelToken.source();
    getProduct(unmounted, source.token);

    return () => {
      unmounted = true;
      source.cancel('Cancelling in cleanup');
    }
  }, []);

  return (
    <Fragment>
      {console.log('categoriesOpt', categoriesOpt)}
      {console.log('categories', categories)}
      <form onSubmit={editProduct}>
        <div className="product-information-form">
          <div className="product-information-header">
            <h5>Product Information</h5>
          </div>
          <div>

            <div className="row group">
              <div className="title-form col-5">
                <h6>Product Name</h6>
                <small className="text-secondary">Name min. 5 words, consisting of the type <br/> of product, brand, and descriptions such <br/> as color, material or type.</small>
              </div>
              <div className="input-form col-7">
                <input type="text" className={name.length === 0 ? "w-100 form-control" : name.length < 5 ? "w-100 form-control is-invalid" : "w-100 form-control is-valid"} onChange={e => setName(e.target.value)} maxLength="70" defaultValue={product.name} />
              </div>
            </div>

            <div className="row group">
              <div className="title-form col-5"><h6>Category</h6></div>
              <div className="input-form category-badge-form col-7">
                <div className="load"><GridLoader color="#00ce75" size="10" loading={loading} /></div>
                {categoriesOpt.length > 0 && 
                  categoriesOpt.map((category, i) => 
                    <Fragment>
                      <input type="checkbox" id={`category-input ${category.id}`} onChange={e => checkHandler(e)} value={category.id} defaultChecked={category.selected}/>
                      <label htmlFor={`category-input ${category.id}`}><span className="badge bg-secondary text-light">{category.name}</span></label>
                    </Fragment>
                  )
                }
              </div>
            </div>

          </div>
        </div>

        <div className="product-information-form mt-4">
          <div className="product-information-header">
            <h5>Detail Product</h5>
          </div>
          <div>

            <div className="row group d-flex align-items-center">
              <div className="title-form col-5"><h6>Condition</h6></div>
              <div className="input-form col-7 radio-input">
                <div className="condition-input">
                  <input type="radio" name="condition" onChange={e => handleCondition(e.target.value)} value='true' checked={product.condition === 1}/>
                  <span>New</span>
                </div>
                <div className="condition-input">
                  <input type="radio" name="condition" onChange={e => handleCondition(e.target.value)} value='false' checked={product.condition === 0}/>
                  <span>Second</span>
                </div>
              </div>
            </div>
            
            <div className="row group">
              <div className="title-form col-5">
                <h6>Price</h6>
                <small className="text-secondary">Enter the product price with number only. Do not use <br/> "." or "," when your're typing your product price.</small>
              </div>
              <div className="input-form price-input col-7">
                <span>Rp</span>
                <input type="number" className={priceValidation === undefined ? "w-100 form-control" : priceValidation ? "w-100 form-control is-valid" : "w-100 form-control is-invalid"} onChange={e => integerHandle(e, 'price')} defaultValue={product.price} />
              </div>
            </div>

            <div className="row group d-flex align-items-center">
              <div className="title-form col-5">
                <h6>Stock</h6>
              </div>
              <div className="input-form col-7">
                <input type="number" className={stockValidation === undefined ? "w-100 form-control" : stockValidation ? "w-100 form-control is-valid" : "w-100 form-control is-invalid"} onChange={e => integerHandle(e, 'stock')} defaultValue={product.stock} />
              </div>
            </div>

            <div className="row group">
              <div className="title-form col-5">
                <h6>Weight</h6>
                <small className="text-secondary">Product weight is typed in grams to make it easier during the checkout process. Make sure you fill <br/> it in correctly, e.g. 1000, 1600, 2000, etc.</small>
              </div>
              <div className="input-form heavy-input col-7">
                <span>gram</span>
                <input type="number" className={heavyValidation === undefined ? "w-100 form-control" : heavyValidation ? "w-100 form-control is-valid" : "w-100 form-control is-invalid"} onChange={e => integerHandle(e, 'heavy')} defaultValue={product.heavy} />
              </div>
            </div>

            <div className="row group">
              <div className="title-form col-5">
                <h6>Description</h6>
                <small className="text-secondary">The product description min. 5 words. Make sure the product description contains specifications, sizes, materials, validity period, and others. The more details, the more useful it is for the buyer.</small>
              </div>
              <div className="input-form col-7">
                <textarea className={description.length < 1 ? "form-control" : description.length > 4 ? "form-control is-valid" : "form-control is-invalid"} id="exampleFormControlTextarea1" rows="5" onChange={e => setDescription(e.target.value)} defaultValue={product.description} ></textarea>
              </div>
            </div>
          </div>
        </div>
        <button className="next-form-btn" type="submit" onSubmit={editProduct}>{loading2 ? <BeatLoader color="#ffffff" size="8"/> : 'Add Product'}</button>
      </form>
    </Fragment>
  )
}

export default Edit;