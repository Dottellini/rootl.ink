<template>
  <div id="pageBuilder" class="container">
    <h1>Design your Page</h1>
    <draggable
        :list="list"
        :disabled="!enabled"
        :animation="200"
        class="list-group"
        ghost-class="ghost"
        drag-class="drag"
        @start="dragging = true"
    >
      <div
          class="list-group-item"
          v-for="element in list"
          :key="element.id"
      >
        <div>
          <div>
            <input type="text" class="form-control" v-model="element.name" placeholder="Name" maxlength="30">
          </div>
          <div>
            <input type="text" class="form-control" v-model="element.link" placeholder="URL"/>
          </div>
        </div>
        <button class="delete-button" @click="removeEntry(element.id)">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
          </svg>
        </button>
      </div>
      <div>
      </div>
    </draggable>
    <button @click="addField" class="edit-mode-button">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
      </svg>
    </button>
  </div>
</template>

<script>
import draggable from "vuedraggable"

export default {
  name: "simple",
  display: "Simple",
  order: 0,
  components: {
    draggable
  },
  data() {
    return {
      editModeActive: false,
      enabled: true,
      dragging: true,
      list: this.$store.state.list,
    };
  },

  methods: {
    removeEntry: function (id) {
      this.$store.commit("removeEntry", id)
    },

    addField: function() {
      this.$store.commit("emptyEntry")
    }
  }
};
</script>

<style scoped lang="scss">
  .container {
    color: var(--text-color);
  }

  .list-group-item {
    display: flex;
    justify-content: space-around;
    align-items: center;
    max-width: 400px;
    margin: 10px auto;
    padding: 10px;
    border-radius: 20px;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.15);
  }

  .delete-button {
    padding: 0.3em 1em;
    border: none;
    outline: none;
    border-radius: 10px;
    background-color: #e74c3c;
    color: white;
  }

  .submit-button {
    background: #536cc0;
    color: white;
    border-radius: 25px;
    outline: none;
    border: none;
    padding: 10px 15px ;
  }

  .edit-mode-button {
    border:none;
    background: white;
    outline: none;
  }

  .form-control{
    outline: none;
    margin: 10px 0;
    border: none;
    border-bottom: 2px solid #536cc0;
  }

  .ghost {
    opacity: 1;
    background: var(--ghost-color);
  }
  .drag {
    opacity: 0;
  }

</style>