// Changing tabs

function onTabClick(event) {
	const activeTabs = document.querySelectorAll('.active');


	// deactive existing active tab and panel
	activeTabs.forEach((tab) => {
		tab.classList.toggle('active') 
	})

	// active new tab and panel
	event.target.classList.toggle('active')
	
	document.querySelector(event.target.id).className = 'tab active'
	const avgKmConsum = 'average-kilometers-consuming'
	const distConsum = 'distance-consuming'

	if (document.querySelector(event.target.id).id == avgKmConsum) {
			activeCalcButton(avgConsumingForm.averageConsumingInputs) 
		
		if (avgConsumingForm.resultBlockShowed) {
			hideShowResult(distanceConsumingForm.distConsumRes, avgConsumingForm.avgRes)
			showMainBorder()
		} else {
			mainBlock.classList.replace("main-border-hide", null);
			hideAllResult()
		}

	} else if (document.querySelector(event.target.id).id == distConsum) {
		activeCalcButton(distanceConsumingForm.distanceConsumInputs) 

		if (distanceConsumingForm.resultBlockShowed) {
			hideShowResult(avgConsumingForm.avgRes, distanceConsumingForm.distConsumRes)
			showMainBorder()
		} else {
			mainBlock.classList.replace("main-border-hide", null);
			hideAllResult()

		}
	}

}

const element = document.querySelector('.navigation');

element.addEventListener('click', onTabClick, false);


// calculator 

// inputs average consuming form

const avgConsumingForm = {
	fuelConsumed: document.querySelector('#fuel_consumed'),
	distance: document.querySelector('#reached_distance'),
	fuelPrice: document.querySelector('#fuel_price'),

	averageConsuming: document.querySelector('#average_consuming'),
	avgPricePerKm: document.querySelector('#avg_price_per_km'),
	totalPrice: document.querySelector('#total_price'),

	averageConsumingInputs: document.querySelectorAll('#average-kilometers-consuming .input-field[type="number"]'),
	avgRes: document.querySelector('.result-block.inputs-block #average-kilometers-consuming'),

	resultBlockShowed: false
}

// inputs distance consuming form

const distanceConsumingForm = {
	fuelConsumed: document.querySelector('#fuel_auto_consumed'),
	distance: document.querySelector('#travelling_distance'),
	fuelPrice: document.querySelector('#distance-consuming #fuel_price'),

	fuelConsuming: document.querySelector('#distance-consuming #fuel_consuming'),
	avgPricePerKm: document.querySelector('#distance-consuming #avg_perKm'),
	totalPrice: document.querySelector('#distance-consuming #total_price'),

	distanceConsumInputs: document.querySelectorAll('#distance-consuming .input-field[type="number"]'),
	distConsumRes: document.querySelector('.result-block.inputs-block #distance-consuming'),

	fuelConsumingSpan: document.querySelector('#fuel_consuming_span'),
	totalPriceSpan: document.querySelector('#total_price_span'),

	resultBlockShowed: false
}


function calculateByEnter(arrayOfInputs) {
	arrayOfInputs.forEach(input => {
		input.addEventListener('keydown', (event) => {
			if(event.code === 'Enter' || event.code === 'NumpadEnter') {
				calculateResult()
			}
		})
	})
}

calculateByEnter(avgConsumingForm.averageConsumingInputs)
calculateByEnter(distanceConsumingForm.distanceConsumInputs)



// buttons
const clearBtn = document.querySelector('#clear');
const calculateBtn = document.querySelector('#calculate');

let formProps = {
	currentTab: 'average-kilometers-consuming',
	currentTabResult: false
}
const mainBlock = document.querySelector('.main');

calculateBtn.disabled = true


function activeCalcButton(arrayOfInputs) {


	// Check if there are filled inputs 
	let filledInputs = 0

	arrayOfInputs.forEach(input => {
		if(input.value) {
			filledInputs++
		}
	})

	if (filledInputs < arrayOfInputs.length) {
		calculateBtn.className = 'btn'
	} else {
		calculateBtn.className = 'btn active-btn'
	}


	arrayOfInputs.forEach(input => {
		input.addEventListener('input', () => {
			let values = []
			arrayOfInputs.forEach(itm => values.push(itm.value))
			calculateBtn.disabled = values.includes('')

			if(!calculateBtn.disabled) {
				calculateBtn.className = 'btn active-btn'
			} else {
				calculateBtn.className = 'btn'
			}
		})
	})


}

activeCalcButton(avgConsumingForm.averageConsumingInputs) 
activeCalcButton(distanceConsumingForm.distanceConsumInputs) 

function inputClear() {


	if(avgConsumingForm.avgRes.classList[0]) {
		avgConsumingForm.avgRes.classList.replace('active-result', null)
		mainBlock.classList.replace('main-border-hide', null)
		avgConsumingForm.resultBlockShowed = false
	} else if (distanceConsumingForm.distConsumRes.classList[0]) {
		distanceConsumingForm.distConsumRes.classList.replace('active-result', null)
		mainBlock.classList.replace('main-border-hide', null)
		distanceConsumingForm.resultBlockShowed = false
	}
	

	if (checkActiveTab() == 'average-kilometers-consuming') {
		avgConsumingForm.averageConsumingInputs.forEach((item) => {
			item.value = ''
		})
	} else {
		distanceConsumingForm.distanceConsumInputs.forEach((item) => {
			item.value = ''
		})
	}
	
}

function validateInputs (...args) {
	const validatedInputs = args.filter(item => item).length;

	if (validatedInputs == args.length) {
		return true
	}

	return false
}

function hideShowResult(hide, show) {
	hide.classList = ''
	show.className += ' active-result'
}

function hideAllResult() {
	avgConsumingForm.avgRes.className = ''
	distanceConsumingForm.distConsumRes.className = ''
}

function showMainBorder() {
	mainBlock.className += ' main-border-hide'
}

// check active tab
function checkActiveTab() {
	let activeTab;
	document.querySelectorAll('.tabs-wrapper div').forEach(item => {
		if (item.classList.contains('active')) {
			activeTab = item.id  
		}
	})
	return activeTab
}

function convertDecimals(...args) {
	args.forEach(inputField => {
		if (inputField.id != 'total_price') {
			inputField.value = Number(inputField.value).toFixed(2)
		}
	})
}

function calculateResult() {
		if (checkActiveTab() == 'average-kilometers-consuming') {

				if (validateInputs(avgConsumingForm.fuelConsumed.value, avgConsumingForm.distance.value, avgConsumingForm.fuelPrice.value)) {


					avgConsumingForm.averageConsuming.value = (Number(avgConsumingForm.fuelConsumed.value) / Number(avgConsumingForm.distance.value) * 100)
					avgConsumingForm.avgPricePerKm.value = (Number(avgConsumingForm.fuelPrice.value) * Number(avgConsumingForm.averageConsuming.value) / 100)
					avgConsumingForm.totalPrice.value = (Number(avgConsumingForm.avgPricePerKm.value) * Number(avgConsumingForm.distance.value))

					convertDecimals(avgConsumingForm.averageConsuming,
									avgConsumingForm.avgPricePerKm,
									avgConsumingForm.totalPrice)

					inputClear()
					activeCalcButton(avgConsumingForm.averageConsumingInputs) 


					hideShowResult(distanceConsumingForm.distConsumRes, avgConsumingForm.avgRes)

					showMainBorder()
					avgConsumingForm.resultBlockShowed = true
				
				} else {
					alert('There is an empty input field')
				}
			} else {
				if (validateInputs(distanceConsumingForm.fuelConsumed.value, distanceConsumingForm.distance.value, distanceConsumingForm.fuelPrice.value)) {

					distanceConsumingForm.fuelConsumingSpan.innerHTML = `л/${distanceConsumingForm.distance.value} км`
					distanceConsumingForm.totalPriceSpan.innerHTML = `грн/${distanceConsumingForm.distance.value} км`
					distanceConsumingForm.fuelConsuming.value =  (Number(distanceConsumingForm.distance.value) / 100 *  Number(distanceConsumingForm.fuelConsumed.value))
					distanceConsumingForm.avgPricePerKm.value =  (Number(distanceConsumingForm.fuelPrice.value) * Number(distanceConsumingForm.fuelConsumed.value) / 100)
					distanceConsumingForm.totalPrice.value = (Number(distanceConsumingForm.fuelPrice.value) * Number(distanceConsumingForm.fuelConsuming.value))

					convertDecimals(distanceConsumingForm.fuelConsuming,
									distanceConsumingForm.fuelConsuming,
									distanceConsumingForm.totalPrice)
					inputClear()
					activeCalcButton(distanceConsumingForm.distanceConsumInputs) 


					hideShowResult(avgConsumingForm.avgRes, distanceConsumingForm.distConsumRes)

					showMainBorder()

					distanceConsumingForm.resultBlockShowed = true
				} else {
					alert('There is an empty input field')
				}
			}
}

calculateBtn.addEventListener('click',() => {
	calculateResult()
})

clearBtn.addEventListener('click', () => {
	inputClear()
})




