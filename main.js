const $btnKick = document.getElementById("btn-kick");
const $btnSpecialKick = document.getElementById("btn-special-kick");
const $logs = document.getElementById("logs");

const renderHPLife = function() {
    const { elHP, damageHP, defaultHP } = this;
    elHP.innerText = damageHP + ' / ' + defaultHP;
};

const renderProgressbarHP = function() {
    const { damageHP, defaultHP, elProgressbar } = this;
    const percent = (damageHP / defaultHP) * 100;
    elProgressbar.style.width = percent + '%';

    elProgressbar.classList.remove('low', 'critical');

    if (percent < 60 && percent > 20) {
        elProgressbar.classList.add('low');
    } else if (percent <= 20) {
        elProgressbar.classList.add('critical');
    }
};

const renderHP = function() {
    this.renderHPLife();
    this.renderProgressbarHP();
};

const changeHP = function(count) {
    this.damageHP -= count;

    const { name } = this;
    let currentHP = this.damageHP;

    if (currentHP <= 0) {
        currentHP = 0;
        this.damageHP = 0;
        alert('Бідний ' + name + ' програв бій!');

        if (this === character) {
            $btnKick.disabled = true;
            $btnSpecialKick.disabled = true;
        }
    }

    this.renderHP();
    checkAllEnemiesDefeated();
};

const character = {
    name: 'Pikachu',
    defaultHP: 300,
    damageHP: 300,
    elHP: document.getElementById('health-character'),
    elProgressbar: document.getElementById('progressbar-character'),

    renderHP: renderHP,
    renderHPLife: renderHPLife,
    renderProgressbarHP: renderProgressbarHP,
    changeHP: changeHP,
};

const enemy1 = {
    name: 'Charmeleon',
    defaultHP: 150,
    damageHP: 150,
    elHP: document.getElementById('health-enemy-1'),
    elProgressbar: document.getElementById('progressbar-enemy-1'),

    renderHP: renderHP,
    renderHPLife: renderHPLife,
    renderProgressbarHP: renderProgressbarHP,
    changeHP: changeHP,
};

const enemy2 = {
    name: 'Bulbasaur',
    defaultHP: 160,
    damageHP: 160,
    elHP: document.getElementById('health-enemy-2'),
    elProgressbar: document.getElementById('progressbar-enemy-2'),

    renderHP: renderHP,
    renderHPLife: renderHPLife,
    renderProgressbarHP: renderProgressbarHP,
    changeHP: changeHP,
};

function generateLog(attacker, defender, damage) {
    const { name: attackerName } = attacker;
    const { name: defenderName, damageHP, defaultHP } = defender;

    const logString = logs[random(logs.length) - 1];

    const text = logString.replace('[ПЕРСОНАЖ №1]', attackerName)
        .replace('[ПЕРСОНАЖ №2]', defenderName);

    return `<p>${text}. <b>-${damage}</b> HP. [${damageHP}/${defaultHP}]</p>`;
}

function displayLog(logEntry) {
    $logs.insertAdjacentHTML('afterbegin', logEntry);
}


function init() {
    console.log('Start Game!');
    character.renderHP();
    enemy1.renderHP();
    enemy2.renderHP();
}

function random(num) {
    return Math.ceil(Math.random() * num);
}

function checkAllEnemiesDefeated() {
    const { damageHP: enemy1HP } = enemy1;
    const { damageHP: enemy2HP } = enemy2;
    const { name: characterName } = character;

    if (enemy1HP <= 0 && enemy2HP <= 0) {
        alert(characterName + ' переміг усіх!');
        $btnKick.disabled = true;
        $btnSpecialKick.disabled = true;
    }
}

function handleAttack(playerDamageMax) {
    const { damageHP: enemy1HP_before } = enemy1;
    const { damageHP: enemy2HP_before } = enemy2;

    if (enemy1HP_before > 0) {
        const damage = random(15);
        character.changeHP(damage);
        displayLog(generateLog(enemy1, character, damage));
    }

    if (enemy2HP_before > 0 && character.damageHP > 0) {
        const damage = random(15);
        character.changeHP(damage);
        displayLog(generateLog(enemy2, character, damage));
    }

    const { damageHP: charHP_after } = character;
    if (charHP_after > 0) {

        if (enemy1HP_before > 0) {
            const damage = random(playerDamageMax);
            enemy1.changeHP(damage);
            displayLog(generateLog(character, enemy1, damage));
        }

        if (enemy2HP_before > 0) {
            const damage = random(playerDamageMax);
            enemy2.changeHP(damage);
            displayLog(generateLog(character, enemy2, damage));
        }
    }
}

// стандартная атака (до 30 хп)
$btnKick.addEventListener('click', function() {
    console.log('Thunder Shock!');
    handleAttack(30);
});

// - сильная атака (до 50 хп)
$btnSpecialKick.addEventListener('click', function() {
    console.log('Mega Shock!');
    const damage = Math.floor(Math.random() * 51) + 50; // от 50 до 100 включительно
    handleAttack(damage);
});

init();
