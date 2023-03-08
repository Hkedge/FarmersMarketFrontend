import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import AddToCart from '../../../cart_components/AddToCart';


function Fruit({setCartItemTotal, cartItemTotal}) {
    const [products, setProducts] = useState([]);
  
    useEffect(() => {
      fetch('https://farmers-market-1oeq.onrender.com/api/products/subcategory/Fresh%20Fruits')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setProducts(data);
        })
        .catch(error => {
          console.log('There was a problem with the API request:', error);
        });
    }, []);
  
    return (
      <div className='products-page'>
        <h3 className='product-title'>Produce / Fruit</h3>
        <div className="product-list">
          {products.map(product => (
            <div key={product.id} className="product">
              <Link to={`/products/${product.id}`}>
                <img className="product-image" src={product.imageURL} alt={product.name} />
                <div className="product-details">
                  <h3 className='product-name'>{product.name}</h3>
                  <p className='product-price'>${product.price}</p>
                </div>
              </Link>
              {product.id && <AddToCart setCartItemTotal={setCartItemTotal} cartItemTotal={cartItemTotal} productId={product.id} productInventory={product.inventory} className="add-to-cart" />}
            </div>
          ))}
        </div>
      </div>
    );  
  }
  
  export default Fruit;
  

