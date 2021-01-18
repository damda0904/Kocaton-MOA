import React, { useState } from 'react';
import { Input, Button } from 'antd';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { registerUser } from '../_actions/user_actions';

function RegisterPage(props) {
    //디스패치 함수 가져오기
    const dispatch = useDispatch();

    //state 설정
    const [email, setEmail] = useState("")
    const [Name, setName] = useState("")
    const [Password, setPassword] = useState("")
    const [ConfirmPassword, setConfirmPassword] = useState("")

    //onChange 처리
    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }
    const onNameHandler = (event) => {
        setName(event.currentTarget.value)
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }

    const onConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.currentTarget.value)
    }

    //onSubmit 처리(서버전달)
    const onSubmitHandler = (event) => {
        event.preventDefault();

        if (Password !== ConfirmPassword) {
            return alert("비밀번호와 비밀번호 확인은 같아야 합니다.")
        }

        //서버로 전달할 state값을 모은 객체
        let body = {
            email: email,
            password: Password,
            name: Name,
            nickName: Name,
            image: "http://gravatar.com/avatar/${moment().unix()}?d=identicon",
            content: "",
        }

        //디스패치
        dispatch(registerUser(body))
            .then(response => {
                if (response.payload.success) {
                    //submit시 로그인 페이지로 이동
                    props.history.push('/login')
                }
                else {
                    alert('Error')
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    return (
        <div style={{
            display: "flex", justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
        }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <img style={{ width: "250px", margin: "20px 0" }} src="" />
                <p style={{ color: "grey", margin: "0 0 70px 0" }}>
                    모아에서 더 많은 활동을 감상하세요!
                </p>

                <label>이메일</label>
                <Input value={email} placeholder="이메일" onChange={onEmailHandler} />

                <label>이름</label>
                <Input type="text" value={Name} placeholder="이름" onChange={onNameHandler} />

                <label>비밀번호</label>
                <Input type="password" value={Password} placeholder="비밀번호" onChange={onPasswordHandler} />

                <label>비밀번호 확인</label>
                <Input type="password" value={ConfirmPassword} placeholder="비밀번호 확인" onChange={onConfirmPasswordHandler} />

                <br />

                <Button type="primary" onClick={onSubmitHandler}>가입하기</Button>
            </div>
        </div>
    )
}

export default RegisterPage;