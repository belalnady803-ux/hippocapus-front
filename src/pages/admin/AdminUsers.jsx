import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import axios from "axios";
import { API_URL } from "../../store/authStore";
import { toast } from "react-hot-toast";
import {
  FiSearch, FiUser, FiShield, FiSlash, FiChevronLeft, FiChevronRight,
} from "react-icons/fi";

const ROLE_STYLES = {
  admin:      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  instructor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  moderator:  "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  client:     "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
};

const ROLE_ICONS = {
  admin:      "👑",
  instructor: "🎓",
  moderator:  "🛡️",
  client:     "👤",
};

export default function AdminUsers() {
  const [users, setUsers]         = useState([]);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [page, setPage]           = useState(1);
  const [updating, setUpdating]   = useState(null); // userId being updated
  const LIMIT = 15;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/admin/courses/users`, {
        params: { search, role: filterRole, page, limit: LIMIT },
      });
      setUsers(data.data.users);
      setTotal(data.data.total);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [search, filterRole, page]);

  useEffect(() => {
    const id = setTimeout(fetchUsers, 300);
    return () => clearTimeout(id);
  }, [fetchUsers]);

  const handleRole = async (userId, role, action) => {
    setUpdating(userId + role);
    try {
      const { data } = await axios.patch(`${API_URL}/admin/courses/users/${userId}/role`, { role, action });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, roles: data.data.user.roles } : u))
      );
      toast.success(
        action === "add"
          ? `Promoted to ${role} ✅`
          : `Removed ${role} role`
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update role");
    } finally {
      setUpdating(null);
    }
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="container mx-auto px-4 py-24 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Promote users to instructor, moderator, or admin.
          </p>
        </div>
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => { setFilterRole(e.target.value); setPage(1); }}
          className="px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="">All roles</option>
          <option value="client">Client</option>
          <option value="instructor">Instructor</option>
          <option value="moderator">Moderator</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl overflow-hidden ring-1 ring-black/5">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <FiUser className="w-10 h-10 mb-2" />
            <p>No users found</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {["User", "Roles", "Verified", "Joined", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  {/* User */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {user.photo ? (
                        <img src={user.photo} alt="" className="w-9 h-9 rounded-full object-cover" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-sm">
                          {user.fullName?.[0]?.toUpperCase() || "?"}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.fullName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Roles */}
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {(user.roles || ["client"]).map((r) => (
                        <span
                          key={r}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_STYLES[r] || ROLE_STYLES.client}`}
                        >
                          {ROLE_ICONS[r]} {r}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Verified */}
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                      user.isVerified
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      {user.isVerified ? "✓ Verified" : "✗ Pending"}
                    </span>
                  </td>

                  {/* Joined */}
                  <td className="px-5 py-4 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      {/* Promote to instructor */}
                      {!user.roles?.includes("instructor") ? (
                        <button
                          onClick={() => handleRole(user._id, "instructor", "add")}
                          disabled={updating === user._id + "instructor"}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                          <FiShield className="w-3.5 h-3.5" />
                          {updating === user._id + "instructor" ? "…" : "Make Instructor"}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRole(user._id, "instructor", "remove")}
                          disabled={updating === user._id + "instructor"}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 hover:bg-red-100 dark:bg-gray-700 dark:hover:bg-red-900/30 disabled:opacity-50 text-gray-700 dark:text-gray-200 hover:text-red-700 dark:hover:text-red-400 text-xs font-semibold rounded-lg transition-colors"
                        >
                          <FiSlash className="w-3.5 h-3.5" />
                          {updating === user._id + "instructor" ? "…" : "Remove Instructor"}
                        </button>
                      )}

                      {/* Promote to moderator */}
                      {!user.roles?.includes("moderator") ? (
                        <button
                          onClick={() => handleRole(user._id, "moderator", "add")}
                          disabled={updating === user._id + "moderator"}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                          <FiShield className="w-3.5 h-3.5" />
                          {updating === user._id + "moderator" ? "…" : "Make Moderator"}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRole(user._id, "moderator", "remove")}
                          disabled={updating === user._id + "moderator"}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 hover:bg-red-100 dark:bg-gray-700 dark:hover:bg-red-900/30 disabled:opacity-50 text-gray-700 dark:text-gray-200 hover:text-red-700 dark:hover:text-red-400 text-xs font-semibold rounded-lg transition-colors"
                        >
                          <FiSlash className="w-3.5 h-3.5" />
                          {updating === user._id + "moderator" ? "…" : "Remove Moderator"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} of {total} users
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
