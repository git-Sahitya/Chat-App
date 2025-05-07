import {create} from "zustand"
import {axiosInstance} from "../lib/axios.js"
import toast from "react-hot-toast";


export const useAuthStore = create((set)=>({
   authUser:null,
   isSigningUp:false,
   isLoggingIn:false,
   isUpdatingProfile:false,
   isCheckingAuth:true,

   checkAuth : async () => {
    try {
        const res = await axiosInstance.get("/auth/check")
        
        set({authUser:res.data})
    } catch (error) {
        set({authUser:null})
        
    }finally{
        set({isCheckingAuth:false})
    }
   },

   signup: async (data) => {
    set({isSigningUp:true})
     try {
        const res = await axiosInstance.post("/auth/signup",data)
        set({authUser : res.data})
        localStorage.setItem("jwt", res.data.token);
        toast.success("Account created successfully")
        
     } catch (error) {
        toast.error(error.response.data.message)
     }finally{
        set({isSigningUp:false})
     }
   },

   login: async (data) => {
    set({isLoggingIn:true})
    try {
        const res = await axiosInstance.post("/auth/login",data)
        set({authUser:res.data})
        localStorage.setItem("jwt", res.data.token);
        toast.success("Logged is successfully!")
    } catch (error) {
        toast.error(error.response.data.message)

    }finally{
        set({isLoggingIn:false})
    }
   },

   logout : async () => {
    try {
        await axiosInstance.post("/auth/logout")
        localStorage.removeItem("jwt");
        set({authUser:null})
        toast.success("Logged out successfully")
    } catch (error) {
        toast.error(error.response.data.message)
    }
   }
}))