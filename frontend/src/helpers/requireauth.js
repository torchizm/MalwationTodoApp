import { Navigate, useLocation } from "react-router-dom";

export const RequireAuth = ({ children }) => {
    let location = useLocation();

    const isAuth = (localStorage.getItem('jwt') || sessionStorage.getItem('jwt')) !== null;
    
    if (!isAuth) {
        return <Navigate to="/login" state={{ from: location }} />;
    }
    
    return children;
}

export const RequireAdmin = ({ children }) => {
    let location = useLocation();
    
    const isAuth = (localStorage.getItem('jwt') || sessionStorage.getItem('jwt')) !== null;
    const isAdmin = (localStorage.getItem('admin') || sessionStorage.getItem('admin')) === 'true';

    if (!isAuth) {
        return <Navigate to="/login" state={{ from: location }} />;
    }
    
    if (!isAdmin) {
        return <Navigate to="/dashboard" state={{ from: location }} />;
    }

    return children;
}
  