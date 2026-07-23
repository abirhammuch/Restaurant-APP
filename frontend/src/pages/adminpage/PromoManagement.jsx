import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const PromoManagement = () => {
  const { backendUrl, admintoken, tAdmin } = useContext(AppContext);
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: 0,
    maxRedemptions: 0,
    maxUsers: 0,
    totalDiscountBudget: 0,
    expiresAt: "",
    active: true,
  });

  const headers = { admintoken };

  const fetchPromos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(backendUrl + "/api/promo/list", { headers });
      if (res.data.success) setPromos(res.data.promos || []);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to load promos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setEditing(null);
    setForm({
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: 0,
      maxRedemptions: 0,
      maxUsers: 0,
      totalDiscountBudget: 0,
      expiresAt: "",
      active: true,
    });
  };

  const handleEdit = (promo) => {
    setEditing(promo._id);
    setForm({
      code: promo.code || "",
      description: promo.description || "",
      discountType: promo.discountType || "percentage",
      discountValue: promo.discountValue || 0,
      maxRedemptions: promo.maxRedemptions || 0,
      maxUsers: promo.maxUsers || 0,
      totalDiscountBudget: promo.totalDiscountBudget || 0,
      expiresAt: promo.expiresAt
        ? new Date(promo.expiresAt).toISOString().slice(0, 16)
        : "",
      active: !!promo.active,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        code: form.code,
        description: form.description,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        maxRedemptions: Number(form.maxRedemptions) || 0,
        maxUsers: Number(form.maxUsers) || 0,
        totalDiscountBudget: Number(form.totalDiscountBudget) || 0,
        expiresAt: form.expiresAt || null,
        active: !!form.active,
      };

      if (editing) {
        payload.promoId = editing;
        const res = await axios.put(backendUrl + "/api/promo/edit", payload, {
          headers,
        });
        if (res.data.success) {
          toast.success("Promo updated");
          fetchPromos();
          resetForm();
        } else toast.error(res.data.message || "Update failed");
      } else {
        const res = await axios.post(backendUrl + "/api/promo/add", payload, {
          headers,
        });
        if (res.data.success) {
          toast.success("Promo created");
          fetchPromos();
          resetForm();
        } else toast.error(res.data.message || "Create failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Promo action failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this promo?")) return;
    try {
      setLoading(true);
      const res = await axios.delete(backendUrl + "/api/promo/delete", {
        data: { promoId: id },
        headers,
      });
      if (res.data.success) {
        toast.success("Promo deleted");
        fetchPromos();
      } else toast.error(res.data.message || "Delete failed");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Promo Codes</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form
          onSubmit={handleSubmit}
          className="space-y-3 bg-white p-4 rounded shadow"
        >
          <div>
            <label className="block text-sm">Code</label>
            <input
              name="code"
              value={form.code}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm">Description</label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm">Type</label>
              <select
                name="discountType"
                value={form.discountType}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm">Value</label>
              <input
                name="discountValue"
                value={form.discountValue}
                onChange={handleChange}
                type="number"
                step="0.01"
                className="w-full border px-2 py-1 rounded"
                required
              />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm">Max Redemptions</label>
              <input
                name="maxRedemptions"
                value={form.maxRedemptions}
                onChange={handleChange}
                type="number"
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm">Max Users</label>
              <input
                name="maxUsers"
                value={form.maxUsers}
                onChange={handleChange}
                type="number"
                className="w-full border px-2 py-1 rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm">Total Discount Budget</label>
            <input
              name="totalDiscountBudget"
              value={form.totalDiscountBudget}
              onChange={handleChange}
              type="number"
              step="0.01"
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div>
            <label className="block text-sm">Expires At</label>
            <input
              name="expiresAt"
              value={form.expiresAt}
              onChange={handleChange}
              type="datetime-local"
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              name="active"
              checked={form.active}
              onChange={handleChange}
              type="checkbox"
            />
            <label className="text-sm">Active</label>
          </div>

          <div className="flex gap-2">
            <button
              disabled={loading}
              className="px-4 py-2 bg-amber-600 text-white rounded"
            >
              {editing ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border rounded"
            >
              Reset
            </button>
          </div>
        </form>

        <div className="lg:col-span-2 bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-3">Existing Promos</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2">Code</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th>Value</th>
                    <th>Redemptions</th>
                    <th>Users</th>
                    <th>Budget</th>
                    <th>Expires</th>
                    <th>Active</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {promos.map((p) => (
                    <tr key={p._id} className="border-b">
                      <td className="py-2 font-medium">{p.code}</td>
                      <td>{p.description}</td>
                      <td>{p.discountType}</td>
                      <td>{p.discountValue}</td>
                      <td>
                        {p.redemptionCount}/{p.maxRedemptions || "∞"}
                      </td>
                      <td>
                        {p.usedUsers?.length || 0}/{p.maxUsers || "∞"}
                      </td>
                      <td>
                        {p.totalDiscountUsed}/{p.totalDiscountBudget || "∞"}
                      </td>
                      <td>
                        {p.expiresAt
                          ? new Date(p.expiresAt).toLocaleString()
                          : "—"}
                      </td>
                      <td>{p.active ? "Yes" : "No"}</td>
                      <td className="flex gap-2 py-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="px-2 py-1 bg-yellow-200 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="px-2 py-1 bg-red-200 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromoManagement;
