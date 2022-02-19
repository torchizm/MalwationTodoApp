import React, { useContext } from 'react';
import { FaUser } from 'react-icons/fa';
import { FiKey, FiLogOut } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { ToggleSlider } from 'react-toggle-slider';
import { logout } from '../helpers/useAuth';
import { userContext } from '../helpers/userContext';


class Header extends React.Component {
    constructor(props) {
        super(props);

        this.themeChanger = React.createRef();
        this.handleLogout = this.handleLogout.bind(this);
        this.toggleThemeHandler = this.toggleThemeHandler.bind(this);
    }
    
    componentDidMount() {
        const theme = localStorage.getItem('theme');
        this.props.setTheme(theme);
    }
    
    toggleThemeHandler = () => {
        const theme = localStorage.getItem('theme');
        const newTheme = theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        this.props.setTheme(newTheme);
    };

    handleLogout = () => {
        logout();
    }

    render() {
        return(
            <header className='header'>
                <Link to='/'>
                    <span className='logo'>Todo</span>
                </Link>

                <userContext.Consumer>
                {(value) => {
                    if (value.user.username === null || value.user.username === undefined) {
                        return(
                            // <Link to='/login'>
                            //     <button className='btn-primary'>Giriş Yap</button>
                            // </Link>

                            <div className='dropdown'>
                                <Link to='/login'>
                                    <button style={{ minWidth: '200px' }} className='btn-primary btn-center-child dropbtn'>Giriş Yap</button>
                                </Link>
                                <div className='dropdown-content'>
                                    <div style={{ display: 'hidden', height: '8px' }}></div>
                                    
                                    <div className='dropdown-item'>
                                        <p style={{ marginRight: '16px' }} className='text-clamp'>Gece Modu</p>
                                        <ToggleSlider style={{ marginRight: '1rem' }} draggable={false} onToggle={this.toggleThemeHandler} active={() => localStorage.getItem('theme') === 'dark'} barBackgroundColorActive={'rgb(239, 190, 250)'} />
                                        <div style={{ width: '1rem' }}></div>
                                    </div>
                                </div>
                            </div>
                        )
                    } else {
                        return(
                            <div className='dropdown'>
                                <Link to='/dashboard'>
                                    <button style={{ minWidth: '200px' }} className='btn-primary btn-center-child dropbtn'>{value.user.username} <FaUser/></button>
                                </Link>
                                <div className='dropdown-content'>
                                    <div style={{ display: 'hidden', height: '8px' }}></div>
                                    
                                    {value.user.admin === 'true' && 
                                        <Link className='dropdown-item' to='/admin/dashboard'>
                                            <button className='btn-primary btn-center-child'>Admin <FiKey/></button>
                                        </Link>
                                    }

                                    <button onClick={this.handleLogout} className='btn-primary btn-center-child dropdown-item' style={{ background: 'var(--main-red)' }}>Çıkış Yap <FiLogOut/></button>

                                    <div className='dropdown-item'>
                                        <p style={{ marginRight: '16px' }} className='text-clamp'>Gece Modu</p>
                                        <ToggleSlider style={{ marginRight: '1rem' }} draggable={false} onToggle={this.toggleThemeHandler} active={() => localStorage.getItem('theme') === 'dark'} barBackgroundColorActive={'rgb(239, 190, 250)'} />
                                        <div style={{ width: '1rem' }}></div>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                }}
                </userContext.Consumer>

            </header>
        );
    }
}

export default Header;