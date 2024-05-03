import React, { useState, useRef } from 'react';
import { ref, set } from 'firebase/database';
import { auth, database } from '../firebase-config';
import { StandaloneSearchBox } from '@react-google-maps/api';

const AddEvent = () => {
    const [eventType, setEventType] = useState('');
    const [playerCount, setPlayerCount] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
    const searchBoxRef = useRef(null);

    const onPlacesChanged = () => {
        const places = searchBoxRef.current.getPlaces();
        if (places && places.length > 0) {
            const place = places[0];
            setLocation(place.formatted_address || '');
            setCoordinates({
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const currentUser = auth.currentUser;
        if (!currentUser) {
            alert('Please log in to add an event.');
            return;
        }

        const eventRef = ref(database, 'events/' + Date.now());
        const eventData = {
            type: eventType,
            players: playerCount,
            time,
            location,
            coordinates, // Save both latitude and longitude
            creatorId: currentUser.uid, // ID of the user creating the event
            participants: [currentUser.uid] // Automatically add the creator as a participant
        };
        set(eventRef, eventData).then(() => {
            alert('Event added successfully!');
        }).catch(error => {
            alert('Error adding event: ' + error.message);
        });
    };

    return (
        <main className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
            <section className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">Add Sports Event</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Event Type</label>
                        <select id="type" name="type" value={eventType} onChange={(e) => setEventType(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="">Select a Sport</option>
                            <option value="Football">Football</option>
                            <option value="Volleyball">Volleyball</option>
                            <option value="Basketball">Basketball</option>
                            <option value="Tennis">Tennis</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="players" className="block text-sm font-medium text-gray-700">Player Count</label>
                        <input type="number" id="players" name="players" value={playerCount}
                            onChange={(e) => setPlayerCount(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>
                    <div>
                        <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
                        <input type="datetime-local" id="time" name="time" value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                        <StandaloneSearchBox onLoad={ref => searchBoxRef.current = ref} onPlacesChanged={onPlacesChanged}>
                            <input type="text" placeholder="Type location"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                        </StandaloneSearchBox>
                    </div>
                    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Add Event
                    </button>
                </form>
            </section>
        </main>
    );
};

export default AddEvent;
