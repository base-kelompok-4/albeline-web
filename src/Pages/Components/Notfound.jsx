import React, { Fragment } from "react";
import { useHistory } from "react-router-dom";
import Notfound from '../../assets/images/clip-art/notfound.png';

const NotFound = () => {
  let history = useHistory();

  return (
    <Fragment>
      <div className="overlay-popup">
        <section className="notfound-sect">
          <div className="container">
            <div className="notfound-content">
              <div className="notfound-text">
                <div className="notfound-title">
                  <h1>Ooops.</h1>
                  <h2>Relax, take it easy. <br/> Keep fresh your mind!</h2>
                </div>
                <div className="notfound-desc">
                  <span>You find our error page 404. this is not your fault. it is just a little bit mistakes. But don't worry, you can still explore our site when you go back to main page.</span>
                  <button onClick={() => history.push('/')}>Explore Albeline</button>
                </div>
              </div>
              <div className="notfound-vector">
                <img src={Notfound} alt="vector"/>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Fragment>
  );
};
export default NotFound;
