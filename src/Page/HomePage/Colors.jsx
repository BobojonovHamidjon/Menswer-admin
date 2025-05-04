import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Colors = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingColor, setEditingColor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [color, setColor] = useState([]);
  const [colorEn, setColorEn] = useState('');
  const [colorRu, setColorRu] = useState('');
  const [colorDe, setColorDe] = useState('');
  const token = localStorage.getItem('token');

  const openModal = () => {
    setIsModalOpen(true);
    setEditingColor(null);
    setColorEn('');
    setColorRu('');
    setColorDe('');
  };

  const handleEdit = (item) => {
    setEditingColor(item);
    setColorEn(item.color_en);
    setColorRu(item.color_ru);
    setColorDe(item.color_de);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingColor(null);
    setColorEn('');
    setColorRu('');
    setColorDe('');
  };

  const openDeleteModal = (id) => {
    setSelectedCategoryId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCategoryId(null);
  };

  const getColor = () => {
    setLoading(true);
    fetch('https://back.ifly.com.uz/api/colors')
      .then((res) => res.json())
      .then((e) => setColor(e?.data))
      .finally(() => setLoading(false));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editingColor
      ? `https://back.ifly.com.uz/api/colors/${editingColor.id}`
      : 'https://back.ifly.com.uz/api/colors';
    const method = editingColor ? 'PATCH' : 'POST';

    fetch(url, {
      method,
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        color_en: colorEn,
        color_ru: colorRu,
        color_de: colorDe,
      }),
    })
      .then((res) => res.json())
      .then((e) => {
        if (e?.success) {
          getColor();
          toast.success(editingColor ? 'Color updated successfully' : 'Color added successfully');
          closeModal();
        } else {
          toast.error(e?.message?.message);
        }
      });
  };

  const deleteCategory = (id) => {
    fetch(`https://back.ifly.com.uz/api/colors/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((e) => {
        if (e?.success) {
          toast.success('Color deleted successfully');
          getColor();
          closeDeleteModal();
        } else {
          toast.error(e?.message?.message);
        }
      });
  };

  const confirmDelete = () => {
    if (!selectedCategoryId) return;
    deleteCategory(selectedCategoryId);
  };

  useEffect(() => {
    getColor();
  }, []);

  return (
    <div className="p-6 relative">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Colors</h1>
        <button
          onClick={openModal}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
        >
          Add Color
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
                <th className="px-4 py-2 border text-left">Color ENG</th>
                <th className="px-4 py-2 border text-left">Color RU</th>
                <th className="px-4 py-2 border text-left">Color DE</th>
                <th className="px-4 py-2 border text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {color?.map((item, index) => (
                <tr key={item.id}>
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{item?.color_en}</td>
                  <td className="px-4 py-2 border">{item?.color_ru}</td>
                  <td className="px-4 py-2 border">{item?.color_de}</td>
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

      {/* Add/Edit Modal */}
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
              {editingColor ? 'Edit Color' : 'Add Color'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Color Name (EN)</label>
                <input
                  type="text"
                  placeholder="English name"
                  value={colorEn}
                  onChange={(e) => setColorEn(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Color Name (RU)</label>
                <input
                  type="text"
                  placeholder="Russian name"
                  value={colorRu}
                  onChange={(e) => setColorRu(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Color Name (DE)</label>
                <input
                  type="text"
                  placeholder="German name"
                  value={colorDe}
                  onChange={(e) => setColorDe(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded mt-4"
              >
                {editingColor ? 'Update Color' : 'Add Color'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={closeDeleteModal}
              className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-xl font-bold"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">Delete Color</h2>
            <p className="text-center mb-6">Are you sure you want to delete this color?</p>
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

export default Colors;
