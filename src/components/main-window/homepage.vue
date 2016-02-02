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
			font-size: 16px;
			padding: .2rem;
        }

        input[type=checkbox]{
            width: 20px;
        }

        button {
            margin: 20px 0 20px 0;
            width: 100%;
        }

        .form {
			h2 {
				font-size: 1.2rem;
				margin-bottom: .5rem;
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
            <h2>Log in</h2>
            <form v-on:submit.prevent>
                <input type="text" placeholder="Username" v-model='username'><br>
				<input type="password" placeholder="Password" v-model='password'><br>
				<div v-show="registerMode">
					<input type="password" placeholder="Repeat Password" v-model='repeated'><br>
					<input type="text" placeholder="Email" v-model='email'><br>
				</div>

                <br>
                <input type="checkbox" v-model="keepLoggedIn" v-show="!registerMode"> Remember me?
				<div v-show="!registerMode">
					<button v-on:click="logIn">Log In</button> <span id="error">{{ error }}</span>
				</div>
				<div v-show="registerMode">
					<button v-on:click="logIn">Register</button> <span id="error">{{ error }}</span>
				</div>

                <div id="recaptcha"></div>

				<div v-show="!registerMode">
					New here? <a v-on:click='toggleRegisterMode' href="" v-on:click.prevent>register</a>
				</div>
				<div v-show="registerMode">
					Already have an account? <a v-on:click='toggleRegisterMode' href="" v-on:click.prevent>Log in</a>
				</div>
            </form>
            {{ keepLoggedIn }}
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
			registerMode: false,
            keepLoggedIn: false,
            captchaId: ''
        }
    },

    route: {
        data () {
            window.onload = function() {
                /*this.captchaId = grecaptcha.render("recaptcha", { sitekey:'6Lcm2hUTAAAAADRIHnMpS4wRMUd4bp_H-1JmvDd0' })*/
            }
        }
    },

    events: {
        'url-update': function(){
            if(store.username) this.$parent.$route.router.go({ path: "/" + store.username })
            /*grecaptcha.reset(this.captchaId)*/
            /*this.captchaId = grecaptcha.render("recaptcha", { sitekey:'6Lcm2hUTAAAAADRIHnMpS4wRMUd4bp_H-1JmvDd0' })*/
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
                this.error = ''
                document.cookie = "username = " + this.username + "; expires=Thu, 18 Dec 2037 12:00:00 UTC"

                console.log(this.getCookie("username"))
                this.$parent.$route.router.go({ path: "/" + this.username })
                document.cookie = "attempts = 0"
            }).catch((error) => {
                console.log(error)
                store.username = ''
                store.password = ''
                this.error = 'Username or password incorrect'
                document.cookie = "attempts = " + (parseInt(this.getCookie('attempts')) + 1)
                if (this.getCookie('attempts') == 3) this.captchaId = grecaptcha.render("recaptcha", { sitekey:'6Lcm2hUTAAAAADRIHnMpS4wRMUd4bp_H-1JmvDd0' })
            })
        }
    }
}
</script>
