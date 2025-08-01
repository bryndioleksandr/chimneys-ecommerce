export const isAdmin = (user) => user?.role === 'admin';
export const isUser = (user) => user?.role === 'user';
export const isGuest = (user) => !user;
