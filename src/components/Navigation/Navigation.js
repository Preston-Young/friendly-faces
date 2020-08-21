import React from 'react';


const Navigation = ({isSignedIn, onRouteChange }) => {
    if (isSignedIn) {
        return(
            <nav style={{ display:'flex', justifyContent:'flex-end' }}>
                <p 
                onClick={() => onRouteChange('signin')}
                className="f3 link pa3 dim black underline pointer">
                    Sign out
                </p>
            </nav>
        );
    } else {
        return(
            <nav style={{ display:'flex', justifyContent:'flex-end' }}>
                <p 
                onClick={() => onRouteChange('register')}
                className="f3 link pa3 dim black underline pointer">
                    Register
                </p>
                <p 
                onClick={() => onRouteChange('signin')}
                className="f3 link pa3 dim black underline pointer">
                    Sign In
                </p>
            </nav>
        );
    }
}

export default Navigation;