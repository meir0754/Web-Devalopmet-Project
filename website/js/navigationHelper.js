function initNav() {
    var lat = 32.076029, long = 34.774781;
    // If it's an iPhone..
    if ((navigator.platform.indexOf("iPhone") != -1)
        || (navigator.platform.indexOf("iPod") != -1)
        || (navigator.platform.indexOf("iPad") != -1))
        window.open("maps://maps.google.com/maps?daddr="+lat+","+long+"&amp;ll=");
    else
        window.open("https://www.google.com/maps?saddr=current+location&daddr=" + lat + "+," + long + "+,++");
}
