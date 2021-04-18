/* -------------------------------------------------------------------------- */
/*                                Client Script                               */
/* -------------------------------------------------------------------------- */

/* ------------------ Global Variables and PageLoad Script ------------------ */

  // Define global variables and arrays to populate over time through program sequence
  let transactions = [];
  let myChart;


  /*
    Script that runs every page load
  */

  // API Call to GET All Transactions (Hits GET Route on API Routes)
  fetch("/api/transaction")
    // Returns data response to json
    .then(response => {
      return response.json();
    })
    // Takes JSON response, sets it equal to transactions array (array of json objects returned)
    .then(data => {
      // save db data on global variable
      transactions = data;
      // Uses data to populate the Totals, tables, and charts
      populateTotal();
      populateTable();
      populateChart();
    });

/* -------------------------- Function Declarations ------------------------- */

  // Function to populate total sum of transactions

    /*

      Note (Reducer Method) Reducer method runs reducer function (that I provide)
      on each element of the transactions array with goal to provide an output of
      one single value for a given array. 

      This reduce method below is taking a varaible I call total, and setting
      it equal to a singel value we calculate.Total is the accumulator, and t is the 
      current value.

      So here it loops through the value property of each given array object (t) coming
      from my transactions array I pull with the opening API call and adds it to the total item
      (which is the accumulator within the reducer function). In the end, this gives me the value 
      sum of all transactions returned. 

      parseint just takes a string and returns an integer (more to this but thats what it does here)

    */

    function populateTotal() {
      // Reduce transaction amounts to a single total value
      let total = transactions.reduce((total, t) => {
        return total + parseInt(t.value);
      }, 0);
      // Get the total field from the DOM
      let totalEl = document.querySelector("#total");
      // Set the total amount as the textcontent of the total field in the DOM
      totalEl.textContent = total;
    }

  // Function to Populate Table Value
    function populateTable() {
      // Gets TBody from the DOM
      let tbody = document.querySelector("#tbody");
      // Sets tBody html to an empty string
      tbody.innerHTML = "";
      // Goes through each trasaction and...
      transactions.forEach(transaction => {
        // creates a table row
        let tr = document.createElement("tr");
        // Sets the inner html of the table row to two colums, name and value of transaction
        tr.innerHTML = `
          <td>${transaction.name}</td>
          <td>${transaction.value}</td>
        `;
        // Appends the row to the table body at screen top
        tbody.appendChild(tr);
      });
    }

  // Function to Populate the Chart
    function populateChart() {
      // Declares a variable equal to reversed trasnaction array
      let reversed = transactions.slice().reverse();
      // Declares sum as 0 value
      let sum = 0;

      // Creates Chart labels
        /*
          Note on Map - creates a new array by looping through 
          a current array and running a function on each array item
        */
      let labels = reversed.map(t => {
        // Gets date value from each transaction
        let date = new Date(t.date);
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
      });
      // Creates incremental values for the chart
      let data = reversed.map(t => {
        sum += parseInt(t.value);
        return sum;
      });
      // If old chart exists, it removes it
      if (myChart) {
        myChart.destroy();
      }
      // Content Below per docs of chart.js...
      let ctx = document.getElementById("myChart").getContext("2d");
      myChart = new Chart(ctx, {
        type: 'line',
          data: {
            labels,
            datasets: [{
                label: "Total Over Time",
                fill: true,
                backgroundColor: "#6666ff",
                data
            }]
        }
      });
    }

  // Function to Send a New Transaction
    function sendTransaction(isAdding) {
      // Gets the value and name fields from the html
      let nameEl = document.querySelector("#t-name");
      let amountEl = document.querySelector("#t-amount");
      let errorEl = document.querySelector(".form .error");
      // Validates Form has information to submit..
      if (nameEl.value === "" || amountEl.value === "") {
        errorEl.textContent = "Missing Information";
        return;
      }
      else {
        errorEl.textContent = "";
      }
      // Creates a transaction object based on the inputs to the form fields
      let transaction = {
        name: nameEl.value,
        value: amountEl.value,
        date: new Date().toISOString()
      };
      // If funds are subtracted, convert value to negative integer
      if (!isAdding) {
        transaction.value *= -1;
      }
      // Otherwise (if values added) adds the new transaction to current transactions array
      transactions.unshift(transaction);
      // Re-run logic to populate ui with new record included in the overall transactions array
      populateChart();
      populateTable();
      populateTotal();
      // Also, post the new transaction to the DB via hitting the API call for post I setup
      fetch("/api/transaction", {
        method: "POST",
        body: JSON.stringify(transaction),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
      // Return the server response (which is just a copy of the newly created transactin based on submission)
      .then(response => {    
        return response.json();
      })
      // Then with that new response, if errors exist provide that text content to the error element
      .then(data => {
        if (data.errors) {
          errorEl.textContent = "Missing Information";
        }
        // Otherwise if no errors, clear the form for another entry
        else {
          nameEl.value = "";
          amountEl.value = "";
        }
      })
      // If something failed, save to index.db the clear form
      .catch(err => {
        // fetch failed, so save in indexed db
        saveRecord(transaction);
        // clear form
        nameEl.value = "";
        amountEl.value = "";
      });
    }

/* ----------------------- Event Handlers and Listners ---------------------- */

  // Listner / Handler for add transactoin button
  document.querySelector("#add-btn").onclick = function() {
    sendTransaction(true);
  };

  // Listner / Handler for subtract transactoin button
  document.querySelector("#sub-btn").onclick = function() {
    sendTransaction(false);
  };
