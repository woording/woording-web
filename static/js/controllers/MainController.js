app.controller('MainController', function($scope, $http, $window, ngDialog, $interval, $cookies, $timeout) {
	$scope.title = 'Wording';
	$scope.Object = Object;
	// Change to "http://127.0.0.1:5000" when debugging
	$scope.apiAdress = 'http://api.woording.com';
	$scope.requests = 0;

	window.onload = function() {
		// Add a custom click listener to the links
		$scope.addUserUrls();
		$scope.addListUrls();

		// Remove the profile info when clicking somewhere else
		var content = document.getElementById('content');
		content.addEventListener('click', function(event) {
			if ($scope.showProfileInfo == true) {
				event.preventDefault();
				$scope.showProfileInfo = false;
			}
		});
	};

	// Return size of an object
	$scope.sizeOf = function(obj) {
		return Object.keys(obj).length;
	};

	// Profile info state
	$scope.showProfileInfo = false;

	$scope.error = null;
	$scope.success = null;
	$scope.isOwner = true;
	$scope.loggedIn = $cookies.get('loggedIn') ? $cookies.get('loggedIn') : false;
	
	$scope.user = $cookies.getObject('user') ? $cookies.getObject('user') : {
		token	:	"",
		username:	"",
		password:	"",
		confirmPassword: "",
		email	:	"",
		friends	: 	""
	};
	$scope.friends = [];
	$scope.userData = {
		username: "",
		email: "",
		lists: []
	};
	$scope.editData = {
		listname: "",
		language_1_tag: "",
		language_2_tag: "",
		shared_with: "",
		words: []
	};
	$scope.importData = {
		name: "",
		language1: "",
		language2: ""
	};
	$scope.request = {
		friend: ""
	};
	$scope.passwordChange = {
		oldPassword: "",
		newPassword: "",
		confirmPassword: "",
		error: null,
		success: null
	};

	// Language variable
	$scope.languages = {
		prefferedLanguage : $cookies.get('language') ? $cookies.get('language') : "eng",
		availableLanguages : ["eng", "dut", "ger"]
	};

	// load translations from translations.json
	$http.get('/translations.json').then(function(result) {
		console.log(result.data[$scope.languages.prefferedLanguage])
		$scope.translations = result.data[$scope.languages.prefferedLanguage];
	});

	// Switch language on page
	$scope.switchLanguage = function(newLanguage) {
		if (newLanguage != undefined)
			$scope.languages.prefferedLanguage = newLanguage;
		$http.get('/translations.json').then(function(result) {
			$scope.translations = result.data[$scope.languages.prefferedLanguage];
		});

		var now = new Date();
		// this will set the expiration to 12 months
		var exp = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());

		// Remove older cookie
		$cookies.remove('language');
		// Set new cookie
		$cookies.put('language', $scope.languages.prefferedLanguage, { expires : exp });
	};

	// Check if language is available
	$scope.languageAvailable = function(value, index, array) {
		return ($scope.languages.availableLanguages.indexOf(value.iso) != -1)
	};

	// Toggle show profile
	$scope.toggleShowProfile = function() {
		$scope.showProfileInfo = !$scope.showProfileInfo
	};

	// Dialogs
	$scope.openSignUp = function() {
		ngDialog.open({
			template:'\
				<h1>[[ translations.login.signup ]]</h1><br>\
				<p ng-if="error" class="error">[[ error ]]</p>\
				<form ng-submit="registerUser()">\
					<table>\
						<tr>\
							<td>[[ translations.login.username ]]: </td>\
							<td><input type="text" ng-model="user.username" name="username" placeholder="[[ translations.login.username ]]"></td>\
						</tr>\
						<tr>\
							<td>[[ translations.login.password ]]: </td>\
							<td><input type="password" ng-model="user.password" name="password" placeholder="[[ translations.login.password ]]"></td>\
						</tr>\
						<tr>\
							<td></td>\
							<td><input type="password" ng-model="user.confirmPassword" name="confirm_password" placeholder="[[ translations.login.confirmPassword ]]"></td>\
						</tr>\
						<tr>\
							<td>[[ translations.login.email ]]: </td>\
							<td><input type="email" ng-model="user.email" name="email" placeholder="[[ translations.login.email ]]"></td>\
						</tr>\
					</table>\
					<input type="submit" value="[[ translations.login.signup ]]">\
				</form>',
			plain:true,
			scope:$scope
		});
	};
	$scope.openLogIn = function() {
		ngDialog.open({
			template:'\
				<h1>[[ translations.login.login ]]</h1><br>\
				<p ng-if="error" class="error">[[ error ]]</p>\
				<form ng-submit="loginUser()">\
					<table>\
						<tr>\
							<td>[[ translations.login.username ]]: </td>\
							<td><input type="text" ng-model="user.username" name="username" placeholder="[[ translations.login.username ]]"></td>\
						</tr>\
						<tr>\
							<td>[[ translations.login.password ]]: </td>\
							<td><input type="password" ng-model="user.password" name="password" placeholder="[[ translations.login.password ]]"></td>\
						</tr>\
					</table>\
					<input type="submit" value="[[ translations.login.login ]]"> <a ng-click="openSignUp()">[[ translations.login.option ]]</a>\
				</form>',
			plain:true,
			scope:$scope
		});
	};
	$scope.openOptions = function() {
		ngDialog.open({
			template: '\
				<h1>[[ translations.options ]]</h1><br>\
				<table>\
					<tr>\
						<td>[[ translations.changeLanguage ]]</td>\
						<td>\
							<select style="min-width: 140px" ng-model="languages.prefferedLanguage" value="" ng-change="switchLanguage()"\
								ng-options="language.iso as language.displayText for language in translations.languages | filter:languageAvailable">\
							</select>\
						</td>\
					</tr>\
				</table>\
				<br>\
				<button ng-click="openChangePassword()">[[ translations.account.changePassword.title ]]</button>\
			',
			plain: true,
			scope: $scope
		});
	};

	// Authentication functions
	$scope.authenticate = function(username, password) {
		var data = {
			'username':username,
			'password':password
		};
		// Post data to API
		$http.post($scope.apiAdress + '/authenticate', data)
			.success(function(data, status, headers, config) {
				if (typeof data == "string") {
					if (data == 'ERROR, Email not verified') $scope.error = $scope.translations.errors.emailNotVerified;
					else if (data == 'ERROR, User not found') $scope.error = $scope.translations.errors.noUser;
				} else {
					$scope.user.token = data.token;
					$scope.user.friends = data.friends;
					$scope.loggedIn = true;
					$scope.loadUser("/" + $scope.user.username);

					// First delete before saving cookies
					$cookies.remove('user');
					$cookies.remove('loggedIn');
					// Save Cookies
					$cookies.put('loggedIn', $scope.loggedIn);
					$cookies.putObject('user', $scope.user);

					ngDialog.closeAll();
					$scope.error = null;

					// Set location to user home page
					$window.location.href = '/' + $scope.user.username;
				}
			}).error(function(data, status, headers, config) {
				console.error("could not authenticate");
				// If error is 401 display it...
				if (status == 401) $scope.error = $scope.translations.errors.validation;
				else $scope.error = $scope.translations.errors.unknown;
			});
	};

	$scope.registerUser = function() {
		// Check if everything is filled in
		if ($scope.user.username && $scope.user.password && $scope.user.email) {
			// Confirm password
			if ($scope.user.password == $scope.user.confirmPassword) {
				data = {
					'username':this.user.username,
					'password':this.user.password,
					'email':this.user.email
				};
				// Post data to API server
				$http.post($scope.apiAdress + '/register', data)
					.success(function(data, status, headers, config) {
						if (data.indexOf("ERROR") > - 1) {
							// An error...
							if (data == "ERROR, not everything filled in") {
								$scope.error = $scope.translations.errors.notEverythingFilledIn;
							} else if (data == "ERROR, username and/or email do already exist") {
								$scope.error = $scope.translations.errors.alreadyExist;
							}
						} else {
							// Give success
							$scope.success = "Please verify your email to login."
							ngDialog.close('registerDialog');
							$scope.error = null;
						}
						console.log($scope.error);
					}).error(function(data, status, headers, config) {
						// Give registration error
						console.error("Failed");
						$scope.error = $scope.translations.errors.unknown;
					});
				// Reset the values
				$scope.user.password = '';
				$scope.user.confirmPassword = '';
			} else $scope.error = $scope.translations.errors.noMatch;
		} else $scope.error = $scope.translations.errors.notEverythingFilledIn;
	};

	$scope.loginUser = function() {
		// Check if everything is filled in
		if ($scope.user.username && $scope.user.password) {
			$scope.authenticate(this.user.username, this.user.password);
			// Reset the fields
			$scope.user.password = '';
		} else $scope.error = $scope.translations.errors.notEverythingFilledIn;
	};

	$scope.logoutUser = function() {
		$scope.loggedIn = false;
		$scope.showProfileInfo = false;
		$scope.user.username = '';
		$scope.user.token = '';
		$scope.user.email = '';

		// Remove the cookies
		$cookies.remove('user');
		$cookies.remove('loggedIn');

		// Go to main page
		$window.location.href = '/';
	};

	$scope.openChangePassword = function() {
		$scope.passwordChange.success = null;
		$scope.passwordChange.error = null;

		ngDialog.open({
			template: '\
				<h1>[[ translations.account.changePassword.title ]]</h1>\
				<br>\
				<p ng-if="passwordChange.error" class="error">[[ passwordChange.error ]]</p>\
				<p ng-if="passwordChange.success" class="success">[[ passwordChange.success ]]</p>\
				<form ng-submit="changePassword()">\
					<table>\
						<tr>\
							<td>[[ translations.account.changePassword.current ]]</td>\
							<td><input type="password" name="old_password" ng-model="passwordChange.oldPassword"></td>\
						</tr>\
						<tr>\
							<td>[[ translations.account.changePassword.new ]]</td>\
							<td><input type="password" name="new_password" ng-model="passwordChange.newPassword"></td>\
						</tr>\
						<tr>\
							<td>[[ translations.account.changePassword.confirm ]]</td>\
							<td><input type="password" name="confirm_password" ng-model="passwordChange.confirmPassword"></td>\
						</tr>\
					</table>\
					<input type="submit" value="[[ translations.account.changePassword.title ]]">\
				</form>\
			',
			plain: true,
			scope: $scope
		});
	};

	// Change password of user
	$scope.changePassword = function() {
		// Confirm the 2 given passwords
		if ($scope.passwordChange.newPassword == $scope.passwordChange.confirmPassword) {
			var data = {
				"username": $scope.user.username,
				"old_password": $scope.passwordChange.oldPassword,
				"new_password": $scope.passwordChange.newPassword,
				"token": $scope.user.token
			}
			$http.post($scope.apiAdress + "/changePassword", data)
				.success(function(data, status, headers, config) {
					if (data.indexOf("ERROR") > -1) {
						// return password is incorrect
						$scope.passwordChange.error = $scope.translations.errors.wrongPassword;
					} else {
						// Changed password
						$scope.passwordChange.error = null;
						$scope.passwordChange.success = $scope.translations.account.changePassword.success;
					}
				}).error(function(data, status, headers, config) {
					console.error("Error " + status + " while changing password");
				});

		} else {
			$scope.passwordChange.error = $scope.translations.errors.noMatch;
		}
	};

	// Get friends for user
	$scope.getFriends = function() { // You don't have them so get them
		var data = {
			"token": $scope.user.token,
			"username": $scope.user.username
		}
		$http.post($scope.apiAdress + "/getFriends", data)
			.success(function(data, status, headers, config) {
				$scope.friends = data;
			}).error(function(data, status, headers, config) {
				console.error("Getting friends failed");
			});
	};

	// json loading functions
	// Password list for users that are in the database
	// cor 		Hunter2
	// leon		all_i_see_is_*****
	// philip	***hunter***
	$scope.loadUser = function(url) {
		// Post data to API server
		$http.post($scope.apiAdress + url, { 'token':$scope.user.token })
			.success(function(data, status, headers, config) {
				if (data.username == 'ERROR, No token' || data.username == 'ERROR, No user') {
					// Go to main page
					$window.location.href = '/';
				} else {
					document.getElementById('right_content').style.display = 'none';
					$scope.userData = data;
					$scope.listData = 0;
					$scope.addListUrls();
					$scope.getFriends();
				}
			})
			.error(function(data, status, headers, config) {
				console.log("error " + status + " while loading user");
			});
	};

	$scope.loadList = function(url){

		$timeout(function(){
			showList();
			if ($scope.userData.username != $scope.user.username) $scope.isOwner = false;
			else $scope.isOwner = true;
		}, 0);

		var data = {
			"token" : $scope.user.token // Token to confirm your username
		}
		// Post data to API
		$http.post($scope.apiAdress + url, data)
			.success(function(data, status, headers, config) {
				$scope.listData = data;
			})
			.error(function(data, status, headers, config) {
				console.log("error " + status + " while loadin list");
			});
	};

	window.onpopstate = function(){
		document.getElementById('practice_div').style.display = 'none';
		document.getElementById('left_content').style.display = 'block';
		fadeIn(document.getElementById('left_content'));
		document.getElementById('middle_content').style.display = 'block';
		fadeIn(document.getElementById('middle_content'));

		if (location.pathname.split('/').length == 2){
			$scope.loadUser(location.pathname);
		}

		else if (location.pathname.split('/').length == 3){
			$scope.loadList(location.pathname);
		}
	};

	// Look for all URL's that link to a user
	$scope.addUserUrls = function() {
		var userLinks = document.getElementsByClassName('user_link');

		for(var i = 0, x = userLinks.length; i < x; i++){
			$scope.addUserUrl(userLinks[i]);
		}
	};

	// Look for all URL's that link to a list
	$scope.addListUrls = function() {
		var listLinks = document.getElementsByClassName('list_link');

		$timeout(function() { // Fixing it by doing this doesn't feel good, but now it works ¯\_(ツ)_/¯
			for(var i = 0, x = listLinks.length; i < x; i++) {
				$scope.addListUrl(listLinks[i]);
			}
		}, 0);
	};

	// Set custom user URL handler
	$scope.addUserUrl = function(link){
		link.addEventListener('click', function(e){
			var url = link.href.split('/').pop();
			console.log(url);
			e.preventDefault();
			history.pushState(null, null, '/' + url);
			$scope.loadUser('/' + url);
		}, false);
	};

	// Set custom list URL handler
	$scope.addListUrl = function(link){
		link.addEventListener('click', function(e){
			var url = link.href.split('/').slice(-2);
			e.preventDefault();
			history.pushState(null, null, '/' + url[0] + '/' + url[1]);
			$scope.loadList('/' + url[0] + '/' + url[1]);
		}, false);
	};

	// Create list
	$scope.createList = function() {
		$scope.editData = {
			listname: "",
			language_1_tag: "",
			language_2_tag: "",
			words: [],
			shared_with: "",
		};

		// Add 3 empty input rows
		for (i = 0; i < 3; i++) {
			$scope.editData.words[i] = {
				language_1_text: "",
				language_2_text: ""
			}
		}
	};

	$scope.practiceIncorrect = function(){
		var words = $scope.incorrectWords;
		var listWords = [];
		for(var i = 0, x = words.length; i < x; i++){
			listWords.push({
				language_2_text: words[i].correctWord,
				language_1_text: words[i].wordShouldBe
			});
		}
		$scope.listData = {
			listname: $scope.listData.listname,
			language_2_tag: $scope.listData.language_1_tag,
			language_1_tag: $scope.listData.language_2_tag,
			words: listWords,
			shared_with: $scope.listData.shared_with
		};

		$scope.numberOfQuestions = $scope.listData.words.length;

		$scope.startList();
	};

	$scope.importList = function() {
		ngDialog.open({ // Open dialog
			template: '\
				<h1>[[ translations.import.title ]]</h1><br>\
				<select id="import_select" name="fromwhere">\
					<option value="woordjesleren">Woordjesleren.nl</option>\
					<option value="excel">Excel</option>\
				</select>\
				<table>\
					<tr>\
						<td>[[ translations.import.name ]]: </td>\
						<td><input type="text" ng-model="importData.name"></td>\
					</tr>\
					<tr>\
						<td>[[ translations.import.language1 ]]: </td>\
						<td>\
							<select ng-model="importData.language1" value="">\
								<option value="">[[ translations.listControls.language1 ]]</option>\
								<option ng-repeat="language in translations.languages" value="[[ language.iso ]]">[[ language.displayText ]]</option>\
							</select>\
						</td>\
					</tr>\
					<tr>\
						<td>[[ translations.import.language2 ]]: </td>\
						<td>\
							<select ng-model="importData.language2" value="">\
								<option value="">[[ translations.listControls.language2 ]]</option>\
								<option ng-repeat="language in translations.languages" value="[[ language.iso ]]">[[ language.displayText ]]</option>\
							</select>\
						<td>\
					</tr>\
					<tr>\
						<td>[[ translations.sharing.sharedWith ]]? </td>\
						<td>\
							<select ng-model="importData.shared_with" value="">\
								<option value="">[[ translations.sharing.sharedWith ]]?</option>\
								<option value="0">[[ translations.sharing.nobody ]]</option>\
								<option value="1">[[ translations.friends ]]</option>\
								<option value="2">[[ translations.sharing.everybody ]]</option>\
							</select>\
						</td>\
					</tr>\
				</table>\
				<p>[[ translations.import.desc ]]</p>\
				<textarea id="import_area" name="" cols="30" rows="10"></textarea>\
				<button ng-click="submitImportedList()">[[ translations.import.title ]]</button>\
			',
			plain:true,
			scope:$scope
		});
	};

	$scope.submitImportedList = function() {
		document.getElementById('undo_delete').style.display = 'none';

		var import_select = document.getElementById('import_select').value;
		var import_area = document.getElementById('import_area');

		var added_index;

		if(import_select == 'woordjesleren'){
			var words = import_area.value.split(/ = |=|\n/g);
		}
		else if (import_select == 'excel'){
			var words = import_area.value.split(/\t|\n/g);
		}

		var wordObjectArray = [];
		console.log(wordObjectArray);
		for (var i = 0, x = words.length; i < x; i+=2){
			wordObjectArray.push({
				language_1_text: words[i],
				language_2_text: words[i+1]
			});
		}

		console.log(words);

		$scope.editData = {
			listname: $scope.importData.name,
			language_1_tag: $scope.importData.language1,
			language_2_tag: $scope.importData.language2,
			words: wordObjectArray,
			shared_with: $scope.importData.shared_with
		}

		console.log($scope.editData);

		$scope.saveList();
		ngDialog.close();
	};

	// Edit the list
	$scope.editList = function() {
		document.getElementById('undo_delete').style.display = 'none';
		$scope.editData = $scope.listData;

		var size = $scope.sizeOf($scope.editData.words);
		for (i = 0; i < 3; i++) { // Add 3 empty input rows
			$scope.editData.words[size] = {
				language_1_text: "",
				language_2_text: ""
			};
		}
	};

	// Save the list
	$scope.saveList = function() {
		var data = {
			'username':$scope.user.username,
			'list_data':$scope.editData,
			'token':$scope.user.token
		};
		console.log(data);
		$http.post($scope.apiAdress + '/savelist', data)
			.success(function(data, status, headers, config) {
				console.log('saved');
				$scope.loadUser('/' + $scope.userData.username);
				$scope.loadList('/' + $scope.userData.username + '/' + $scope.editData.listname);
				$scope.editData = null;

				if (!$scope.isOwner) {
					alert("Edited list saved on own account.")
				}
			}).error(function(data, status, headers, config) {
				console.error('error');
			});
	};

	// Delete the list
	$scope.deleteList = function(listname) {
		document.getElementById('undo_delete').style.display = 'block';
		$scope.editData = $scope.listData;
		var data = {
			'username':$scope.userData.username,
			'listname':listname,
			'token':$scope.user.token
		};
		$http.post($scope.apiAdress + '/deleteList', data)
			.success(function(data, status, headers, config) {
				$scope.loadUser('/' + $scope.userData.username);
				listData = null;
				editData = null;
			}).error(function(data, status, headers, config){
				console.error('Error while deleting list')
			});
	};

	$scope.undoDelete = function() {
		document.getElementById('undo_delete').style.display = 'none';
		$scope.saveList();
	};

	// Start practice
	$scope.startList = function(){
		$scope.usedWords = [];
		$scope.incorrectWords = [];

		for(var i = 0, x = $scope.translations.languages.length; i < x; i++){
			if ($scope.translations.languages[i].iso == $scope.listData.language_1_tag){
				$scope.firstLanguage = $scope.translations.languages[i].displayText;
			}

			else if ($scope.translations.languages[i].iso == $scope.listData.language_2_tag){
				$scope.secondLanguage = $scope.translations.languages[i].displayText;
			}
		}

		$scope.languages = [{
			language1: $scope.firstLanguage,
			language2: $scope.secondLanguage
		}];

		// Open the dialog with options
		// TODO: Integrate this in the practice screen
		ngDialog.open({
			template:'\
				<h1>[[ translations.options ]]</h1>\
				<br>\
				<form>\
					[[ translations.practice.questionedLanguage ]]?<br>\
					<input type="radio" name="language" value="second" class="secondLanguage" checked> ' + $scope.secondLanguage + '<br>\
					<input type="radio" name="language" value="first" class="firstLanguage"> ' + $scope.firstLanguage + '<br>\
					<input type="radio" name="language" value="both" class="bothLanguages"> [[ translations.practice.both ]]<br>\
					<br>\
					<input type="checkbox" id="case_sensitivity" checked> [ Case sensitive? ]<br>\
					<br>\
					<input type="submit" ng-click="setPracticeOptions([[ languages ]])" value="[[ translations.practice.start ]]">\
				</form>\
				',
			plain:true,
			scope:$scope,
			closeByEscape: false,
			closeByDocument: false,
			showClose: false
		});

		showPractice();

		$scope.getRandomWord();
		$scope.numberOfQuestions = $scope.listData.words.length;
		document.getElementById('words_left').innerHTML = $scope.numberOfQuestions;
	};

	$scope.getSelectedLists = function() {
		var listElements = document.getElementsByClassName('list_list-item');
		var listNames = [];

		var x = listElements.length;
		for (var i = 0; i < x; i++) {
			var list = listElements[i];
			if (list.firstElementChild.firstElementChild.checked == true) {
				var listName = $scope.userData.lists[i].listname;
				// listName.replace(" ", "").replace("\n", "");
				listNames.push(listName);
			}
		}

		var lists = [];
		var data = {
			"token" : $scope.user.token // Token to confirm your username
		}
		for (var i = 0, x = listNames.length; i < x; i++) {
			$scope.requests++;
			// Post data to API
			$http.post($scope.apiAdress + "/" + $scope.userData.username + "/" + listNames[i], data)
				.success(function(data, status, headers, config) {
					if (data.username != 'ERROR, No token' || data.username != 'ERROR, No user') {
						lists.push(data);

						$scope.requests--;
						if ($scope.requests == 0) $scope.startLists(lists); // If this is the last request, start the lists
					}
				}).error(function(data, status, headers, config) {
					console.log("error " + status + " while loading list");
				});
		}
	};

	$scope.startLists = function(lists) {
		// Reset older practice
		$scope.usedWords = [];
		$scope.incorrectWords = [];
		// check for the languages
		var languages_1 = [];
		var languages_2 = [];

		for (var i = 0, x = lists.length; i < x; i++) {
			var list = lists[i];

			if (languages_1.length === 0 && languages_2.length === 0) {
				languages_1.push(list.language_1_tag);
				languages_2.push(list.language_2_tag);
			} else if (languages_1.indexOf(list.language_1_tag) === -1) {
				if (languages_1.indexOf(list.language_2_tag) > -1 && languages_2.indexOf(list.language_1_tag) > -1) {
					// Swap languages
					var temp = list.language_1_tag;
					list.language_1_tag = list.language_2_tag;
					list.language_2_tag = temp;

					// Swap words
					for (var j = 0, y = list.words.length; j < y; j++) {
						var word = list.words[j];
						temp = word.language_1_text;
						word.language_1_text = word.language_2_text;
						word.language_2_text = temp;
					}
				} else {
					languages_1.push(list.language_1_tag);
					languages_2.push(list.language_2_tag);
				}
			} else if (languages_2.indexOf(list.language_2_tag) === -1) {
				languages_1.push(list.language_1_tag);
				languages_2.push(list.language_2_tag);
			} else {
				continue;
			}
		}

		$scope.languages = [];

		for (var i = 0, x = languages_1.length; i < x; i++) {
			var first, second;
			for(var j = 0, y = $scope.translations.languages.length; j < y; j++){
				if ($scope.translations.languages[j].iso === languages_1[i]){
					first = $scope.translations.languages[j].displayText;
				} else if ($scope.translations.languages[j].iso === languages_2[i]){
					second = $scope.translations.languages[j].displayText;
				}
			}

			$scope.languages.push({
				language1: first,
				language2: second
			});
		}

		// Display dialog with language options
		ngDialog.open({
			template:'\
				<h1>[[ translations.options ]]</h1>\
				<br>\
				<form>\
					<p ng-repeat="language in languages">\
						[[ translations.practice.questionedLanguage ]]?<br>\
						<input type="radio" name="[[ language ]]" value="first" class="firstLanguage" checked="true"> [[ language.language1 ]]<br>\
						<input type="radio" name="[[ language ]]" value="second" class="secondLanguage"> [[ language.language2 ]]<br>\
						<input type="radio" name="[[ language ]]" value="both" class="bothLanguages"> [[ translations.practice.both ]]<br>\
					</p>\
					<br>\
					<input type="checkbox" id="case_sensitivity" checked> [ Case sensitive? ]<br>\
					<br>\
					<input type="submit" ng-click="setPracticeOptions([[ languages ]])" value="[[ translations.practice.start ]]">\
				</form>\
				',
			plain: true,
			scope: $scope,
			closeByEscape: false,
			closeByDocument: false,
			showClose: false
		});

		// Do something different when there is only one language
		if ($scope.languages.length === 1) {
			// Add the words of all lists to one list
			$scope.listData = lists[0];
			for (var i = 1, x = lists.length; i < x; i++) {
				var list = lists[i];
				for (var j = 0, y = list.words.length; j < y; j++) {
					$scope.listData.words.push(list.words[j]);
				}
			}

			$scope.getRandomWord();
			showPractice();

			$scope.numberOfQuestions = $scope.listData.words.length;
			document.getElementById('words_left').innerHTML = $scope.numberOfQuestions;
		} else {
			// TODO: Create this function
			
		}
	};

	$scope.setPracticeOptions = function(languages) {
		for (var j = 0, y = languages.length; j < y; j++) {
			if (document.getElementsByClassName('firstLanguage')[j].checked) {
				$scope.questionedLanguage = true;
			} else if (document.getElementsByClassName('secondLanguage')[j].checked){
				$scope.questionedLanguage = false;
			} else if (document.getElementsByClassName('bothLanguages')[j].checked){
				document.getElementById('words_left').innerHTML *= 2;
				for (var i = 0, x = $scope.listData.words.length; i < x; i++){
					$scope.listData.words.push({
						language_1_text: $scope.listData.words[i].language_2_text,
						language_2_text: $scope.listData.words[i].language_1_text
					});
				}
			}
		}

		// Check case sensitivity
		$scope.caseSensitivity = document.getElementById('case_sensitivity').checked;

		ngDialog.close();
	};

	// Practice lists
	$scope.getRandomWord = function(){
		if ($scope.usedWords.length === $scope.listData.words.length){
			showResults();
			setResult($scope.numberOfQuestions, $scope.incorrectWords.length);
			return true;
		}

		if($scope.listData){
			$scope.randomWord = $scope.listData.words[Math.floor(Math.random() * $scope.listData.words.length)];

			if ($scope.usedWords.indexOf($scope.randomWord) > -1){
				$scope.getRandomWord();
			} else {
				$scope.usedWords.push($scope.randomWord);
			}
		}
	};

	$scope.numberOfQuestions = 0;
	$scope.usedWords = [];
	$scope.incorrectWords = [];

	$scope.submit = function(){
		document.getElementById('wrong_word').innerHTML = '';

		$scope.checkWord(this.text, $scope.randomWord);
		this.text = '';
	};

	$scope.checkWord = function(wordOne, wordTwo) {
		var wordShouldBe = $scope.questionedLanguage ? wordTwo.language_1_text : wordTwo.language_2_text;
		var wordObject = wordTwo;
		wordTwo = $scope.questionedLanguage ? wordTwo.language_2_text : wordTwo.language_1_text;

		if (!$scope.caseSensitivity) {
			wordOne = wordOne.toLowerCase();
			wordTwo = wordTwo.toLowerCase();
		}

		if (wordOne == wordTwo) {
			$scope.wordIsRight();
		} else if (wordTwo.split(/\s*[,|/|;]\s*/).length >= 2) {
			var wordOneArray = wordOne.split(/\s*[,|/|;]\s*/).sort();
			var wordTwoArray = wordTwo.split(/\s*[,|/|;]\s*/).sort();

			for (var i = 0; i < wordOneArray.length; i++) {
				if (wordOneArray[i] != wordTwoArray[i]) {
					$scope.wordIsWrong(wordOne, wordTwo);
					return false;
				}
			}

			$scope.wordIsRight();
		} else {
			$scope.wordIsWrong(wordOne, wordTwo, wordShouldBe, wordObject);
		}
	};

	$scope.wordIsRight = function(){
		document.getElementById('words_left').innerHTML--;
		document.getElementById('correct').innerHTML++;
		$scope.getRandomWord();

		return true;
	};

	$scope.wordIsWrong = function(wordOne, wordTwo, wordShouldBe, wordObject){
		console.log(wordOne + " " + wordTwo);

		document.getElementById('words_left').innerHTML++;
		document.getElementById('wrong_word').innerHTML = wordTwo;
		document.getElementById('wrong_word').style.color = 'red';
		if ($scope.usedWords.indexOf(wordObject) > -1){
			console.log('splice');
			$scope.usedWords.splice($scope.usedWords.indexOf(wordObject));
		}

		document.getElementById('incorrect').innerHTML++;

		$scope.numberOfQuestions++;
		$scope.incorrectWords.push({
			correctWord: wordTwo,
			incorrectWord: wordOne,
			wordShouldBe: wordShouldBe
		});

		return false;
	};

	// Friends
	$scope.openFriendRequest = function(name) {
		ngDialog.open({ // Open dialog
			template: '\
				<h1>[ Friend request ]</h1>\
				<form ng-submit="addFriend()">\
					<table>\
						<tr>\
							<td>\
								[ Friend name: ]\
							</td>\
							<td>\
								<input type="text" ng-model="request.friend" placeholder="[ name ]">\
							</td>\
						</tr>\
					</table>\
					<input type="submit" value="[ Request ]">\
				</form>\
			',
			plain: true,
			scope: $scope
		});
	};

	$scope.addFriend = function() {
		// Send friend request
		var data = {
			"username": $scope.user.username,
			"friendname": $scope.request.friend
		}
		$http.post($scope.apiAdress + "/friendRequest", data)
			.success(function(data, status, headers, config) {
				ngDialog.close();
			})
			.error(function(data, status, headers, config) {
				console.error("error");
			});
	};
});
