'use strict'

let gNextId = 1
let gNextLoadId = 1
let gImgs = []
let gMeme
var gImgObj
let gSavedMems = []
let gFilter = {keyword: 'fun'}
let gSizes = []
const memesSentences = [
	'I never eat falafel',
	'DOMS DOMS EVERYWHERE',
	'Stop Using i in for loops',
	'Armed in knowledge',
	'Js error "Unexpected String"',
	'One does not simply write js',
	'I`m a simple man i see vanilla JS, i click like!',
	'JS, HTML,CSS?? Even my momma can do that',
	'May the force be with you',
	'I know JS',
	'JS Where everything is made up and the rules dont matter',
	'Not sure if im good at programming or good at googling',
	'But if we could',
	'JS what is this?',
	'Write hello world , add to cv 7 years experienced',
]

function createImgs() {
	gImgs = []
	gImgs.push(
		createImage('/img/1.jpg', ['fun', 'bad']),
		createImage('/img/2.jpg', ['fun', 'happy', 'animal']),
		createImage('/img/3.jpg', ['fun', 'happy', 'animal']),
		createImage('/img/4.jpg', ['fun', 'happy', 'animal']),
		createImage('/img/5.jpg', ['fun', 'sad', 'awkward', 'bad']),
		createImage('/img/6.jpg', ['fun', 'happy', 'animal']),
		createImage('/img/7.jpg', ['fun', 'sad', 'awkward', 'bad']),
		createImage('/img/8.jpg', ['fun', 'sad', 'awkward', 'bad']),
		createImage('/img/9.jpg', ['fun', 'happy', 'animal'], 'sad'),
		createImage('/img/10.jpg', ['fun', 'happy', 'animal']),
		createImage('/img/11.jpg', ['fun', 'sad', 'awkward', 'bad']),
		createImage('/img/12.jpg', ['fun', 'happy', 'animal']),
		createImage('/img/13.jpg', ['fun', 'sad', 'awkward', 'bad'])
	)

	return gImgs
}

function getGImgs() {
	let filterImgs = []
	createImgs()
	gImgs.forEach((img) => {
		for (let i = 0; i < img.keywords.length; i++) {
			if (img.keywords[i] === gFilter.keyword) filterImgs.push(img)
		}
	})

	gImgs = filterImgs
	return gImgs
}

function getImgSrc() {
	var imgIdx = gImgs.findIndex(function (img) {
		return gMeme.selectedImgId === img.id
	})

	return gImgs[imgIdx].url
}

function getRandomImgSrc() {
	let idx = getRandomInt(0, gImgs.length - 1)
	gMeme.selectedImgId = gImgs[idx].id
	return gImgs[idx].url
}

function createImage(url, keywords) {
	return {
		id: gNextId++,
		url: url,
		keywords,
	}
}
function createGmeme(imgId) {
	return (gMeme = {
		selectedImgId: imgId,
		tdx: 0,
		txts: [createTxt('Your Text1', 125, 48), createTxt('Your Text', 125, 484)],
	})
}
function createTxt(line, x, y) {
	return {
		isChosen: false,
		line: line,
		size: 40,
		align: 'left',
		color: '#000000',
		fontFamily: 'Impact',
		isOutline: true,
		lineWidth: 2,
		strokeStyle: '#ffffff',
		isShadow: false,
		shadowColor: '#000000',
		shadowOffsetX: 1,
		shadowOffsetY: 1,
		shadowBlur: 0,
		x: x,
		y: y,
		isDrag: false,
	}
}
function getSetImgObj(imgObj) {
	if (!imgObj) return gImgObj
	gImgObj = imgObj
	return gImgObj
}
function getSetMeme(meme) {
	if (meme) {
		gMeme = meme
		return gMeme
	} else return gMeme
}
function isTxtClicked(clickedPos) {
	const pos = {
		x: gMeme.txts[gMeme.tdx].x,
		y: gMeme.txts[gMeme.tdx].y - gMeme.txts[gMeme.tdx].size / 2,
	}
	const distance = Math.sqrt(2 + (pos.y - clickedPos.y) ** 2)
	return distance <= gMeme.txts[gMeme.tdx].size / 2
}
function setTxtIsDrag(val) {
	gMeme.txts[gMeme.tdx].isDrag = val
}
function moveTxt(dx, dy) {
	gMeme.txts[gMeme.tdx].x += dx
	gMeme.txts[gMeme.tdx].y += dy
}
function locateClicklTxt(clickedPos) {
	gMeme.txts.forEach((txt, idx) => {
		const pos = {
			x: txt.x,
			y: txt.y - txt.size / 2,
		}
		const distance = Math.sqrt(2 + (pos.y - clickedPos.y) ** 2)
		if (distance <= txt.size / 2) {
			txt.isChosen = true
			txt.isDrag = true
			gMeme.tdx = idx
		}
	})
}
function getLine() {
	let x = getRandomInt(0, memesSentences.length)
	return memesSentences[x]
}
function getRandomTxt() {
	let x = getRandomInt(0, 2)
	if (x === 0) gMeme.txts.splice(1, 1)
	gMeme.txts.forEach((txt) => {
		txt.color = getRandomColor()
		txt.line = getLine()
		txt.strokeStyle = getRandomColor()
		txt.size = getRandomInt(20, 60)
	})
}
function addMemeToSavedList() {
	// if (gMeme.id === )
	gMeme.imgUrl = gImgObj.src
	gMeme.loadId = makeId()
	gSavedMems.push(gMeme)
	saveToStorage(MEME_KEY, gSavedMems)
}
function loadMemsList() {
	gSavedMems = loadFromStorage(MEME_KEY)
	if (!gSavedMems) gSavedMems = []
}
function getSavedMemes() {
	return gSavedMems
}
function setFilter(filter) {
	gFilter.keyword = filter
}
function getFilter() {
	return gFilter
}
function saveSize(val) {
	gSizes.fun = val[0].size
	gSizes.animal = val[1].size
	gSizes.bad = val[2].size
	gSizes.awkward = val[3].size
	gSizes.happy = val[4].size
	gSizes.sad = val[5].size

	saveToStorage(SIZE_KEY, val)
}
function getFilterSize() {
	gSizes = loadFromStorage(SIZE_KEY)
	if (!gSizes) {
		gSizes = [
			{size: '16', property: 'fun'},
			{size: '16', property: 'animal'},
			{size: '16', property: 'bad'},
			{size: '16', property: 'awkward'},
			{size: '16', property: 'happy'},
			{size: '16', property: 's'},
		]
	}
	return gSizes
}
function removeMemeFormSave(btn) {
	gSavedMems.splice(btn.dataset.mdx, 1)
	console.log('gSavedMems:', gSavedMems)
}
