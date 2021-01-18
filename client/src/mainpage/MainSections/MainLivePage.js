import React, { useEffect, useState } from 'react';
import * as AiIcons from "react-icons/ai";
import * as BiIcons from "react-icons/bi";
import Axios from 'axios';
import '../Mainpage.css';


function MainLivePage(){
    const [liveVideo, setLiveVideo] = useState([]);

    

    useEffect(() => {
        Axios.get('/api/liveVideo/getliveVidoes')
        .then(res => {
            if (res.data.success) {
                console.log(res.data);
                setLiveVideo(res.data.liveVideo)
            } else {
                alert("라이브 비디오 가져오기를 실패했습니다.")
            }
        })
    }, [])

    let liveRenderCards = [];
    if (liveVideo !== 0) {
        liveRenderCards = liveVideo.map((video, index) => {
            return (
                // <li style={{listStyleType:"none",display:"flex",float:"left"}} >
                <div key={index} style={{marginRight:"30px"}}>
                <a href={`/liveVideo/${video._id}`}>
                    <img src={`http://localhost:5000/${video.thumbnail}`} width="340px" height="220px" />
                </a>
                <p className="livevideobigcap" width="340px" fontSize="1rem">{video.title}</p>
                <p className="livevideosmallcap">{video.writer.name}</p>
                <hr width="330px" style={{marginTop:'15px', paddingLeft:'18px'}}/>
                </div>
                // </li> 
            ) 
        })
    }
    let length=liveRenderCards.length;
    
    var bigwidth=348*length;
    console.log(bigwidth);
    let gep=30*(length);
    bigwidth=bigwidth+gep;

    
    let smallwidth=2268;

    const [paddings,setStyle]=useState(0);
    var divstyle={width: bigwidth, display:'flex',justifyContent:"center",float:"left",paddingRight:paddings};
    const movel =() =>{
        let left=length%3;
        
        if(paddings<bigwidth-left*378*2) setStyle(paddings+2268);
        if(paddings==bigwidth-left*378*2)setStyle(paddings+left*378*2);
        console.log(paddings);
        console.log(length);
        
    }
    const mover=()=>{
        let left=length%3;
        
        if(paddings>0) setStyle(paddings-2268);
        if(paddings==0)setStyle(paddings-left*378*2);
        console.log(paddings);
        console.log(length);
    }


    return (
        <div className='mainpage_below' style={{textAlign:'center', backgroundSize:'cover'}} height="100vh">
            
            <p className="streamlive">실시간 방송 LIVE</p>
            <p className="meetinlive">전국의 대학생 활동을 라이브 방송으로 만나보세요</p>
            <AiIcons.AiOutlineLeftSquare size="40" color="#C692B8"  className="livevideoleft" onClick={movel}/>
            <AiIcons.AiFillRightSquare size="40" color="#C692B8" className="livevideoright" onClick={mover}/>
            
            <span id="#livevideo" className="livevideo" style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                {/* <div style={{display: 'flex', justifyContent: 'space-between'}}> */}
                {/* <AliceCarousel dotsDisabled={true} buttonsDisabled={true} ref={ el =>this.Carousel = el }>
                {liveRenderCards}
                </AliceCarousel> */}
                <div style={{width:"1104px",overflow:'hidden'}}>
                    <div style={divstyle}>
                    {liveRenderCards}
                    </div>
                </div>
                
                
                {/* <div className="slide_wrapper" style={{position:'relative',margin:'0 auto',height:'300px',width:'1110',overflow:'hidden'}}>
                <ul className="slides" style={{listStyle:'none',whiteSpace:'nowrap',position:"absolute",left:"0",top:"0", width:`${bigwidth}`}}>
                {liveRenderCards}
                </ul> 
                
            </div>*/}
            </span>
        </div>
    )
}


export default MainLivePage;