import React, { useState } from "react";
import { useQuery } from "react-query";
import Drawer from "@material-ui/core/Drawer";
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import styled from "styled-components";
import Item from "./itemComponent/Item";
import Card from "./cardComponent/Card";
import Navbar from "./Navbar/Navbar";
import Home from "./Home/Home";
import "./App.css";

/////// Api integration (fake shoping api) using async and await fetch

const getProduct = async () =>
  await (await fetch("https://fakestoreapi.com/products")).json();

const App = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const { data, isLoading, error } = useQuery("products", getProduct);

 

  const getTotaleItems = (items) =>
    items.reduce((ack, item) => ack + item.amount, 0);

  ////////////////// Handle function to aad a item in Cart box

  const handleAddToCart = (clickedItem) => {
    setCartItems((prev) => {
      const isItemInCart = prev.find((item) => item.id === clickedItem.id);

      if (isItemInCart) {
        return prev.map((item) =>
          item.id === clickedItem.id
            ? { ...item, amount: item.amount + 1 }
            : item
        );
      }

      return [...prev, { ...clickedItem, amount: 1 }];
    });
  };

  /////////////////  Handle the function to remove items to card

  const handleRemoveFromCart = (id) => {
    setCartItems((prev) =>
      prev.reduce((ack, item) => {
        if (item.id === id) {
          if (item.amount === 1) return ack;
          return [...ack, { ...item, amount: item.amount - 1 }];
        } else {
          return [...ack, item];
        }
      }, [])
    );
  };
  if (isLoading) return <LinearProgress />;
  if (error) return <div>Please Try to again..</div>;

  return (
    <div className="main-container">
      <Navbar />
      <Home />

      <div className="container">
        <Drawer
          anchor="right"
          open={cartOpen}
          onClose={() => setCartOpen(false)}
        >
          {" "}
          <Card
            cartItems={cartItems}
            addToCart={handleAddToCart}
            removeFromCart={handleRemoveFromCart}
          />
        </Drawer>
        <StyledButton onClick={() => setCartOpen(true)}>
          <Badge badgeContent={getTotaleItems(cartItems)} color="error">
            <AddShoppingCartIcon />
          </Badge>
        </StyledButton>
        <Grid container spacing={3}>
          {data?.map((item) => (
            <Grid item key={item.id} xs={12} sm={4}>
              <Item item={item} handleAddToCart={handleAddToCart} />
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default App;

///////adding styled in seprate div . this is a material ui buttons(in add css in the css file is not possible)

export const StyledButton = styled(IconButton)`
  position: absolute;
  z-index: 100;
  right: 20px;
  top: 3px;
  color: #fff;
`;
