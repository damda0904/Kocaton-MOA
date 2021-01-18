import React from 'react';
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as BiIcons from "react-icons/bi";
import * as GiIcons from "react-icons/gi";
import * as RiIcons from "react-icons/ri";
import * as FiIcons from "react-icons/fi";


export const SidebarData=[
    {
        title:'Home',
        path:'/',
        icon:<AiIcons.AiFillHome style={{color:"#F3868D",fontSize:"40",paddingBottom:"10px"}}/>,
        cName:'nav-text'
    },
    {
        title:'업로드',
        path:"/upload",
        icon:<FiIcons.FiUpload style={{color:"#F3868D",fontSize:"40",paddingBottom:"10px"}}/>,
        cName:"nav-text"
    },
    {
        title:'라이브 시작',
        path:'/broadcastform',
        icon:<RiIcons.RiLiveFill style={{color:"#F3868D",fontSize:"40",paddingBottom:"10px"}}/>,
        cName:'nav-text'
    },
    {
        title:'부스편집',
        path:'/',
        icon:<BiIcons.BiEdit style={{color:"#F3868D",fontSize:"40",paddingBottom:"10px"}}/>,
        cName:'nav-text'
    }
]