// Import React, useEffect, useState
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import '../styles/DestinationDetails.css';

// Import local images for each section
import descriptionImg from '../assets/description.jpg'; 
import historyImg from '../assets/history.png'; 
import attractionsImg from '../assets/attractions.png';
import foodImg from '../assets/food.jpg';
import nightlifeImg from '../assets/nightlife.jpg';
import accommodationImg from '../assets/accommodation.jpg'; 
import transportationImg from '../assets/transportation.jpg'; 

const DestinationDetails = () => {
    const { destinationId } = useParams();
    const [destination, setDestination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalContent, setModalContent] = useState({ title: '', content: null });
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchDestinationDetails = async () => {
            try {
                const docRef = doc(db, 'destinationDetails', destinationId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setDestination(docSnap.data());
                } else {
                    setError('No destination found with that name.');
                }
            } catch (error) {
                setError('Failed to fetch destination details.');
            } finally {
                setLoading(false);
            }
        };

        fetchDestinationDetails();
    }, [destinationId]);

    // Helper function to parse URLs and convert them into clickable links
    const parseTextWithLinks = (text) => {
        const urlPattern = /(https?:\/\/[^\s]+)/g;
        return text.split(urlPattern).map((part, index) => 
            urlPattern.test(part) ? (
                <a key={index} href={part} target="_blank" rel="noopener noreferrer">
                    {part}
                </a>
            ) : (
                part
            )
        );
    };

    // Open modal with content
    const openModal = (title, content) => {
        setModalContent({ title, content });
        setIsModalOpen(true);
    };

    // Close the modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!destination) return <div>No Destination Found</div>;

    return (
        <div className="destination-details">
            <div className="title-container">
                <h1>{destination.name}</h1>
            </div>

            <div className="flex-container">
                {/* Description Section */}
                <div className="container" onClick={() => openModal('Description', destination.description)}>
                    <h3>Description</h3>
                    <img src={descriptionImg} alt="Description" className="section-image" />
                </div>

                {/* History Section */}
                <div className="container" onClick={() => openModal('History', destination.history)}>
                    <h3>History</h3>
                    <img src={historyImg} alt="History" className="section-image" />
                </div>

                {/* Attractions Section */}
                <div className="container" onClick={() => openModal('Attractions', destination.attractions)}>
                    <h3>Attractions</h3>
                    <img src={attractionsImg} alt="Attractions" className="section-image" />
                </div>

                {/* Food Section */}
                <div className="container" onClick={() => openModal('Food', destination.food)}>
                    <h3>Food</h3>
                    <img src={foodImg} alt="Food" className="section-image" />
                </div>

                {/* Nightlife Section */}
                <div className="container" onClick={() => openModal('Nightlife', destination.nightlife)}>
                    <h3>Nightlife</h3>
                    <img src={nightlifeImg} alt="Nightlife" className="section-image" />
                </div>

                {/* Accommodation Section */}
                <div className="container" onClick={() => openModal('Where to Stay', destination.accommodation)}>
                    <h3>Where to Stay</h3>
                    <img src={accommodationImg} alt="Accommodation" className="section-image" />
                </div>

                {/* Transportation Section */}
                <div className="container" onClick={() => openModal('Ready to Go?', destination.transportation)}>
                    <h3>Ready to Go?</h3>
                    <img src={transportationImg} alt="Transportation" className="section-image" />
                </div>
            </div>

            {/* Modal for displaying section info */}
            {isModalOpen && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>{modalContent.title}</h2>
                        {Array.isArray(modalContent.content) ? (
                            <ul>
                                {modalContent.content.map((item, index) => (
                                    <li key={index}>{parseTextWithLinks(item)}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>{parseTextWithLinks(modalContent.content)}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DestinationDetails;
