/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowsRotate, faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { createPath } from 'react-router';

import { 
  fetchRemoveOrderProduct,
  fetchUpdateOrderProductQuantity,
  fetchUserOpenOrders,
  fetchCheckout,
  fetchCancelOrder,
} from '../../orders_api'; 



function Cart({setCartItemTotal, cartItemTotal}) {
  const [userOrderProducts, setUserOrderProducts] = useState([])
  const [quantity, setQuantity] = useState(0);
  const [userMessage, setUserMessage] = useState("")
  const [orderId, setOrderId] = useState(0)

  const randomString =  () => {
    return crypto.randomUUID()
  }
  
  async function loadUserOpenOrders() {
    try {  
      const sessionId = window.localStorage.getItem("fetchSessionId")

      if (!sessionId) {
        const newSessionId = randomString();
        window.localStorage.setItem("fetchSessionId", newSessionId )
      }
        
      const results = await fetchUserOpenOrders(sessionId);
      const resultProducts = results.products
      const sortedProducts = resultProducts.sort((a, b) => (a.name > b.name) ? 1: -1);
      console.log('sortedProducts :>> ', sortedProducts);
      setUserOrderProducts(() => sortedProducts);
      setOrderId(() => results.id)
      console.log('loadOrderResults :>> ', results);

      let numOfItems = 0
      if (results.products) {
        results.products.map((product) => numOfItems += product.quantity)
        setCartItemTotal(numOfItems)
        window.localStorage.setItem("cartTotal", numOfItems)
      }

    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadUserOpenOrders()
  }, [])

  async function handleRemoveItem(orderProductId){
    try{
      const results = await fetchRemoveOrderProduct (orderProductId)
      console.log('RemoveItemResults :>> ', results);
      if (results.id === orderProductId ){
        loadUserOpenOrders()
      } else {  
        setUserMessage("Sorry there was an error removing your item please try again")
        console.log(userMessage)
      }

    } catch (error) {
      console.error(error);
    }

  }

  async function handleUpdateItem(orderProductId, event) {
    console.log('am I getting here?');

    try{
      const results = await fetchUpdateOrderProductQuantity (orderProductId, quantity)
      console.log('UpdateItemResults :>> ', results);
      if (results.quantity === quantity){
        setUserMessage("Sorry there was an error updating your item please try again")
        console.log(userMessage)
      } else {  
        loadUserOpenOrders()
      }
    } catch (error) {
      console.error(error);
    }

  }
  
  async function handleCheckout() {
    try{

      const orderDate = new Date()
      console.log('orderDate :>> ', orderDate);

      const results = await fetchCheckout (orderId, orderSum, orderDate)
      console.log('checkoutResults :>> ', results);
      if (!results.isCheckedOut){
        setUserMessage("Sorry there was an error updating your item please try again")
        console.log(userMessage)
      } else {  
        setUserOrderProducts([])
        setCartItemTotal(0)
        window.localStorage.removeItem("cartTotal")

      }
    } catch (error) {
      console.error(error);
    }

  }

  async function handleCancelOrder() {
    try{

      const results = await fetchCancelOrder(orderId)
      console.log('cancelOrderResults :>> ', results);
      setUserOrderProducts([])
      setCartItemTotal(0)
      window.localStorage.removeItem("cartTotal")
      
    } catch (error) {
      console.error(error);
    }

  }

  let orderSum = 0
  if(userOrderProducts){
    userOrderProducts.map((item) => 
      orderSum += item.price*item.quantity
    )
  }
  let taxes = orderSum*.05
      

  return (
    <div className='mainCartPage'>
      <h3 className='cartPageTitle' >Shopping Cart</h3>
      <div className='cartDetailsCtr'>
        <div className='cartProductsOutsideCtr'>
        <h3 className="cartProductsCtrTitle">Products {cartItemTotal !== 0 && <>({cartItemTotal} {cartItemTotal > 1 ? <>items</> : <>item</>})</>}</h3>
          <div className="cartProductsCtr">
            {cartItemTotal === 0 && <h4 className='cartEmptyMessage' >Your cart is currently empty</h4>}
            {userOrderProducts && <div>
              {userOrderProducts.map((item) =>
                  (<div className='cartProductCtr'>
                    <div key={item.id}>
                      <div className='cartProductCtrTop'>
                        <p className='cartProdTitle'>{item.name}<class className ='itemPrice'> - ${item.price} each</class></p>
                        <button className="xFromCartBtn" onClick={() =>handleRemoveItem(item.orderProductId)} >X</button>
                      </div>  
                      <div className='cartQtyTotalCtr'>
                        <h4 className='cartQtyTitle'>Quantity</h4>
                        <form onClick={(event)=>handleUpdateItem(item.orderProductId)}>
                        <input className='cartQtyDropdown' type='number' defaultValue={item.quantity} onChange={(event) => setQuantity(event.target.value)} min={1} max={item.inventory || 10}/>
                        </form>
                        <h4 className='cartProdTotal'>${(item.price*item.quantity).toFixed(2)}</h4>
                      </div>
                    </div>
                  </div>
            ))}</div>}
          </div>        
        </div>  
        {cartItemTotal !== 0 && <div className="checkoutDetailsCtr">
          <h3 className="cartProductsCtrTitle">Order Details</h3>
          <h3 className='sumTotal'>Products Total: ${orderSum.toFixed(2)}</h3>
          <h3 className='shippingCharge'>Delivery Fee: $5.99</h3>
          <h3 className='taxes'>Taxes: ${taxes.toFixed(2)}</h3>
          <h3 className='orderTotal'>Order Total: ${(orderSum+taxes+5.99).toFixed(2)}</h3>
          <div className='manageCartBtnCtr'>
            <button className="checkoutCartBtn" onClick={() => handleCheckout()} >Checkout</button>
            <button className="cancelOrderBtn" onClick={() => handleCancelOrder()} >Cancel Order</button>
          </div>
        </div>}
      </div>
    </div>
  );
}

export default Cart;

