<template>
  <div class="wrapper-todo">
    <h1 class="title">MyTodoList</h1>
    <form class="mb-5">
      <div class="field is-grouped">
        <p class="control is-expanded">
          <input class="input" type="text" placeholder="ToDo text" v-model="newToDoText" />
        </p>
        <p class="control">
          <button class="button is-info" @click.prevent="addToDo" :disabled="!newToDoText">
            Add
          </button>
        </p>
      </div>
    </form>
    <div v-for="todo in todos" :key="todo.id" class="card">
      <div class="card-content">
        <div class="content">
          <div class="columns is-mobile is-vcentered">
            <div class="column" :class="{ completed: todo.completed }">
              {{ todo.text }}
            </div>
            <div class="column has-text-right">
              <button class="button" @click="completeToDo(todo.id)">&check;</button>
              <button class="button ml-1" @click="removeToDo(todo.id)">&cross;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

const newToDoText = ref('')

const addToDo = () => {
  todos.value.unshift({
    id: uuidv4(),
    text: newToDoText.value,
    completed: false
  })

  console.log(todos.value)

  newToDoText.value = ''
}

const completeToDo = (id) => {
  let todo = todos.value.find((todo) => todo.id == id)

  if (todo) todo.completed = !todo.completed
}

const removeToDo = (id) => {
  todos.value = todos.value.filter((todo) => todo.id != id)
}

const todos = ref([])
</script>

<style>
@import 'bulma/css/bulma.min.css';

.wrapper-todo {
  max-width: 400px;
  padding: 20px;
  margin: 0 auto;
}

.completed {
  text-decoration: line-through;
}
</style>
