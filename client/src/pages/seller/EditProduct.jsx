import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const EditProduct = () => {
  const { id } = useParams();
  const { axios } = useAppContext();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(`/api/product/${id}`);
      if (data.success) {
        setProduct(data.product);
      }
    };
    fetchProduct();
  }, []);

  const updateHandler = async (e) => {
    e.preventDefault();
    const { data } = await axios.post("/api/product/update", product);
    if (data.success) toast.success("Updated!");
  };

  if (!product) return <p>Loading...</p>;

  return (
    <form onSubmit={updateHandler} className="p-6 space-y-4">
      <input
        value={product.name}
        onChange={(e) =>
          setProduct({ ...product, name: e.target.value })
        }
      />
      <button className="bg-primary text-white px-4 py-2">
        Update
      </button>
    </form>
  );
};

export default EditProduct;