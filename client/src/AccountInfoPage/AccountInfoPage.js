import React, { useState } from 'react';
import NavBar from '../NavBar/Navbar';
import MyBoothCards from './MyBoothCards';

import Profile from './Profile';

function AccountInfoPage() {
    //로컬데이터 저장된 state
    //카드 내용
    const [Booths, setBooths] = useState([])
    //프로필 사진 소스
    const [Profile_src, setProfile_src] = useState("")
    //프로필 이름
    const [Profile_name, setProfile_name] = useState('')
    //프로필 아이디
    const [Profile_id, setProfile_id] = useState('')
    //프로필 자기소개
    const [Profile_contents, setProfile_contents] = useState("")

    // 프로필 변경
    const changeProfile = (_name, _contents) => {
        setProfile_name(_name)
        setProfile_contents(_contents)
    }

    return (
        <div>
            <article
                style={{
                    margin: '24px 16px',
                    padding: 24,
                    minHeight: 280,
                }}
            >
                <div style={{ margin: "10px 0 120px 0" }}>
                    <Profile></Profile>
                </div>
                <MyBoothCards></MyBoothCards>
            </article>
        </div>
    );

}

export default AccountInfoPage;