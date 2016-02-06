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
        font-size: 40px;
    }
	.toggleRegisterModeLink {
		text-align: left;
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
			font-size: 16px;
			padding: .4rem;
            margin: 2px;
            border-radius: 3px;
            border: 1px solid #aaa;
            background: #F4F4F4;
            color: black;

            &:focus {
                background: white;
                transition: background 0.2s;
                outline: none;
            }
        }
        
        a {
            color: #4CAF50;
        }
        
        input[type=checkbox]{
            width: 20px;
            cursor: pointer;
        }

        button {
            margin: 20px 0 20px 0;
            width: 100%;
            background: #4CAF50;
            border: none;
            padding: 10px;
            border-radius: 3px;
            color: white;
            font-weight: bold;
            cursor: pointer;
        }

        .form {
			h2 {
				font-size: 1.6rem;
				margin-bottom: .5rem;
                font-weight: 400;
			}
			#rememberMeToggle {
				margin-top: 0.4rem;

			}

            flex: 1;
            background: white;
            padding: 20px;
			border-radius: .5rem;
			box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

			transition: max-height 1s ease-out; /* broken */

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
            <h2 v-if="!registerMode">Log in</h2>
            <h2 v-if="registerMode">Register</h2>
            <form v-on:submit.prevent>
                <input type="text" placeholder="Username" v-model='username'><br>
				<input type="password" placeholder="Password" v-model='password'><br>
				<div v-show="registerMode">
					<input type="password" placeholder="Repeat Password" v-model='repeated'><br>
					<input type="text" placeholder="Email" v-model='email'><br>
				</div>

                <p id="rememberMeToggle" v-show="!registerMode"><input type="checkbox" v-model="keepLoggedIn" v-show="!registerMode">Remember me?</p>
				<div v-if="!registerMode">
					<button v-on:click="logIn">LOG IN</button> <span id="error">{{ error }}</span>
				</div>
				<div v-if="registerMode">
					<button v-on:click="register">REGISTER</button> <span id="error">{{ error }}</span>
				</div>

                <div id="recaptcha"></div>

            </form>
			<div v-show="!registerMode">
				<p class="toggleRegisterModeLink"> New here? <a v-on:click='toggleRegisterMode' href="" v-on:click.prevent>Register</a> </p>
			</div>
			<div v-show="registerMode">
				<p class="toggleRegisterModeLink"> Already have an account? <a v-on:click='toggleRegisterMode' href="" v-on:click.prevent>Log in</a> </p>
			</div>
        </div>

    </div>
</div>
</template>

<script>

import store from "../../store";
import globals from "../../globals";

export default {
    data: function() {
        return {
            username: '',
            password: '',
            repeated: '',
            email: '',
            error: '',
			registerMode: false,
            keepLoggedIn: false,
            captchaId: ''
        }
    },

    route: {
        data () {
            if(!this.getCookie('attempts')) document.cookie = 'attempts = 0'
        }
    },

    events: {
        'url-update': function(){
            if(store.username) this.$parent.$route.router.go({ path: "/" + store.username })
        }
    },

    methods: {
		toggleRegisterMode: function() {
			this.registerMode = !this.registerMode
		},

        getCookie: function(cookieName) {
            var name = cookieName + "=";
            var cookieAttributes = document.cookie.split(';');
            for(var i = 0; i < cookieAttributes.length; i++) {
                var cookie = cookieAttributes[i];
                while (cookie.charAt(0)==' ') cookie = cookie.substring(1);
                if (cookie.indexOf(name) == 0) return cookie.substring(name.length, cookie.length);
            }
            return "";
        },

        register: function(){
            let elements = [this.username, this.password, this.repeated, this.email]
            for(let i = 0, x = elements.length; i < x; i++){
                if(!elements[i]){
                    this.error = 'Do not leave fields empty'
                    return
                }
            }

            globals.validateInput(this.username).then(response => {
                console.log(response)
            }).catch(error => {
                this.error = 'Please only user letters, numbers and hyphen in the username'
                return
            })

            if (this.password != this.repeated){
                this.error = 'Password not the same'
                return
            }

            var regexMailCheck = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
            if(!regexMailCheck.test(this.email)){
                this.error = 'Not a valid email address'
                return
            }

            this.error = ''
            store.register(this.username, this.password, this.email).then(response => {
                console.log(response)
                if(response.succes){
                    alert('Validation email has been sent')
                } else {
                    this.error = response.response
                }
            })
        },

        logIn: function(){
            if (!this.username || !this.password){
                this.error = 'Username and password cannot be empty'
                return
            }

            if (this.getCookie('attempts') == 3){
                let recaptchaResponse = grecaptcha.getResponse(this.captchaId)
                if (!recaptchaResponse){
                    this.error = 'Please fill in captcha'
                    return
                }
                let secret = '6Lcm2hUTAAAAAKwVWXZkDxsDxsgdruju_5CKWjcG'
                let url = 'https://www.google.com/recaptcha/api/siteverify?secret=' + secret + '&response=' + recaptchaResponse
                console.log(url)

                store.validateCaptcha(url).then(response => {
                    if(!response){
                        console.log('Bitte')
                        return
                    }
                })
            }

            store.username = this.username
            store.password = this.password

            store.fetchToken().then((response) => {
                if(!response.success){
                    console.log(response)
                    throw new Error(response.error)
                }

                store.cachedToken = response.token
                this.error = ''
                document.cookie = "username = " + this.username + "; expires=Thu, 18 Dec 2037 12:00:00 UTC"

                console.log(this.getCookie("username"))
                this.$parent.$route.router.go({ path: "/" + this.username })
                document.cookie = "attempts = 0"
            }).catch((error) => {
                console.log(error.message)
                store.username = ''
                store.password = ''
                this.error = error.message
                /*document.cookie = "attempts = " + (parseInt(this.getCookie('attempts')) + 1)*/
                /*if (this.getCookie('attempts') == 3) this.captchaId = grecaptcha.render("recaptcha", { sitekey:'6Lcm2hUTAAAAADRIHnMpS4wRMUd4bp_H-1JmvDd0' })*/
            })
        }
    }
}
</script>
