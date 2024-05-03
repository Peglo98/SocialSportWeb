import React, { useState, useEffect } from 'react';
import { auth, database } from '../firebase-config';
import { ref, onValue, update } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    username: '',
    avatar: ''
  });

  useEffect(() => {
    const authUnsub = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed", currentUser);
      if (currentUser) {
        setUser(currentUser);
        const userRef = ref(database, 'users/' + currentUser.uid);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setFormData(data);
          }
        }, {
          onlyOnce: true
        });
      } else {
        setUser(null);
      }
    });
  
    return () => authUnsub();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();  // Stops the default form submission behavior
    console.log("Form submitted", formData);
    if (user) {
      const updates = {};
      const path = '/users/' + user.uid;
      updates[path] = formData;
      console.log("Attempting to update at path:", path, "with data:", formData);
      update(ref(database), updates)
        .then(() => {
          alert('Data updated successfully!');
          console.log('Update successful');
        })
        .catch((error) => {
          console.error('Failed to update data:', error);
          alert('Failed to update data: ' + error.message);
        });
    } else {
      console.log("No user logged in");
      alert('No user logged in');
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <section className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {user ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name:</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name:</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange}
                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone:</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Username:</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange}
                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Avatar URL:</label>
              <input type="text" name="avatar" value={formData.avatar} onChange={handleChange}
                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <p>Please log in to see this page.</p>
        )}
      </section>
    </main>
  );
}

export default UserProfile;
