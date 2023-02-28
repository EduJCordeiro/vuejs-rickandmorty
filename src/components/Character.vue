<template>
	<div v-show="isLoaded" >
		<div class="container">
			<div class="header">
				<div class="content">
					<img width="130" height="130" :src="character.image" :alt="character.name">
					<div class="infos">
						<div>
							<h2>{{ character.name }}</h2>
							<p>{{ location.name }}</p>
							<p>{{ character.species }}</p>
							<p>{{ character.status }}</p>
						</div>
						<div>
							<p>{{ character.gender }}</p>
							<p>{{ character.type }}</p>
							<p>{{ origin.name }}</p>
						</div>
					</div>
				</div>
				<router-link to="/" class="button">Voltar</router-link>
			</div>
		</div>
		<div v-if="hasEpisodes" class="episodes">
			<h2>Episódios</h2>
			<div v-for="episode in episodes" :key="episode.id">
				<h3>{{ episode.episode }} | {{ episode.name }}</h3>
				<p>{{ episode.air_date }}</p>
			</div>
		</div>
		<h2 class="no-episodes" v-else>Nenhum episódio encontrado!</h2>
	</div>
</template>
  
<script lang="ts">
	import { defineComponent } from 'vue'

	interface Character {
		id: number
		name: string
		image: string
		status: string
		species: string
		type: string
		gender: string
	}

	interface Location {
		name: string
	}

	interface Origin {
		name: string
	}

	interface Episodes {
		id: number
		name: string
		episode: string
		air_date: string
	}

	export default defineComponent({
		name: 'Character',
		data() {
			return {
				character: {} as Character,
				origin: {} as Origin,
				location: {} as Location,
				episodes: [] as Episodes[],
				isLoaded: false,
				hasEpisodes: false
			}
		},
		mounted() {
			const id = this.$route.params.id
			this.getCharacter(id)
		},
		methods: {
			async getCharacter(id: any) {
				const query = `
					query Character {
						character(id: ${id}) {
							id
							name
							status
							species
							type
							gender
							image
							origin {
								id
								name
								type
								dimension
							}
							location {
								id
								name
								type
								dimension
							}
							episode {
								id
								name
								air_date
								episode
							}
						}
					}
				`;

				await fetch('https://rickandmortyapi.com/graphql', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						query,
					}),
				})
				.then((response) => response.json())
				.then((data) => {
					const result = data.data.character;
					this.character = result;
					this.location = result.location;
					this.origin = result.origin;
					this.episodes = result.episode;
					this.hasEpisodes = this.episodes.length > 0;
					this.isLoaded = true;
				});		
			}
		}
	})
</script>

<style lang="scss" scoped>
	.container {
		
		.header {
			background: #2442ae;
			height: 150px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			box-shadow: 0px 1px 10px #000;
			padding: 16px 64px;

			img {
				border-radius: 4px;
			}

			.button {
				background: #fff;
				color: #2442ae;
				border: none;
				padding: 8px;
				margin: 16px 8px;
				border-radius: 4px;
				font-size: 14px;
				cursor: pointer;
				text-decoration: none;

				&:hover {
					filter: opacity(.8);
				}
			}

			.content {
				display: flex;
				align-items: center;

				.infos {
					display: flex;
					align-items: flex-end;
					margin: 16px 32px;

					h2 {
						color: #fff;
						padding: 4px 16px;
						padding-bottom: 8px;
					}

					p {
						padding: 4px 16px;
						color: #ddd;
					}
				}
			}
		}
	}

	.episodes {
		display: flex;
		flex-direction: column;
		padding: 16px 64px;

		h2 {
			padding: 16px;
			color: #2442ae;
		}

		div {
			padding: 32px;
			border-bottom: 1px solid #eee;
			color: #24232a;
			display: flex;
			justify-content: space-between;

			p {
				opacity: .5;
			}
		}
	}

	.no-episodes {
			text-align: center;
			margin: 64px
		}
</style>