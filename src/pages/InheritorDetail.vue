<template>
	<div class="inheritor-detail">
		<h2>传承人详情</h2>
		<p>当前传承人 ID：{{ inheritorId }}</p>
	</div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const inheritorId = computed(() => route.params.id)
</script>

<style scoped>
.inheritor-detail {
	padding: 16px;
}

h2 {
	margin: 0 0 12px 0;
}
</style>

