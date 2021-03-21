import { Fragment, useEffect, useState } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useLocation } from "react-router-dom";

export const currencyFormatter = (duit) => {
  let int = parseInt(duit);
  if(int !== undefined) {
    return int.toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).slice(0, -3);
  } else {
    console.error('Parameter duit gak ada valuenya. duit : ', int);
  }
}

export const soldFormatter = (terjual) => {
  if(terjual !== undefined) {
    if(terjual !== null) {
      return `${terjual} Terjual`
    } else {
      return '';
    }
  } else {
    console.error('Parameter Terjual gak ada valuenya. Terjual : ', terjual);
  }
}

export const inStockFormatter = (jumlah) => {
  if( jumlah !== undefined ) {
    if( jumlah !== 0 ) {
      return (
        <Fragment>
          <span className="in-stock"><i class="bi bi-check2-circle"></i> <span>In stock</span></span>
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          <span className="out-of-stock"><i class="bi bi-check2"></i> <span>Out of stock</span></span>
        </Fragment>
      )
    }
  }
}

export const ratingTextFormatter = (rating) => {
  if( rating !== undefined ) {
    const rate = parseInt(rating);
    if(rate % 1 === 0) {
      console.log('rating', typeof rate);
      return rate.toFixed(1);
    } else {
      return rating;
    }
  }
}

export const ratingFormatter = (rating) => {
  if(rating !== undefined ) {
    if (rating === null) {
      return (<span>Be the first to rate this product</span>);
    } else {
      const starsComponent = [];
      const modulus = rating % 1;
      const ratingCountFloored = Math.floor(rating);
    
      for(let i=0;i<ratingCountFloored;i++) {
        starsComponent.push(
          <svg xmlns="http://www.w3.org/2000/svg" key={i} width="16" height="16" fill="currentColor" className="bi bi-star-fill yellow" viewBox="0 0 16 16">
            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
          </svg>
        );
      }
      if(modulus > 0.5) {
        starsComponent.push(
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star-half yellow" viewBox="0 0 16 16">
            <path d="M5.354 5.119L7.538.792A.516.516 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.537.537 0 0 1 16 6.32a.55.55 0 0 1-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.519.519 0 0 1-.146.05c-.341.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 0 1-.171-.403.59.59 0 0 1 .084-.302.513.513 0 0 1 .37-.245l4.898-.696zM8 12.027c.08 0 .16.018.232.056l3.686 1.894-.694-3.957a.564.564 0 0 1 .163-.505l2.906-2.77-4.052-.576a.525.525 0 0 1-.393-.288L8.002 2.223 8 2.226v9.8z"/>
          </svg>
        );
      }
      if(starsComponent.length < 5) {
        for(let a=starsComponent;starsComponent.length < 5;a++) {
          starsComponent.push(
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star yellow" key={a} viewBox="0 0 16 16">
              <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.523-3.356c.329-.314.158-.888-.283-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767l-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288l1.847-3.658 1.846 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.564.564 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
            </svg>
          );
        }
      }
      return (
        starsComponent
      );
    }
  } else {
    console.error("Parameter Terjual gak ada valuenya. Terjual : ", rating);
  }
}

export const OfflineAlert = () => {
  const [isOnline, setNetwork] = useState(window.navigator.onLine);
  const updateNetwork = () => {
    setNetwork(window.navigator.onLine);
  };
  
  useEffect(() => {
    window.addEventListener("offline", updateNetwork);
    window.addEventListener("online", updateNetwork);
    return () => {
        window.removeEventListener("offline", updateNetwork);
        window.removeEventListener("online", updateNetwork);
    };
  });

  const handleRefresh = () => {
    window.location.reload();
  }

  const hideAlert = () => {
    const alert = document.getElementsByClassName("network-alert")[0];
    alert.classList.remove("show-alert");
    alert.classList.add("hide-alert");
  }

  return (
    <Fragment>
      <div className={isOnline ? "hide-alert network-alert" : "show-alert network-alert"}>
        <i className="bi bi-wifi-off wifi-mati"></i>
        <span>You are currently offline.</span>
        <span onClick={handleRefresh} style={{color: "rgb(65 142 235)", cursor: "pointer"}}>Refresh</span>
        <i onClick={hideAlert} className="bi bi-x cancel-offline"></i>
      </div>
    </Fragment>
  );
}

export function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export const countTotal = (list, key, type = 'item', price_key = 'price', item_amount = 'amount') => {
  var per_item = [];
  let final;

  // eslint-disable-next-line array-callback-return
  list.map((item) => {
    if (type === 'price') {
      let count = (item[`${price_key}`] * item[`${item_amount}`]);
      per_item = [...per_item, count];
    } else {
      per_item = [...per_item, item[`${key}`]];
    }
  })
  
  final = per_item.reduce((a, b) => a + b, 0);
  return final;
}