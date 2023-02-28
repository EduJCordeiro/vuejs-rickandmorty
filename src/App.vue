<template>
	<div>
		<RouterView />
	</div>
</template>

<script setup lang="ts">
	import { RouterView } from 'vue-router'
</script>
<style>
	*{
		padding: 0;
		margin: 0;
	}

	html, body {
	font-family: 'Inter', sans-serif;
	}
</style>
