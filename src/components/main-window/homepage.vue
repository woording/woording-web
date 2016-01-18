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
			<label>Username: </label>
			<input type="text"><br>
			<label>Password: </label>
			<input type="password">
		</div>

		<div id="register">
			<label>Username: </label>
			<input type="text"><br>
			<label>E-mail: </label>
			<input type="text"><br>
			<label>Password: </label>
			<input type="password"><br>
			<label>Repeat password: </label>
			<input type="password"><br>
		</div>
	</div>
</div>
</template>
<script>
</script>
