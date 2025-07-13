import React from 'react';
import './modal.css';

const ModalWrapper = ({ children, onClose }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    );
};

export default ModalWrapper;
