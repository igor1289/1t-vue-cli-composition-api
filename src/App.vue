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
      <div class="field is-grouped">
        <p class="control">
          <button
            class="button"
            :class="{ 'is-danger': filterByImportance }"
            @click.prevent="toggleImportanceFilter()"
          >
            Важные
          </button>
          <button
            class="button ml-1"
            :class="{ 'is-danger': filterByUrgency }"
            @click.prevent="toggleUrgencyFilter()"
          >
            Срочные
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
import {
  collection,
  onSnapshot,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  where,
  getDocs
} from 'firebase/firestore'
import { db } from '@/firebase'

const todosCollectionRef = collection(db, 'todos')
let todosCollectionQuery = query(todosCollectionRef, orderBy('date', 'desc'))

//New item field
const newToDoText = ref('')

//Todos
const todos = ref([])

//Current date
const currentDate = new Date()

//Common filter update
const updateFilter = async () => {
  const filters = []

  if (filterByImportance.value) filters.push(where('important', '==', true))

  if (filterByUrgency.value) filters.push(where('urgent', '==', true))

  todosCollectionQuery = query(todosCollectionRef, orderBy('date', 'desc'), ...filters)

  readDocs(await getDocs(todosCollectionQuery))
}

//Importance filter
const filterByImportance = ref(false)

const toggleImportanceFilter = () => {
  filterByImportance.value = !filterByImportance.value
  updateFilter()
}

//Urgency filter
const filterByUrgency = ref(false)

const toggleUrgencyFilter = () => {
  filterByUrgency.value = !filterByUrgency.value
  updateFilter()
}

//Methods
const addToDo = async () => {
  await addDoc(todosCollectionRef, {
    text: newToDoText.value,
    completed: false,
    important: false,
    urgent: false,
    date: Date.now(),
    timestamp: new Date()
  })

  newToDoText.value = ''
}

const completeToDo = (id) => {
  let todo = todos.value.find((todo) => todo.id == id)

  if (todo) todo.completed = !todo.completed

  updateDoc(doc(todosCollectionRef, id), {
    completed: todo.completed
  })
}

const markAsImportant = (id) => {
  let todo = todos.value.find((todo) => todo.id == id)

  if (todo) todo.important = !todo.important

  updateDoc(doc(todosCollectionRef, id), {
    important: todo.important
  })
}

const markAsUrgent = (id) => {
  let todo = todos.value.find((todo) => todo.id == id)

  if (todo) todo.urgent = !todo.urgent

  updateDoc(doc(todosCollectionRef, id), {
    urgent: todo.urgent
  })
}

const removeToDo = (id) => {
  deleteDoc(doc(todosCollectionRef, id))
}

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
  onSnapshot(todosCollectionQuery, (querySnapshot) => {
    readDocs(querySnapshot)
  })
})

const readDocs = async (docs) => {
  const fetchedTodos = []

  docs.forEach((doc) => {
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

  todos.value = fetchedTodos
}
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
