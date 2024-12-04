import React, { useContext } from 'react';
import { UserContext } from '../App';
import Layout from './layout';
import SingInPage from './signinPage';

function Home(props) {
    const {user} = useContext(UserContext)
    return (
        <div className='h-full w-full'>
          {
            user?
            <Layout />
            :<SingInPage/>
          }
        </div>
    );
}

export default Home;