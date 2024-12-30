import { useEffect, useState } from "react";
import axios from "axios";

function useTenantListData(){
    const [users, setUsers] = useState([]);
    
    useEffect(()=>{
        axios.get(`http://localhost:8000/api/v1/tenant/get-tenants`)
        .then((response)=>setUsers(response.data.data))
        .catch((err)=>console.log(err))
    }, [])
    return {users, setUsers};
}

export default useTenantListData;