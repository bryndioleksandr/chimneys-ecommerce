import React from 'react';
import { useSelector } from 'react-redux';
import { isAdmin, isUser, isGuest } from '../../utils/roleCheck';

const RoleGuard = ({ role, children }) => {
    const user = useSelector((state) => state.user.user);

    const hasAccess =
        (role === 'admin' && isAdmin(user)) ||
        (role === 'user' && isUser(user)) ||
        (role === 'guest' && isGuest(user));

    return hasAccess ? <>{children}</> : null;
};

export default RoleGuard;
