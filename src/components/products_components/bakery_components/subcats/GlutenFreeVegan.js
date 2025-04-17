import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AddToCart from "../../../cart_components/AddToCart";
import Loading from '../../../Loading';

const GlutenFreeVeganProducts = ({setCartItemTotal, cartItemTotal}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchGlutenFreeVeganProducts = async () => {
      try {
        const response = await fetch("https://fetch-farm-web-service.onrender.com/api/products/subcategory/Gluten-free%20&%20Vegan");
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchGlutenFreeVeganProducts();
  }, []);

  return (
    <div>
      {loading && <Loading/>}
      {!loading &&<div className='products-page'>
        <h3 className='product-title'>Bakery / Gluten-free & Vegan</h3>
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
            <div className='addToCartMultiProdCtr'>
              {product.id && <AddToCart setCartItemTotal={setCartItemTotal} cartItemTotal={cartItemTotal} productId={product.id} productInventory={product.inventory} className="add-to-cart" />}
            </div>          
          </div>
          ))}
        </div>
      </div>}
    </div>
  );  
}

export default GlutenFreeVeganProducts;