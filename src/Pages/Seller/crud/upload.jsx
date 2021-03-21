import Axios from 'axios';
import React, { Fragment, useState, useCallback, useEffect } from 'react'
import Dropzone from './Dropzone';
import { useHistory, useParams } from 'react-router-dom';
import { config } from '../../../config';
import Cookie from 'universal-cookie';
var cookies = new Cookie();

export const Upload = () => {
  const {id} = useParams();
  const [imagedata, setImagedata] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [previews, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUpload, setCurrentUpload] = useState(1);
  const [successUpload, setSuccessUpload] = useState(1);
  const [uploadPercentage, setUploadPercentage] = useState(0);

  let history = useHistory();

  const onDrop = useCallback((acceptedFile, p) => {
    console.log('acceptedFile', acceptedFile);
    console.log('currentUpload', currentUpload);
    // handleChangew(acceptedFile);
    var form = document.getElementById('imageform');
    setImageUrl(acceptedFile);
    var event = new Event('submit');
    form.dispatchEvent(event);
    addFormData(event, acceptedFile);
  }, []);

  function preview(files, i) {
    i = i - 2;
    if (files && files[0]) {
      var reader = new FileReader();

      reader.onload = function(e) {
        console.log('i', i);
        let previewElement = document.getElementsByClassName('preview-img');
        
        if (previewElement[i].hasAttribute('src')) {
          previewElement[i+1].setAttribute('src', e.target.result);
        } else {
          previewElement[i].setAttribute('src', e.target.result);
        }
        console.log('previewElement', previewElement);
      }

      reader.readAsDataURL(files[0]); //? Convert to base64 string
    }
  }

  async function addFormData(e, file) {
    e.preventDefault();
    
    const fd = new FormData();
    const url = `${config.api_host}/api/store-image/${id}`;
    const header = {'Authorization': `Bearer ${cookies.get('user_token')}`};

    const options = {
      headers: header,
      onUploadProgress: (progressEvent) => {
        const {loaded, total} = progressEvent;
        let percent = Math.floor( (loaded * 100) / total )
        console.log(`${loaded}kb of ${total}kb | ${percent}%`);
        if (percent < 100) {
          setUploadPercentage(percent)
        }
      }
    }
    
    fd.append("image", file[0]);
    console.log('imagedata', file[0]);
    setLoading(true);
    
    try {
      await Axios.post(url, fd, options);
      setCurrentUpload(currentUpload => currentUpload + 1);
      setSuccessUpload(successUpload => successUpload + 1);
      setInterval(() => {
        setUploadPercentage(100);
      }, 1000);
      setTimeout(() => {
        setUploadPercentage(0);
      }, 1000);
      
      setLoading(false);
    } catch (e) {
      console.error(e.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    preview(imageUrl, successUpload);
  }, [successUpload]);

  return (
    <Fragment>
      <div id="imagesform">
        <div className="product-information-form">
          <div className="product-information-header img-form">
            <div className="title-form"><h6>Upload Product</h6></div>
          </div>
          <small className="text-secondary">Image format .jpg .jpeg .png .jfif .webp and minimum size of 300 x 300px (For optimal image use minimum size of 570 x 570 px). <br/></small>
          <small className="text-secondary mt-3">Select product photos or drag and drop up to 6 product photos here.</small>
          <form id="imageform" onSubmit={addFormData}>
            <div className="preview-upload-wrapper">
              <div className="guide-vector main"></div>
              {loading && currentUpload === 1 && 
                <div class="progress">
                  <div class="progress-bar" role="progressbar" style={{ width: `${uploadPercentage}%` }} aria-valuenow={uploadPercentage} aria-valuemin="0" aria-valuemax="100">{uploadPercentage}%</div>
                </div>
              }
              {imageUrl === "" ? null : <img className="preview-img" id="preview-upload1"/>}
              {successUpload > 1 ? <div className="disabled success"><i class="bi bi-cloud-check"></i></div> : null}
              <Dropzone onDrop={onDrop} accept={"image/*"} preview={e => setPreview('one')} />
            </div>

            <div className="preview-upload-wrapper">
              {currentUpload === 2 ? null : <div className="disabled"></div>}
              {successUpload > 2 ? <div className="disabled success"><i class="bi bi-cloud-check"></i></div> : null}
              <div className="guide-vector front"></div>
              {loading && currentUpload === 2 && 
                <div class="progress">
                  <div class="progress-bar" role="progressbar" style={{ width: `${uploadPercentage}%` }} aria-valuenow={uploadPercentage} aria-valuemin="0" aria-valuemax="100">{uploadPercentage}%</div>
                </div>
              }
              {imageUrl === "" ? null : <img className="preview-img" id="preview-upload2"/>}
              <Dropzone onDrop={onDrop} accept={"image/*"} preview={e => setPreview('two')} />
            </div>
            
            <div className="preview-upload-wrapper">
              {currentUpload === 3 ? null : <div className="disabled"></div>}
              {successUpload > 3 ? <div className="disabled success"><i class="bi bi-cloud-check"></i></div> : null}
              <div className="guide-vector right"></div>
              {loading && currentUpload === 3 && 
                <div class="progress">
                  <div class="progress-bar" role="progressbar" style={{ width: `${uploadPercentage}%` }} aria-valuenow={uploadPercentage} aria-valuemin="0" aria-valuemax="100">{uploadPercentage}%</div>
                </div>
              }
              {imageUrl === "" ? null : <img className="preview-img" id="preview-upload3"/>}
              <Dropzone onDrop={onDrop} accept={"image/*"} preview={e => setPreview('three')} />
            </div>

            <div className="preview-upload-wrapper">
              {currentUpload === 4 ? null : <div className="disabled"></div>}
              {successUpload > 4 ? <div className="disabled success"><i class="bi bi-cloud-check"></i></div> : null}
              <div className="guide-vector upper"></div>
              {loading && currentUpload === 4 && 
                <div class="progress">
                  <div class="progress-bar" role="progressbar" style={{ width: `${uploadPercentage}%` }} aria-valuenow={uploadPercentage} aria-valuemin="0" aria-valuemax="100">{uploadPercentage}%</div>
                </div>
              }
              {imageUrl === "" ? null : <img className="preview-img" id="preview-upload4"/>}
              <Dropzone onDrop={onDrop} accept={"image/*"} preview={e => setPreview('four')} />
            </div>
            
            <div className="preview-upload-wrapper">
              {currentUpload === 5 ? null : <div className="disabled"></div>}
              {successUpload > 5 ? <div className="disabled success"><i class="bi bi-cloud-check"></i></div> : null}
              <div className="guide-vector detail"></div>
              {loading && currentUpload === 5 && 
                <div class="progress">
                  <div class="progress-bar" role="progressbar" style={{ width: `${uploadPercentage}%` }} aria-valuenow={uploadPercentage} aria-valuemin="0" aria-valuemax="100">{uploadPercentage}%</div>
                </div>
              }
              {imageUrl === "" ? null : <img className="preview-img" id="preview-upload5"/>}
              <Dropzone onDrop={onDrop} accept={"image/*"} preview={e => setPreview('five')} />
            </div>
            
            <div className="preview-upload-wrapper">
              {currentUpload === 6 ? null : <div className="disabled"></div>}
              {successUpload > 6 ? <div className="disabled success"><i class="bi bi-cloud-check"></i></div> : null}
              <div className="guide-vector back"></div>
              {loading && currentUpload === 6 && 
                <div class="progress">
                  <div class="progress-bar" role="progressbar" style={{ width: `${uploadPercentage}%` }} aria-valuenow={uploadPercentage} aria-valuemin="0" aria-valuemax="100">{uploadPercentage}%</div>
                </div>
              }
              {imageUrl === "" ? null : <img className="preview-img" id="preview-upload6"/>}
              <Dropzone onDrop={onDrop} accept={"image/*"} preview={e => setPreview('six')} />
            </div>
            <button onClick={() => history.push('/seller/products')}>Finish</button>
          </form>
        </div>
      </div>
    </Fragment>
  )
}

export default Upload;