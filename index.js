const element = document.querySelector('.navigation');

element.addEventListener('click', onTabClick, false);
window.addEventListener('load', function () {
  changeCalcButton();
});

// buttons
const clearBtn = document.querySelector('#clear');
const calculateBtn = document.querySelector('#calculate');

const mainBlock = document.querySelector('.main');

calculateBtn.addEventListener('click', () => {
  calculateResult();
});

clearBtn.addEventListener('click', () => {
  checkActiveTab().dataset.resultsBlock = 'hide';
  inputClear();
});
let activeTabId = '1';

// Changing tabs
function onTabClick(event) {
  const userSelectedTabId = event.target.dataset.tab;

  activeTabId = userSelectedTabId;

  let tabs = document.querySelectorAll('.navigation li');
  let tabPanels = document.querySelectorAll('.tabs-wrapper div');

  //   display results block depending on tab show attribute
  hideShowResult();
  changeCalcButton();

  // deactive existing active tab and panel
  tabs.forEach((tab) => {
    if (tab.dataset.tab === userSelectedTabId) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  tabPanels.forEach((tabPanel) => {
    if (tabPanel.dataset.tabpanel === userSelectedTabId) {
      calculateByEnter();
      tabPanel.classList.add('active');
    } else {
      tabPanel.classList.remove('active');
    }
  });
}

const toggleAttribute = (attributeName, value) => {
  const node = checkActiveTab();
  node.dataset[attributeName] = value;
};

// Let user calculate by pressing "Enter" button
function calculateByEnter() {
  getActiveInputs()['allInputsIntab'].forEach((input) => {
    input.addEventListener('keydown', (event) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        calculateResult();
      }
    });
  });
}

calculateByEnter();

function changeCalcButton() {



  // Check button when we change tab
  const { allInputsIntab: arrayOfInputs } = getActiveInputs();
  // Check if there are filled inputs
  let filledInputs = 0;

  arrayOfInputs.forEach((input) => {
    if (Number(input.value) > 0) {
      filledInputs++;
    }
  });

  if (filledInputs < arrayOfInputs.length) {
    calculateBtn.classList.remove('active-btn');
    calculateBtn.disabled = true;
  } else {
    calculateBtn.classList.add('active-btn');
    calculateBtn.disabled = false;
  }


  // Add event to all inputs 
  arrayOfInputs.forEach((input) => {
    input.addEventListener('input', () => {
      let values = [];
      arrayOfInputs.forEach((itm) => values.push(itm.value.trim()));

      calculateBtn.disabled = values.includes('') || values.some((v) => v < 0);

      if (!calculateBtn.disabled) {
        calculateBtn.className = 'btn active-btn';
      } else {
        calculateBtn.className = 'btn';
      }
    });
  });
}

function inputClear() {
  const activeBottomBlock = document.querySelector(
    `.result-block #${checkActiveTab().id}`
  );

  const {allInputsIntab :currentInputsBlock} = getActiveInputs()

  currentInputsBlock.forEach((input) => {
    input.value = '';
  });
  activeBottomBlock.classList.remove('active-result');
  mainBlock.classList.remove('main-border-hide');

  calculateBtn.disabled = true;
}

function validateInputs(...args) {
  const validatedInputs = args[0].filter((item) => Number(item) > 0).length;

  if (validatedInputs == args[0].length) {
    return true;
  }

  return false;
}

function hideShowResult() {
  const allInfoBlocks = document.querySelectorAll('.result-block > div');
  const activeTab = checkActiveTab();

  toggleMainBorder();

  allInfoBlocks.forEach((infoBlock) => {
    if (
      infoBlock.dataset.resultBlock === activeTab.dataset.tab &&
      activeTab.dataset.resultsBlock === 'show'
    ) {
      infoBlock.classList.add('active-result');
    } else {
      infoBlock.classList.remove('active-result');
    }
  });
}

function toggleMainBorder() {
  const activeTab = checkActiveTab();

  if (activeTab.dataset.resultsBlock === 'show') {
    mainBlock.classList.add('main-border-hide');
  } else {
    mainBlock.classList.remove('main-border-hide');
  }
}

// check active tab
function checkActiveTab() {
  return document.querySelector(`[data-tab="${activeTabId}"]`);
}

function getActiveInputs() {
  const allInputsIntab = document.querySelectorAll(
    `.main [data-tabpanel="${activeTabId}"] input`
  );
  const allBottomBlockInputs = document.querySelectorAll(
    `.result-block [data-result-block="${activeTabId}"] input`
  );

  return { allInputsIntab, allBottomBlockInputs };
}

function calculateResult() {
  const activeTab = checkActiveTab();

  const { allInputsIntab, allBottomBlockInputs } = getActiveInputs();

  const arrayOfValues = Array.from(allInputsIntab).map((input) => input.value);

  const hashmapAllInputsTab = Array.from(allInputsIntab).reduce(
    (accum, input) => {
      accum[input.name] = Number(input.value);
      return accum;
    },
    {}
  );

  const hashmapAllInputsResult = Array.from(allBottomBlockInputs).reduce(
    (accum, input) => {
      accum[input.name] = input;
      return accum;
    },
    {}
  );

  if (activeTab.id == 'average-kilometers-consuming') {
    if (validateInputs(arrayOfValues)) {
      const { fuel_consumed, fuel_price, reached_distance } =
        hashmapAllInputsTab;
      const { average_consuming, avg_price_per_km, total_price } =
        hashmapAllInputsResult;

      average_consuming.value = (
        (fuel_consumed / reached_distance) *
        100
      ).toFixed(2);
      avg_price_per_km.value = (
        (fuel_price * Number(average_consuming.value)) /
        100
      ).toFixed(2);
      total_price.value = (
        Number(avg_price_per_km.value) * reached_distance
      ).toFixed(2);

      inputClear();

      //   deactivate  calc button
      changeCalcButton(allInputsIntab);

      toggleAttribute('resultsBlock', 'show');
      hideShowResult();
    } else {
      alert('There is an empty input field');
    }
  } else {
    if (validateInputs(arrayOfValues)) {
      const { fuel_auto_consumed, fuel_price, travelling_distance } =
        hashmapAllInputsTab;
      const {
        avg_perKm,
        fuel_consuming,
        total_price,
        fuel_consuming_span,
        total_price_span,
      } = hashmapAllInputsResult;

      fuel_consuming_span.value = `л/${travelling_distance} км`;
      total_price_span.value = `грн/${travelling_distance} км`;

      fuel_consuming.value = (
        (travelling_distance / 100) *
        fuel_auto_consumed
      ).toFixed(2);
      avg_perKm.value = ((fuel_price * fuel_auto_consumed) / 100).toFixed(2);
      total_price.value = (fuel_price * fuel_consuming.value).toFixed(2);

      inputClear();
      changeCalcButton(allInputsIntab);

      toggleAttribute('resultsBlock', 'show');

      hideShowResult();
    } else {
      alert('There is an empty input field');
    }
  }
}
