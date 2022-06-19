'use strict'
let gLines = 1 //*
var gCtx
let gIsUp = true
let gCanvas
let gStartPos = {
	x: 150,
	y: 48,
}
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']
function init() {
	createImgs()
	loadMemsList()
	loadFilter()
	renderImgs(gImgs)
}
function renderImgs(imgs) {
	var strHtml = imgs
		.map(function (img, idx) {
			return `
        <img id='${img.id}' src='${img.url}' onclick="initMemeEditor(${img.id},this)" data-random="false" alt='meme picture'/>
        `
		})
		.join(' ')

	document.querySelector('.gallery').innerHTML = strHtml
}
function initMemeEditor(imgId, th) {
	const meme = createGmeme(imgId)

	let plh = document.querySelector('.plh')
	const property = plh.dataset.property

	meme.txts[meme.tdx].isChosen = true
	plh.placeholder = meme.txts[meme.tdx][property]
	toggleView()

	initCanvas(th)
}
function initCanvas(th) {
	gCanvas = document.querySelector('.memeCanvas')
	gCtx = gCanvas.getContext('2d')
	let canvas2 = document.querySelector('.recCanvas')
	gCtx = gCanvas.getContext('2d')
	let imgObj = new Image()
	if (th.dataset.random === 'true') {
		imgObj.src = getRandomImgSrc()
		getRandomTxt()
		getSetImgObj(imgObj)
	} else imgObj.src = getImgSrc()

	imgObj.onload = function () {
		const meme = getSetMeme()
		gCanvas.style.cursor = 'grab'

		gCanvas.width = imgObj.width //* לא להיט
		gCanvas.height = imgObj.height
		canvas2.width = imgObj.width
		canvas2.height = imgObj.width

		drawCanvas(imgObj)
		addMouseListeners()
	}
	getSetImgObj(imgObj)
}
function drawCanvas() {
	const meme = getSetMeme()
	let imgObj = getSetImgObj()
	gCtx.drawImage(imgObj, 0, 0)

	meme.txts.forEach((txt) => {
		drawTxt(txt)
	})
}
function editTxt(elInput) {
	let property = elInput.dataset.property

	let value
	switch (elInput.type) {
		case 'select-one':
			value = elInput.options[elInput.selectedIndex].value
			break
		case 'checkbox':
			value = elInput.checked
			break
		default: // text, number
			value = elInput.value
			break
	}
	const meme = getSetMeme()
	meme.txts[meme.tdx][property] = value

	addBorder(meme)
	drawCanvas()
}
function toggleView() {
	document.querySelector('.meme-container').classList.toggle('hidden')
	document.querySelector('.gallery').classList.toggle('hidden')
}
function drawTxt(txt) {
	const meme = getSetMeme()
	gCtx.font = txt.size + 'px' + ' ' + txt.fontFamily
	gCtx.textAlign = txt.align
	gCtx.fillStyle = txt.color
	if (txt.isShadow) addTxtShadow(txt)
	if (txt.isOutline) addTxtOutline(txt)
	if (txt.isChosen) addBorder(meme)
	gCtx.fillText(txt.line, txt.x, txt.y)
}

function addTxt() {
	if (gLines === 0) return console.log('no')
	drawCanvas()
	const meme = getSetMeme()

	let elIdx = document.querySelectorAll('[data-id]')

	meme.txts.push(createTxt('New Line', 125, 50 + 202))
	meme.tdx = 2
	elIdx.forEach((el) => {
		el.dataset.id = meme.tdx
	})
	addBorder(meme)
	drawCanvas()
	gLines--
}
function deleteTxt() {
	const meme = getSetMeme()

	console.log('meme.idx:', meme.tdx)
	meme.txts.splice(meme.tdx, 1)
	meme.tdx--
	gLines++
	drawCanvas()
}
function chooseTxt(val) {
	const meme = getSetMeme()
	let plh = document.querySelector('.plh')
	plh.placeholder = ''

	if (meme.tdx === 0) gIsUp = true
	if (meme.tdx === meme.txts.length - 1 || !gIsUp) {
		gIsUp = false
		meme.tdx--
	} else if (meme.tdx === 0 || gIsUp) {
		gIsUp = true
		meme.tdx++
	} else meme.tdx++
	let txt = meme.txts[meme.tdx]

	addBorder(meme)
}
function addTxtShadow(txt) {
	gCtx.shadowColor = txt.shadowColor
	gCtx.shadowOffsetX = txt.shadowOffsetX
	gCtx.shadowOffsetY = txt.shadowOffsetY
	gCtx.shadowBlur = txt.shadowBlur
}
function addTxtOutline(txt) {
	gCtx.strokeStyle = txt.strokeStyle
	gCtx.lineWidth = txt.lineWidth
	gCtx.strokeText(txt.line, txt.x, txt.y)
}
function drawRect(txt) {
	let dis = txt.size * 1.2
	let y = txt.y - txt.size
	let x = txt.x - 25
	let xLeng = (txt.line.length * dis * 1.2) / 2.5 + 40
	gCtx.beginPath()
	gCtx.rect(x, y, xLeng, dis)
	gCtx.strokeStyle = '#0f87ff'
	gCtx.stroke()
}

function downloadImg(elLink) {
	var imgContent = gCanvas.toDataURL('image/jpg') // image/jpeg the default format
	elLink.href = imgContent
}
function addBorder(meme) {
	meme.txts[meme.tdx].isChosen = true
	drawRect(meme.txts[meme.tdx])
	if (meme.txts[meme.tdx].length === 0) return
	setTimeout(clearRect, 3000, meme.txts[meme.tdx])
}
function clearRect(txt) {
	const meme = getSetMeme()

	meme.txts.forEach((txt) => {
		txt.isChosen = false
	})
	let dis = txt.size * 1.2
	let y = txt.y - txt.size
	let x = txt.x - txt.x * 0.1
	let xLeng = (txt.line.length * dis * 1.2) / 3
	gCtx.clearRect(x, y, xLeng, dis)
	drawCanvas()
}
function addMouseListeners() {
	gCanvas.addEventListener('mousemove', onMove)
	gCanvas.addEventListener('mousedown', onDown)
	gCanvas.addEventListener('mouseup', onUp)
}
function onMove(ev) {
	const meme = getSetMeme()
	const currTxt = meme.txts[meme.tdx]
	if (currTxt.isDrag) {
		const pos = getEvPos(ev)
		const dx = pos.x - gStartPos.x
		const dy = pos.y - gStartPos.y
		moveTxt(dx, dy)
		gStartPos = pos
		drawCanvas()
		drawRect(meme.txts[meme.tdx])
	}
}
function onDown(ev) {
	const pos = getEvPos(ev)
	var x = isTxtClicked2(pos)
	if (!isTxtClicked(pos)) return

	setTxtIsDrag(true)
	gStartPos = pos
	gCanvas.style.cursor = 'grabbing'
}

function getEvPos(ev) {
	var pos = {
		x: ev.offsetX,
		y: ev.offsetY,
	}
	if (gTouchEvs.includes(ev.type)) {
		ev.preventDefault()
		ev = ev.changedTouches[0]
		pos = {
			x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
			y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
		}
	}
	return pos
}
function onUp() {
	const meme = getSetMeme()

	setTxtIsDrag(false)
	setTimeout(clearRect, 3000, meme.txts[meme.tdx])
	document.body.style.cursor = 'default'
	gCanvas.style.cursor = 'grab'
}

function save(el) {
	addMemeToSavedList()
}
function load() {
	let loadMemes = getSavedMemes()
	renderLoadImgs(loadMemes)
}
function renderLoadImgs(loadMeme) {
	var strHtml = loadMeme
		// changeId(meme)
		.map(function (meme, idx) {
			return `
        <img id='${meme.selectedImgId}' data-id='${meme.loadId}' src='${meme.imgUrl}' onclick="initLoadMeme(this)" data-random="false" alt='meme picture'/>
        `
		})
		.join(' ')

	document.querySelector('.gallery').innerHTML = strHtml
}
function initLoadMeme(btn) {
	const memes = getSavedMemes()
	let plh = document.querySelector('.plh')
	const property = plh.dataset.property
	memes.forEach((meme) => {
		if (meme.loadId === btn.dataset.id) {
			meme.txts[meme.tdx].isChosen = true
			plh.placeholder = meme.txts[meme.tdx][property]
			toggleView()
			getSetMeme(meme)
			initCanvas(btn)
		}
	})
}

function initMemeEditor1() {
	//* לעדכן data set וזזה אולי יפתור רת עניין הפלייס הולדר

	meme.txts[meme.tdx].isChosen = true
	plh.placeholder = meme.txts[meme.tdx][property]
	toggleView()
	initCanvas(th)
}

function onSetFilter(value) {
	const keyWords = document.querySelectorAll('.keyWord')
	let size = +value.dataset.size
	size += 2.4
	value.dataset.size = size
	let filter = getFilter()
	if (filter.keyword === value.dataset.property) return
	setFilter(value.dataset.property)
	let x = getGImgs()
	renderImgs(x)
	displayFilter(value)
	value.style.color = '#fe6e20'
}
function displayFilter(val) {
	let test = []
	const keyWords = document.querySelectorAll('.keyWord')
	keyWords.forEach((word) => {
		word.style.fontSize = word.dataset.size + 'px'
		word.style.color = '#f2a57b'
		test.push(word.dataset)
	})
	saveSize(test)
}
function loadFilter() {
	const filter = getFilterSize()

	const keyWords = document.querySelectorAll('.keyWord')
	keyWords.forEach((word, idx) => {
		word.dataset.size = filter[idx].size
		word.style.fontSize = word.dataset.size + 'px'
	})
}
function onMove1(btn) {
	let property = btn.dataset
	console.log('property:', property.move)

	const meme = getSetMeme()

	switch (property.move) {
		case 'up':
			meme.txts[meme.tdx].y -= 3
			break
		case 'down':
			meme.txts[meme.tdx].y += 3
			break
		case 'right':
			meme.txts[meme.tdx].x += 3
			break
		default:
			meme.txts[meme.tdx].x -= 3
			break
	}
	drawCanvas()
}
function editLocation(elInput) {
	console.log('btn:')
	const meme = getSetMeme()

	let property = elInput.options[elInput.selectedIndex].value

	switch (property) {
		case 'left':
			meme.txts[meme.tdx].x = 3
			break
		case 'center':
			meme.txts[meme.tdx].x = 150
			break

		default:
			meme.txts[meme.tdx].x = 250
			break
	}
	drawCanvas()
}
