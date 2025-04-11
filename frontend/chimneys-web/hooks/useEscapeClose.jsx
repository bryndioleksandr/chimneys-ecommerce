import { useEffect } from "react";

const useEscapeKey = (onClose, isActive = true) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        if (isActive) {
            document.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose, isActive]);
};

export default useEscapeKey;
