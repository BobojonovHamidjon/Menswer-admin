import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Discount = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
  };
 
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [selectedSizeId, setSelectedSizeId] = useState(null);
const openDeleteModal = (id) => {
  setSelectedSizeId(id);
  setIsDeleteModalOpen(true);
};

const closeDeleteModal = () => {
  setIsDeleteModalOpen(false);
  setSelectedSizeId(null);
};
const confirmDelete = () => {
  if (!setSelectedSizeId) return;
  deleteCategory(setSelectedSizeId);
};





  //get size
   const [size, setSize] = useState([])
  const  getSize = () => {
    setLoading(true); 
   fetch('https://back.ifly.com.uz/api/sizes')
   .then((res)=>res.json())
   .then((e)=>setSize(e?.data)) 
   .finally(() => setLoading(false));
  }
 
  useEffect(()=>{
    getSize()
  },[])
  //post size
      const token = localStorage.getItem('token')
      const [sizes, setSizes] = useState('');
    

 
  const handleSubmit = (e) => {
    e.preventDefault();
   fetch('https://back.ifly.com.uz/api/sizes', {
     method: 'POST',
     headers: {
       'Content-type': 'application/json',
       "Authorization": `Bearer ${token}`
     },
     body: JSON.stringify({
      size:sizes,
     
     })
     }).then((res)=>res.json())
   .then((e)=>{
     if(e?.success){
       toast.success("Size added successfully")
       getSize()
       setIsModalOpen(false)
     }
     else{
       toast.error(e?.message?.message)
     }
   })
    closeModal();
  };
  //deleteSize
  const deleteCategory = (id) => {
    fetch(`https://back.ifly.com.uz/api/sizes/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        "Authorization": `Bearer ${token}`
      }
    }).then((res)=>res.json())
    .then((e)=>{
      if(e?.success){
        toast.success("Size deleted successfully!")
        getSize
        closeDeleteModal();
      }
      else{
        toast.error(e?.message)
      }
    })
  }


  return (
    <div className="p-6 relative">
 
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Size</h1>
        <button
          onClick={openModal}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
        >
          Add Size
        </button>
      </div>

    
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
          <tr key={index}>
            <td className="px-4 py-2 border">{index + 1}</td>
            <td className="px-4 py-2 border">{item?.size}</td>
            <td className="px-4 py-2 border flex justify-start gap-2">
              <button className="text-white bg-orange-400 hover:bg-orange-400 border border-orange-400 px-2 py-1 rounded">
                Edit
              </button>
              <button 
                onClick={() => openDeleteModal(item?.id)} 
                className="text-white bg-red-500 hover:bg-red-600 border border-red-600 px-2 py-1 rounded">
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>



{isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/10 bg-opacity-50 backdrop-blur-sm z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
      <button
        onClick={closeModal}
        className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-xl font-bold"
      >
        ✕
      </button>
      <h2 className="text-2xl font-bold mb-6 text-center">Add Sizes</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Sizes"
            onChange={(e) => setSizes(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded mt-4"
        >
          Add Sizes
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
      <h2 className="text-2xl font-bold mb-4 text-center">Delete Sizes</h2>
      <p className="text-center mb-6">Are you sure you want to delete this sizes?</p>
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
