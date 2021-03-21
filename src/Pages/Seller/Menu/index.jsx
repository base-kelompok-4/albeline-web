import React, { Fragment } from 'react'
import { Link, NavLink } from 'react-router-dom'

export const Menu = () => {
  return (
    <Fragment>
      <div className="menu-panel" style={{ paddingTop: '5vh' }}>
        <NavLink to="/seller/dashboard" activeClassName="panel__link--active" className="panel__link">
          <i class="fas fa-columns"></i>
          &nbsp;
          Dashboard
        </NavLink>
        <NavLink to="/seller/orders" activeClassName="panel__link--active" className="panel__link">
          <i class="bi bi-box-seam"></i>
          &nbsp;
          Store Orders
        </NavLink>
        <NavLink to="/seller/products" activeClassName="panel__link--active" className="panel__link">
          <i class="far fa-list-alt"></i>
          &nbsp;
          Your Products
        </NavLink>
        <NavLink to="/seller/settings" activeClassName="panel__link--active" className="panel__link">
          <i class="fas fa-cog"></i>
          &nbsp;
          Store Settings
        </NavLink>
      </div>
    </Fragment>
  )
}

export default Menu;