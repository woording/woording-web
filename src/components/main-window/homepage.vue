<style lang="sass">
#homepage {
    background: url('/img/hipsterbg.jpeg');
    background-size: cover;
        display: flex;
        align-items: center;
        justify-content: center;
    flex: 1;
    @media(min-width: 768px) {
        overflow: auto;
    }

    h1 {
        font-size: 30px;
    }

    #forms {
        width: 300px;
        margin: 10px;

        label {
            display: block;
            width: 50px;
            margin: 0;
        }

        form {
            margin-top: 20px 0 20px 0;
        }

        input {
            width: 100%;
        }

        button {
            margin: 20px 0 20px 0;
            width: 100%;
        }

        .form {
            flex: 1;
            background: white;
            padding: 20px;
			border-radius: .5rem;
			box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);


            #error {
                color: red;
            }
        }

        #register {
            display: none;
        }
    }
}
</style>
<template>
<div id="homepage">
    <!--<h1>Welcome to Woording!</h1>-->
    <div id="forms">
        <div id="login" class='form'>
            <span> Log in:</span>
            <form v-on:submit.prevent>
                <label>Username: </label>
                <input type="text" v-model='username'><br>
                <label>Password: </label>
                <input type="password" v-model='password'><br>
                <button v-on:click="logIn">Log In</button> <span id="error">{{ error }}</span>
                Or <a v-on:click='formToggle' href="" v-on:click.prevent>register</a>
            </form>
        </div>

        <div id='register' class='form'>
            <span>Register: </span>
            <form v-on:submit.prevent>
                <label>Username: </label>
                <input type="text" v-model='username'><br>
                <label>Password: </label>
                <input type="password" v-model='password'><br>
                <label>Repeat password:</label>
                <input type="password" v-model='repeated'><br>
                <label>E-mail:</label>
                <input type="text" v-model='email'><br>
                <button v-on:click="logIn">Register</button> <span id="error">{{ error }}</span>
                Or <a v-on:click='formToggle' href="" v-on:click.prevent>Log in</a>
            </form>
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
            error: '',
            form: 1,
        }
    },

    events: {
        'url-update': function(){
            if(store.username) this.$parent.$route.router.go({ path: "/" + store.username })
        }
    },

    methods: {
        formToggle: function(){
            if(this.form){
                document.getElementById('register').style.display = 'block'
                document.getElementById('login').style.display = 'none'
                this.form = 0
            } else {
                document.getElementById('register').style.display = 'none'
                document.getElementById('login').style.display = 'block'
                this.form = 1
            }
        },

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
