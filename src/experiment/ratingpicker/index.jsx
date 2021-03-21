import React, {Fragment, useState} from 'react';
import Rating from 'react-rating';

const RatingPicker = () => {
  const [rate, setRate] = useState()

  return (
    <Fragment>
      {console.log('rate', rate)}
      <Rating onChange={e => setRate(e)} emptySymbol="far fa-star white-text" fullSymbol="fas fa-star" fractions={2}/>
    </Fragment>
  )
}

export default RatingPicker;