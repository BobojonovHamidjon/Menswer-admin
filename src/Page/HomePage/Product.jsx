import React, { useEffect, useState } from "react";
//import Modal from "../Components/Modal";
import { IoClose } from "react-icons/io5";
import { FaSpinner } from "react-icons/fa";
import { MdImageNotSupported } from "react-icons/md";
import API from "../Api";
import { toast } from "react-toastify";

function Products() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const getProduct = () => {
    setLoading(true);
    API.get("/product")
      .then((res) => {
        setData(res.data.data.products);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <div className="p-4">
      {/* <Modal onClose={() => setAddModal(false)}>
        <div className="p-5 bg-white rounded-2xl relative">
          <button
            onClick={() => setAddModal(false)}
            className="absolute top-2 right-2 p-1 hover:bg-black/20 rounded-full"
          >
            <IoClose size={27} />
          </button>
          <h1 className="text-2xl pb-4 text-blue-800 font-extrabold">
            Add Category
          </h1>
          <form className="flex flex-col gap-5">
            <input
              required
              type="text"
              name="description_de"
              value={formData.description_de}
              onChange={handleChange}
              placeholder="description (de)"
              className="py-2 rounded-md bg-cyan-400/15 focus:outline-cyan-500 px-4"
            />
            <div className="flex w-full gap-5 items-start">
              <input
                required
                type="file"
                name="file"
                onChange={handleChange}
                className="py-2 w-full rounded-md bg-cyan-400/15 focus:outline-cyan-500 px-4"
              />
              {formData.preview && (
                <div className="w-50 h-30">
                  <img
                    src={formData.preview}
                    alt={formData.title_en}
                    className="w-full h-full"
                  />
                </div>
              )}
            </div>
            <button
              type="submit"
              className="bg-blue-700 py-2 text-xl rounded-xl font-bold text-white"
            >
              Add Category
            </button>
          </form>
        </div>
      </Modal> */}

      {/* <Modal onClose={() => setDelModal(false)}>
          <div className="p-5 bg-white rounded-2xl text-center">
            <h2 className="text-xl font-bold text-red-600">Are you sure?</h2>
            <p className="py-4">You are about to delete this category.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDelModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={newsDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal> */}

      <div className="flex justify-between bg-white/18 px-4 py-5 rounded-xl mb-5">
        <div className="text-xl tracking-wider font-bold text-black">
          Products
        </div>
        <button className="px-4 py-2 cursor-pointer bg-green-600 text-white font-medium rounded-md  transition">
          Add Products
        </button>
      </div>

<div className="bg-white shadow rounded-lg overflow-x-auto p-4">
  
    {loading ? (
      <div className="flex flex-col gap-4 items-center py-5 text-3xl text-white">
        <FaSpinner className="animate-spin" />
        <div>loading</div>
      </div>
    ) : (
      <table className="min-w-full border-collapse border-spacing-0">
        {data && data.length > 0 ? (
          <thead>
            <tr className="bg-gray-100 text-black">
              <th className=" border border-gray-300 p-2">
                №
              </th>
              <th className="  border border-gray-300 p-2">
                Images
              </th>
              <th className=" border border-gray-300 p-2">
                Title
              </th>
              <th className="border border-gray-300 p-2">
                Description
              </th>
              <th className=" border border-gray-300 p-2">
                Price
              </th>
              <th className=" border border-gray-300 p-2">
                Category
              </th>
              <th className=" border border-gray-300 p-2">
                Colors
              </th>
              <th className=" border border-gray-300 p-2">
                Sizes
              </th>
              <th className=" border border-gray-300 p-2">
                Discount
              </th>

              <th className="border border-gray-300 p-2">
                Actions
              </th>
            </tr>
          </thead>
        ) : (
          <tbody>
            <tr>
              <td colSpan="100" className="py-8 text-center text-white">
                No Data Available
                <MdImageNotSupported size={30} className="mx-auto mt-5" />
              </td>
            </tr>
          </tbody>
        )}

        <tbody>
          {data &&
            data.map((item, index) => (
              <tr
                key={item.id}
                className="hover:bg-white/2 text-black text-center"
              >
                <td className="py-1 border border-gray-600">
                  {index + 1}
                </td>
                <td className="py-1 border border-gray-600">
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={`https://back.ifly.com.uz/${item.images[0]}`}
                      alt={item.title_en}
                      className="w-12 h-12 object-cover mx-auto rounded-md"
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="py-1 border border-gray-600">
                  {item.title_en?.split(" ").slice(0, 1).join(" ") +
                    "..." || "-"}
                </td>
                <td className="py-1 border border-gray-600">
                  {item.description_en?.split(" ").slice(0, 2).join(" ") +
                    "..." || "-"}
                </td>
                <td className="py-1 border border-gray-600">
                  {item.price || "-"}
                </td>
                <td className="py-1 border border-gray-600">
                  {item.category?.name_en
                    ?.split(" ")
                    .slice(0, 1)
                    .join(" ") + "..." || "-"}
                </td>
                <td className="py-1 border border-gray-600">
                  {item.colors && item.colors.length > 0
                    ? item.colors
                        .map((color) => color.color_en)
                        .join(", ")
                    : "🤷‍♂️"}
                </td>
                <td className="py-1 border border-gray-600">
                  {item.sizes && item.sizes.length > 0
                    ? item.sizes.map((size) => size.size).join(", ")
                    : "🤷‍♂️"}
                </td>
                <td className="py-1 border border-gray-600">
                  {item?.discount?.discount}
                </td>

                <td className="py-1 border border-gray-600">
                  <button className="bg-green-500 text-white px-2 py-1 rounded mr-2">
                    Edit
                  </button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    )}
  </div>
</div>

);
}

export default Products;


