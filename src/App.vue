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
      <div class="card-content" :class="{ 'has-background-success-light': todo.completed }">
        <div class="content">
          <div class="columns is-mobile is-vcentered">
            <div class="column" :class="{ completed: todo.completed }">
              {{ todo.text }}
            </div>
            <div class="column has-text-right">
              <button
                class="button"
                @click="completeToDo(todo.id)"
                :class="{ 'has-text-success': todo.completed }"
              >
                &check;
              </button>
              <button class="button ml-1" @click="removeToDo(todo.id)">&cross;</button>
            </div>
          </div>
          <div class="columns is-mobile is-vcentered">
            <div class="column">
              <span class="is-size-7 is-outlined is-info">
                {{ timestampFormatted(todo.timestamp) }}
              </span>
            </div>
            <div class="column has-text-right">
              <button
                class="button is-size-7"
                :class="{ 'is-danger': todo.important }"
                @click="markAsImportant(todo.id)"
              >
                Важно
              </button>
              <button
                class="button is-size-7 ml-1"
                :class="{ 'is-danger': todo.urgent }"
                @click="markAsUrgent(todo.id)"
              >
                Срочно
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'

const newToDoText = ref('')

const addToDo = () => {
  todos.value.unshift({
    id: uuidv4(),
    text: newToDoText.value,
    completed: false,
    important: false,
    urgent: false,
    timestamp: new Date()
  })

  console.log(todos.value)

  newToDoText.value = ''
}

const completeToDo = (id) => {
  let todo = todos.value.find((todo) => todo.id == id)

  if (todo) todo.completed = !todo.completed
}

const markAsImportant = (id) => {
  let todo = todos.value.find((todo) => todo.id == id)

  if (todo) todo.important = !todo.important
}

const markAsUrgent = (id) => {
  let todo = todos.value.find((todo) => todo.id == id)

  if (todo) todo.urgent = !todo.urgent
}

const removeToDo = (id) => {
  todos.value = todos.value.filter((todo) => todo.id != id)
}

const todos = ref([])

const currentDate = new Date()

const timestampFormatted = (timestamp) => {
  const timestampDate = timestamp

  const year = timestampDate.getFullYear()
  const month = timestampDate.getMonth()
  const day = timestampDate.getDate()
  const hours = timestampDate.getHours()
  const minutes = timestampDate.getMinutes()

  if (
    year == currentDate.getFullYear() &&
    month == currentDate.getMonth() &&
    day == currentDate.getDate()
  ) {
    return `${hours > 10 ? hours : '0' + hours}:${minutes > 10 ? minutes : '0' + minutes}`
  } else {
    return `${day}.${month > 10 ? month + 1 : '0' + (month + 1)}.${year}`
  }
}

onMounted(async () => {
  const querySnapshot = await getDocs(collection(db, 'todos'))

  const fetchedTodos = []

  querySnapshot.forEach((doc) => {
    const docData = doc.data()

    const todo = {
      id: doc.id,
      text: docData.text,
      completed: docData.completed,
      timestamp: docData.timestamp.toDate(),
      important: docData.important,
      urgent: docData.urgent
    }

    fetchedTodos.push(todo)
  })

  fetchedTodos.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  todos.value = fetchedTodos
})
</script>

<style>
@import 'bulma/css/bulma.min.css';

.wrapper-todo {
  max-width: 500px;
  padding: 20px;
  margin: 0 auto;
}

.completed {
  text-decoration: line-through;
}
</style>
