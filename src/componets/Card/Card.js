/* eslint-disable jsx-a11y/alt-text */
import React from 'react';

function Card(img) {
  return (
    <div className="card-container">
      <img src={img.imgURL} />
    </div>
  );
}

export default Card;
