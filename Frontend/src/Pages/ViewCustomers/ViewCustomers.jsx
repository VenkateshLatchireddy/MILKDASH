import React, { useEffect, useState } from 'react';
import './ViewCustomers.css';
import AdminNavbar from '../../Components/AdminNavbar/AdminNavbar';
import AdminSidebar from '../../Components/AdminSidebar/AdminSidebar';

const ViewCustomers = () => {
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
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
        try {
            const response = await fetch(`http://localhost:5000/api/users/${editUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editUser)
            });
            if (response.ok) {
                fetchUsers(); // Refresh data after update
                setEditUser(null);
            } else {
                console.error('Failed to update user');
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <div>
            <AdminNavbar />
            <div className='wrapper-container'>
                <div className='sidebar-container'>
                    <AdminSidebar />
                </div>
                <div className="customer-container">
                    <div className="table-wrapper">
                        <h1>View Customers</h1>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>NAME</th>
                                    <th>EMAIL</th>
                                    <th>PASSWORD</th>
                                    <th>CONTACT</th>
                                    <th>ADDRESS</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{editUser?.id === user.id ? <input type="text" name="name" value={editUser.name} onChange={handleChange} /> : user.name}</td>
                                        <td>{editUser?.id === user.id ? <input type="email" name="email" value={editUser.email} onChange={handleChange} /> : user.email}</td>
                                        <td>{editUser?.id === user.id ? <input type="password" name="password" value={editUser.password} onChange={handleChange} /> : user.password}</td>
                                        <td>{editUser?.id === user.id ? <input type="text" name="contactnumber" value={editUser.contactnumber} onChange={handleChange} /> : user.contactnumber}</td>
                                        <td>{editUser?.id === user.id ? <input type="text" name="address" value={editUser.address} onChange={handleChange} /> : user.address}</td>
                                        <td>
                                            {editUser?.id === user.id ? (
                                                <button onClick={handleUpdate}>Save</button>
                                            ) : (
                                                <button onClick={() => handleEdit(user)}>Edit</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ViewCustomers;
