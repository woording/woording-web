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

        p, .list_header, .search_box {
            padding-left: .5rem;
            padding-top: .25rem;
            padding-bottom: .25rem;
        }

        .search_box {
            -webkit-appearance: none;
            border-radius: 0;
            border: none;
            width: 100%;
        }

        li {
            transition: 0.1s;
        }

        .list-list-list-item-item {
            &:hover {
                background: white;
                color: #212121;
            }
        }

        .list-link:hover {
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

.v-link-active p {
    background-color: #FFFFFF;
    color: #212121;
}

#wrapper {
    position: fixed;
    z-index: 9997;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: none;
    align-items: center;
    justify-content: center;
    transition: opacity .3s ease;
}

#importPopup {
    width: 500px;
    z-index: 9999;
    position: relative;
    background: white;
    display: none;
    border-radius: 3px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    padding: 15px;

    h1 {
        margin-bottom: 20px;
        font-size:18px;
        font-weight: bold;
    }

    textarea {
        width: 100%;
        margin-top: 20px;
        font-family: 'Roboto';
    }

    input[type='radio'] {
        display: none;
        margin: 2px;

        &:checked + label {
            background: #4CAF50;
            transition: all 0.3s ease-in;
            color: white;
        }
    }

    label {
        background: #ccc;
        border-radius: 3px;
        padding: 5px;
        cursor: pointer;
        user-select: none;
    }

    input[type='submit'] {
        background: #4caf50;
        border: none;
        color: white;
        padding: 10px;
        border-radius: 3px;
        font-weight: bold;
    }

    p {
        margin-top: 20px;
    }
}

#clicker {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 9998;
    top: 0;
    left: 0;
}

.grow {
    animation-name            : grow;
    animation-duration        : 0.3s;
    animation-iteration-count : 1;
    animation-timing-function : ease;
    animation-fill-mode       : forwards;
}
@keyframes grow {
    from {
        transform: scale(1.1);
    }
    to {
        transform: scale(1);
    }
}

</style>

<template>
    <div id="list-list">
        <div id="lists">
            <ul>
                <li class="list_header">{{ $route.params.username + "'s lists" | uppercase }}</li>
                <input class="search_box" type="search" v-model="listname" placeholder="Search lists">
                <li v-for="list in lists | filterBy listname in 'listname'" class="list-list-list-item-item">
                    <a v-link='{ path: "/" + $route.params.username + "/" + list.listname }'>
                        <p class="list-link">{{ list.listname }}</p>
                    </a>
                </li>
            </ul>
        </div>
        <button v-on:click="showImport">IMPORT</button>
        <div v-link='{ path: "/" + $route.params.username + "/add" }' id="add-list-button">
            <p>+</p>
        </div>
    </div>


    <div id="wrapper" transition="modal">
        <div id="clicker" v-on:click="closeImport"></div>
        <div id="importPopup">
            <h1><b>Import Lists</b></h1>
            <form v-on:submit.prevent>
                Import from:
                <input type="radio" name='where' id='1' v-model='where' value='woordjesleren'>
                <label for='1'>Woordjesleren</label>
                <input type="radio" name='where' id='2' v-model='where' value='wrts'>
                <label for='2'>Wrts</label>
                <input type="radio" name='where' id='3' v-model='where' value='excel'>
                <label for='3'>Excel</label>
                <br>
                <p v-show="where">Paste copied words from {{ where }} below.</p>
                <textarea id="importWords" name="" cols="30" rows="10"></textarea>
                <br>
                <input type="submit" v-on:click="importList" value="IMPORT" v-link="{ path: '/' + $route.params.username + '/add' }">
            </form>
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
            undoButton: false,
            where: ''
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

        importList: function(){
            if (!this.where){
                alert('Please select where the words are imported from.')
                return
            }

            let wordsRegex = ''
            let words = document.getElementById('importWords').value
            switch(this.where){
                case 'woordjesleren':
                    wordsRegex = / = |=|\n/g
                    break;
                case 'excel':
                    wordsRegex = /\t|\n/g
                    break;
                case 'wrts':
                    words = words.replace(/[0-9]+\t/g, '')
                    console.log(words)
                    wordsRegex = /\t|\n/g
                    break;
            }

            words = words.split(wordsRegex);
            let wordObjectArray = [];
            for (let i = 0, x = words.length; i < x; i+=2){
                wordObjectArray.push({
                    language_1_text: words[i],
                    language_2_text: words[i+1]
                });
            }
            store.importedWords = wordObjectArray
            document.getElementById('importWords').value = ''
            this.closeImport()
        },

        showImport: function(){
            document.getElementById('wrapper').style.display = 'flex'
            let popup = document.getElementById('importPopup')
            popup.style.display = 'block'
            popup.classList.add("grow");
        },

        closeImport: function(){
            document.getElementById('wrapper').style.display = 'none'
        }
    }
}

</script>
