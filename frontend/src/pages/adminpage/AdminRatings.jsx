

// frontend/src/pages/adminpage/AdminRatings.jsx
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { FaTrash, FaEye, FaEyeSlash, FaReply, FaStar, FaRegStar } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminRatings = () => {
  const { backendUrl } = useContext(AppContext);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    average: 0,
    byRating: {}
  });

  const getToken = () => localStorage.getItem('admintoken');

  // ✅ Fetch all ratings
  const fetchRatings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/rating/admin/all`, {
        headers: { admintoken: getToken() }
      });

      if (response.data.success) {
        setRatings(response.data.ratings);
        calculateStats(response.data.ratings);
      }
    } catch (error) {
      console.error('Fetch ratings error:', error);
      toast.error('Failed to fetch ratings');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Calculate statistics
  const calculateStats = (data) => {
    const total = data.length;
    const sum = data.reduce((acc, r) => acc + r.rating, 0);
    const average = total > 0 ? (sum / total) : 0;
    
    const byRating = {};
    data.forEach(r => {
      byRating[r.rating] = (byRating[r.rating] || 0) + 1;
    });

    setStats({ total, average, byRating });
  };

  // ✅ Toggle hide rating
  const toggleHideRating = async (ratingId, currentStatus) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/rating/admin/hide/${ratingId}`,
        { isHidden: !currentStatus },
        { headers: { admintoken: getToken() } }
      );

      if (response.data.success) {
        toast.success(`Rating ${currentStatus ? 'hidden' : 'shown'} successfully`);
        fetchRatings();
      }
    } catch (error) {
      console.error('Toggle hide error:', error);
      toast.error('Failed to update rating');
    }
  };

  // ✅ Delete rating
  const deleteRating = async (ratingId) => {
    if (!window.confirm('Are you sure you want to delete this rating?')) return;

    try {
      const response = await axios.delete(
        `${backendUrl}/api/rating/admin/delete/${ratingId}`,
        { headers: { admintoken: getToken() } }
      );

      if (response.data.success) {
        toast.success('Rating deleted successfully');
        fetchRatings();
      }
    } catch (error) {
      console.error('Delete rating error:', error);
      toast.error('Failed to delete rating');
    }
  };

  // ✅ Add admin response
  const handleReplySubmit = async () => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    try {
      const response = await axios.put(
        `${backendUrl}/api/rating/admin/response/${selectedRating._id}`,
        { adminResponse: replyText },
        { headers: { admintoken: getToken() } }
      );

      if (response.data.success) {
        toast.success('Reply added successfully');
        setShowReplyModal(false);
        setReplyText('');
        fetchRatings();
      }
    } catch (error) {
      console.error('Reply error:', error);
      toast.error('Failed to add reply');
    }
  };

  // ✅ Render stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        i < rating ? 
          <FaStar key={i} className="text-yellow-400 text-sm" /> : 
          <FaRegStar key={i} className="text-gray-300 text-sm" />
      );
    }
    return stars;
  };

  // ✅ Filter ratings
  const filteredRatings = ratings.filter(r => {
    if (filter === 'hidden' && !r.isHidden) return false;
    if (filter === 'visible' && r.isHidden) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return r.userId?.name?.toLowerCase().includes(searchLower) ||
             r.foodId?.name?.toLowerCase().includes(searchLower) ||
             r.comment?.toLowerCase().includes(searchLower);
    }
    return true;
  });

  useEffect(() => {
    fetchRatings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Rating Management</h1>
          <p className="text-gray-500">Manage customer ratings and reviews</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Average Rating</p>
          <p className="text-2xl font-bold text-amber-500">
            {stats.average.toFixed(1)} ★
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Reviews</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        {[5, 4, 3, 2, 1].map(star => (
          <div key={star} className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">{star} ★ Reviews</p>
            <p className="text-2xl font-bold">{stats.byRating[star] || 0}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-amber-500 text-white' : 'bg-gray-200'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('visible')}
            className={`px-4 py-2 rounded-lg ${filter === 'visible' ? 'bg-amber-500 text-white' : 'bg-gray-200'}`}
          >
            Visible
          </button>
          <button
            onClick={() => setFilter('hidden')}
            className={`px-4 py-2 rounded-lg ${filter === 'hidden' ? 'bg-amber-500 text-white' : 'bg-gray-200'}`}
          >
            Hidden
          </button>
        </div>
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by user, food, or comment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Ratings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Food</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRatings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No ratings found
                  </td>
                </tr>
              ) : (
                filteredRatings.map((rating) => (
                  <tr key={rating._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium">{rating.userId?.name || 'Anonymous'}</p>
                      <p className="text-sm text-gray-500">{rating.userId?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{rating.foodId?.name}</p>
                      <p className="text-sm text-gray-500">ID: {rating.foodId?._id?.slice(-6)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {renderStars(rating.rating)}
                        <span className="ml-2 font-bold">{rating.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="max-w-xs truncate">{rating.comment || 'No comment'}</p>
                      {rating.adminResponse && (
                        <p className="text-sm text-blue-600">
                          📝 Replied: {rating.adminResponse}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        rating.isHidden ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {rating.isHidden ? 'Hidden' : 'Visible'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleHideRating(rating._id, rating.isHidden)}
                          className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors"
                          title={rating.isHidden ? 'Show' : 'Hide'}
                        >
                          {rating.isHidden ? <FaEye /> : <FaEyeSlash />}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedRating(rating);
                            setReplyText(rating.adminResponse || '');
                            setShowReplyModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Reply"
                        >
                          <FaReply />
                        </button>
                        <button
                          onClick={() => deleteRating(rating._id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reply Modal */}
      {showReplyModal && selectedRating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Reply to Review</h3>
              <button
                onClick={() => setShowReplyModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <p className="font-bold">{selectedRating.userId?.name}</p>
                <div className="flex gap-0.5">
                  {renderStars(selectedRating.rating)}
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-1">{selectedRating.comment}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Admin Response</label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your response to this review..."
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                rows="4"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowReplyModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReplySubmit}
                className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRatings;