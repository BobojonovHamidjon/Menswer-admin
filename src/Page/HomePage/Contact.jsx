import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Contact = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [contact, setContact] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address_en, setAddress_en] = useState('');
  const [address_ru, setAddress_ru] = useState('');
  const [address_de, setAddress_de] = useState('');

  const token = localStorage.getItem('token');

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditMode(false);
    setSelectedId(null);
    setPhone('');
    setEmail('');
    setAddress_en('');
    setAddress_ru('');
    setAddress_de('');
  };

  const openDeleteModal = (id) => {
    setSelectedId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedId(null);
    setIsDeleteModalOpen(false);
  };

  const getContact = () => {
    setLoading(true);
    fetch('https://back.ifly.com.uz/api/contact')
      .then((res) => res.json())
      .then((data) => setContact(data?.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getContact();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = editMode
      ? `https://back.ifly.com.uz/api/contact/${selectedId}`
      : 'https://back.ifly.com.uz/api/contact';
    const method = editMode ? 'PATCH' : 'POST';

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        phone_number: phone,
        email,
        address_en,
        address_ru,
        address_de,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          toast.success(`Contact ${editMode ? 'updated' : 'created'} successfully!`);
          getContact();
          closeModal();
        } else {
          toast.error(data?.message || `Failed to ${editMode ? 'update' : 'create'} contact.`);
        }
      })
      .catch(() => toast.error('Something went wrong!'));
  };

  const deleteContact = (id) => {
    fetch(`https://back.ifly.com.uz/api/contact/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          toast.success('Contact deleted successfully!');
          getContact();
          closeDeleteModal();
        } else {
          toast.error(data?.message || 'Failed to delete contact.');
        }
      })
      .catch(() => toast.error('Something went wrong!'));
  };

  const confirmDelete = () => {
    if (!selectedId) return;
    deleteContact(selectedId);
  };

  const handleEdit = (item) => {
    setEditMode(true);
    setSelectedId(item.id);
    setPhone(item.phone_number);
    setEmail(item.email);
    setAddress_en(item.address_en);
    setAddress_ru(item.address_ru);
    setAddress_de(item.address_de);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Contact</h1>
        <button
          onClick={openModal}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
        >
          Add Contact
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
                <th className="px-4 py-2 border text-left">Phone Number</th>
                <th className="px-4 py-2 border text-left">Email</th>
                <th className="px-4 py-2 border text-left">Address (EN)</th>
                <th className="px-4 py-2 border text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contact.map((item, index) => (
                <tr key={item.id || index}>
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{item?.phone_number}</td>
                  <td className="px-4 py-2 border">{item?.email}</td>
                  <td className="px-4 py-2 border">{item?.address_en}</td>
                  <td className="px-4 py-2 border flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-orange-400 hover:bg-orange-500 text-white px-2 py-1 rounded"
                    >
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

      {/* Add/Edit Contact Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-xl font-bold"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center">
              {editMode ? 'Edit Contact' : 'Add Contact'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Phone Number</label>
                <input
                  type="tel"
                  maxLength={20}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Address (EN)</label>
                <textarea
                  value={address_en}
                  onChange={(e) => setAddress_en(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Address (RU)</label>
                <textarea
                  value={address_ru}
                  onChange={(e) => setAddress_ru(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Address (DE)</label>
                <textarea
                  value={address_de}
                  onChange={(e) => setAddress_de(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded mt-4"
              >
                {editMode ? 'Update Contact' : 'Add Contact'}
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
            <h2 className="text-2xl font-bold mb-4 text-center">Delete Contact</h2>
            <p className="text-center mb-6">Are you sure you want to delete this contact?</p>
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

export default Contact;
