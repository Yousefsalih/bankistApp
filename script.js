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
const displayMovements = function(movements, sort = false) {

  containerMovements.innerHTML = ''; //removes values

  //Adding sort
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements

  movs.forEach(function (mov, i){
    const type = mov > 0 ? 'deposit' : 'withdrawal'
    const html = `
          <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov.toFixed(2)}€</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html) //4 different types of inputs (afterbegin, before end, etc.) The order of element matters to choose the right one//html is the variable above
  })
}

// displayMovements(account1.movements);


//Display final balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
  // console.log(balance); //3840 for the first account
};

// calcDisplayBalance(account1.movements)

//Display the summary of the totals
const calcDisplaySummary = function(acc) {
  //Display the income
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

//Display the withdrawal amount
const withdrawal = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(withdrawal).toFixed(2)}€`;

//Display the interest total
const interest = acc.movements
.filter(mov => mov > 0)
.map(deposit => (deposit * acc.interestRate) / 100).filter((int, i, arr) => {
  // console.log(arr);
  return int >= 1;
})
.reduce((acc, int) => acc + int, 0);
labelSumInterest.textContent = `${interest.toFixed(2)}€`;
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
// console.log(accounts); //Updates are made

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
  if (currentAccount?.pin === +(inputLoginPin.value)) {
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
  const amount = +(inputTransferAmount.value);
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

//Close Account Function
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (inputCloseUsername.value === currentAccount.username && +(inputClosePin.value) === currentAccount.pin) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    console.log(index); //0 (Jonas object)
    accounts.splice(index, 1) ///Delete Account
    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = ''
})

//Request Loan Function
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value)
  // +(inputLoanAmount.value);
  //Number(inputLoanAmount.value)
//Using the .some method: Sets a condition where any of the values are true
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)){
    //Add movement
    currentAccount.movements.push(amount);

    //Update UI
    updateUI(currentAccount)
  }
  inputLoanAmount.value = '';

})

//Testing out the flat method in order for the bank to calculate the total balance of all of the movements (transactions) in the bank
const accountMovements = accounts.map(acc => acc.movements);
console.log(accountMovements); //Creates 1 array of 4 nested arrays
const allMovements = accountMovements.flat(); //Combines all arrays into one array
console.log(allMovements);
const overallBalance = allMovements.reduce((acc, mov) => acc + mov, 0); //Sums up the total values
console.log(overallBalance);//17840

//Same as above but using chaining methods
const overallBalance2 = accounts.map(acc => acc.movements).flat().reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance2);

//Using flatMap: Combines both map and flat methods. It is better for performance. Flat map can only go one level deep, therefore, if you need to go deeper, use the flat method.

const overallBalance3 = accounts.flatMap(acc => acc.movements).reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance3);

let sorted = false;

//Sort button
btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})

//.from() method in practice: Takes all the movements, puts it into an array and replaces the euro sign as well
// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => Number(el.textContent.replace('€', ''))
//   )
//   console.log(movementsUI)
//Alternatively
//   const movementsUI2 = [...document.querySelectorAll('.movements__value')];
// })

//Exercise #1: Calculate total deposits
// const bankDepositSum = accounts.map(acc => acc.movements).flat();//Same as below
const bankDepositSum = accounts.flatMap(acc => acc.movements).filter(mov => mov > 0).reduce((sum, cur) => sum + cur, 0)
console.log(bankDepositSum);

//Exercise #2: Number of deposits that are at least 1000 euros

// const numDeposits1000 = accounts.flatMap(acc => acc.movements).filter(mov => mov >= 1000).length
//Alternative way using reduce
const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count , cur) => cur >= 1000 ? count + 1 : count, 0) //Alternative to count + 1 is ++count. The ++ prefixed operator works.

console.log(numDeposits1000);//6 deposits

let a = 10;
console.log(a++);//Still returns 10
console.log(a);//11

//Exercise #3: Calculate the sum of the deposits and withdrawals using the reduce method
const sums = accounts.flatMap(acc => acc.movements).reduce((sums, cur) => {
  cur > 0 ? sums.deposits += cur : sums.withdrawals += cur;
  return sums;
}, {deposits: 0, withdrawals: 0})

console.log(sums); //Object { deposits: 25180, withdrawals: -7340 }

const {deposits, withdrawals} = accounts.flatMap(acc => acc.movements).reduce((sums, cur) => {
  // cur > 0 ? sums.deposits += cur : sums.withdrawals += cur;
  sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;// same as above
  return sums;
}, {deposits: 0, withdrawals: 0})

console.log(deposits, withdrawals); //25180 -7340

//Exercise: Using the remainder operator (For the Nth time feature)
labelBalance.addEventListener('click', function(){
  [...document.querySelectorAll('movements__row')].forEach(function (row, i) {
    //Evens 0, 2, 4, 6
    if (i % 2 ===0) row.style.backgroundColor = 'orangered'
    //Odds
    if (i % 3 === 0) row.style.backgroundColor = 'blue';
  });
});