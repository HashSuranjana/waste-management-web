import React, { useEffect, useState } from 'react';
import {
    addBulkMaterial,
    fetchBulkMaterials,
    updateBulkStatus,
    updateStepStatus
} from "../../../utils/bulk-collection.js";

const Material = () => {
    const [showNewBulkModal, setShowNewBulkModal] = useState(false);
    const [recyclingTab, setRecyclingTab] = useState('overview');
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [recycleMaterials, setRecycleMaterials] = useState([]);

    const [newBulkData, setNewBulkData] = useState({
        name: '',
        type: '',
        quantity: '',
        description: '',
        status: 1,
        stepsCompletionStatus: {
            collection: 1,
            sorting: 0,
            cleaning: 0,
            processing: 0,
            qualitycheck: 0,
            packaging: 0
        }
    });

    const [recyclingProcess, setRecyclingProcess] = useState({
        currentStep: 1,
        steps: [
            {
                id: 1,
                name: 'Collection',
                status: 'completed',
                description: 'Waste materials are collected from various sources',
                completedAt: '2024-03-15 09:00',
                notes: 'Collected from 5 different locations'
            },
            {
                id: 2,
                name: 'Sorting',
                status: 'in-progress',
                description: 'Materials are sorted by type and quality',
                completedAt: null,
                notes: ''
            },
            {
                id: 3,
                name: 'Cleaning',
                status: 'pending',
                description: 'Materials are cleaned and prepared for processing',
                completedAt: null,
                notes: ''
            },
            {
                id: 4,
                name: 'Processing',
                status: 'pending',
                description: 'Materials are processed into raw materials',
                completedAt: null,
                notes: ''
            },
            {
                id: 5,
                name: 'Quality Check',
                status: 'pending',
                description: 'Processed materials undergo quality inspection',
                completedAt: null,
                notes: ''
            },
            {
                id: 6,
                name: 'Packaging',
                status: 'pending',
                description: 'Materials are packaged for distribution',
                completedAt: null,
                notes: ''
            }
        ]
    });

    const handleNewBulkChange = (e) => {
        const { name, value } = e.target;
        setNewBulkData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 0: return 'Pending';
            case 1: return 'In Progress';
            case 2: return 'Completed';
            default: return 'Unknown';
        }
    };

    const handleNewBulkSubmit = async () => {
        try {
            await addBulkMaterial(newBulkData);
            alert('New recycling bulk added successfully!');
            setShowNewBulkModal(false);
            setNewBulkData({
                name: '',
                type: '',
                quantity: '',
                description: '',
                status: 1,
                stepsCompletionStatus: {
                    collection: 1,
                    sorting: 0,
                    cleaning: 0,
                    processing: 0,
                    qualitycheck: 0,
                    packaging: 0
                }
            });
            const data = await fetchBulkMaterials();
            setRecycleMaterials(data);
        } catch (error) {
            console.error('Error adding bulk material:', error);
        }
    };

    const handleMaterialClick = (material) => {
        setSelectedMaterial(material);

        const stepsStatus = material.stepsCompletionStatus || {};
        const steps = [
            'collection',
            'sorting',
            'cleaning',
            'processing',
            'qualitycheck',
            'packaging'
        ];

        // Find index of last completed step
        let lastCompletedIndex = -1;
        steps.forEach((key, index) => {
            if (stepsStatus[key] === 2) {
                lastCompletedIndex = index;
            }
        });

        const newCurrentStep = lastCompletedIndex + 1;

        setRecyclingProcess({
            currentStep: newCurrentStep + 1, // for display (1-based)
            steps: steps.map((stepKey, index) => {
                let status;
                if (stepsStatus[stepKey] === 2) {
                    status = 'completed';
                } else if (index === newCurrentStep) {
                    status = 'in-progress';
                } else {
                    status = 'pending';
                }

                return {
                    id: index + 1,
                    name: stepKey.charAt(0).toUpperCase() + stepKey.slice(1).replace(/([A-Z])/g, ' $1'),
                    status,
                    description: '', // Optional: you can fetch or hardcode descriptions here
                    completedAt: status === 'completed' ? 'Previously Completed' : null,
                    notes: ''
                };
            })
        });

        setRecyclingTab('process-updates');
    };

    const handleProcessUpdate = async (stepId, newStatus) => {
        if (!selectedMaterial) return;

        const step = recyclingProcess.steps.find(s => s.id === stepId);
        const firestoreStatus = newStatus === 'completed' ? 2 : newStatus === 'in-progress' ? 1 : 0;

        const stepKey = step.name.toLowerCase().replace(/\s+/g, '');

        try {
            await updateStepStatus(selectedMaterial.id, stepKey, firestoreStatus);

            const updatedSteps = recyclingProcess.steps.map(s => {
                if (s.id === stepId) {
                    return {
                        ...s,
                        status: newStatus,
                        completedAt: newStatus === 'completed' ? new Date().toLocaleString() : null
                    };
                }
                return s;
            });

            let newCurrentStep = recyclingProcess.currentStep;
            if (newStatus === 'completed' && stepId === recyclingProcess.currentStep) {
                newCurrentStep = Math.min(stepId + 1, recyclingProcess.steps.length);
                if (newCurrentStep <= recyclingProcess.steps.length) {
                    const nextStepIndex = newCurrentStep - 1;
                    if (updatedSteps[nextStepIndex] && updatedSteps[nextStepIndex].status !== 'completed') {
                        updatedSteps[nextStepIndex].status = 'in-progress';
                    }
                }
            }

            // ✅ 4. If all steps are now completed → update bulk status
            const allCompleted = updatedSteps.every(s => s.status === 'completed');
            if (allCompleted) {
                await updateBulkStatus(selectedMaterial.id, 2);
                console.log("Bulk status updated to completed ✅");
            }

            // ✅ 5. Update local state
            setRecyclingProcess({
                currentStep: newCurrentStep,
                steps: updatedSteps
            });

            // ✅ 6. Update recycleMaterials state so overview reflects new status
            setRecycleMaterials(prev =>
                prev.map(mat => {
                    if (mat.id === selectedMaterial.id) {
                        return {
                            ...mat,
                            status: allCompleted ? 2 : mat.status,
                            stepsCompletionStatus: {
                                ...mat.stepsCompletionStatus,
                                [stepKey]: firestoreStatus
                            }
                        };
                    }
                    return mat;
                })
            );
        } catch (err) {
            console.error("Error updating step or bulk status:", err);
        }
    };

    useEffect(() => {
        const loadBulks = async () => {
            const data = await fetchBulkMaterials();
            setRecycleMaterials(data);
        };
        loadBulks();
    }, []);

    return (
        <div className="materials-section">
            {/* Tabs + Add Button */}
            <div className="section-header">
                <h2>Recycling Materials</h2>
                <div className="recycling-filters">
                    <select value={recyclingTab} onChange={(e) => setRecyclingTab(e.target.value)} className="view-select">
                        <option value="overview">Overview</option>
                        <option value="process-updates">Process Updates</option>
                    </select>
                    <button className="add-bulk-btn" onClick={() => setShowNewBulkModal(true)}>Add New Recycling Bulk</button>
                </div>
            </div>

            {/* Modal */}
            {showNewBulkModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Add New Recycling Bulk</h3>
                        <div className="form-group">
                            <label>Material Name</label>
                            <input type="text" name="name" value={newBulkData.name} onChange={handleNewBulkChange} required />
                        </div>
                        <div className="form-group">
                            <label>Material Type</label>
                            <select name="type" value={newBulkData.type} onChange={handleNewBulkChange} required>
                                <option value="">Select Type</option>
                                <option value="Plastic">Plastic</option>
                                <option value="Paper">Paper</option>
                                <option value="Glass">Glass</option>
                                <option value="Metal">Metal</option>
                                <option value="Electronics">Electronics</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Quantity (kg)</label>
                            <input type="number" name="quantity" value={newBulkData.quantity} onChange={handleNewBulkChange} required />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea name="description" value={newBulkData.description} onChange={handleNewBulkChange} required />
                        </div>
                        <div className="modal-actions">
                            <button className="btn-primary" onClick={handleNewBulkSubmit}>Add Bulk</button>
                            <button className="btn-secondary" onClick={() => setShowNewBulkModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Overview */}
            {recyclingTab === 'overview' && (
                <div className="materials-list">
                    {recycleMaterials.map(material => (
                        <div key={material.id} className={`material-card ${selectedMaterial?.id === material.id ? 'selected' : ''}`} onClick={() => handleMaterialClick(material)}>
                            <div className="material-header">
                                <h3>{material.name}</h3>
                                <span className={`status-badge ${getStatusLabel(material.status)}`}>{getStatusLabel(material.status)}</span>
                            </div>
                            <div className="material-details">
                                <div className="detail-item"><span>Type:</span> {material.type}</div>
                                <div className="detail-item"><span>Quantity:</span> {material.quantity} kg</div>
                                <div className="detail-item"><span>Last Updated:</span> {material.lastUpdated || 'N/A'}</div>
                            </div>
                            <p className="material-description">{material.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Process Updates */}
            {recyclingTab === 'process-updates' && selectedMaterial && (
                <div className="recycling-process-section">
                    <div className="section-header">
                        <h2>Recycling Process - {selectedMaterial.name}</h2>
                        <p>{selectedMaterial.type} • {selectedMaterial.quantity} kg</p>
                    </div>

                    <div className="process-progress">
                        <div className="progress-bar" style={{ width: `${(recyclingProcess.currentStep / recyclingProcess.steps.length) * 100}%` }} />
                        <span>Step {recyclingProcess.currentStep} of {recyclingProcess.steps.length}</span>
                    </div>

                    <div className="process-steps">
                        {recyclingProcess.steps.map(step => (
                            <div key={step.id} className={`process-step ${step.status}`}>
                                <div className="step-header">
                                    <h3>{step.name}</h3>
                                    <span className={`status-badge ${step.status}`}>{step.status}</span>
                                    {step.id === recyclingProcess.currentStep && step.status !== 'completed' && (
                                        <button className="btn-action" onClick={() => handleProcessUpdate(step.id, 'completed')}>Complete Step</button>
                                    )}
                                </div>
                                <p>{step.description}</p>
                                {step.notes && <p><strong>Notes:</strong> {step.notes}</p>}
                                {step.completedAt && <p><strong>Completed At:</strong> {step.completedAt}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Material;
