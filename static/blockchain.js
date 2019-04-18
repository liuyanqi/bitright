$(document).ready(function () { 
    $.LoadingOverlay("show", {
        image: "",
        text: "Loading Blockchain..."
    });
    $.ajax({
        url: "/chain",
        type: 'GET',
        success: function (response) {
            let chain = response["chain"];
            for (var i = 0; i < chain.length; i++) { 
                addRow(chain[i].index, 
                    chain[i].transaction.title, 
                    chain[i].transaction.author,
                    chain[i].transaction.genre, 
                    chain[i].previous_hash, 
                    chain[i].time_string, 
                    chain[i].transaction.public_key,
                    chain[i].transaction.media);
              }
            console.log(response)
            $.LoadingOverlay("hide");
        },
        error: function (error) {
            console.log(error);
            $.LoadingOverlay("hide");
        }
    });
});

function addRow(index, title, author, genre, previousHash, timestamp, pubkey, media) {
    let specific_tbody = document.getElementById("blockchainBody");
    let newRow = specific_tbody.insertRow(-1);
    // Insert a cell in the row at index 0
    newRow.insertCell(0).appendChild(document.createTextNode(index));
    newRow.insertCell(1).appendChild(document.createTextNode(title));
    newRow.insertCell(2).appendChild(document.createTextNode(author));
    newRow.insertCell(3).appendChild(document.createTextNode(genre));

    newRow.insertCell(4).appendChild(document.createTextNode(previousHash));
    newRow.insertCell(5).appendChild(document.createTextNode(timestamp));

    var lastCellElement = document.createElement('div');
    lastCellElement.innerHTML = "<a href=\"" + pubkey + "\" title=\"Owner Public Key\"><i class=\"fas fa-key\"></i></a><a href=\"" + media + "\" title=\"Download File\" class=\"ml-2\"><i class=\"fas fa-file-alt\"></i></a>";

    newRow.insertCell(6).appendChild(lastCellElement);
}