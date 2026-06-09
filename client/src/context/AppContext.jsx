import { createContext, useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.baseURL= import.meta.env.VITE_BACKEND_URL ;

export const AppContext = createContext(null);
export const AppContextProvider = ({children})=>{
const currency = import.meta.env.VITE_CURRENCY;

    const navigate = useNavigate();
    const [admin, setAdmin] = useState(null);
    const [user, setUser] = useState(null)
    const [IsSeller, setIsSeller] = useState(false)
    const [seller, setSeller] = useState(null);
    const [showUserLogin, setShowUserLogin] = useState(false)
    const [products, setProducts] = useState([])
    const [cartItems, setCartItems] = useState([])
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [serviceAvailable, setServiceAvailable] = useState(true);
    const [searchQuery, setSearchQuery] = useState("")
    const [location, setLocation] = useState(
        localStorage.getItem("userLocation") || "Tezpur, Assam"
      );

      // fetchAdmin
      const fetchAdmin = async () => {
        try {
          const { data } = await axios.get("/api/seller/admin/is-auth");
      
          if (data.success) {
            setAdmin(data.admin);
          } else {
            setAdmin(false);
          }    
        } catch {
          setAdmin(false);
        }
      };

    //  fetch seller status
    const fetchSeller = async () => {
      try {
        const { data } = await axios.get('/api/seller/is-auth');
    
        if (data.success) {
          setIsSeller(true);
          setSeller(data.seller);
        } else {
          setIsSeller(false);
          setSeller(null);          
        }
    
      } catch (error) {
        setIsSeller(false);
        setSeller(null);            
      }
    };

// Fetch User Auth Status, User Data & Cart Items:-
const fetchUser = async()=>{
    try {
        const {data} = await axios.get('/api/user/is-auth');
        if(data.success){
            setUser(data.user)
            setCartItems(Array.isArray(data.user.cartItems) ? data.user.cartItems : []);
        }
    } catch (error) {
        setUser(null)
    }
}

    // fetch All products
    const fetchProducts = async ()=>{
       try {
        const {data}= await axios.get('/api/product/list')
        if(data.success){
         setProducts(data.products)   
        }else{
            toast.error(data.message)
        }
    } catch (error) {
           toast.error(error.message)      
       }
    }
// Add products to cart-
const addToCart = (product, selectedOption) => {
  if (!selectedOption || !selectedOption.price) return;

  setCartItems((prev) => {
    // Check if same product + same option already exists
    const exists = prev.find(
      (item) =>
        item.product === product._id &&
        item.option?.value === selectedOption.value &&
        item.option?.unit === selectedOption.unit
    );

    // IF EXISTS → increase quantity
    if (exists) {
      return prev.map((item) =>
        item.product === product._id &&
        item.option?.value === selectedOption.value &&
        item.option?.unit === selectedOption.unit
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }

    // IF NOT EXISTS → add new item
    return [
      ...prev,
      {
        product: product._id,
        name: product.name,
        image: product.image?.[0] || "",
        option: selectedOption,
        quantity: 1,
      },
    ];
  });

  toast.success("Added to cart");
};

// UpdateCartItems-
const updateCartItem = (productId, selectedOption, type) => {
  setCartItems((prev) =>
    prev
      .map((item) => {
        if (
          item.product === productId &&
          item.option?.value === selectedOption.value &&
          item.option?.unit === selectedOption.unit
        ) {
          return {
            ...item,
            quantity:
              type === "inc"
                ? item.quantity + 1
                : item.quantity - 1,
          };
        }
        return item;
      })
      .filter((item) => item.quantity > 0)
  );
};
// Remove product from cart
const removeCartItem = (productId, selectedOption) => {
  if (!selectedOption) return;

  setCartItems((prev) =>
    prev.filter(
      (item) =>
        !(
          item.product === productId &&
item.option?.value === selectedOption.value &&
item.option?.unit === selectedOption.unit
        )
    )
  );
};

// // Get cart items-
const getCartCount = () => {
  if (!Array.isArray(cartItems)) return 0;
  return cartItems.reduce((total, item) => total + item.quantity, 0);
};

const getCartAmount = () => {
  if (!Array.isArray(cartItems)) return 0;

  return cartItems.reduce((total, item) => {
    if (!item.option || !item.option.price) return total;
    return total + item.option.price * item.quantity;
  }, 0);
};

    useEffect(() => {
        fetchAdmin()
        fetchUser()
        fetchSeller()
        fetchProducts()
    }, [])

// Update database cartitems
    useEffect(()=>{
    const updateCart = async ()=>{
        try {
            const {data}= await axios.post('/api/cart/update', {cartItems})
            if(!data.success){
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            
        }
    }
    if(user){
        updateCart()
    }
    },[cartItems])

    useEffect(() => {
        localStorage.setItem("userLocation", location);
      }, [location]);
    
    const value = {navigate, user, setUser, setIsSeller, IsSeller, showUserLogin, setShowUserLogin, products, currency, addToCart, updateCartItem, removeCartItem, cartItems,  getCartCount, getCartAmount, searchQuery, setSearchQuery, axios, fetchProducts, setCartItems, location,
    setLocation, deliveryFee, setDeliveryFee, serviceAvailable, setServiceAvailable, admin,
    setAdmin, seller, setSeller
    };

    return <AppContext.Provider value ={value}>
            {children}
           </AppContext.Provider>
  }
export const useAppContext = ()=>{
    return useContext(AppContext)
}