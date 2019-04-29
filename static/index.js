const AudioFileExt = ['pcm', 'wav', 'aiff', 'mp3', 'aac', 'ogg', 'wma', 'flac', 'alac'];
const ImageFileExt = ['jpeg', 'jpg', 'png', 'gif', 'webp', 'bmp'];
const TextFileExt = ['txt'];

$(document).ready(function () {

    init();

    // $.ajax({
    //     url: "/pending_tx",
    //     type: 'GET',
    //     success: function (response) {
    //         transactions = response["transactions"]
    //         let dataSet = []
    //         for (let i = 0; i < transactions.length; i++) {
    //             let val = transactions[i]["value"]
    //             let sender = transactions[i]["sender"]
    //             let recipient = transactions[i]["recipient"]

    //             let data = [sender, recipient, val];

    //             dataSet.push(data);

    //         }

    //         $('#unmined_transactions_table').DataTable({
    //             data: dataSet,
    //             columns: [
    //                 { title: "Sender" },
    //                 { title: "Recipient" },
    //                 { title: "Value" }
    //             ]
    //         });
    //     },
    //     error: function (error) {
    //         console.log(error);
    //     }
    // });

    $.ajax({
        url: "/chain",
        type: 'GET',
        success: function (response) {
            let chain = response["chain"];
            console.log(response)

            let dataSet = []

            for (let i = 0; i < chain.length; i++) {

                let transactions = chain[i]["data"]
                let index = chain[i]["index"]
                let prev_hash = chain[i]["previous_hash"]
                let nonce = chain[i]["nonce"]
                let time = chain[i]["time_string"]

                let data = [index, transactions.length, prev_hash, nonce, time];

                console.log(data);

                dataSet.push(data);

                $('#block_select').append($('<option>', { value: index, text: 'Block ' + index }));
            }

            let chain_table = $('#chain_table').DataTable({
                data: dataSet,
                columns: [
                    { title: "Index" },
                    { title: "Number of Transactions" },
                    { title: "Previous Hash" },
                    { title: "Nonce" },
                    { title: "Timestamp" }
                ]
            });

            $('#chain_table tbody').on('click', 'tr', function () {
                let data = chain_table.row(this).data();
                $("#block_select").val(data[0]).trigger('change');
            });
        },
        error: function (error) {
            console.log(error);
        }
    });


    // $("#block_select").change(function () {

    //     console.log("changed")

    //     $.ajax({
    //         url: "/get_block",
    //         type: "POST",
    //         dataType: 'json',
    //         data: $('#block_form').serialize(),
    //         success: function (response) {
    //             block = response["block"]
    //             transactions = block["data"]
    //             let dataSet = []
    //             for (let i = 0; i < transactions.length; i++) {
    //                 let val = transactions[i]["value"]
    //                 let sender = transactions[i]["sender"]
    //                 let recipient = transactions[i]["recipient"]

    //                 let data = [sender, recipient, val];

    //                 dataSet.push(data);
    //             }
    //             $('#block_table').DataTable({
    //                 data: dataSet,
    //                 columns: [
    //                     { title: "Sender" },
    //                     { title: "Recipient" },
    //                     { title: "Value" }
    //                 ],
    //                 destroy: true,
    //             });

    //         },
    //         error: function (error) {
    //             console.log(error);
    //         }
    //     });
    // });

    // $("#mine_button").click(function () {

    //     $.ajax({
    //         url: "/mine",
    //         type: "GET",
    //         success: function (response) {
    //             window.location.reload();
    //         },
    //         error: function (error) {
    //             console.log(error);
    //         }
    //     });

    // });

    // $("#reset_button").click(function () {

    //     $.ajax({
    //         url: "/reset",
    //         success: function (response) {
    //             window.location.reload();
    //         },
    //         error: function (error) {
    //             console.log(error);
    //         }
    //     });

    // });

    // $("#integrity_button").click(function () {

    //     $.ajax({
    //         url: "/integrity",
    //         type: "GET",
    //         success: function (response) {
    //             if (response["integrity"] === true) {
    //                 swal("Success!", "Blockchain passed the integrity test", "success");
    //             } else {
    //                 swal("Uh oh!", "Blockchain failed the integrity test", "error");
    //             }
    //         },
    //         error: function (error) {
    //             console.log(error);
    //         }
    //     });

    // });

});

function init() {
    //hide unneccessary elements
    $('#publishinfo').hide();
    $('#step2').hide();
    $('#btnConfirmPub').hide();
    $('#genreSelector').hide();

    //setup file picker event handler
    $("input[type=file]").change(function () {
        console.log($(this));
        var fullPath = $(this).val();
        var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
        var filename = fullPath.substring(startIndex);
        if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
            filename = filename.substring(1);
        }
        let ext = filename.split('.')
        if (ext.length > 1) {
            ext = ext[ext.length-1].toLowerCase();
            console.log(ext);
            if (AudioFileExt.includes(ext)){
                $("#genreSelectInput").val("Audio");
            } else if(ImageFileExt.includes(ext)){
                $("#genreSelectInput").val("Image");
            }else if(TextFileExt.includes(ext)){
                $("#genreSelectInput").val("Text");
            } else {
                $("#genreSelectInput").val("Text");
            }
        } else {
            $("#genreSelectInput").val("Text");
        }

        $('#fname').html('<mark>' + filename + '</mark>');
        $('#genreSelector').show();
        $('#step2').show();
    });



}

function uploadFile(action) {
    var form = document.getElementById('content');
    var formData = new FormData(form);
    console.log(formData);
    formData.set('action', action);
    console.log(formData);
    if(action == "publish"){
        if ($('#contentTitle')[0].checkValidity() && $('#contentAuthor')[0].checkValidity() && $('#contentOwnerPubKey')[0].checkValidity()) {
            formData.set('title', $('#contentTitle').val());
            formData.set('author', $('#contentAuthor').val());
            formData.set('pubkey', $('#contentOwnerPubKey').val());
        } else {
            //alert("Invalid input detected.");
            new Noty({
                text: "Invalid input detected.",
                theme: 'metroui',
                type: 'error',
                timeout: 3000,
            }).show();
            return;
        }
    }

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload', true);
    xhr.onprogress = function () {
        //do nothing
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            //Upload completed
            console.log(xhr.responseText);
            var data = JSON.parse(xhr.responseText);
            if(data.unique){
                if (action == 'publish'){
                    //alert("Object Successfully Published");
                    new Noty({
                        text: "Object Successfully Published",
                        theme: 'metroui',
                type: 'success',
                timeout: 3000,
                    }).show();
                    $('#publishinfo').hide();
                    $('#btnPub').show();
                    $('#btnConfirmPub').hide();    
                }
                else {
                    //alert("Object is Unique");   
                    new Noty({
                        text: "Object is Unique",
                        theme: 'metroui',
                type: 'success',
                timeout: 3000,
                    }).show();                 
                }
            } else {
                //alert(data.message);
                new Noty({
                    text: data.message,
                    theme: 'metroui',
                type: 'error',
                timeout: 3000,
                }).show(); 
                if(action == "lookup"){
                    let currentBlock = data.block;
                    var pubkeyBlob = new Blob([currentBlock.transaction.public_key], { type: 'text/plain' });

                    $('#detailsModalLabel').html("<h4>Similar to: " + currentBlock.transaction.title + "</h4>");
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
                    $('#detailsModal').modal({show: true});
                }
            }
            $.LoadingOverlay("hide");
                    
        } else if(xhr.readyState === 4 && xhr.status != 200){
            //alert("Upload Failed");
            new Noty({
                text: "Upload Failed",
                theme: 'metroui',
                type: 'error',
                timeout: 3000,

            }).show(); 
            $.LoadingOverlay("hide");
        }
    };
    xhr.onerror = function () {
        //alert("Upload Failed");
        new Noty({
            text: "Upload Failed",
            theme: 'metroui',
                type: 'error',
                timeout: 3000,
        }).show(); 
        $.LoadingOverlay("hide");
    };
    $.LoadingOverlay("show", {
        image: "",
        text: "Uploading File..."
    });
    xhr.send(formData);
}

function showPublishInfo() {
    $('#mainContainer').addClass("inactive");
    $('#mainContainer').removeClass("active");
    $('#publishinfo').show();
    $('#btnPub').hide();
    $('#btnConfirmPub').show();
}

function confirmPublish() {
    uploadFile("publish");
}

function lookup() {
    uploadFile("lookup");
}