<template>
  <div class="app">
    <h1>Ma liste de tâches</h1>
    <div class="form">
      <input v-model="nouvelleTache" placeholder="Saisir une tâche" />
      <label>
        <input type="checkbox" v-model="estTerminee" />
        Terminée ?
      </label>
      <button @click="ajouterTache">Ajouter</button>
    </div>
    <ul>
      <li v-for="(tache, index) in taches" :key="index">
        {{ tache.text }} <span class="status">[{{ tache.done ? 'Terminé' : 'Non terminé' }}]</span>
        <button @click="supprimerTache(index)">Supprimer</button>
        <button class="modifier" @click="modifierTache(index)">Modifier</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const nouvelleTache = ref('');
    const estTerminee = ref(false);
    const taches = ref([]);

    const chargerTaches = async () => {
      const res = await fetch('http://localhost:3000/api/taches');
      taches.value = await res.json();
    };

    const ajouterTache = async () => {
      if (!nouvelleTache.value.trim()) {
        alert('Veuillez entrer une tâche.');
        return;
      }

      await fetch('http://localhost:3000/api/taches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: nouvelleTache.value, done: estTerminee.value })
      });

      nouvelleTache.value = '';
      estTerminee.value = false;
      chargerTaches();
    };

    const supprimerTache = async (index) => {
      await fetch(`http://localhost:3000/api/taches/${index}`, {
        method: 'DELETE'
      });
      chargerTaches();
    };

    const modifierTache = async (index) => {
      const tache = taches.value[index];
      const nouveauTexte = prompt('Modifier la tâche:', tache.text);
      if (nouveauTexte !== null && nouveauTexte.trim() !== '') {
        await fetch(`http://localhost:3000/api/taches/${index}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: nouveauTexte, done: tache.done })
        });
        chargerTaches();
      }
    };

    onMounted(chargerTaches);

    return { nouvelleTache, estTerminee, taches, ajouterTache, supprimerTache, modifierTache };
  }
};
</script>

<style>
body {
  font-family: sans-serif;
}
.app {
  max-width: 600px;
  margin: auto;
  padding: 20px;
}
.form input[type="text"] {
  padding: 8px;
  width: 250px;
}
.status {
  margin-left: 10px;
  font-weight: bold;
}
button {
  margin-left: 5px;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}
button:hover {
  opacity: 0.9;
}
button.supprimer {
  background-color: red;
  color: white;
}
button.modifier {
  background-color: green;
  color: white;
}
</style>
