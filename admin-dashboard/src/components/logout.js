import React, { useContext } from 'react';
import axios from "axios"
import { UserContext } from '../../../client/src/App';
const {user, setUser} = useContext(UserContext);
export const handleLogout = async (e) => {
        e.preventDefault();
        let url = "http://localhost:3000/api/logout";
        const res = await axios.get(url);
        if (res.data.success) {
          localStorage.removeItem("SHADY_BUSINESS_ADMIN");
          setUser(null);
        }
      };
 