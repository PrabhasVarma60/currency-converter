async function temp() {
    let from = document.getElementById("from").value;
    let to = document.getElementById("to").value;
    let conv = await fetch(`https://api.fxratesapi.com/latest?symbols=${to}&base=${from}`);
    let ans = await conv.json();
    let amt = document.getElementById("amount").value;
    let temp=ans.rates[to];

    if (amt === "") {
        alert("Enter amount");
    } else {
        let convAmt = parseFloat(amt);
        let output = Number((convAmt * ans.rates[to]).toFixed(2));
        let history = {
            oneamt: Number(temp),   
            userfrom: from,
            userto: to,
            fromamt: convAmt,
            toamt: output,
            date: new Date().toLocaleString()
        };
        let storedHistory = JSON.parse(localStorage.getItem("history")) || [];
        storedHistory.push(history);
        localStorage.setItem("history", JSON.stringify(storedHistory));
        document.getElementById("output").innerHTML =
            `<div class="alert alert-success">Output: <strong>${output} ${to}</strong></div>`;
    }
}

function showHistory() {
    let storedHistory = JSON.parse(localStorage.getItem("history")) || [];
    let historyDiv = document.getElementById("history");

    if (storedHistory.length === 0) {
        historyDiv.innerHTML = "<p class='text-muted'>No conversions yet.</p>";
        return;
    }

    storedHistory = storedHistory.reverse();
    let html = "";
    for (let i=0;i<storedHistory.length;i++) {
      let prevhis=null;
      for(let j=i+1;j<storedHistory.length;j++)
      {
        if(storedHistory[j].userfrom==storedHistory[i].userfrom && storedHistory[j].userto==storedHistory[i].userto )
        {
          prevhis=storedHistory[j].oneamt;
        }
      }
      let gain = prevhis === null ? 0 : (storedHistory[i].oneamt - prevhis)/prevhis * 100;


          if (Math.abs(gain) < 0.005) {
              gain = 0;
            }

      let gainText = `(${gain >= 0 ? "+" : ""}${gain.toFixed(2)}%)`;
      
        html += `
          <div class="card mb-2 shadow-sm">
            <div class="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 class="mb-1">${storedHistory[i].fromamt} ${storedHistory[i].userfrom} → ${storedHistory[i].toamt} ${storedHistory[i].userto} ${gainText}</h6>
                <small class="text-muted">${storedHistory[i].date} </small>
              </div>
              <span class="badge bg-dark">${storedHistory[i].userto}</span>
            </div>
          </div>
        `;
    }

    historyDiv.innerHTML = html;
}

function clearHistory() {
  if (confirm("Are you sure you want to clear all history?")) {
    localStorage.removeItem("history");
    document.getElementById("history").innerHTML="No conversions Yet"
  }
}
