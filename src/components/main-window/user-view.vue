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
    width:100%;
	.message {
		flex: 1;
		p {
			text-align: center;
			flex: 1;
		}
	}
}

#undoThing {
	display: flex;
	align-items: flex-end;
    font-size: 1.1em;
    width:100%;
    flex: 1;

    div {
        flex: 1;
    }

    p {
        flex: 1;
        text-align: center;
    }

    i {
        font-weight: 500;
    }

    a {
        color: green;
    }
}
</style>

<template>
<div id="translation-list">
		<div class="message-container">
			<div class="message">
				<p>Select a list on the left to open it.</p>
			</div>
		</div>

        <div v-if="undoThing" id="undoThing">
            <div>
            <p>
                Deleted list <i>{{deletedList}}</i>, <a v-on:click.prevent="undoDelete" href="/">undo</a>?
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
					this.$parent.$route.router.go({ path: store.username + "/" + response.listname })
                    console.log(response.listname)
					store.deletedList = null
					this.undoButton = false
                    console.log(response)
				})
			} else {
				console.log('Welp, we messed up')
			}
        }
	}
}
</script>
