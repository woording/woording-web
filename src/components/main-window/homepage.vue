<style lang="sass">
#homepage {
    flex: 1;
    @media(min-width: 768px) {
        overflow: auto;
    }

    #forms {
        display: flex;

        label {
            display: block;
            width: 50px;
            margin: 0;
        }

        #login {
            flex: 1;
            width: 100%;

            #error {
                color: red;
            }
        }

        #register {
            flex: 1;
            width: 100%;
        }
    }
}
</style>
<template>
<div id="homepage">
    <h1>Welcome to Woording!</h1>
    <div id="forms">
        <div id="login">
            <form v-on:submit.prevent>
                <label>Username: </label>
                <input type="text" v-model='username'><br>
                <label>Password: </label>
                <input type="password" v-model='password'><br>
                <button v-on:click="logIn">Log In</button> <span id="error">{{ error }}</span>
            </form>
        </div>

        <div id="register">
            <label>Username: </label>
            <input type="text" v-model='username'><br>
            <label>E-mail: </label>
            <input type="text" v-model='email'><br>
            <label>Password: </label>
            <input type="password" v-model='password'><br>
            <label>Repeat password: </label>
            <input type="password" v-model='repeated'><br>
            <button>Register</button>
        </div>
    </div>
</div>
</template>

<script>

import store from "../../store";

export default {
    data: function() {
        return {
            username: '',
            password: '',
            repeated: '',
            email: '',
            error: ''
        }
    },

    events: {
        'url-update': function(){
            if(store.username) this.$parent.$route.router.go({ path: "/" + store.username })
        }  
    },

    methods: {
        logIn: function(){
            if (!this.username || !this.password){
                this.error = 'Username and password cannot be empty'
                return
            }

            store.username = this.username
            store.password = this.password
            store.fetchToken().then((response) => {
                this.error = ''
                this.$parent.$route.router.go({ path: "/" + this.username })
            }).catch((error) => {
                console.log(error)
                store.username = ''
                store.password = ''
                this.error = 'Username or password incorrect'
            })
        }
    }
}
</script>
