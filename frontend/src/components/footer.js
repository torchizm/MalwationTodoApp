import React from 'react';
import { Link } from 'react-router-dom';

function Footer(props) {
    const date = new Date().getFullYear();

    return (
        <footer className='footer'>
            <a style={{ color: 'var(--main-purple-hover)' }} href="https://malwation.com">
                <span>Malwation</span>
            </a>
            <span>Copyright {date}</span>
        </footer>
    );
}

export default Footer;