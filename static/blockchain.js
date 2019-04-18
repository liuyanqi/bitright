var chain = [];
$(document).ready(function () { 
    $.LoadingOverlay("show", {
        image: "",
        text: "Loading Blockchain..."
    });
    $.ajax({
        url: "/chain",
        type: 'GET',
        success: function (response) {
            chain = response["chain"];
            for (var i = 0; i < chain.length; i++) { 
                addRow(chain[i].index, 
                    chain[i].transaction.title, 
                    chain[i].transaction.author,
                    chain[i].transaction.genre, 
                    chain[i].previous_hash, 
                    chain[i].time_string, 
                    chain[i].transaction.public_key,
                    chain[i].transaction.media,
                    chain[i].transaction.filename);
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

function addRow(index, title, author, genre, previousHash, timestamp, pubkey, media, filename) {
    let specific_tbody = document.getElementById("blockchainBody");
    let newRow = specific_tbody.insertRow(-1);
    newRow.setAttribute('data-toggle', 'modal');
    newRow.setAttribute('data-target', '#detailsModal');
    newRow.setAttribute('onclick', 'showDetails('+index+')');
    newRow.classList.add("clickable");

    // Insert a cell in the row at index 0
    newRow.insertCell(0).appendChild(document.createTextNode(index));
    newRow.insertCell(1).appendChild(document.createTextNode(title));
    newRow.insertCell(2).appendChild(document.createTextNode(author));
    newRow.insertCell(3).appendChild(document.createTextNode(genre));
    newRow.insertCell(4).appendChild(document.createTextNode(previousHash));
    newRow.insertCell(5).appendChild(document.createTextNode(timestamp));

    var pubkeyBlob = new Blob([pubkey], { type: 'text/plain' });

    var lastCellElement = document.createElement('div');
    lastCellElement.innerHTML = 
    '<a href="' + window.URL.createObjectURL(pubkeyBlob) + '" download="pubkey-'+ media +'.asc" title="Owner Public Key"><i class="fas fa-key"></i></a>' +
    '<a href="/uploads/' + media + '" download="'+ filename +'" title="Download File" class="ml-2"><i class="fas fa-file-download"></i></a>';

    newRow.insertCell(6).appendChild(lastCellElement);
}

function showDetails(id){
    console.log(id);
    let currentBlock = chain[parseInt(id)-1];
    var pubkeyBlob = new Blob([currentBlock.transaction.public_key], { type: 'text/plain' });

    $('#detailsModalLabel').html("<h4>" + currentBlock.transaction.title + "</h4>");
    $('#detailsModalBodyLeft').html(
        "<b>" + "Index: " + "</b>" + currentBlock.index + "<br/>" +
        "<b>" + "Author: " + "</b>" + currentBlock.transaction.author + "<br/>" +
        "<b>" + "Genre: " + "</b>" + currentBlock.transaction.genre + "<br/>" +
        "<span style='word-wrap: break-word;'><b>Previous Hash: " + "</b>"+ currentBlock.previous_hash + "</span><br/>" +
        "<b>" + "Timestamp: " + "</b>" + currentBlock.timestamp + "<br/>" +
        "<b>" + "Owner Public Key: " + "</b>" + '<a href="' + window.URL.createObjectURL(pubkeyBlob) + '" download="pubkey-'+ currentBlock.transaction.media +'.asc" title="Owner Public Key"><i class="fas fa-key"></i></a>' + "<br/>" +
        "<b>" + "Original Filename: " + "</b>" + currentBlock.transaction.filename + "<br/>" +
        "<b>" + "Original File: " + "</b>" + '<a href="' + window.URL.createObjectURL(pubkeyBlob) + '" download="'+ currentBlock.transaction.filename +'" title="Original File"><i class="fas fa-file-download"></i></a>' + "<br/>"
    );

    let preview = "";
    if (currentBlock.transaction.genre == "Audio"){
        preview = 
            '<audio controls>' +
                '<source src="../uploads/' + currentBlock.transaction.media + '" type="audio/ogg">'+
                '<source src="./uploads/' + currentBlock.transaction.media + '" type="audio/mpeg">'+
                'Your browser does not support the audio element.'+
            '</audio>'
    } else if (currentBlock.transaction.genre == "Image"){
        preview = 
            '<img height="250px" width="250px" src="./uploads/'+ currentBlock.transaction.media +'" />';

    } else if (currentBlock.transaction.genre == "Text"){
        preview = 
        '<iframe height="250px" width="250px" src="./uploads/'+ currentBlock.transaction.media +'.html" />';
    }

    $('#detailsModalBodyRight').html(
        "<h5>File Preview</h5>" +
        preview
    );
}