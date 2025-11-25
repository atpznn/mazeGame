<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  createMap,
  discoverAround,
  initDiscovered,
  renderMap,
  turnLeft,
  turnRight,
  walk,
} from './gameEngine'
const testText =
  '[x][x][x][x][x][x][x][x]\n[x][x][x][_][_][x][x][x]\n[s][_][_][_][x][x][o][x]\n[x][x][x][_][x][x][_][x]\n[x][x][x][_][_][_][_][x]\n[x][x][x][x][x][x][x][x]\n'
const state = ref<string[][]>(createMap(testText))
const command = ref<string>('')
const direction = ref<string>('>')
const discovered = ref<[number, number][]>(initDiscovered(state.value))
const map = computed(() => renderMap(state.value, direction.value, discovered.value))
function onCommand() {
  const cmd = command.value.toLowerCase()
  let isFinish = false
  if (cmd == 'walk') {
    const [_isFinish, _state] = walk(state.value, direction.value)
    state.value = _state
    console.log('state', _isFinish)
    isFinish = _isFinish
  } else if (cmd == 'turnleft') {
    direction.value = turnLeft(direction.value)
  } else if (cmd == 'turnright') {
    direction.value = turnRight(direction.value)
  } else {
    window.alert('unknown command')
    return
  }
  if (isFinish) {
    window.alert('You Win !!!')
    state.value = createMap(testText)
    discovered.value = []
  }
  discovered.value = discoverAround(state.value, discovered.value)
  command.value = ''
}
</script>

<template>
  <div>
    <div>คำสั่งมี walk | turnLeft | turnRight</div>
    <div
      v-for="(row, indexRow) in map.split('\n')"
      :key="indexRow"
      :style="{ display: 'flex', gap: '12px' }"
    >
      <div v-for="(cell, indexCell) in row" :key="indexCell">
        {{ cell }}
      </div>
    </div>
  </div>
  <input v-model="command" placeholder="command" @keyup.enter="onCommand" />
</template>

<style scoped></style>
