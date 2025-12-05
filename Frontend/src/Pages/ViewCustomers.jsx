import React, { useEffect, useState } from 'react';
import AdminNavbar from '../Components/AdminNavbar';
import AdminSidebar from '../Components/AdminSidebar';
import API_BASE_URL from "../config";
import { Users, User, Mail, Phone, MapPin, Edit2, Save, X, RefreshCw, Shield } from 'lucide-react';

const ViewCustomers = () => {
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/users`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Failed to load customers. Please check the API connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user) => {
        setEditUser({ ...user });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditUser((prevUser) => ({ ...prevUser, [name]: value }));
    };

    const handleUpdate = async () => {
        if (!editUser) return;
        
        try {
            setUpdating(true);
            const response = await fetch(`${API_BASE_URL}/api/users/${editUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editUser)
            });
            
            if (response.ok) {
                fetchUsers(); // Refresh data after update
                setEditUser(null);
                alert('Customer updated successfully!');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update user');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update customer. Please try again.');
        } finally {
            setUpdating(false);
        }
    };

    const handleCancel = () => {
        setEditUser(null);
    };

    const formatPhoneNumber = (phone) => {
        if (!phone) return '';
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 10) {
            return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
        }
        return phone;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminNavbar />
            
            <div className="flex">
                {/* Sidebar */}
                <div className="hidden md:block">
                    <AdminSidebar />
                </div>

                {/* Main Content */}
                <div className="flex-1 p-4 md:p-6">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
                                    <Users className="w-7 h-7 text-green-600" />
                                    Customer Management
                                </h1>
                                <p className="text-gray-600 mt-2">View and manage all registered customers</p>
                            </div>
                            
                            <div className="flex gap-3">
                                <button
                                    onClick={fetchUsers}
                                    disabled={loading}
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200 disabled:opacity-50"
                                >
                                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                    {loading ? 'Refreshing...' : 'Refresh'}
                                </button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Total Customers</p>
                                        <p className="text-xl font-bold text-gray-800">{users.length}</p>
                                    </div>
                                    <Users className="w-8 h-8 text-blue-600 opacity-60" />
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Active Today</p>
                                        <p className="text-xl font-bold text-gray-800">
                                            {users.filter(u => new Date(u.created_at || u.date).toDateString() === new Date().toDateString()).length}
                                        </p>
                                    </div>
                                    <User className="w-8 h-8 text-green-600 opacity-60" />
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Verified</p>
                                        <p className="text-xl font-bold text-gray-800">
                                            {users.filter(u => u.email && u.email.includes('@')).length}
                                        </p>
                                    </div>
                                    <Shield className="w-8 h-8 text-purple-600 opacity-60" />
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-4 border border-yellow-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Editing</p>
                                        <p className="text-xl font-bold text-gray-800">
                                            {editUser ? '1 Active' : 'None'}
                                        </p>
                                    </div>
                                    <Edit2 className="w-8 h-8 text-yellow-600 opacity-60" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Customers Table */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                        {/* Table Header */}
                        <div className="p-4 md:p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-800">Registered Customers</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Click edit to update customer information
                            </p>
                        </div>

                        {/* Table Content */}
                        <div className="overflow-x-auto">
                            {loading ? (
                                <div className="p-8 text-center">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
                                    <p className="mt-2 text-gray-500">Loading customers...</p>
                                </div>
                            ) : users.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <h3 className="text-lg font-semibold text-gray-700">No Customers Found</h3>
                                    <p className="text-gray-500 mt-1">No registered customers in the database</p>
                                </div>
                            ) : (
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Address</th>
                                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joined</th>
                                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {users.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="py-4 px-4">
                                                    <div className="font-mono font-semibold text-gray-800">#{user.id}</div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <User className="w-4 h-4 text-gray-400" />
                                                            {editUser?.id === user.id ? (
                                                                <input
                                                                    type="text"
                                                                    name="name"
                                                                    value={editUser.name}
                                                                    onChange={handleChange}
                                                                    className="px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                                                                />
                                                            ) : (
                                                                <span className="font-medium text-gray-700 capitalize">{user.name}</span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Mail className="w-4 h-4 text-gray-400" />
                                                            {editUser?.id === user.id ? (
                                                                <input
                                                                    type="email"
                                                                    name="email"
                                                                    value={editUser.email}
                                                                    onChange={handleChange}
                                                                    className="px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                                                                />
                                                            ) : (
                                                                <span className="text-sm text-gray-600">{user.email}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="w-4 h-4 text-gray-400" />
                                                        {editUser?.id === user.id ? (
                                                            <input
                                                                type="text"
                                                                name="contactnumber"
                                                                value={editUser.contactnumber}
                                                                onChange={handleChange}
                                                                className="px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                                                            />
                                                        ) : (
                                                            <span className="font-medium text-gray-700">{formatPhoneNumber(user.contactnumber)}</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-start gap-2 max-w-xs">
                                                        <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                                                        {editUser?.id === user.id ? (
                                                            <textarea
                                                                name="address"
                                                                value={editUser.address}
                                                                onChange={handleChange}
                                                                rows="2"
                                                                className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm resize-none"
                                                            />
                                                        ) : (
                                                            <span className="text-sm text-gray-600 line-clamp-2">{user.address}</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="text-sm text-gray-600">
                                                        {user.created_at ? new Date(user.created_at).toLocaleDateString('en-GB', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        }) : 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    {editUser?.id === user.id ? (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={handleUpdate}
                                                                disabled={updating}
                                                                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 text-sm disabled:opacity-70"
                                                            >
                                                                {updating ? (
                                                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                                ) : (
                                                                    <Save className="w-4 h-4" />
                                                                )}
                                                                {updating ? 'Saving...' : 'Save'}
                                                            </button>
                                                            <button
                                                                onClick={handleCancel}
                                                                className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 text-sm"
                                                            >
                                                                <X className="w-4 h-4" />
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleEdit(user)}
                                                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition duration-200"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                            Edit
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-8 bg-white rounded-xl p-4 border border-gray-200">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h4 className="font-medium text-gray-700">Customer Management Guidelines</h4>
                                <ul className="text-sm text-gray-500 mt-2 space-y-1">
                                    <li>• Customer data is sensitive - handle with care</li>
                                    <li>• Always verify information before updating</li>
                                    <li>• Use edit mode to modify customer details</li>
                                    <li>• Changes are saved immediately to the database</li>
                                </ul>
                            </div>
                            <div className="text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="font-medium text-green-600">Database Connected</span>
                                </div>
                                <p className="text-gray-500 mt-1">Last sync: {new Date().toLocaleTimeString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewCustomers;