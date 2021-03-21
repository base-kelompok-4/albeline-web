import React, { Fragment } from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import GettingStarted from '../Components/GettingStarted';
import Add from './crud/add';
import Edit from './crud/edit';
import Upload from './crud/upload';
import Dashboard from './Dashboard';
import Menu from './Menu';
import Order from './Orders';
import Products from './Products';
import Settings from './Settings';

export const Seller = () => {
  return (
    <Fragment>
      <div className="overlay-popup">
        <section className="seller">
          <div className="container">
            <div className="seller-page">
              <Router>
                <Menu />
                <div className="main-panel" style={{ paddingTop: '5vh' }}>
                  <Switch>
                    
                    <Route path="/seller/dashboard">
                      <Dashboard />
                    </Route>

                    <Route path="/seller/orders">
                      <Order />
                    </Route>

                    <Route path="/seller/products">
                      <Products />
                    </Route>

                    <Route path="/seller/new-product">
                      <Add />
                    </Route>

                    <Route path="/seller/upload-product/:id">
                      <Upload />
                    </Route>

                    <Route path="/seller/edit-product/:id">
                      <Edit />
                    </Route>

                    <Route path="/seller/settings">
                      <Settings />
                    </Route>

                  </Switch>
                </div>
              </Router>
            </div>
          </div>
        </section>
      </div>
      <GettingStarted />
    </Fragment>
  )
}

export default Seller;