import { combineReducers } from "redux";
import Cookie from 'universal-cookie';
var cookies = new Cookie();

const initialQ = {
  open: false,
  id: 0,
};

const QReducer = (state = initialQ, action) => {
  switch (action.type) {
    case "SET_QUICKVIEW":
      return {
        ...state,
        open: action.open,
        id: action.id,
      };

    case "SET_POPUP":
      return {
        ...state,
        open: action.open,
      };

    default:
      return state;
  }
};

const initialCredentialPopup = {
  open: false,
  popup: "login",
};

const CredentialPopup = (state = initialCredentialPopup, action) => {
  switch (action.type) {
    case "CREDENTIAL_POPUP":
      return {
        ...state,
        open: action.open,
      };
    case "POPUP_TYPE":
      return {
        ...state,
        popup: action.popup,
      };
    default:
      return state;
  }
};

const initialRegisterShop = {
  registered: false,
};

const RegisterShop = (state = initialRegisterShop, action) => {
  switch (action.type) {
    case "REGISTER_SHOP":
      return {
        ...state,
        registered: action.registered,
      };
    default:
      return state;
  }
};

const initialCart = {
  render: 0,
  product_id: [],
}

const CartReducer = (state = initialCart, action) => {
  switch (action.type) {
    case "CART_COUNT":
      return {
        ...state,
        render: action.render,
        product_id: [...state.product_id, action.product_id]
      };
    case "CART_RENDER":
      return {
        ...state,
        render: state.render + 1
      };
    default:
      return state;
  }
}

const initialCheckout = {
  products: []
}

const CheckoutReducer = (state = initialCheckout, action) => {
  switch (action.type) {
    case "CHECKOUT":
      return {
        ...state,
        products: action.products
      }
  
    default:
      return state;
  }
}

const initialRender = {
  render: 0
}

const RenderReducer = (state = initialRender, action) => {
  switch (action.type) {
    case "SET_RENDER":
      return {
        ...state,
        render: state.render + 1
      }
  
    default:
      return state;
  }
}

const reducer = combineReducers({
  QReducer,
  CredentialPopup,
  RegisterShop,
  CartReducer,
  CheckoutReducer,
  RenderReducer
});

export default reducer;
