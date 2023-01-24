import React, { useState } from 'react';
import { authService } from 'fbase';

const AuthForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newAccount, setNewAccount] = useState(true);

    const onChange = (event) => {
        //console.log(event.target.name);
        const {target: {name, value}} = event;
        if(name === 'email'){
            setEmail(value);
        } else if(name === 'password'){
            setPassword(value);
        }
    }

    const toggleAccount = () => setNewAccount((prev) => !prev);
    
    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            // let data;
            if (newAccount){
                // create Account
                await authService.createUserWithEmailAndPassword(
                    email, password
                );
            } else {
                // log in 
                await authService.signInwithEmailAndPassword(email, password);
            }
        } catch (error) {
            // console.log(error);
        }
    };
    
    return(
        <>
            <form onSubmit={onSubmit}>
                <input name='email' type='text' placeholder='Email' required value={email} onChange={onChange}/>
                <input name='password' type='password' placeholder='Password' required value={password} onChange={onChange}/>
            </form>
            <span onClick={toggleAccount}>{newAccount ? 'Log in.' : 'Create Account'}</span>
        </>
    )
}

export default AuthForm;