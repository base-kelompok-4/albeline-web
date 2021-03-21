/* eslint-disable no-unused-vars */
// eslint-disable-next-line
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Navbar from "./Pages/Navbar";
import Home from "./Pages/Home";
import Detail from "./Pages/Detail";
import Quickview from "./Pages/Components/Quickview";
import { OfflineAlert } from "./utils";
import { store } from "./redux";
import { Provider } from "react-redux";
import Cart from "./Pages/Buyer/Cart";
import UploadImage from "./experiment/uploadImage";
import RatingPicker from "./experiment/ratingpicker";
import Credential from "./Pages/Credentials";
import { PushNotification } from "./experiment/pushnotification";
import ListProduct from "./Pages/ListProduct";
import Register from "./Pages/Seller/Register";
import Seller from "./Pages/Seller";
import AuthGuarder from "./Pages/Guarder/AuthGuarder";
import NotFound from "./Pages/Components/Notfound";
import Checkout from "./Pages/Buyer/Checkout";
import User from "./Pages/User";
import ResetPassword from "./Pages/Credentials/CallbackResetPassword";
import Store from "./Pages/Store";
import Footer from "./Pages/Components/Footer";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/products">
            <ListProduct />
          </Route>
          <Route path="/detail/:id">
            <Detail />
          </Route>
          <Route path="/store/:id">
            <Store />
          </Route>
          <AuthGuarder path="/user">
            <User />
          </AuthGuarder>
          <AuthGuarder path="/cart" exact>
            <Cart />
          </AuthGuarder>
          <AuthGuarder path="/order-checkout" exact>
            <Checkout />
          </AuthGuarder>
          <AuthGuarder path="/open-shop">
            <Register />
          </AuthGuarder>
          <AuthGuarder path="/seller">
            <Seller />
          </AuthGuarder>
          <Route path="/experiment-rating-picker">
            <RatingPicker/>
          </Route>
          <AuthGuarder path="/cart/checkout">
            <Checkout />
          </AuthGuarder>
          <Route path="/password/reset/:token/:email" exact>
            <ResetPassword />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
        <Footer />
      </Router>
      {/* <PushNotification /> */}
      <Credential />
      <Quickview />
      <OfflineAlert />
    </Provider>
  );
}

export default App;
