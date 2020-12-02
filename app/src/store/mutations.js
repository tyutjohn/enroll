const mutations={
    userStatus(state,user){
        if(user){
            state.currentUser=user
            state.isLogin=true
        }else if(user==null){
            sessionStorage.setItem('userName',null)
            sessionStorage.setItem('userToken','')
            state.currentUser=null
            state.isLogin=false
            state.token=''
        }
    },
    usernameStatus(state,username){
        state.username=username
    },
    newIsSuccessConnect(state,value){
        state.isSuccessConnect=value
    }
}

export default mutations