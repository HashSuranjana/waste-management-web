import React, { useState } from 'react';
import './PostalResidents.css';

/**
 * PostalResidents Component
 * 
 * This component displays a list of residents grouped by postal code
 * and allows sending messages to residents in a specific postal code area.
 */
const PostalResidents = ({ residents }) => {
    // State for postal code selection and messaging
    const [selectedPostalCode, setSelectedPostalCode] = useState('');
    const [postalCodeMessage, setPostalCodeMessage] = useState('');
    const [showMessageModal, setShowMessageModal] = useState(false);

    // Function to get unique postal codes from residents
    const getUniquePostalCodes = () => {
        return [...new Set(residents.map(resident => resident.postalCode))];
    };

    // Function to get residents by postal code
    const getResidentsByPostalCode = (postalCode) => {
        return residents.filter(resident => resident.postalCode === postalCode);
    };

    // Function to handle sending message to residents
    const handleSendMessage = () => {
        // Here you would typically integrate with your backend to send messages
        // For now, we'll just show an alert
        alert(`Message sent to residents in postal code ${selectedPostalCode}`);
        setShowMessageModal(false);
        setPostalCodeMessage('');
    };

    return (
        <div className="postal-residents">
            <h2>Postal Code Residents List</h2>

            {/* Postal Code Selection */}
            <div className="postal-code-selection">
                <select
                    value={selectedPostalCode}
                    onChange={(e) => setSelectedPostalCode(e.target.value)}
                    className="postal-code-select"
                >
                    <option value="">Select Postal Code</option>
                    {getUniquePostalCodes().map(code => (
                        <option key={code} value={code}>{code}</option>
                    ))}
                </select>

                {selectedPostalCode && (
                    <button
                        className="send-message-btn"
                        onClick={() => setShowMessageModal(true)}
                    >
                        Send Message to Residents
                    </button>
                )}
            </div>

            {/* Residents List for Selected Postal Code */}
            {selectedPostalCode && (
                <div className="residents-list">
                    <h3>Residents in {selectedPostalCode}</h3>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Address</th>
                                <th>Phone</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getResidentsByPostalCode(selectedPostalCode).map(resident => (
                                <tr key={resident.id}>
                                    <td>{resident.name}</td>
                                    <td>{resident.address}</td>
                                    <td>{resident.phone}</td>
                                    <td>{resident.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Message Modal */}
            {showMessageModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Send Message to Residents in {selectedPostalCode}</h3>
                        <div className="message-form">
                            <textarea
                                value={postalCodeMessage}
                                onChange={(e) => setPostalCodeMessage(e.target.value)}
                                placeholder="Enter your message here..."
                                rows="6"
                                className="message-input"
                            />
                            <div className="modal-actions">
                                <button
                                    className="action-btn save"
                                    onClick={handleSendMessage}
                                    disabled={!postalCodeMessage.trim()}
                                >
                                    Send Message
                                </button>
                                <button
                                    className="action-btn cancel"
                                    onClick={() => {
                                        setShowMessageModal(false);
                                        setPostalCodeMessage('');
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostalResidents; 