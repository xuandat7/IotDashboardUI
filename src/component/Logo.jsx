import React from 'react'
import './Logo.css'

function Logo() {
    // whenever the user clicks on the sidebar toggle button, the body will be added and removed the 'sidebar-toggled' class
    const handleToggleSidebar = () => {
        document.body.classList.toggle('toggle-sidebar')
    }
    return (
        <div className='d-flex align-items-center justify-content-between'>
        <a href='/' className='logo d-flex align-items-center text-decoration-none'>
            <span className='d-none d-lg-block'>IoT Dashboard</span>
        </a>
        <i
            className='bi bi-list toggle-sidebar-btn'
            onClick={handleToggleSidebar}
        ></i>
        </div>
    )
}

export default Logo