const getters={
    currentUser(state){
        return state.currentUser
    },
    isLogin(state){
        return state.isLogin
    },
    getUsername(state){
        return state.username
    },
    getIsSuccessConnect:state=>{
        return state.isSuccessConnect
    }
}

export default getters