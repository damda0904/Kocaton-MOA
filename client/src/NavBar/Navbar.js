import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import {Link} from 'react-router-dom';
import { useSelector } from "react-redux";
import {SidebarData} from'./SidebarData';
import axios from 'axios';
import './Navbar.css';
import {IconContext} from 'react-icons';
import moalogo from '../mainpage/pictures/moa.png';
import { withRouter } from 'react-router-dom';

function Navbar(props){

    
    const user = useSelector(state => state.user);

    const [sidebar, setSidebar]=useState(false);
    const showSidebar=()=> setSidebar(!sidebar);

    const handleLogout = () => {
        axios.get('/api/user/logout')
            .then(res => {
                if (res.status === 200) {
                    props.history.push('/login');
                } else {
                    alert('로그아웃에 실패했습니다.')
                }
            })
    }

    return (
        <div style={{ position: 'fixed', zIndex: 5, width: '100%', display: 'flex', background: 'white'}}>
            <IconContext.Provider value ={{ color: '#fff' }}>
            <div className='navbar'>
                <Link to='#' className='menu-bars' style={{ paddingTop: '0', }}>
                    <FaIcons.FaBars onClick={showSidebar} color="#FFA625"/>
                </Link>
                <a href='/'><img className="logo" src={moalogo} alt="logo" /></a>
                {
                    (user.userData && !user.userData.isAuth) ?
                    <Link to='/login'><button  className="loginbutton" >login</button></Link> :
                    <button style={{marginLeft:'90%'}} className="loginbutton" onClick={handleLogout}>logout</button>
                }
            </div>
            <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
            <ul className='nav-menu-items' onClick={showSidebar}>
                <li className="navbar-toggle">
                    <Link to="#" className='menu-bars'>
                        <AiIcons.AiOutlineClose/>
                    </Link>
                </li>
                {SidebarData.map((item,index) =>{
                    return(
                        <li style={{height:"80px"}} key={index} className={item.cName}>
                            <Link to={item.path}>
                                {item.icon}
                                <span>{item.title}</span>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
        </IconContext.Provider>
        </div>
    )
}

export default withRouter(Navbar) 
