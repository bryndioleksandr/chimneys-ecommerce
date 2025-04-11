import { useEffect } from "react";

const useOutsideClick = (ref, onClose, isActive = true) => {
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                onClose();
            }
        };

        if (isActive) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, onClose, isActive]);
};

export default useOutsideClick;
