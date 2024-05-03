import React, { useState, useEffect } from 'react';
import { ref, onValue, get, update } from 'firebase/database';
import { auth, database } from '../firebase-config';
import { GoogleMap, Marker } from '@react-google-maps/api';


const ViewEvents = () => {
    const [events, setEvents] = useState([]);

    // Auth listener to handle dynamic auth states
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                fetchEvents(user);  // Fetch events only when user is logged in
            } else {
                console.log("No user logged in");
                setEvents([]); // Clear events if user logs out or isn't logged in
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchEvents = (user) => {
        console.log("Fetching events for user:", user.uid);
        const eventsRef = ref(database, 'events');
        onValue(eventsRef, async (snapshot) => {
            const eventsData = snapshot.val();
            if (!eventsData) {
                console.log("No events data found");
                return;
            }
            const loadedEvents = [];

            for (const key in eventsData) {
                const eventData = eventsData[key];
                try {
                    const userRef = ref(database, `users/${eventData.creatorId}`);
                    const userSnapshot = await get(userRef);
                    const userInfo = userSnapshot.val();

                    if (eventData.coordinates) {
                        loadedEvents.push({
                            id: key,
                            ...eventData,
                            user: userInfo,
                            isParticipant: eventData.participants?.includes(user.uid),
                            playersNeeded: eventData.players - (eventData.participants ? eventData.participants.length : 0)
                        });
                    }
                } catch (error) {
                    console.error("Error fetching user data for event:", key, error);
                }
            }
            setEvents(loadedEvents);
            console.log("Loaded events:", loadedEvents);
        });
    };

    const handleJoinLeaveEvent = (eventId, isParticipant) => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            alert("Please log in first.");
            return;
        }

        const eventRef = ref(database, `events/${eventId}/participants`);
        get(eventRef).then((snapshot) => {
            let participants = snapshot.val() || [];
            if (isParticipant) {
                participants = participants.filter(uid => uid !== currentUser.uid);
                alert('You have left the event.');
            } else {
                participants.push(currentUser.uid);
                alert('You have joined the event.');
            }
            update(eventRef, participants);
        }).catch(error => {
            console.error('Error updating participants: ', error);
        });
    };

    const mapContainerStyle = {
        width: '100%',
        height: '200px'
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center">
            <h1 className="text-2xl font-bold text-center my-6">Sports Events</h1>
            {events.map((event) => (
                <div key={event.id} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mb-4">
                    <h2 className="text-xl font-bold">{event.type}</h2>
                    <p>Total Players: {event.players}</p>
                    <p>Players still needed: {event.playersNeeded}</p>
                    <p>Time: {new Date(event.time).toLocaleString()}</p>
                    <p>Location: {event.location}</p>
                    <p>Organized by: {event.user.firstName} {event.user.lastName}</p>
                    {event.user.avatarUrl && <img src={event.user.avatarUrl} alt="Avatar" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />}
                    {event.coordinates && (
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={{ lat: event.coordinates.lat, lng: event.coordinates.lng }}
                            zoom={15}
                        >
                            <Marker position={{ lat: event.coordinates.lat, lng: event.coordinates.lng }} />
                        </GoogleMap>
                    )}
                    <div className="mt-2">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            View Details
                        </button>
                        {event.isParticipant ? (
                            <button onClick={() => handleJoinLeaveEvent(event.id, true)}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 ml-2 rounded">
                                Leave Event
                            </button>
                        ) : (
                            <button onClick={() => handleJoinLeaveEvent(event.id, false)}
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 ml-2 rounded">
                                Join Event
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ViewEvents;
