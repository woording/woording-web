<style lang="sass" scoped>


#list-list {
	display: flex;
	flex-direction: column;
	@media (min-width: 768px) {
		min-width: 10rem;
	}

	#lists {
		background-color: #4CAF50;
		color: #FFFFFF;
		padding-top: .5rem;
		min-height: 0;
		flex: 1;

		a {
			text-decoration: none;
			color: #FFFFFF;
			&:visited {
				color: #FFFFFF;
			}
		}

		li {
			padding-left: .5rem;
			padding-top: .25rem;
			padding-bottom: .25rem;
			transition: 0.1s;

		}
		.list-link:hover {
			background-color: #FFFFFF;
			color: #212121;
		}

		@media (min-width: 768px) {
			min-height: 0;
			overflow: auto;
		}

		h2 {
			font-weight: bold;
		}

	}
	#add-list-button {
		background-color: #388E3C;
		color: white;

		text-align: center;
		font-size: 2rem;
		cursor: pointer;
	}

    #undoButton {
		background-color: grey;
		color: white;

		text-align: center;
		font-size: 1rem;
        height: 32px;
        font-weight: bold;
		cursor: pointer;
        border: none;
    }
}

.v-link-active li {
	background-color: #FFFFFF;
	color: #212121;
}

</style>

<template>
	<div id="list-list">
		<div id="lists">
			<ul>
				<li>{{ $route.params.username + "'s lists" | uppercase }}</li>
				<a v-for='list in lists' v-link='{ path: "/" + $route.params.username + "/" + list.listname }'><li class="list-link">{{ list.listname }}</li></a>
			</ul>
		</div>
		<button v-on:click="undoDelete" v-if="undoButton" v-link='{ path: "/cor" }' id='undoButton'>UNDO</button>
		<div v-link='{ path: "/" + $route.params.username + "/add" }' id="add-list-button">
			<p>+</p>
		</div>
	</div>
</template>

<script>

import store from '../../store'

export default {

	data: function () {
		var username = this.$parent.$route.params.username
		this.fetchLists(username)
		return {
			lists: [],
			undoButton: false
		}
	},

	events: {
		'url-update': function(){
			var username = this.$parent.$route.params.username
			this.fetchLists(username)
			if (store.deletedList){
                this.undoButton = true
			}
		}
	},

	methods: {
		addList: function() {
			// Create empty list with a few standard settings and empty rows
			var list = {
				listname: '',
				language_1_tag: 'dut',
				language_2_tag: 'eng',
				shared_with: '1',
				words: [
					{language_1_text: '', language_2_text: ''},
					{language_1_text: '', language_2_text: ''},
					{language_1_text: '', language_2_text: ''},
					{language_1_text: '', language_2_text: ''},
					{language_1_text: '', language_2_text: ''},
					{language_1_text: '', language_2_text: ''},
					{language_1_text: '', language_2_text: ''},
					{language_1_text: '', language_2_text: ''}
				]
			}
		},

		fetchLists : function(username) {

			var updateLists = lists => { this.lists = lists }

			store.fetchUser(username).then(user => {
                if(!user.lists.length){
                    console.log('no lists')
                }
				updateLists(user.lists)
            }).catch(error => {
            })

		},
        
		undoDelete: function(){
			if (store.deletedList){
				// Call savelist on saved data from last delete
				store.saveList(store.username, store.deletedList).then((response) => {
					this.$parent.$route.router.go({ path: store.username + "/" + store.deletedList.listname })
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
