const get = (query, element = document) => element.querySelector(query);

const getDiceFiels = (element) => ({
  count: get('.count', element),
  diceType: get('.dice-type', element),
  sidesCount: get('.sides-count', element),
  modifier: get('.modifier', element),
  removeButton: get('.remove', element),
});

const doNTimes = (n, callback) => {
  for (let i = 0; i < n; i++) {
    callback();
  }
};

window.addEventListener('load', () => {
  const throwButton = get('#throw');
  const clearButton = get('#clear');
  const addButton = get('#add-dice');
  const results = get('#list');
  const dicesList = get('#dices-list');
  const diceTemplate = get('#dice-template');
  let dicesSettings = [];
  let lastId = 0;

  function addDice() {
    const dice = diceTemplate.cloneNode(true);
    const fields = getDiceFiels(dice);
    const id = `${lastId++}`;
    dice.id = id;

    const remove = () => {
      if (dicesSettings.length > 1) {
        dice.removeEventListener('click', remove);
        dicesSettings = dicesSettings.filter(([d]) => d.id !== id);
        dice.remove();
      } //
      else {
        alert('You need at least one dice to throw.');
      }
    };

    fields.removeButton.addEventListener('click', remove);
    fields.diceType.addEventListener('input', (e) => {
      const numberOfSides = fields.diceType.value;
      const isCustom = numberOfSides === 'custom';
      fields.sidesCount.disabled = !isCustom;
      if (!isCustom) {
        fields.sidesCount.value = numberOfSides;
      }
    });

    dicesList.appendChild(dice);
    dicesSettings.push([dice, fields]);
  }

  function addResultToTheList(description, result) {
    const newResult = document.createElement('li');
    newResult.innerHTML = `${description} = ${result}`;
    results.appendChild(newResult);
    results.scrollTop = results.scrollHeight;
  }

  throwButton.addEventListener('click', () => {
    let description = '';
    let result = 0;

    dicesSettings.forEach(([, fields], index) => {
      const numberOfDices = parseInt(fields.count.value);
      const sidesCount = parseInt(
        fields.diceType.value === 'custom'
          ? fields.sidesCount.value
          : fields.diceType.value
      );
      const mod = parseInt(fields.modifier.value);

      description += `${index > 0 ? ' +' : ''} ${
        numberOfDices || ''
      }k${sidesCount}${mod != 0 ? ` + ${mod}` : ''}`;

      doNTimes(numberOfDices, () => {
        result += Math.ceil(Math.random() * sidesCount);
      });

      result += mod;
    });

    addResultToTheList(description, result);
  });

  addButton.addEventListener('click', () => {
    addDice();
  });

  clearButton.addEventListener('click', () => {
    results.innerHTML = '';
  });

  addDice();
});
