'use strict'
const MEME_KEY = 'memsDB'
const SIZE_KEY = 'sizeDB'

function saveToStorage(key, val) {
	localStorage.setItem(key, JSON.stringify(val))
}

function loadFromStorage(key) {
	var val = localStorage.getItem(key)
	return JSON.parse(val)
}
