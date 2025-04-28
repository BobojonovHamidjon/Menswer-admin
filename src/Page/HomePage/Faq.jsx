import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Faq = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [faq, setFaq] = useState([]);
  const [loading, setLoading] = useState(false);

  const [question_en, setQuestion_en] = useState('');
  const [question_ru, setQuestion_ru] = useState('');
  const [question_de, setQuestion_de] = useState('');
  const [answer_en, setAnswer_en] = useState('');
  const [answer_ru, setAnswer_ru] = useState('');
  const [answer_de, setAnswer_de] = useState('');

  const token = localStorage.getItem('token');

  // Modalni ochish
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Delete modalni ochish
  const openDeleteModal = (id) => {
    setSelectedId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedId(null);
    setIsDeleteModalOpen(false);
  };

  // FAQlarni olish
  const getFaq = () => {
    setLoading(true);
    fetch('https://back.ifly.com.uz/api/faq')
      .then((res) => res.json())
      .then((data) => setFaq(data?.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getFaq();
  }, []);

  // FAQ qo'shish
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('https://back.ifly.com.uz/api/faq', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        question_en,
        question_ru,
        question_de,
        answer_en,
        answer_ru,
        answer_de,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          toast.success('FAQ created successfully!');
          getFaq();
          closeModal();
        } else {
          toast.error(data?.message || 'Failed to create FAQ.');
        }
      })
      .catch(() => toast.error('Something went wrong!'));
  };

  // FAQni o'chirish
  const deleteFaq = (id) => {
    fetch(`https://back.ifly.com.uz/api/faq/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          toast.success('FAQ deleted successfully!');
          getFaq();
          closeDeleteModal();
        } else {
          toast.error(data?.message || 'Failed to delete FAQ.');
        }
      })
      .catch(() => toast.error('Something went wrong!'));
  };

  const confirmDelete = () => {
    if (!selectedId) return;
    deleteFaq(selectedId);
  };

  return (
    <div className="p-6 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">FAQ</h1>
        <button
          onClick={openModal}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
        >
          Add FAQ
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
                <th className="px-4 py-2 border text-left">Question (EN)</th>
                <th className="px-4 py-2 border text-left">Answer (EN)</th>
                <th className="px-4 py-2 border text-left">Question (RU)</th>
                <th className="px-4 py-2 border text-left">Answer (RU)</th>
                <th className="px-4 py-2 border text-left">Question (DE)</th>
                <th className="px-4 py-2 border text-left">Answer (DE)</th>
                <th className="px-4 py-2 border text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {faq.map((item, index) => (
                <tr key={item.id || index}>
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{item?.question_en}</td>
                  <td className="px-4 py-2 border">{item?.answer_en}</td>
                  <td className="px-4 py-2 border">{item?.question_ru}</td>
                  <td className="px-4 py-2 border">{item?.answer_ru}</td>
                  <td className="px-4 py-2 border">{item?.question_de}</td>
                  <td className="px-4 py-2 border">{item?.answer_de}</td>
                  <td className="px-4 py-2 border flex gap-2">
                    <button className="bg-orange-400 hover:bg-orange-500 text-white px-2 py-1 rounded">
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(item?.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
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

      {/* Add FAQ Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-xl font-bold"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center">Add FAQ</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Question (EN)</label>
                <input
                  type="text"
                  placeholder="Question in English"
                  value={question_en}
                  onChange={(e) => setQuestion_en(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Answer (EN)</label>
                <textarea
                  placeholder="Answer in English"
                  value={answer_en}
                  onChange={(e) => setAnswer_en(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Question (RU)</label>
                <input
                  type="text"
                  placeholder="Question in Russian"
                  value={question_ru}
                  onChange={(e) => setQuestion_ru(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Answer (RU)</label>
                <textarea
                  placeholder="Answer in Russian"
                  value={answer_ru}
                  onChange={(e) => setAnswer_ru(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Question (DE)</label>
                <input
                  type="text"
                  placeholder="Question in German"
                  value={question_de}
                  onChange={(e) => setQuestion_de(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Answer (DE)</label>
                <textarea
                  placeholder="Answer in German"
                  value={answer_de}
                  onChange={(e) => setAnswer_de(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded mt-4"
              >
                Add FAQ
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
            <h2 className="text-2xl font-bold mb-4 text-center">Delete FAQ</h2>
            <p className="text-center mb-6">Are you sure you want to delete this FAQ?</p>
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

export default Faq;
