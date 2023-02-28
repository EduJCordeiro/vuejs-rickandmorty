<template>
	<div v-show="isLoaded" class="container">
		<div class="header">
			<h1>Personagens Rick and Morty</h1>
			<div class="inputFilter">
				<label for="filter">Filtrar personagem</label>
				<input id="filter" type="text" @input="filteredCharacters($event)" v-model="filter" placeholder="Ex: Rick Sanchez" autocomplete="off"/>
			</div>
		</div>
		<div v-if="hasCharacter">
			<div class="cards">
				<div class="card" v-for="character in characters" :key="character.id">
					<router-link :to="{ name: 'character', params: { id: character.id }}">
						<img width="150" height="150" :src="character.image" :alt="character.name">
						<p>{{  character.name }}</p>
					</router-link>
				</div>
			</div>
			<div class="buttons">
				<button v-if="hasPrev" @click="prevPageCharacters">Página anterior</button>
				<button v-else disabled>Página anterior</button>
				<button v-if="hasNext" @click="nextPageCharacters">Próxima página</button>
				<button v-else disabled>Próxima página</button>
			</div>
		</div>
		<h2 v-else>Nenhum personagem encontrado!</h2>
	</div>
</template>

<script lang="ts">
	import { defineComponent } from 'vue';

	interface Characters {
		id: number;
		name: string;
		image: string;
		episode: [],
		location: []
	}

	export default defineComponent({
		name: 'App',
		mounted() {
			this.getCharacters();
		},
		data() {
			return {
				isLoaded: false,
				characters: [] as Characters[],
				filter: '',
				page: 1,
				hasNext: false,
				hasPrev: false,
				hasCharacter: false
			};
		},
		methods: {
			async getCharacters() {
				const query = `
					query Character {
						characters(page: ${this.page}, filter: { name: "${this.filter}" }) {
							info {
								count
								pages
								prev
								next
							}
							results {
								id
								name
								image
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
					const result = data.data.characters;

					this.hasCharacter = result.info.count > 0;
					this.hasNext = result.info.next != null;
					this.hasPrev = result.info.prev != null;
					this.page = this.hasNext ? result.info.next - 1 : result.info.pages;
					this.characters = result.results;

					this.isLoaded = true;
				});
			},
			filteredCharacters(e: any) {
				setTimeout(() => {
					e.stopPropagation();
					this.getCharacters();
				}, 1000);
			},
			prevPageCharacters(){
				this.page--;
				this.getCharacters();
			},
			nextPageCharacters() {
				this.page++;
				this.getCharacters();
			}
		},
	});
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		padding-bottom: 50px;

		.header {
			background: #2442ae;
			height: 150px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			box-shadow: 0px 1px 10px #000;
			padding: 16px 64px;

			h1 {
				color: #fff;
			}
			
			.inputFilter {
				display: flex;
				flex-direction: column;

				label {
					color: #eee;
					font-size: 12px;
				}

				input {
					width: 250px;
					margin-top: 8px;
					color: #24232a;
					border-radius: 4px;
					padding: 8px;
					border: 2px solid transparent;
					box-shadow: rgb(0 0 0 / 12%) 0px 1px 3px, rgb(0 0 0 / 24%) 0px 1px 2px;
					background: #eee;   
					outline: none;             
				}
			}
		}

		.cards {
			margin: 32px auto;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-wrap: wrap;

			.card {
				width: 150px;
				margin: 16px;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				background: #eee;
				border-radius: 4px;
				text-align: center;

				img {
					border-radius: 4px 0 0 4px;
				}

				p {
					font-size: 12px;
					color: #24232a;
					margin: 8px;
					height: 40px;
					display: flex;
					flex-direction: column;
					justify-content: center;
				}

				&:hover {
					opacity: .8;
				}
			}
		}

		.buttons {
			width: 100%;
			text-align: center;

			button {
				background: #2442ae;
				color: #fff;
				border: none;
				padding: 8px;
				margin: 16px 8px;
				border-radius: 4px;
				font-size: 14px;
				cursor: pointer;

				&:hover {
					filter: opacity(.8);
				}

				&:disabled {
					opacity: .5;
					cursor: no-drop;
				}
			}
		}

		h2 {
			text-align: center;
			margin: 64px
		}

		a {
			text-decoration: none;
		}
	}
</style>