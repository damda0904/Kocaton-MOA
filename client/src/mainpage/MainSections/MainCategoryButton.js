import React, { useState, useRef } from "react";
import './MainCategoryButton.css';
import '../Mainpage.css';


const MainCategoryButton=()=>{

    var category=["전시","공연","학술","이벤트"];
    var now="전시";
    var count=10;
    const [nowtext, setNowtext] = useState(now); 
    
    const changeText = (text) => setNowtext(text);
    
    
    return(
        
        <>
        <link rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
        crossOrigin="anonymous"/>

        {/* 버튼 */}
        <span style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>

        <span className="category" >
            <button className="categorybutton1" onClick={() => changeText(category[0])}  ><img src="./display.png"/>전시</button>
            <div className="verticalLine"></div>
            <button className="categorybutton2" onClick={() => changeText(category[1])} ><img src="./stage.png"/>공연</button>
            <div className="verticalLine"></div>
            <button className="categorybutton3" onClick={() => changeText(category[2])} ><img src="./haksul.png"/>학술</button>
            <div className="verticalLine"></div>
            <button className="categorybutton4" onClick={() => changeText(category[3])} ><img src="./event.png"/>이벤트</button>
            {/* onMouseEnter={() => setIsShown2(!hovered2)} onMouseLeave={() => setIsShown2(false)} */}
        </span>
        
        
        </span>

        
        </>
    )
    
}

export default MainCategoryButton;