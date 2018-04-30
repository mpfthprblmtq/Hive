// this is a list of the items that are to be printed
// they are formatted in json
var items = JSON.parse(document.getElementById("itemsToAdd").textContent);

// this event calls the appendLabelsToBody function on window load event
$(window).load(appendLabelsToBody());

// this is the meat of the script; this function builds the html
// based on the list of items that are passed in as json encoded
// objects; the only thing that is dependent on this function's 
// integrity is that the items objects that are encoded have the
// 5 attributes id, name, room, unit, and shelf
function appendLabelsToBody(){
    var offset = $('#offset').val();
    var html = '';

    for(var j = 0; j < offset; ++j){
    	// add the blank labels as needed based on the # offset
        html += "<div class='label'>BLANK</div>";
    }

    for(var i = 0; i < items.length; ++i){
    	// add the actual labels that are going to be printed
        html +=     "<div class='label'>" +
                        "<label class='itemName'>" + items[i]["name"] + "</label>" +
                        "<div class='location'>" +
                            "<span><label class='loc'>Bldng:</label><label class='loc'> " + items[i]["building"] + "</label></span></br>" +
                            "<span><label class='loc'>Rm - Subrm:</label><label class='loc'> " + items[i]["room"] + " - " + items[i]["subroom"] + "</label></span></br>" +
                            "<span><label class='loc'>Unit - Shelf:</label><label class='loc'> " + items[i]["shelfUnit"] + " - "+ items[i]["shelf"] + "</label></span>" +
                        "</div>" +
                        "<div class='barcode'>" +
                            "<div id='demo" + i + "'/></div>" +
                        "</div>" +
                    "</div>";
        // add page breaks to disallow the breaking up of a label
        if(((j + i) + 1) % 30 == 0){
            html +=     "<div class='page-break'></div>";
        }
    }
    // append the resulting html to the body of the page
    $('body').append(html);
    // initialize the barcodes now
    initBarcodes();
}

// this function does what is says; it initializes the 
// barcodes with the js library
function initBarcodes(){
    for(var i = 0; i < items.length; ++i){
        // init the new barcode
        $("#demo" + i).barcode(
            items[i]["id"], // the id of the item that creates the barcode
            "codabar" // we can adjust the created format of the barcode here
        );
    }
}