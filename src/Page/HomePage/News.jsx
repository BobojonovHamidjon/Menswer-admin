import React, { useEffect, useState } from 'react';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItemId, setDeletingItemId] = useState(null);

  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    title: '',
    descriptionEn: '',
    descriptionDe: '',
    descriptionRu: '',
    image: null,
  });

  const fetchNews = () => {
    setLoading(true);
    fetch('https://testaoron.limsa.uz/api/news')
      .then((res) => res.json())
      .then((data) => setNews(data?.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const openFormModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title_en || '',
        descriptionEn: item.description_en || '',
        descriptionDe: item.description_de || '',
        descriptionRu: item.description_ru || '',
        image: null,
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        descriptionEn: '',
        descriptionDe: '',
        descriptionRu: '',
        image: null,
      });
    }
    setFormModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title_en", formData.title);
    data.append("title_de", formData.title);
    data.append("title_ru", formData.title);
    data.append("description_en", formData.descriptionEn);
    data.append("description_de", formData.descriptionDe);
    data.append("description_ru", formData.descriptionRu);
    if (formData.image) data.append("file", formData.image);

    const url = editingItem
      ? `https://testaoron.limsa.uz/api/news/${editingItem.id}`
      : `https://testaoron.limsa.uz/api/news`;
    const method = editingItem ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    })
      .then((res) => res.json())
      .then(() => {
        fetchNews();
        setFormModalOpen(false);
      });
  };

  const confirmDelete = (id) => {
    setDeletingItemId(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    fetch(`https://testaoron.limsa.uz/api/news/${deletingItemId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      fetchNews();
      setDeleteModalOpen(false);
      setDeletingItemId(null);
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold">News</h1>
        <button
          onClick={() => openFormModal()}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
        >
          Add News
        </button>
      </div>

      {formModalOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button
              onClick={() => setFormModalOpen(false)}
              className="absolute top-3 right-3 text-red-500 text-xl font-bold"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">{editingItem ? 'Edit' : 'Add'} News</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Description EN"
                value={formData.descriptionEn}
                onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Description DE"
                value={formData.descriptionDe}
                onChange={(e) => setFormData({ ...formData, descriptionDe: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Description RU"
                value={formData.descriptionRu}
                onChange={(e) => setFormData({ ...formData, descriptionRu: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="file"
                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                className="w-full p-2 border rounded"
                accept="image/*"
              />
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
              >
                {editingItem ? 'Update' : 'Add'} News
              </button>
            </form>
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm text-center">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete this news?</p>
            <div className="flex justify-between">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex justify-center items-center"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Preview"
            className="max-w-full max-h-[90vh] rounded"
          />
        </div>
      )}

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto p-4">
      {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ): (
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Image</th>
                <th className="px-4 py-2 border">Title</th>
                <th className="px-4 py-2 border">Description</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {news.map((item, index) => (
                <tr key={item.id}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">
                    <img
                      src={`https://testaoron.limsa.uz/${item.image}`}
                      onClick={() =>
                        setSelectedImage(`https://testaoron.limsa.uz/${item.image}`)
                      }
                      className="w-20 h-20 object-cover rounded cursor-pointer"
                      alt={item.title_en}
                    />
                  </td>
                  <td className="border px-4 py-2">{item.title_en}</td>
                  <td className="border px-4 py-2">{item.description_en}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => openFormModal(item)}
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(item.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
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
    </div>
  );
};

export default News;
