<style lang="sass">
/* Colors */
    $primary-color-dark:   #388E3C;
    $primary-color:        #4CAF50;
    $primary-color-light:  #C8E6C9;
    $primary-color-text:   #FFFFFF;
    $accent-color:         #FF9800;
    $primary-text-color:   #212121;
    $secondary-text-color: #727272;
    $divider-color:        #B6B6B6;

    html {
        box-sizing: border-box;
    }

    *, *:before, *:after {
        box-sizing: inherit;
    }

    body {

        color: #212121;
        font-family: 'Roboto';
    }

    #app {
        display: flex;
        flex-direction: column;

        min-height: 100vh;
        @media (min-width: 768px) {
            height: 100vh;
        }
    }
</style>

<template>

<div id="app">

    <!-- usage of the urlParameters computed property to make the url-update event hack work !-->
    <div id='{{ urlParameters }}'></div>

    <site-header></site-header>


    <site-body>

        <user-list v-if="username"></user-list>
        <list-list v-if="username"></list-list>

        <!-- main window --!>
        <router-view></router-view>

    </site-body>
    <site-footer></site-footer>
</div>

</template>


<script>
import store from './store'

// Site structure
import SiteHeader from './components/site-structure/header.vue'
import SiteBody from './components/site-structure/body.vue'
import SiteFooter from './components/site-structure/footer.vue'

// Side Bar
import ListList from './components/side-bar/list-list.vue'
import UserList from './components/side-bar/user-list.vue'



export default {
    data () {
        return {
            username: ''
        }
    },

    components: {
        SiteHeader,
        SiteBody,
        SiteFooter,

        UserList,
        ListList
    },

    computed: {
        // Since list-list isn't routed we still need this to update list-list :(
        urlParameters: function() {
            var username = this.$route.params.username

            this.username = username || ''

            var temp = this.$route.params
            this.$broadcast('url-update')
            return temp
        }
    },
}

</script>
