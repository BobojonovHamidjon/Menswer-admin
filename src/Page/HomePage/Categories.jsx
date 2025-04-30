import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Categories = () => {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const [nameEn, setNameEn] = useState('');
  const [nameRu, setNameRu] = useState('');
  const [nameDe, setNameDe] = useState('');

  const token = localStorage.getItem('token');

  const getCategory = () => {
    setLoading(true);
    fetch('https://back.ifly.com.uz/api/category')
      .then((res) => res.json())
      .then((e) => setCategory(e?.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getCategory();
  }, []);

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditCategoryId(null);
    setNameEn('');
    setNameRu('');
    setNameDe('');
  };

  const openDeleteModal = (id) => {
    setSelectedCategoryId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCategoryId(null);
  };

  const handleEdit = (category) => {
    setIsEditMode(true);
    setEditCategoryId(category.id);
    setNameEn(category.name_en);
    setNameRu(category.name_ru);
    setNameDe(category.name_de);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = isEditMode
      ? `https://back.ifly.com.uz/api/category/${editCategoryId}`
      : 'https://back.ifly.com.uz/api/category';

    const method = isEditMode ? 'PATCH' : 'POST';

    fetch(url, {
      method,
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name_en: nameEn,
        name_ru: nameRu,
        name_de: nameDe,
      }),
    })
      .then((res) => res.json())
      .then((e) => {
        if (e?.success) {
          toast.success(isEditMode ? 'Category updated successfully' : 'Category added successfully');
          getCategory();
          closeModal();
        } else {
          toast.error(e?.message?.message || e?.message);
        }
      });
  };

  const deleteCategory = (id) => {
    fetch(`https://back.ifly.com.uz/api/category/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((e) => {
        if (e?.success) {
          toast.success(e?.data?.message || 'Category deleted');
          getCategory();
          closeDeleteModal();
        } else {
          toast.error(e?.message);
        }
      });
  };

  const confirmDelete = () => {
    if (!selectedCategoryId) return;
    deleteCategory(selectedCategoryId);
  };

  return (
    <div className="p-6 relative">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Category</h1>
        <button
          onClick={openModal}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
        >
          Add Category
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
                <th className="px-4 py-2 border text-left">Title ENG</th>
                <th className="px-4 py-2 border text-left">Title RU</th>
                <th className="px-4 py-2 border text-left">Title DE</th>
                <th className="px-4 py-2 border text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {category?.map((item, index) => (
                <tr key={item?.id || index}>
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{item?.name_en}</td>
                  <td className="px-4 py-2 border">{item?.name_ru}</td>
                  <td className="px-4 py-2 border">{item?.name_de}</td>
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

      {/* Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-xl font-bold"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center">
              {isEditMode ? 'Update Category' : 'Add Category'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Category Name (EN)</label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Category Name (RU)</label>
                <input
                  type="text"
                  value={nameRu}
                  onChange={(e) => setNameRu(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Category Name (DE)</label>
                <input
                  type="text"
                  value={nameDe}
                  onChange={(e) => setNameDe(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded mt-4"
              >
                {isEditMode ? 'Update Category' : 'Add Category'}
              </button>
            </form>
          </div>
        </div>
      )}

      
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={closeDeleteModal}
              className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-xl font-bold"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">Delete Category</h2>
            <p className="text-center mb-6">Are you sure you want to delete this category?</p>
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

export default Categories;
