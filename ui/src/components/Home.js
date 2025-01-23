import React, { useEffect, useState } from "react";
import { CartState } from "../context/CartContext";
import Filters from "./Filters";
import SingleProduct from "./SingleProduct";
import useProducts from "../hooks/useProducts";
import useCategories from "../hooks/useCategories";
import useStock from "../hooks/useStock"; // Import useStock hook
import "./styles.css";

const Home = () => {
  const products = useProducts(); // Fetch products using the custom hook
  const categories = useCategories(); // Fetch categories using the custom hook

  const {
    productFilterState: { sort, byStock, byFastDelivery, byRating, searchQuery },
  } = CartState();

  const [productIds, setProductIds] = useState([]);

  // Get all product IDs from products
  useEffect(() => {
    setProductIds(products.map((product) => product.id));
  }, [products]);

  // Fetch stock data for all products
  const { stockData, loading, error } = useStock(productIds); // Pass the productIds to the useStock hook

  const transformProducts = (sortedProducts) => {
    if (sort) {
      sortedProducts = sortedProducts.sort((a, b) =>
        sort === "lowToHigh" ? a.price - b.price : b.price - a.price
      );
    }

    // Filter products by stock availability
    if (!byStock) {
      sortedProducts = sortedProducts.filter(
        (prod) => stockData[prod.id] > 0 // Use stockData to filter by availability
      );
    }

    // Filter products by fast delivery
    if (byFastDelivery) {
      sortedProducts = sortedProducts.filter((prod) => prod.fastDelivery);
    }

    // Filter products by rating
    if (byRating) {
      sortedProducts = sortedProducts.filter((prod) => prod.ratings === byRating);
    }

    // Filter products by search query
    if (searchQuery) {
      sortedProducts = sortedProducts.filter((prod) => {
        const categoryName = categories.find((obj) => obj.id === prod.category_id)?.name || "Unknown";
        return (
          prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          categoryName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    return sortedProducts;
  };

  return (
    <div className="home">
      <div className="productContainer">
        {loading ? (
          <div>Loading...</div>
        ) : (
          transformProducts(products).map((prod) => {
            return <SingleProduct key={prod.id} prod={prod} />;
          })
        )}
      </div>
      <Filters />
    </div>
  );
};

export default Home;