<template>
  <div id="pageBuilder">
    <h1>Design your Page</h1>
    <draggable
        :list="list"
        :disabled="!enabled"
        :animation="200"
        class="list-group"
        ghost-class="ghost"
        drag-class="drag"
        :move="checkMove"
        @start="dragging = true"
        @end="endMove"
    >
      <div
          class="list-group-item"
          v-for="element in list"
          :key="element.id"
      >
        <div class="">
          <input type="text" class="form-control" v-model="element.name" placeholder="Name" maxlength="30">
        </div>
        <div>
          <input type="text" class="form-control" v-model="element.link" placeholder="URL"/>
        </div>
      </div>
    </draggable>
    <button @click="addField" class="edit-mode-button">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
      </svg>
    </button>
    <!--
    <div v-if="editModeActive" :animation="200">
      <h3>Add a new Link</h3>
      <div class="">
        <input type="text" class="form-control" v-model="newElement.name" placeholder="Name"/>
      </div>
      <div>
        <input type="text" class="form-control" v-model="newElement.link" placeholder="URL"/>
      </div>
      <div>
        <button @click="add" class="submit-button">Submit</button>
      </div>
    </div>-->
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
    checkMove: function(e) {
      window.console.log("Future index: " + e.draggedContext.futureIndex);
    },

    endMove: function() {
      console.log(this.$store.state.list)

    },

    addField: function() {
      this.$store.commit("emptyEntry")
    }
  }
};
</script>

<style scoped lang="scss">
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

  .list-group-item {
    max-width: 400px;
    margin: 10px auto;
    padding: 10px;
    border-radius: 20px;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.15);
  }

  .ghost {
    opacity: 1;
    background: #e0f3ff;
  }
  .drag {
    opacity: 0;
  }

</style>