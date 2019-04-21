var chain = [];
var filter = "";

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
                    chain[i].timestamp,
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
    newRow.setAttribute('onclick', 'showDetails(' + index + ')');
    newRow.classList.add("clickable");

    // Insert a cell in the row at index 0
    newRow.insertCell(0).appendChild(document.createTextNode(index));
    newRow.insertCell(1).appendChild(document.createTextNode(title));
    newRow.insertCell(2).appendChild(document.createTextNode(author));
    newRow.insertCell(3).appendChild(document.createTextNode(genre));
    newRow.insertCell(4).appendChild(document.createTextNode(previousHash));
    newRow.insertCell(5).appendChild(document.createTextNode(new Date(timestamp)));

    var pubkeyBlob = new Blob([pubkey], { type: 'text/plain' });

    var lastCellElement = document.createElement('div');
    lastCellElement.innerHTML =
        '<a href="' + window.URL.createObjectURL(pubkeyBlob) + '" download="pubkey-' + media + '.asc" title="Owner Public Key"><i class="fas fa-key"></i></a>' +
        '<a href="/uploads/' + media + '" download="' + filename + '" title="Download File" class="ml-2"><i class="fas fa-file-download"></i></a>';

    newRow.insertCell(6).appendChild(lastCellElement);
}

function addEmptyRow() {
    let specific_tbody = document.getElementById("blockchainBody");
    let newRow = specific_tbody.insertRow(-1);
    newRow.colSpan = 7;

    // Insert a cell in the row at index 0
    let cell = newRow.insertCell(0);
    cell.colSpan = 7;
    cell.appendChild(document.createTextNode("..."));
}

function showDetails(id) {
    console.log(id);
    let currentBlock = chain[parseInt(id) - 1];
    var pubkeyBlob = new Blob([currentBlock.transaction.public_key], { type: 'text/plain' });

    $('#detailsModalLabel').html("<h4>" + currentBlock.transaction.title + "</h4>");
    $('#detailsModalBodyLeft').html(
        "<b>" + "Index: " + "</b>" + currentBlock.index + "<br/>" +
        "<b>" + "Author: " + "</b>" + currentBlock.transaction.author + "<br/>" +
        "<b>" + "Genre: " + "</b>" + currentBlock.transaction.genre + "<br/>" +
        "<span style='word-wrap: break-word;'><b>Previous Hash: " + "</b>" + currentBlock.previous_hash + "</span><br/>" +
        "<b>" + "Timestamp: " + "</b>" + new Date(currentBlock.timestamp) + "<br/>" +
        "<b>" + "Owner Public Key: " + "</b>" + '<a href="' + window.URL.createObjectURL(pubkeyBlob) + '" download="pubkey-' + currentBlock.transaction.media + '.asc" title="Owner Public Key"><i class="fas fa-key"></i></a>' + "<br/>" +
        "<b>" + "Original Filename: " + "</b>" + currentBlock.transaction.filename + "<br/>" +
        "<b>" + "Original File: " + "</b>" + '<a href="' + window.URL.createObjectURL(pubkeyBlob) + '" download="' + currentBlock.transaction.filename + '" title="Original File"><i class="fas fa-file-download"></i></a>' + "<br/>"
    );

    let preview = "";
    if (currentBlock.transaction.genre == "Audio") {
        preview =
            '<audio controls>' +
            '<source src="../uploads/' + currentBlock.transaction.media + '" type="audio/ogg">' +
            '<source src="./uploads/' + currentBlock.transaction.media + '" type="audio/mpeg">' +
            'Your browser does not support the audio element.' +
            '</audio>'
    } else if (currentBlock.transaction.genre == "Image") {
        preview =
            '<img height="250px" width="250px" src="./uploads/' + currentBlock.transaction.media + '" />';

    } else if (currentBlock.transaction.genre == "Text") {
        preview =
            '<iframe height="250px" width="250px" src="./uploads/' + currentBlock.transaction.media + '.html" />';
    }

    $('#detailsModalBodyRight').html(
        "<h5>File Preview</h5>" +
        preview
    );
}

function handleFilter(e, type) {
    if (!e.target.className.includes("text-muted")) {
        if (filter != type) {
            console.log('hi');
            $("#blockchainBody tr").remove();
            for (let i = 0; i < chain.length; i++) {
                switch (chain[i].transaction.genre.toLowerCase()) {
                    case type:
                        addRow(chain[i].index,
                            chain[i].transaction.title,
                            chain[i].transaction.author,
                            chain[i].transaction.genre,
                            chain[i].previous_hash,
                            chain[i].timestamp,
                            chain[i].transaction.public_key,
                            chain[i].transaction.media,
                            chain[i].transaction.filename);
                        break;
                    default:
                        addEmptyRow();
                }
            }
        } else {
            //restore
            $("#blockchainBody tr").remove();
            for (let i = 0; i < chain.length; i++) {
                addRow(chain[i].index,
                    chain[i].transaction.title,
                    chain[i].transaction.author,
                    chain[i].transaction.genre,
                    chain[i].previous_hash,
                    chain[i].timestamp,
                    chain[i].transaction.public_key,
                    chain[i].transaction.media,
                    chain[i].transaction.filename);
            }
        }
        toggleFilterButton(type);
    }
    
}

function toggleFilterButton(type) {
    switch (type) {
        case 'text':
            if (filter == type) {
                $("#btnImageFilter").removeClass("text-muted");
                $("#btnAudioFilter").removeClass("text-muted");
                filter = "";
            } else {
                $("#btnImageFilter").addClass("text-muted");
                $("#btnAudioFilter").addClass("text-muted");
                filter = type;
            }
            break;
        case 'image':
            if (filter == type) {
                $("#btnTextFilter").removeClass("text-muted");
                $("#btnAudioFilter").removeClass("text-muted");
                filter = "";
            } else {
                $("#btnTextFilter").addClass("text-muted");
                $("#btnAudioFilter").addClass("text-muted");
                filter = type;
            }
            break;
        case 'audio':
            if (filter == type) {
                $("#btnImageFilter").removeClass("text-muted");
                $("#btnTextFilter").removeClass("text-muted");
                filter = "";
            } else {
                $("#btnImageFilter").addClass("text-muted");
                $("#btnTextFilter").addClass("text-muted");
                filter = type;
            }
            break;
    }
}