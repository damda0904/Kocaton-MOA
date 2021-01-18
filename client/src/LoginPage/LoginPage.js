import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../_actions/user_actions'

function LoginPage(props) {
    //디스패치 함수 가져오기
    const dispatch = useDispatch();

    //state 설정
    const [email, setEmail] = useState("")
    const [Password, setPassword] = useState("")

    //onChange 처리
    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }

    //onSubmit 처리
    const onSubmitHandler = (event) => {
        event.preventDefault();

        console.log('Id', email)
        console.log('Password', Password)

        //서버로 전달할 state값을 모은 객체
        let body = {
            email: email,
            password: Password,
        }

        //디스패치
        dispatch(loginUser(body))
            .then(response => {
                if (response.payload.loginSuccess) {
                    //submit시 홈페이지로 이동
                    window.localStorage.setItem('userId', response.payload.userId);
                    props.history.push('/')
                }
                else {
                    alert('Error')
                }
            })
    }

    return (
        <div>
            <div style={{
                display: "flex", justifyContent: 'center', alignItems: 'center',
                width: '100%', height: '100vh'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h1 className="mainText">Welcome!</h1>
                    <lable>아이디</lable>
                    <Input value={email} onChange={onEmailHandler} />
                    <lable>비밀번호</lable>
                    <Input type="password" value={Password} onChange={onPasswordHandler} onPressEnter={onSubmitHandler} />
                    <br />
                    <Button>
                            <Link to="/register">회원가입</Link>
                    </Button>
                    <Button type="primary" onClick={onSubmitHandler}>Login</Button>
                </div>

            </div>
        </div>
    )
}

export default LoginPage;