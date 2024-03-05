'use client'
import {useRouter } from "next/router";
import { useState, useEffect } from "react"


export default function User() {
  const [users, setUserData] = useState(null)
  const [selectUser, selectedUser] = useState(null)
  const [showUserForm, setShowUserForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    isActive: false,
    name: '',
    lastName:'',
  });
  const [updateUser, setUpdateUser] = useState(null);


  useEffect(() => {
    fetch("http://3.80.137.20/getAllUser")
      .then(response => response.json())
      .then(data => setUserData(data))
      .catch(error => console.log("Error fetching data:", error));
  }, []);

  const handleViewUser = async (userId) => {
    try {
      const response = await fetch('http://3.80.137.20/getUserById/' + userId)
      const data = await response.json()
      selectedUser(data)
    } catch (error) {
      console.log("Error fetching user data:", error);
    }

  }

  const handleCloseCard = () => {
    selectedUser(null);
  };

  const handleAddUser = () => {
    setShowUserForm(true);
    setUpdateUser(null);
  };

  const closeUserForm = () => {
    setShowUserForm(false);
    setFormData({
      email: '',
      password: '',
      isActive: false,
      name: '',
      lastName:'',
    });

    setUpdateUser(null);
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }
  const handleDeleteUser = async (userId) => {
    try {
      console.log(`Deleting user with ID: ${userId}`);
      const response = await fetch(`http://3.80.137.20/deleteUserById/${userId}`, {
        method: 'DELETE',
      });

      console.log('Response:', response);

      if (response.ok) {
        console.log('User deleted successfully!');
        const updatedResponse = await fetch("http://3.80.137.20/getAllUser");
        const updatedData = await updatedResponse.json();
        setUserData(updatedData);
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };


  const handleUpdateUser = (user) => {
    setUpdateUser(user);
    setFormData({
      email: user.email,
      password: user.password,
      isActive: user.is_active,
      name: user.name,
      lastName:user.lastName,
    });
    setShowUserForm(true);
  };



  const handleSubmit = async () => {
    console.log('FormData:', formData);
    try {
      let apiUrl = 'http://3.80.137.20/saveUser';
      let methods = 'POST'

      if (updateUser) {
        apiUrl = `http://3.80.137.20/updateUser/${updateUser.id}`;
        methods = 'PUT'
      }

      const response = await fetch(apiUrl, {
        method: methods, // Use 'PUT' for updates if your API supports it
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('User data saved successfully!');
        const updatedResponse = await fetch("http://3.80.137.20/getAllUser");
        const updatedData = await updatedResponse.json();
        setUserData(updatedData);
      } else {
        console.error('Failed to save user data');
      }
    } catch (error) {
      console.error('Error submitting user data:', error);
    }

    closeUserForm();

  }

  const handleBack = () => {
    router.push('/');
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20vh', fontWeight: 'bold', fontSize: '1.2 em' }}>
        User Form
      </div>

      <table style={{ margin: 'auto', width: '60%', borderCollapse: 'collapse', border: '1px solid black' }}>
        <thead>
          <tr>
            <th style={{ width: '10%', border: '1px solid black' }}>ID</th>
            <th style={{ width: '30%', border: '1px solid black' }}>Name</th>
            <th style={{ width: '30%', border: '1px solid black' }}>lastName</th>
            <th style={{ width: '30%', border: '1px solid black' }}>Email</th>
            <th style={{ width: '20%', border: '1px solid black' }}>Status</th>
            <th style={{ width: '20%', border: '1px solid black' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {users && users.map(user => (
            <tr key={user.id}>
              <td style={{ width: '10%', border: '1px solid black' }}>{user.id}</td>
              <td style={{ width: '30%', border: '1px solid black' }}>{user.name}</td>
              <td style={{ width: '30%', border: '1px solid black' }}>{user.lastName}</td>
              <td style={{ width: '30%', border: '1px solid black' }}>{user.email}</td>
              <td style={{ width: '40%', border: '1px solid black' }}>{user.is_active.toString()}</td>
              <td style={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}>

                <button style={{ marginLeft: '8px' }} onClick={() => { handleViewUser(user.id) }}>View</button>
                <button style={{ marginLeft: '8px' }} onClick={() => handleUpdateUser(user)} >Update</button>
                <button style={{ marginLeft: '8px' }} onClick={() => { handleDeleteUser(user.id) }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <button style={{ margin: '20px', width: '150px', padding: '10px', backgroundColor: '#4CAF50', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={handleAddUser}>
          Add
        </button>
        {/* <button style={{ margin: '20px', width: '150px', padding: '10px', backgroundColor: '#4CAF50', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={handleBack}>
          Back
        </button> */}
      </div>
      {/* Display user details in a card */}
      {selectUser && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', background: 'white', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', zIndex: '999' }}>
          <h2>User Details</h2>
          <p>ID: {selectUser.id}</p>
          <p>Name: {selectUser.name}</p>
          <p>lastName: {selectUser.lastName}</p>
          <p>Email: {selectUser.email}</p>
          <p>Status: {selectUser.is_active?.toString()}</p>
          <button onClick={handleCloseCard}>Close</button>
        </div>
      )}

      {showUserForm && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '999', width: '300px', padding: '20px', borderRadius: '8px', background: '#fff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ textAlign: 'center' }}>{updateUser ? 'Update User' : 'Add User'}</h2>
          {/* Input fields for the user form */}
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} style={{ width: '100%', marginBottom: '10px', padding: '8px', borderRadius: '4px' }} />
        
          <label>lastName:</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} style={{ width: '100%', marginBottom: '10px', padding: '8px', borderRadius: '4px' }} />

          <label>Email:</label>
          <input type="text" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', marginBottom: '10px', padding: '8px', borderRadius: '4px' }} />

          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} style={{ width: '100%', marginBottom: '10px', padding: '8px', borderRadius: '4px' }} />

          <label>Is Active:</label>
          <input type="checkbox" name="isActive" value={formData.isActive} onChange={handleChange} style={{ marginBottom: '10px' }} />


          <button style={{ width: '100%', padding: '10px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={handleSubmit}>   {updateUser ? 'Update' : 'Add'}</button>
          <button style={{ width: '100%', padding: '10px', backgroundColor: '#ccc', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }} onClick={closeUserForm}>Close</button>
        </div>
      )}

    </div>
  )




}