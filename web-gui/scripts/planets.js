document.onreadystatechange = function(){
    if (document.readyState === 'complete'){
        var canvas = document.getElementById("diagram");
        var star_size = parseFloat(document.getElementById("star-radius").innerHTML);
        var outer_limit = parseFloat(document.getElementById("star-limit").innerHTML);
        var star_letter = document.getElementById("star-letter").innerHTML;

        // The star will be drawn with a fixed radius, so we need to scale all radii accordingly

        var diagram_scale = 1 / star_size;

        var overviewTable = document.getElementById("objects-overview");
        var rows = overviewTable.getElementsByTagName("tr");
        var toDraw = [];
        var max_size = 0;
        for (row in rows){
            // Row 0 contains the headings, the others are javascript attributes of the object
            if (row !== '0' && row !== 'item' && row !== 'length' && row !== 'namedItem'){
                var min_cell = document.getElementById('min_radius' + row);
                var max_cell = document.getElementById('max_radius' + row);

                var min_radius = parseFloat(min_cell.innerHTML, '10');
                var max_radius = parseFloat(max_cell.innerHTML, '10');

                // scale the radii
                min_radius = (min_radius * diagram_scale);
                max_radius = (max_radius * diagram_scale);

                toDraw.push({max: max_radius / 2, min: min_radius / 2});
                max_size = max_radius > max_size ? max_radius : max_size;
            }
        }


        // Now that we know how big everything is, relative to the star
        // We can scale it to fit the website
        var sweet_spot_scale = 1;
        if (max_size < 500){
            sweet_spot_scale = 500 / max_size;
        } else if (max_size > 600){
            sweet_spot_scale = 600 / max_size;
        }

        // Provide 10px padding
        canvas.height = (max_size * sweet_spot_scale) + 10;
        canvas.width  = (max_size * sweet_spot_scale) + 10 ;

        var context = canvas.getContext("2d");
        var centerX = canvas.width / 2;
        var centerY = canvas.height / 2;

        context.beginPath();
        context.arc(centerX, centerY, 1 * sweet_spot_scale, 0, 2 * Math.PI, false);
        context.fillStyle = 'yellow';
        context.fill();
        context.stroke();
        context.fillStyle = 'black';

        var cookies = document.cookie.split(';');
        for (var i = 0; i < toDraw.length; i++){
            if (getCookie(i + star_letter) == ""){
                document.cookie = i + star_letter + "=" + Math.floor((Math.random() * 360) + 1);
            }
            cookieValue = parseInt(getCookie(i + star_letter), '10');
            var semi_major = toDraw[i].max * sweet_spot_scale;
            var semi_minor = toDraw[i].min * sweet_spot_scale;

            // Draw the ellipse
            context.beginPath();
            context.ellipse(centerX, centerY, semi_major, semi_minor, cookieValue, 0, Math.PI*2);
            context.stroke();

            // Write the label; offset 10 and 15 pixels respectively from the ellipse
            var text_x = centerX + (semi_major * Math.cos(1) * Math.cos(cookieValue) - semi_minor * Math.sin(1) * Math.sin(cookieValue));
            var text_y = centerY + (semi_major * Math.cos(1) * Math.sin(cookieValue) + semi_minor * Math.sin(1) * Math.cos(cookieValue));
            context.fillText(star_letter + "-" + (i + 1), 10 + text_x, 15 + text_y);

            // Draw a dot to represent the astronomical body
            context.beginPath();
            context.arc(text_x, text_y, 1 * sweet_spot_scale, 0, 2 * Math.PI, false);
            context.fill();
            context.stroke();
        }
        document.getElementById('diagram-legend').innerHTML = "Scale (relative to star size): 1:" + Math.floor(diagram_scale * sweet_spot_scale)
    }
}

function getCookie(cookieName) {
    var name = cookieName + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}


// beginPath starts a new Path that can then be drawn with stroke