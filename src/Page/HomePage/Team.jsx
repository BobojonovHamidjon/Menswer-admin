import React, { useEffect, useState } from 'react';

const Team = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItemId, setDeletingItemId] = useState(null);

  const token = localStorage.getItem('token');
  const [fullname, setFullname] = useState('');
  const [positionEn, setPositionEn] = useState('');
  const [positionDe, setPositionDe] = useState('');
  const [positionRu, setPositionRu] = useState('');
  const [image, setImage] = useState(null);

  const getTeam = () => {
    setLoading(true);
    fetch('https://testaoron.limsa.uz/api/team-section')
      .then((item) => item.json())
      .then((e) => setTeam(e?.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getTeam();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('full_name', fullname);
    formData.append('position_de', positionDe);
    formData.append('position_ru', positionRu);
    formData.append('position_en', positionEn);
    if (image) formData.append('file', image);

    const url = editingItem
      ? `https://testaoron.limsa.uz/api/team-section/${editingItem.id}`
      : 'https://testaoron.limsa.uz/api/team-section';
    const method = editingItem ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((item) => {
        console.log(item);
        getTeam(); // refresh list
        setShowModal(false); // close modal
        // clear form
        setFullname('');
        setPositionEn('');
        setPositionDe('');
        setPositionRu('');
        setImage(null);
        setEditingItem(null);
      });
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFullname(item.full_name);
    setPositionEn(item.position_en);
    setPositionDe(item.position_de);
    setPositionRu(item.position_ru);
    setImage(null);
    setShowModal(true);
  };

  const openDeleteModal = (id) => {
    setDeletingItemId(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    fetch(`https://testaoron.limsa.uz/api/team-section/${deletingItemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }).then(() => {
      getTeam();
      setDeleteModalOpen(false);
      setDeletingItemId(null);
    });
  };

  return (
    <div className="p-6 relative">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Team</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
        >
          Add Team
        </button>
      </div>

      {/* Add/Edit Member Modal */}
      {showModal && (
        <div className="fixed inset-0 z-20 backdrop-blur-sm bg-black/40 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editingItem ? 'Edit' : 'Add'} Team Member</h2>
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-xl font-bold"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
              <input
                type="text"
                placeholder="Position (EN)"
                value={positionEn}
                onChange={(e) => setPositionEn(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <input
                type="text"
                placeholder="Position (DE)"
                value={positionDe}
                onChange={(e) => setPositionDe(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <input
                type="text"
                placeholder="Position (RU)"
                value={positionRu}
                onChange={(e) => setPositionRu(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                accept="image/*"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded mt-4"
                >
                  {editingItem ? 'Update' : 'Add'} Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-30 bg-black/80 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative">
            <img
              src={selectedImage}
              alt="Preview"
              className="max-w-full max-h-[90vh] rounded-lg shadow-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-red-500 text-2xl font-bold hover:text-red-500"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg text-center w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete this team member?</p>
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

      {/* Team Table */}
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
                <th className="px-4 py-2 border text-left">Images</th>
                <th className="px-4 py-2 border text-left">Full Name</th>
                <th className="px-4 py-2 border text-left">Position</th>
                <th className="px-4 py-2 border text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {team.map((item, index) => (
                <tr key={item.id || index}>
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">
                    <img
                      onClick={() =>
                        setSelectedImage(`https://testaoron.limsa.uz/${item?.image}`)
                      }
                      className="w-20 h-20 object-cover rounded cursor-pointer hover:scale-105 transition-transform"
                      src={`https://testaoron.limsa.uz/${item?.image}`}
                      alt={item?.full_name}
                    />
                  </td>
                  <td className="px-4 py-2 border">{item?.full_name}</td>
                  <td className="px-4 py-2 border">{item?.position_en}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => openEditModal(item)}
                      className="bg-orange-400 hover:bg-orange-500 text-white px-2 py-1 mr-3 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(item.id)}
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
    </div>
  );
};

export default Team;
