'use strict';

//Different user accounts. For refactoring, we can add the date, description of the movement, and time. Using objects instead of maps to resemble a web API.
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4]; //Holding accounts array

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//Show the transactions
const displayMovements = function(movements) {

  containerMovements.innerHTML = ''; //removes values

  movements.forEach(function (mov, i){
    const type = mov > 0 ? 'deposit' : 'withdrawal'
    const html = `
          <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}€</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html) //4 different types of inputs (afterbegin, before end, etc.) The order of element matters to choose the right one//html is the variable above
  })
}

// displayMovements(account1.movements);


//Display final balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
  // console.log(balance); //3840 for the first account
};

// calcDisplayBalance(account1.movements)

//Display the summary of the totals
const calcDisplaySummary = function(acc) {
  //Display the income
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`

//Display the withdrawal amount
const withdrawal = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(withdrawal)}€`;

//Display the interest total
const interest = acc.movements
.filter(mov => mov > 0)
.map(deposit => (deposit * acc.interestRate) / 100).filter((int, i, arr) => {
  console.log(arr);
  return int >= 1;
})
.reduce((acc, int) => acc + int, 0);
labelSumInterest.textContent = `${interest}€`;
}

// calcDisplaySummary(account1.movements);

//Adding a username property for all the accounts based on the initials of the owner name:
const createUsernames = function (accs) { //Array of accounts
  //Side effect: Change/mutate original array
  accs.forEach(function(acc) { //Each account object in the accounts array
    acc.username = acc.owner //Create a username property with a value that provides initials of the owner name and transforms it to the following:
      .toLowerCase()
      .split(' ')
      .map(function (name) {
        return name[0];
      })
      .join('');
  });
};
createUsernames(accounts); //Call the function using the accounts array as the argument
console.log(accounts); //Updates are made

//Testing 1 user
// const createUsernames = function (user) {

// //Create a function to transform a name to initials for the username login
// const username = user.toLowerCase().split(' ').map(function(name){
//   return name[0];//Array(3) [ "s", "t", "w" ]
// }).join('');
//   return username
// };
// console.log(createUsernames('Steven Thomas Williams')); //stw

//To modify over an array, we use a forEach().

//Example using the find method
// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account); //returns account2 object

const updateUI = function (acc) {
  //Display movements
  displayMovements(acc.movements);
  //Display balance
  calcDisplayBalance(acc);
  //Display Summary
  calcDisplaySummary(acc);
  // console.log('LOGIN');
};

//Event handler for login
let currentAccount;

btnLogin.addEventListener('click', function (e) { //Enter button works in the form input as a click too
  e.preventDefault(); //prevent form from submitting because it refreshes the page
  console.log('LOGIN');

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value)
  console.log(currentAccount);//shows the account object
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and Welcome Message
    labelWelcome.textContent = `Welcome back. ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;

    //Clear Input fields
    inputLoginUsername.value = inputLoginPin.value = ''
    inputLoginPin.blur(); //Loses focus

    //Update UI
    updateUI(currentAccount);
  }
})

//Transfer Money
btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  // console.log(amount, receiverAcc);
  inputTransferAmount.value = inputTransferTo.value = '';

  if(amount > 0 && 
    receiverAcc && //Same as line 187 to ask if the account exists or not
    currentAccount.balance >= amount && 
    receiverAcc?.username !== currentAccount.username) {
      // console.log('Transfer Valid');
      //Doing the transfer
      currentAccount.movements.push(-amount);
      receiverAcc.movements.push(amount);

      //Update UI
      updateUI(currentAccount);
    }
})

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];