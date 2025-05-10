import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Discount = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDiscountId, setSelectedDiscountId] = useState(null);
  const [discountt, setDiscountt] = useState([]);

  const [discount, setDiscount] = useState(0);
  const [started_at, setStarted_at] = useState('');
  const [finished_at, setFinished_at] = useState('');
  const [status, setStatus] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem('token');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    clearForm();
  };

  const openDeleteModal = (id) => {
    setSelectedDiscountId(id);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedDiscountId(null);
  };

  const clearForm = () => {
    setDiscount(0);
    setStarted_at('');
    setFinished_at('');
    setStatus(false);
    setEditingId(null);
  };

  const getDiscount = () => {
    setLoading(true);
    fetch('https://testaoron.limsa.uz/api/discount')
      .then((res) => res.json())
      .then((e) => setDiscountt(e?.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getDiscount();
  }, []);

  const handleEdit = (item) => {
    setIsEditMode(true);
    setEditingId(item.id);
    setDiscount(item.discount);
    setStarted_at(item.started_at);
    setFinished_at(item.finished_at);
    setStatus(item.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Token topilmadi. Iltimos, tizimga qayta kiring.");
      return;
    }

    const payload = {
      discount: Number(discount),
      started_at,
      finished_at,
      status: Boolean(status),
    };

    const url = isEditMode
      ? `https://testaoron.limsa.uz/api/discount/${editingId}`
      : 'https://testaoron.limsa.uz/api/discount';

    const method = isEditMode ? 'PATCH' : 'POST';

    fetch(url, {
      method,
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          toast.success(isEditMode ? "Discount updated!" : "Discount added!");
          getDiscount();
          closeModal();
        } else {
          toast.error(data?.message || "Xatolik yuz berdi");
        }
      })
      .catch((err) => {
        toast.error("Xatolik: " + err.message);
      });
  };

  const deleteDiscount = (id) => {
    fetch(`https://testaoron.limsa.uz/api/discount/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((e) => {
        if (e?.success) {
          toast.success(e?.data?.message);
          getDiscount();
          closeDeleteModal();
        } else {
          toast.error(e?.message);
        }
      });
  };

  const confirmDelete = () => {
    if (!selectedDiscountId) return;
    deleteDiscount(selectedDiscountId);
  };

  return (
    <div className="p-6 relative">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Discount</h1>
        <button
          onClick={openModal}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
        >
          Add Discount
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow p-4">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border text-left">№</th>
                <th className="px-4 py-2 border text-left">Discount (%)</th>
                <th className="px-4 py-2 border text-left">Created Date</th>
                <th className="px-4 py-2 border text-left">Finished Date</th>
                <th className="px-4 py-2 border text-left">Status</th>
                <th className="px-4 py-2 border text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {discountt?.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{item?.discount}</td>
                  <td className="px-4 py-2 border">{item?.started_at}</td>
                  <td className="px-4 py-2 border">{item?.finished_at}</td>
                  <td className="px-4 py-2 border">{item?.status ? "Active" : "Inactive"}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-white bg-orange-400 hover:bg-orange-500 border border-orange-400 px-4 py-2 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(item?.id)}
                      className="text-white bg-red-500 hover:bg-red-600 border border-red-600 px-4 py-2 rounded ml-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-xl font-bold"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center">
              {isEditMode ? "Edit Discount" : "Add Discount"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="number"
                placeholder="Discount (%)"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
              <input
                type="date"
                value={started_at}
                onChange={(e) => setStarted_at(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
              <input
                type="date"
                value={finished_at}
                onChange={(e) => setFinished_at(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
              <div className="flex items-center gap-2">
                <input
                  id="status"
                  type="checkbox"
                  checked={status}
                  onChange={(e) => setStatus(e.target.checked)}
                  className="w-5 h-5"
                />
                <label htmlFor="status" className="text-gray-700 font-medium">
                  Active
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded mt-4"
              >
                {isEditMode ? "Update Discount" : "Add Discount"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={closeDeleteModal}
              className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-xl font-bold"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">Delete Discount</h2>
            <p className="text-center mb-6">Are you sure you want to delete this discount?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={closeDeleteModal}
                className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-6 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discount;
