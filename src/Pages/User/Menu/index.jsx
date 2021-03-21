import React, { Fragment } from 'react'
import { NavLink } from 'react-router-dom'

const Menu = () => {
  return (
    <Fragment>
      <div className="menu-panel" style={{ paddingTop: '5vh' }}>
        <NavLink to="/user/settings" activeClassName="panel__link--active" className="panel__link">
          <i class="bi bi-person-badge"></i>
          &nbsp;
          Your Profile
        </NavLink>
        <NavLink to="/user/track" activeClassName="panel__link--active" className="panel__link">
          <i class="bi bi-box-seam"></i>
          &nbsp;
          Tracking
        </NavLink>
        <NavLink to="/user/wishlist" activeClassName="panel__link--active" className="panel__link">
          <i class="bi bi-heart"></i>
          &nbsp;
          Wishlist
        </NavLink>
        <NavLink to="/seller/notification" activeClassName="panel__link--active" className="panel__link">
          <i class="bi bi-bell"></i>
          &nbsp;
          Notification
        </NavLink>
      </div>
    </Fragment>
  )
}

export default Menu;