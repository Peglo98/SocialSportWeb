import React, { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider, signInWithPopup } from 'firebase/auth';
import { set, ref, onValue } from 'firebase/database';
import { auth, database } from '../firebase-config';
import { NavLink, useNavigate } from 'react-router-dom';
import './css/tailwind.css';
import { useUser } from './utils/UserContext'; // Używamy hooka useUser

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useUser(); // Pobieranie funkcji login za pomocą hooka useUser

    const checkUserAndProceed = (user, additionalData) => {
        const userRef = ref(database, `users/${user.uid}`);
        onValue(userRef, (snapshot) => {
            if (!snapshot.exists()) {
                console.log("User does not exist, saving new user data.");
                createUserEntry(user, additionalData, () => {
                    navigate('/profile', { state: { message: 'Please complete your profile information.' } });
                });
            } else {
                console.log("User already exists, navigating to home.");
                navigate('/home');
            }
        }, { onlyOnce: true });
    };

    const createUserEntry = (user, additionalData = {}, callback) => {
        const userData = {
            firstName: additionalData.firstName || '',
            lastName: additionalData.lastName || '',
            email: user.email || '',
            phone: additionalData.phone || '',
            username: additionalData.username || '',
            avatar: additionalData.avatar || user.photoURL || ''
        };
        console.log("Writing userData to database:", userData);
        set(ref(database, `users/${user.uid}`), userData)
            .then(() => {
                console.log('User data saved to database:', userData);
                login(user); // Aktualizacja stanu użytkownika
                callback(); // Wywołanie funkcji nawigacji
            })
            .catch(error => {
                console.error('Error writing to database: ', error);
            });
    };

    const onLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                console.log("Authentication successful", userCredential.user);
                login(userCredential.user); // Aktualizacja stanu użytkownika
                if (userCredential.additionalUserInfo?.isNewUser) {
                    createUserEntry(userCredential.user, {}, () => {
                        navigate('/profile', { state: { message: 'Please complete your profile information.' } });
                    });
                } else {
                    navigate('/home');
                }
            })
            .catch(error => {
                console.error("Authentication error:", error);
            });
    };

    const handleSocialLogin = (provider) => {
        signInWithPopup(auth, provider)
            .then(result => {
                console.log("Authentication successful", result.user);
                login(result.user); // Aktualizacja stanu użytkownika
                checkUserAndProceed(result.user, {avatar: result.user.photoURL});
            })
            .catch(error => {
                console.error("Authentication error:", error);
            });
    };

    return (
        <main className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
            <section className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">SocialSport</h1>
                <form className="space-y-4" onSubmit={onLogin}>
                    <div>
                        <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Email address"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Login
                    </button>
                    <div className="space-y-2">
                        <button
                            type="button"
                            className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            onClick={() => handleSocialLogin(new GoogleAuthProvider())}
                        >
                            Login with Google
                        </button>
                        <button
                            type="button"
                            className="w-full bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            onClick={() => handleSocialLogin(new FacebookAuthProvider())}
                        >
                            Login with Facebook
                        </button>
                        <button
                            type="button"
                            className="w-full bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            onClick={() => handleSocialLogin(new TwitterAuthProvider())}
                        >
                            Login with Twitter
                        </button>
                    </div>
                </form>
                <p className="mt-6 text-sm text-center text-gray-600">
                    No account yet? {' '}
                    <NavLink to="/signup" className="text-blue-500 hover:text-blue-800">
                        Sign up
                    </NavLink>
                </p>
            </section>
        </main>
    );
};

export default Login;
