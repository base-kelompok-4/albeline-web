import Axios from "axios";
import React, { useState, useCallback } from "react";
import Dropzone from './Dropzone';

const UploadImage = () => {
  const [imagedata, setImagedata] = useState("");

  function handleChange(file) {
    setImagedata(file[0]);
  }

  function addFormData(e) {
    e.preventDefault();
    const fd = new FormData();

    fd.append("image", imagedata);
    console.log('imagedata', imagedata)
    console.log('fd', fd);

    Axios.post("http://127.0.0.1:8000/api/upload-image", fd).then((res) => {
      console.log("Success uploading file", res);
    });
  }

  //! >>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<
  //! >>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<
  //! >>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<

  return (
    <>
      <form onSubmit={addFormData}>
        <label htmlFor="image">Image Upload</label>
        <input
          type="file"
          onChange={(e) => handleChange(e.target.files)}
          id="image"
        />
        <button type="submit" onClick={addFormData}>
          Submit
        </button>
      </form>
    </>
  );
};

const UploadImageIbb = () => {
  const [imagedata, setImagedata] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  function handleChange(file) {
    setImagedata(file[0]);
  }

  function addFormData(e) {
    e.preventDefault();
    const fd = new FormData();

    fd.set('key', 'bd01b524fc3073d96af785323b5f2ccc');
    fd.append("image", imagedata);
    Axios.post("http://localhost:8010/proxy/1/upload", fd).then((res) => {
      console.log("Success uploading file", res);
      setImageUrl(res.data.data.url);
    }).catch(e => {console.error(e.message);})
  }

  function preview(files) {
    if (files && files[0]) {
      var reader = new FileReader();

      reader.onload = function(e) {
        let previewElement = document.getElementById("preview-upload");
        previewElement.setAttribute("src", e.target.result);
      }

      reader.readAsDataURL(files[0]); //? Convert to base64 string
    }
  }

  //! >>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<
  //! >>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<
  //! >>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<

  const style = {
    backgroundColor: 'indigo',
    color: 'white',
    padding: '0.5rem',
    fontFamily: 'sans-serif',
    borderRadius: '0.3rem',
    cursor: 'pointer',
    marginTop: '1rem'
  }

  return (
    <>
      <form onSubmit={addFormData}>
        <label htmlFor="image" style={{ cursor: 'pointer' }}>
          <div className="preview-upload-wrapper">
            <img id="preview-upload" alt="select an image"/>
          </div>
        </label>
        <input type="file" onChange={(e) => {handleChange(e.target.files); preview(e.target.files)}} id="image" hidden />
        <button type="submit" onClick={addFormData}>
          Submit
        </button>
      </form>
      {imageUrl !== "" &&
        <img src={imageUrl} alt="img ibb"/>
      }
    </>
  );
};

// ^ Drag n Drop

const UploadImageDnd = () => {
  const [imagedata, setImagedata] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const onDrop = useCallback(acceptedFile => {
    preview(acceptedFile);
    // handleChangew(acceptedFile);
    var form = document.getElementById('dndform');
    var event = new Event('submit');
    form.dispatchEvent(event);
    addFormData(event, acceptedFile);
  }, []);

  function preview(files) {
    if (files && files[0]) {
      var reader = new FileReader();

      reader.onload = function(e) {
        let previewElement = document.getElementById("preview-upload");
        previewElement.setAttribute("src", e.target.result);
      }

      reader.readAsDataURL(files[0]); //? Convert to base64 string
    }
  }

  function handleChangew(files) {
    console.log('files', files);
    setImagedata(files[0]);
  }

  function addFormData(e, file) {
    e.preventDefault();
    const fd = new FormData();
    fd.append("image", file[0]);
    console.log('imagedata', file[0]);
    console.log('fd', fd);
    console.log('e', e);

    Axios.post("http://127.0.0.1:8000/api/upload-image", fd).then((res) => {
      console.log("Success uploading file", res);
    }).catch(e => {
      console.error(e.message);
    });
  }

  //! >>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<
  //! >>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<
  //! >>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<

  return (
    <>
      <main>
        <form id="dndform" onSubmit={addFormData}>
          <div className="preview-upload-wrapper">
            {imageUrl === "" ? <img id="preview-upload"/> : null}
            <Dropzone onDrop={onDrop} accept={"image/*"}/>
          </div>
        </form>
      </main>
    </>
  );
};

export default UploadImageDnd;
// import Axios from "axios";
// import React from "react";

// class UploadImage extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       imagedata: String,
//     };
//     this.addFormData = this.addFormData.bind(this);
//     this.handleChange = this.handleChange.bind(this);
//   }
//   //FileChange
//   handleChange(file) {
//     this.setState({
//       imagedata: file[0],
//     });
//   }
//   //Form Submission
//   addFormData(evt) {
//     evt.preventDefault();
//     const fd = new FormData();

//     fd.append("image", this.state.imagedata);

//     //Post Request to laravel API Route
//     Axios.post(
//       "http://localhost:8000/",
//       fd
//     ).then((res) => {
//       this.myFormRef.reset();
//     });
//   }

//   render(Message) {
//     return (
//       <div>
//         <h1>Therichpost.com</h1>
//         <form ref={(el) => (this.myFormRef = el)}>
//           <label for="image">Image Upload:</label>
//           <input
//             onChange={(e) => this.handleChange(e.target.files)}
//             type="file"
//             id="image"
//             ref="productimage"
//           />

//           <button type="submit" onClick={this.addFormData}>
//             Submit
//           </button>
//         </form>
//       </div>
//     );
//   }
// }
// export default UploadImage;
