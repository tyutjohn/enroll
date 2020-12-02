const actions={
    setUser({commit},user){
        commit("userStatus",user)
    },
    setAdmin({commit},username){
        commit("usernameStatus",username)
    }
}

export default actions