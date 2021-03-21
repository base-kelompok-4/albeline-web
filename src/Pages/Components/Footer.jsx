import React, { Fragment } from 'react';
import Instagram2 from '../../assets/images/icons/instagram2.svg';
import Facebook2 from '../../assets/images/icons/facebook2.svg';
import Logo from '../../assets/images/Logo.png';
import Youtube2 from '../../assets/images/icons/youtube2.svg';
import Email2 from '../../assets/images/icons/email2.svg';

const Footer = () => {

 function getThisYear() {
   return new Date().getFullYear();
 }

  return(
    <Fragment>
      <footer className="footer">
        <div className="row">
          <div className="footer-wrapper">
            <div className="footer-main">
              <div className="container">
                <div className="content-footer">
                  <div className="logo-wrapper-footer">
                    <img src={Logo} alt="logo" />
                  </div>
                  <div className="location-footer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                    </svg>
                    <a href="https://goo.gl/maps/6VS7aCJJwP3WGn53A" rel="noopener noreferrer" target="_blank"><span><span className="locone">Singasari, Kec. Jonggol</span><span className="loctwo">Bogor, Jawa Barat 16830</span></span></a>
                  </div>
                  <div className="call-footer">
                    <i class="bi bi-telephone"></i>
                    <span><span className="locone">0812 3456 789</span><span className="loctwo">kelompok4@smk-mail.lan</span></span>
                  </div>
                  <div className="social-footer">
                    <a href="https://www.facebook.com/smktimadinatulquran" rel="noopener noreferrer" target="_blank">
                      <div className="social-button">
                        <img src={Facebook2} alt="fb" />
                      </div>
                    </a>
                    <a href="https://www.instagram.com/smktimadinatulquran/" rel="noopener noreferrer" target="_blank">
                      <div className="social-button">
                        <img src={Instagram2} alt="ig" />
                      </div>
                    </a>
                    <a href="mailto:skytours.com">
                      <div className="social-button">
                        <img src={Email2} alt="email" />
                      </div>
                    </a>
                    <a href="https://www.youtube.com/channel/UCLQ2_4V-t11pUG0pATDXK6g" rel="noopener noreferrer" target="_blank">
                      <div className="social-button">
                        <img src={Youtube2} alt="yt" />
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer-copyright">
              <div className="container">
                <div className="copyright">
                  <p className="cptlz-text">copyright &#169; {getThisYear()}</p>
                  <p className="cptlz-text c-brand">Albeline, Inc. </p>
                  <p className="last-p"><span className="cptlz-text">All</span> rights reserved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </Fragment>
  );
}
export default Footer;