import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Size = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState([]);
  const [sizes, setSizes] = useState('');
  const [selectedSizeId, setSelectedSizeId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const token = localStorage.getItem('token');

  // Modal ochish va yopish
  const openModal = (id = null) => {
    if (id) {
      setIsEditing(true);
      setSelectedSizeId(id);
      const selected = size.find(item => item.id === id);
      setSizes(selected?.size || '');
    } else {
      setIsEditing(false);
      setSizes('');
    }
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSizes('');
    setIsEditing(false);
    setSelectedSizeId(null);
  };

  const openDeleteModal = (id) => {
    setSelectedSizeId(id);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedSizeId(null);
  };

  // Size ro'yxatini olish
  const getSize = () => {
    setLoading(true);
    fetch('https://back.ifly.com.uz/api/sizes')
      .then((res) => res.json())
      .then((data) => setSize(data?.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getSize();
  }, []);

  // Size qo'shish va tahrirlash
  const handleSubmit = (e) => {
    e.preventDefault();
    const method = isEditing ? 'PATCH' : 'POST';
    const url = isEditing
      ? `https://back.ifly.com.uz/api/sizes/${selectedSizeId}`
      : 'https://back.ifly.com.uz/api/sizes';

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        size: sizes,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          toast.success(isEditing ? 'Size updated successfully!' : 'Size added successfully!');
          getSize();
          closeModal();
        } else {
          toast.error(data?.message || 'Failed to save size.');
        }
      })
      .catch(() => toast.error('Something went wrong!'));
  };

  // Size o'chirish
  const deleteCategory = (id) => {
    fetch(`https://back.ifly.com.uz/api/sizes/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          toast.success('Size deleted successfully!');
          getSize();
          closeDeleteModal();
        } else {
          toast.error(data?.message || 'Delete failed!');
        }
      })
      .catch(() => toast.error('Server error during delete!'));
  };

  // O'chirishni tasdiqlash
  const confirmDelete = () => {
    if (!selectedSizeId) return;
    deleteCategory(selectedSizeId);
  };

  return (
    <div className="p-6 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Size</h1>
        <button
          onClick={() => openModal()}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
        >
          Add Size
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow p-4">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <table className="min-w-full table-auto" style={{ tableLayout: 'fixed' }}>
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border text-left">№</th>
                <th className="px-4 py-2 border text-left">Sizes</th>
                <th className="px-4 py-2 border text-left" style={{ width: '150px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {size?.map((item, index) => (
                <tr key={item.id || index}>
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{item?.size}</td>
                  <td className="px-4 py-2 border flex gap-2">
                    <button
                      onClick={() => openModal(item.id)}
                      className="text-white bg-orange-400 hover:bg-orange-500 px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(item?.id)}
                      className="text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded"
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

      {/* Add/Edit Size Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-xl font-bold"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center">{isEditing ? 'Edit Size' : 'Add Size'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Enter size"
                  value={sizes}
                  onChange={(e) => setSizes(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded mt-4"
              >
                {isEditing ? 'Update Size' : 'Add Size'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Size Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={closeDeleteModal}
              className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-xl font-bold"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">Delete Size</h2>
            <p className="text-center mb-6">Are you sure you want to delete this size?</p>
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

export default Size;
