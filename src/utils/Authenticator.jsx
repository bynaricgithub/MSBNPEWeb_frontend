/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux";
// import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
// import { logout } from '../Store/AllReducers/userSlice';
import Error404 from '../component/Error404';
import Content from '../layout/Content';
import { whoAmI } from './Helper';


const Authenticator = () => {

    const { myUser } = useSelector((state) => state.currentUser);
    const [loading, setLoading] = useState(true);


    const dispatch = useDispatch()
    // const navigate = useNavigate()

    useEffect(() => {
        whoAmI(dispatch, setLoading)
    }, [])

    if (loading) {
        return <>
            <div className='pt-5'>
                <div className='admin-loader-container'>
                    <div className="admin-loader"></div>
                </div>
            </div>
        </>
    }

    if (!myUser) {
        return <>
            <Error404 />
        </>
    }

    return (
        <div>
            <Content />
        </div>
    )
}

export default Authenticator