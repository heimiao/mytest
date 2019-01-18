<template>
	<div>
		测试路由
	</div>
</template>
<script>
	export default {
		/*computed: {
			username() {
				//return this.$route.params.username
			}
		},*/
		methods: {
			goBack() {
				window.history.length > 1 ?
					this.$router.go(-1) :
					this.$router.push('/')
			}
		}
	}
</script>
<style lang="scss">
	.router-fade-enter-active,
	.router-fade-leave-active {
		transition: opacity .3s;
	}
	
	.router-fade-enter,
	.router-fade-leave-active {
		opacity: 0;
	}
</style>