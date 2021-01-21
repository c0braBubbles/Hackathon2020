function searchEvent() {
    var input, filter, ul, li, h3, i, txtValue;
    input = document.getElementById("sok");
    filter = input.value.toUpperCase();     // setter alle bokstaver fra inp. til store
    ul = document.getElementById("test");   // lista den skal søke fra
    li = ul.getElementsByTagName("li");     // hva den skal søke i (array)

    for(i = 0; i < li.length; i++) {        // looper gjennom hele lista
        h3 = li[i].getElementsByTagName("h3", "p", "button")[0]; // plasserer dem inn i en variabel
        txtValue = h3.textContent || h3.innerText;              

        // setter dataen til store bokstaver for å matche og bestemme hvem som skal bli
        if(txtValue.toUpperCase().indexOf(filter) > -1) { 
            li[i].style.display = "";               
        } else {
            li[i].style.display = "none";
        }
    }
}


function searchDate() {
    var filter, ul, li, h3, i, txtValue;
    var all = [
        document.getElementById("dag"),
        document.getElementById("maaned"),
        document.getElementById("organisasjon")
    ];
    

    if(all[2].value != "organisasjon") {
        filter = all[2].value.toUpperCase();
        ul = document.getElementById("test");
        li = ul.getElementsByTagName("li");


        for(i = 0; i < li.length; i++) {
            h3 = li[i].getElementsByTagName("h3", "p", "button")[0];
            txtValue = h3.textContent || h3.innerText;

            if(txtValue.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
    }


    else {
        for(var j = 0; j < all.length-1; j++) {
            filter = all[j].value.toUpperCase();
            ul = document.getElementById("test");
            li = ul.getElementsByTagName("li");


            for(i = 0; i < li.length; i++) {
                h3 = li[i].getElementsByTagName("h3", "p", "button")[0];
                txtValue = h3.textContent || h3.innerText;

                if(txtValue.toUpperCase().indexOf(filter) > -1) {
                    li[i].style.display = "";
                } else {
                    li[i].style.display = "none";
                }
            }
        }
    }
}