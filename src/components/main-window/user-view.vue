<style lang="sass">
$border-style: 0.125rem solid #B6B6B6;
#translation-list {
	color: #212121;
	display: flex;
	min-height: 0px;
}

/* the message that is shown when a user hasn't selected a list */
.message-container {
	display: flex;
	align-items: center;
	flex: 1;
    width: 100%;
	.message {
		flex: 1;
		p {
			text-align: center;
			flex: 1;

            i {
                font-weight: 500;
            }

            a {
                color: green;
            }
		}
	}
}

#undoThing {
    font-size: 1.1em;
    bottom: 40px;
    text-align: center;
    right: 0px;
    width: 100%;

    p {
        text-align: center;
    }


}
</style>

<template>
<div id="translation-list">
		<div class="message-container">
			<div class="message" v-if="!undoThing">
				<p>Select a list on the left to open it.</p>
			</div>
            <div class="message" v-if="undoThing">
                <p>
                    Deleted list <i>{{deletedList}}</i>, <a v-on:click.prevent="undoDelete" href="/" v-link='{ path: "/cor" }'>undo</a>?
                </p>
            </div>
		</div>
</div>
</template>

<script>
import store from '../../store'
import globals from '../../globals'

export default {
	data: function(){
		return {
            undoThing: false,
            deletedList: ''
		}
	},

	ready() {
		if (!globals.getCookie('logvalue') && store.username == "") {
			// No one logged in, redirect to homepage
			this.$route.router.go({ path: '/' })
            location.reload()
		}
	},

	route: {
		data () {
            if(store.deletedList){
                this.undoThing = true
                this.deletedList = store.deletedList.listname
            }
		}
	},

	methods: {
        undoDelete: function(){
			if (store.deletedList){
				// Call savelist on saved data from last delete
				store.saveList(store.username, store.deletedList).then((response) => {
					this.$parent.$route.router.go({ path: store.username + "/" + store.deletedList.listname })
					store.deletedList = null
					this.undoButton = false
				})
			} else {
				console.log('Welp, we messed up')
			}
        }
	}
}
</script>
