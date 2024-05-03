import React from 'react';
import { LoadScript } from '@react-google-maps/api';
import AddEvent from './AddEvent';
import ViewEvents from './ViewEvents';
import { useUser } from './utils/UserContext'; // Import Context

const libraries = ['places'];

const EventManagement = () => {
    const { currentUser } = useUser();
    console.log(currentUser);
    return (
        <LoadScript
            googleMapsApiKey=""
            libraries={libraries}
        >
            <div className="min-h-screen flex">
                {currentUser ? (
                    <>
                        <div className="w-1/2 p-4">
                            <ViewEvents />
                        </div>
                        <div className="w-1/2 p-4 bg-gray-100">
                            <AddEvent />
                        </div>
                    </>
                ) : (
                    <div>Please log in to view this page.</div>
                )}
            </div>
        </LoadScript>
    );
};

export default EventManagement;