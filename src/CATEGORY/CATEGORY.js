import React, { useState} from "react";
import { useQuery, gql } from "@apollo/client";
import "./CATEGORY.css";
import { useHistory } from "react-router-dom";

const DATA_QUERY = gql`
  query {
    categories {
      name
      products {
        id
        name
        inStock
        gallery
        prices {
          currency
          amount
        }
      }
    }
  }
`;

const Category = () => {
  const { data } = useQuery(DATA_QUERY);

  let history = useHistory();
  function handleClick(id) {
    history.push("/women/" + id);
  }

  const  icon = (<div>
    <div className="cart-circle" />
    <svg
      className="empty-cart"
      width="24"
      height="17"
      viewBox="0 0 24 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M23.4736 4.8484C23.0186 4.29247 22.3109 3.95457 21.5785 3.95457H6.19066L5.71097 2.16691C5.43262 1.12772 4.47323 0.402832 3.36082 0.402832H0.783719C0.354361 0.402832 0 0.740725 0 1.15227C0 1.56284 0.353351 1.9017 0.783719 1.9017H3.36082C3.73985 1.9017 4.06854 2.14333 4.1692 2.50577L7.25167 14.2494C7.53003 15.2886 8.48941 16.0135 9.60182 16.0135H19.6833C20.7947 16.0135 21.7808 15.2886 22.0335 14.2494L23.9286 6.80699C24.1053 6.1293 23.9543 5.40442 23.4736 4.84848L23.4736 4.8484ZM22.3879 6.46712L20.4928 13.9095C20.3921 14.272 20.0634 14.5136 19.6844 14.5136H9.60185C9.22282 14.5136 8.89413 14.272 8.79347 13.9095L6.59533 5.47717H21.5796C21.8323 5.47717 22.085 5.59798 22.237 5.79148C22.388 5.98403 22.463 6.22566 22.388 6.46729L22.3879 6.46712Z"
        fill="white"
      />
    </svg>
    <svg
      className="cart-wheel-one"
      width="6"
      height="7"
      viewBox="0 0 6 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.13325 0.977781C1.69316 0.977781 0.505859 2.11324 0.505859 3.49023C0.505859 4.86722 1.69326 6.00268 3.13325 6.00268C4.57333 6.00362 5.76064 4.86816 5.76064 3.49096C5.76064 2.11375 4.57323 0.977539 3.13325 0.977539V0.977781ZM3.13325 4.48139C2.55188 4.48139 2.09685 4.04626 2.09685 3.49033C2.09685 2.93439 2.55188 2.49926 3.13325 2.49926C3.71462 2.49926 4.16965 2.93439 4.16965 3.49033C4.16866 4.02266 3.68897 4.48139 3.13325 4.48139Z"
        fill="white"
      />
    </svg>
    <svg
      className="cart-wheel-two"
      width="6"
      height="7"
      viewBox="0 0 6 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.82514 0.978027C1.38506 0.978027 0.197754 2.11349 0.197754 3.49048C0.197754 4.86747 1.38516 6.00293 2.82514 6.00293C4.26513 6.00293 5.45253 4.86747 5.45253 3.49048C5.42786 2.11433 4.26513 0.978027 2.82514 0.978027ZM2.82514 4.48164C2.24377 4.48164 1.78874 4.04651 1.78874 3.49057C1.78874 2.93464 2.24377 2.49951 2.82514 2.49951C3.40652 2.49951 3.86155 2.93464 3.86155 3.49057C3.86155 4.0229 3.38087 4.48164 2.82514 4.48164Z"
        fill="white"
      />
    </svg>
   </div>);

  
const [cartState, setCartState] = useState("id");

  let categoryList = [];
  if (data) {
    data.categories.forEach((element) => {
      categoryList.push(
        <h1 className="category_title">
          {element.name}
        </h1>
      );
      categoryList.push(
        element.products.map((item) => {
          return (
            <div
              className="product_list"
              key={item.id}
              onMouseEnter={() => {setCartState(item.id)}}
              onMouseLeave={() => {setCartState("id")}}
              
            >
            
              <li
                className="list_wraper"
                key={item.id}
                onClick={() => handleClick(item.id)}
              >
                
                {item.inStock ? (
                  <div>
                    <img src={item.gallery[0]} alt={item.name} />
                    {cartState === item.id && icon}
                  </div>
                  
                ) : (
                  <>
                    <img src={item.gallery[0]} alt={item.name} />
                    <div className="overlay">
                      <p>OUT OF STOCK</p>
                    </div>
                  </>
                )}

                <div className="item_info">
                  <p className="name">{item.name}</p>
                  <p className="price">{"$" + item.prices[0].amount}</p>
                </div>
              </li>
            </div>
          );
        })
      );
    });
  }

  return <div className="category_body">{categoryList}</div>;
};

export default Category;
