// ==UserScript==
// @name         TorrentLeech V4 Enhancer - Tampermonkey
// @namespace   https://openuserjs.org/scripts/Sandbird/TorrentLeech_V4_Enhancer
// @description Enhance TorrentLeech
// @updateURL https://openuserjs.org/meta/Sandbird/TorrentLeech_V4_Enhancer_-_Tampermonkey.meta.js
// @include   https://torrentleech.org/torrents/*
// @include   https://www.torrentleech.org/torrents/*
// @resource trakt_btn https://rawgit.com/Sandbird/TL/master/tr.png
// @resource trakt_btn_on https://rawgit.com/Sandbird/TL/master/tr_on.png
// @resource info_btn https://rawgit.com/Sandbird/TL/master/i.png
// @resource info_btn_on https://rawgit.com/Sandbird/TL/master/i_on.png
// @resource copy_btn https://rawgit.com/Sandbird/TL/master/c.png
// @resource copy_btn_on https://rawgit.com/Sandbird/TL/master/c_on.png
// @resource trailer_btn https://rawgit.com/Sandbird/TL/master/t.png
// @resource trailer_btn_on https://rawgit.com/Sandbird/TL/master/t_on.png
// @resource navBAR https://rawgit.com/Sandbird/TL/master/AdminLTE.min.css
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @require  http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/jquery-ui.min.js
// @require https://rawgit.com/Sandbird/TL/master/app.min.js
// @grant   GM_getValue
// @grant   GM_setValue
// @grant   GM_getResourceURL
// @grant   GM_getResourceText
// @grant   GM_xmlhttpRequest
// @grant   GM_addStyle
// @version 2.3
// @license GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
var navBAR = GM_getResourceText ("navBAR");
GM_addStyle (navBAR);

$("body").append ('<aside class="control-sidebar control-sidebar-dark"> <div class="tab-content"> <div class="tab-pane" id="control-sidebar-settings-tab" style="position:fixed;padding-right:10px;"> <form method="post"> <h3 class="control-sidebar-heading">TL Enhancer Settings</h3> <div class="form-group"> <label class="control-sidebar-subheading"> Bold Titles <input type=\'checkbox\' data-boldtitles=\'toggle\' class=\'pull-right\' > </label> <p> The default TL stylesheet. Bold titles for torrent names. </p> </div> <div class="form-group"> <label class="control-sidebar-subheading"> Bold Seeders <input type=\'checkbox\' data-boldseeders=\'toggle\' class=\'pull-right\' > </label> <p> The default TL stylesheet. Bold seeder values. </p> </div> <div class="form-group"> <label class="control-sidebar-subheading"> Add Colour to Torrent Titles <input type=\'checkbox\' data-coloredtitles=\'toggle\' class=\'pull-right\' > </label> <p> The darker the colour, the more seeders available. </p> </div> <div class="form-group"> <label class="control-sidebar-subheading"> Add Colour to Seeders Column <input type=\'checkbox\' data-coloredseeders=\'toggle\' class=\'pull-right\' > </label> <p> The darker the colour, the more seeders available. </p> </div> <div class="form-group"> <label class="control-sidebar-subheading"> Tighter Box <input type=\'checkbox\' data-tightbox=\'toggle\' class=\'pull-right\'> </label> <p> Brings things a bit closer. (Classic TL layout) </p> </div> <div class="form-group"> <label class="control-sidebar-subheading"> Show details <input type=\'checkbox\' data-imdbdetails=\'toggle\' class=\'pull-right\'> </label> <p> Show/Hide imdb details. </p> </div> <h3 class="control-sidebar-heading"></h3> <div class="form-group"> <label class="control-sidebar-subheading"> Restore default TL settings <a href="javascript:void(0)" id="data-reset-cookies" class="text-red pull-right"><i class="fa fa-trash-o"></i></a> </label> </div> </form> </div> </div> </aside> <div class="control-sidebar-bg"></div>');
$("#navigation").append ('<li class="waves-effect waves-ripple"><a class="top-menu" title="TorrentLeech V4 Enhancer" href="#" id="control-sidebar" data-toggle="control-sidebar"><i style="font-size:20px; margin-top: -6px; color: rgb(255, 216, 0); vertical-align: middle; margin-right: 1px; margin-left: 1px;" class="fa fa-gears"></i><span style="font-size: 13px; margin-right: 3px;"></span></a></li>');
$( ".tab-content > .tab-pane" ).show();

function button(name, src, rollover){
        this.type = name;
        this.src = src;
        this.rollover = rollover;
}
var traktv = new button('traktv' ,GM_getResourceURL('trakt_btn') ,GM_getResourceURL('trakt_btn_on'));
var info = new button('info' ,GM_getResourceURL('info_btn') ,GM_getResourceURL('info_btn_on'));
var copy = new button('copy' ,GM_getResourceURL('copy_btn') ,GM_getResourceURL('copy_btn_on'));
var trailer = new button('trailer' ,GM_getResourceURL('trailer_btn') ,GM_getResourceURL('trailer_btn_on'));
//var episodes = new button('episodes' ,GM_getResourceURL('episodes_btn') ,GM_getResourceURL('episodesRl_btn'));
var fixed_words = Array('INTERNAL' , 'iNTERNAL' ,'READNFO' ,'NFO' ,'XBLA' ,'XBOX360','GERMAN','USA', 'NDS' ,'Update' ,
                        'Edition' ,'MULTi9' ,'MULTi7' ,'MULTi5' ,'MULTi2' ,'MULTi1' ,'XBLA' ,'Proper' ,
                        'JTAG' ,'PS3' ,'EUR' ,'DLC' ,'PL' ,'WII' ,'NGC' ,'FIX' ,'CRACK' ,'WORKING' ,
                        'NTSC' ,'Real' ,'DVDR' ,'RC' ,'BDRip' ,'TS' ,'RF' ,'PAL' ,'NORDiC' ,'UNRATED',
                        'WEBRiP' ,'HDRip', 'BluRay', 'Blu-ray', 'HDTV' ,'HDCAM',
                        '720p BluRay' , '1080p BluRay');

var buttons_collection = [traktv,
                          info,
                          copy,
                          trailer
                          ];

function getType(category_value){
  switch(category_value){
          case 1: case 8: case 9: case 10: case 11: case 12: case 13: case 14: case 15: case 29:
                  return 'cat_movies';
          case 2: case 26: case 27: case 32:
                  return 'cat_tv';
          case 3: case 17: case 18: case 19: case 20: case 21: case 22: case 28: case 30:
                  return 'cat_games';
  }
}

function inRange(x, min, max) {
    return min <= x && x <= max;
}

function splitter(string, type){
    var result = "";
    var split_str = string.split(' ');
    for (var index in split_str){
        if(type == 'cat_tv')
            if(parseInt(split_str[index],10) > 10 ){
                    result = (split_str.slice(0,index)).join(" ");
                    splitter(result, type);
                    break;
                }
        if(split_str[index].toLowerCase() == "update"){
             result = (split_str.slice(0,index)).join(" ");
             splitter(result, type);
             break;
        }
        if(split_str[index].charAt(0).toLocaleLowerCase() == 'v' && !isNaN(split_str[index].charAt(1))){
            result = (split_str.slice(0,index)).join(" ");
            splitter(result, type);
            break;
        }
        if(split_str[index].indexOf('-') != -1){
            result = (split_str.slice(0,index)).join(" ");
            splitter(result, type);
            break;
        }

    }
    if(result.length > 0)
       return result;
    else
        return string;


}
function cleanName2(rawName, type){
        var name = "";

    var tempName =  splitter(rawName, type);

        var split_name = tempName.split(" ");

        //remove fixed words
        for(var j = 0; j < split_name.length; j++){
                var found = false;
                for(var k = 0; k < fixed_words.length; k++){
                   if(fixed_words[k].toLowerCase() == split_name[j].toLowerCase()){
                           found = true;
                           break;
                   }
                }
                if(found)
                  delete split_name[j];
        }
        //special case filter
        for (var index in split_name){
                if(isNaN(split_name[index]) && 
                   isNaN(split_name[index].charAt(0)) && 
                   split_name[index].indexOf("(") == -1){
                                if(type == 'cat_tv')
                                        if(split_name[index].indexOf("E") != -1 && split_name[index].indexOf("S") != -1)
                                                break;
                                name += split_name[index] + " ";
                }
                else if(!isNaN(split_name[index])){  //handler for numbers in the name
                        if(type == 'cat_movies')
                                if(parseInt(split_name[index],10) > 10 )
                                        break;

                        name += split_name[index] + " ";
                }
                else
                        break;
        }
        if(type== 'cat_tv')
           return name.slice(0, - 1);
        else
      return $.trim(name);
}
function openImdb(name, type){

        var movie_name = cleanName2(name, type);
        window.open('http://www.imdb.com/find?s=tt&q=' + movie_name);

 //http://www.imdbapi.com/?t=movie name --- get json respons with imdb id
 //http://www.imdb.com/find?s=tt&q=movie name  --- takes you to the movie page or to results
}
function opentraktTV(name , type){
        var showtype;
        var tv_name = cleanName2(name, type);
        if(type== 'cat_tv'){
        	showtype = 'shows';
        }else if (type== 'cat_movies'){
        	showtype = 'movies';
        }
        window.open('https://trakt.tv/search/'+showtype+'?query=' + tv_name);

 //http://www.tv.com/search?type=11&stype=all&tag=search%3Bforums&q=tv show name
}
function openTv(name , type){

        var tv_name = cleanName2(name, type);
        window.open('http://www.tv.com/search?q=' + tv_name);

 //http://www.tv.com/search?type=11&stype=all&tag=search%3Bforums&q=tv show name
}
function openEpisodes(name, type){

        var episode_name = cleanName2(name, type);
        window.open('http://www.torrentleech.org/torrents/browse/index/query/'+ episode_name + '/facets/e8044d_877b75');

//www.torrentleech.org/torrents/browse/index/query/The+Big+Bang+Theory/facets/e8044d_877b75
}
function openGamePlay(name, type){

        var game_name = cleanName2(name, type);
        window.open('http://www.youtube.com/results?search_query='+ game_name + " gameplay");
//http://www.youtube.com/results?search_query=game name
}
function openTrailer(name, type){

        var movie_name = cleanName2(name, type);
        window.open('http://www.youtube.com/results?search_query='+ movie_name + " trailer");
//http://www.youtube.com/results?search_query=game name
}
function openGameReview(name, type){

        var game_name = cleanName2(name, type);
        //window.open('http://www.gamespot.com/search/?qs='+ game_name);
        window.open('http://www.rlslog.net/?s='+ game_name +'&sbutt=Go');

//http://www.gamespot.com/search/?qs=
}

// This is the equivalent of @run-at document-end
var titleSettings = get('boldtitles');
var seederSettings = get('boldseeders');
var colorTitSettings = get('colortitles');
var colorSeedSettings = get('colorseeders');
var tighterSettings = get('tighterbox');
var imdbdetails = get('imdbdetails');

if (titleSettings === "normal") {
  $("[data-boldtitles='toggle']").prop('checked', false);
}else{
  $("[data-boldtitles='toggle']").prop('checked', true);
}
if (seederSettings !== null)
   $('.display .title').css("font-weight", titleSettings);

if (seederSettings === "normal") {
  $("[data-boldseeders='toggle']").prop('checked', false);
}else{
  $("[data-boldseeders='toggle']").prop('checked', true);
}
if (seederSettings !== null)
   $('.display .seeders').css("font-weight", seederSettings);

if (tighterSettings !== null && tighterSettings === "small") {
  $("[data-tightbox='toggle']").prop('checked', true);
  $('.col-xs-12').removeClass('col-xs-12').addClass('col-xs-10');
  $('.col-xs-2').removeClass('col-xs-2').addClass('col-xs-3');
}else{
    $("[data-tightbox='toggle']").prop('checked', false);
    $('.col-xs-10').removeClass('col-xs-10').addClass('col-xs-12');
    $('.col-xs-3').removeClass('col-xs-3').addClass('col-xs-2');
}

if (colorTitSettings !== null && colorTitSettings === "1") {
    addColour('title');
    $("[data-coloredtitles='toggle']").prop('checked', true);
}else{
    $("[data-coloredtitles='toggle']").prop('checked', false);
}

if (colorSeedSettings !== null && colorSeedSettings === "1") {
    addColour();
    $("[data-coloredseeders='toggle']").prop('checked', true);
}else{
    $("[data-coloredseeders='toggle']").prop('checked', false);
}

if (imdbdetails !== null && imdbdetails === "0") {
	$("[id=imdbOnBrowse]").hide();
  $("[data-imdbdetails='toggle']").prop('checked', false);
}else{
  $("[data-imdbdetails='toggle']").prop('checked', true);
}


$('td[class = "name"]').each(function(i){
  var cache_this = this;
  $raw_text = $(this).closest('td').prev().find('a').attr('href');
  var pattern = /[0-9]+/g;
  var category_value = parseInt($raw_text.match(pattern));
  var category_type = getType(category_value);
  var imdbscore = $(this).find('span:#imdbOnBrowse').html();
  if(category_type == 'cat_movies' || category_type == 'cat_tv'){
  	//console.log(imdbscore);
  	if (imdbscore !== null && (imdbscore.indexOf('.')!=-1) ) {
	  	var remakeImdb = imdbscore.replace(" &nbsp;&nbsp; ", ""); //remove that extra space
	    var score = remakeImdb.split(" ");
	    var str1 = score[0];
	    if (str1.indexOf(".")!=-1) {
		    $(cache_this).find('span.title').append(' <span style="color:yellow">('+str1+')</span>');
		    $(cache_this).find('span:#imdbOnBrowse').html(function(index,html){
    			return html.replace('&nbsp;&nbsp; '+str1+' ','');
				});
		  } else {
		  	$(cache_this).find('span.title').append(' <span style="color:red">(N/A)</span>');
	  	}
  	}
    $(this).append($('<div>').addClass('enhanceWrapper')
               .css({float:'right', margin: '3px 5px 0 0'})
               .data('category', category_type));
  }
} );

$.each(buttons_collection,function(index, value) {
    $('.enhanceWrapper').append($('<img />')
                       .addClass('enhance-buttons_collection')
                       .attr({src: value.src,
                              alt: value.rollover,
                              title: value.type})
                       .css({margin: "0 8px 0 0",
                                      cursor: 'pointer',
                                      float: 'left'})
                       .data('name',value.type));
});

$('img[class="enhance-buttons_collection"]').load(function(){
  $name = $(this).closest('td').find('a').text();
  var cat_type = $(this).parent().data('category');

  switch($(this).data('name')){
          case 'traktv':
                  if(cat_type == 'cat_games'){
                  	$(this).remove();
                  }
           break;
          case 'trailer':
                  if(cat_type == 'cat_tv'){
                  	$(this).remove();
                  }
           break;
  }
});

$('img[class="enhance-buttons_collection"]').hover(function(){
        $src = $(this).attr('src');
        $alt = $(this).attr('alt');
        $(this).attr('src', $alt);
        $(this).attr('alt', $src);
},
function(){
        $src = $(this).attr('src');
        $alt = $(this).attr('alt');
        $(this).stop(false,true).attr('src', $alt);
        $(this).stop(false,true).attr('alt', $src);
});

$('img[class="enhance-buttons_collection"]').click(function(){
        //$(this).stop(true,true).effect("bounce", { times:3 }, 300);

      //diable the add to bookmark feature if clicking the enhance buttons
      $(this).parents('tbody tr').addClass('row_selected');

      //$raw_text = $(this).closest('td').prev().find('a').attr('href');
      $name = $(this).closest('td').find('a').text();
      var cat_type = $(this).parent().data('category');

        switch($(this).data('name')){
                case 'copy':
                        window.prompt ("Copy to clipboard: Ctrl+C, Enter", $name);
                        break;
                case 'info':
                        if(cat_type == 'cat_movies'){
                                openImdb($name, cat_type);
                        }
                        else if(cat_type == 'cat_tv')
                                openTv($name, cat_type);
                        else if(cat_type == 'cat_games')
                                openGameReview($name, cat_type);
                        break;
                case 'traktv':
                        if(cat_type != 'cat_games'){
                           opentraktTV($name, cat_type);
                        }else{
                        	$(this).remove();
                        }
                        break;
                case 'trailer':
                        if(cat_type == 'cat_games')
                                openGamePlay($name, cat_type);
                        else if(cat_type == 'cat_movies')
                                openTrailer($name, cat_type);
                        break;
                case 'episodes':
                        if(cat_type == 'cat_tv')
                                openEpisodes($name, cat_type);
                        break;
        }
});


function store(name, val) {
    if (typeof (Storage) !== "undefined") {
        localStorage.setItem(name, val);
    } else {
        window.alert('Please use a modern browser to properly view this template!');
    }
}

function get(name) {
    if (typeof (Storage) !== "undefined") {
        return localStorage.getItem(name);
    } else {
        window.alert('Please use a modern browser to properly view this template!');
    }
}

function addColour(whatTodo) {
    $('td[class = "seeders"]').each(function(){
        var snum = $(this).html();
        if( $(snum).hasClass('seederDiv') ){
            snum = $(this).find('.seederDiv').html();
        }
        var sstyle = '';
        if(inRange(snum, 0, 50)) {
            sstyle = 'style="color:#D9D9D9"';
        }
        else if(inRange(snum, 51, 100)) {
            sstyle = 'style="color:#f5efd2"';
        }
        else if(inRange(snum, 101, 200)) {
            sstyle = 'style="color:#c0eca9"';
        }
        else if(inRange(snum, 201, 300)) {
            sstyle = 'style="color:#82e3af"';
        }
        else if(inRange(snum, 301, 500)) {
            sstyle = 'style="color:#5db5da"';
        }
        else if(inRange(snum, 501, 800)) {
            sstyle = 'style="color:#4d3bd1"';
        }
        else if(inRange(snum, 801, 1000)) {
            sstyle = 'style="color:#be1cc8"';
        }
        else if(inRange(snum, 1001, 10000000)) {
            sstyle = 'style="color:#bf002d"';
        }
        else{
            sstyle = 'style="font-weight:bold"';
        }
        if (whatTodo === undefined) {
            $(this).empty();
            $(this).append ('<div class="seederDiv" ' + sstyle + '>' + snum + '</div>');
        }else{
            var titleObj = $(this).closest('tr').find('.title a');
            $(this).closest('tr').find('.title a').wrapInner('<span class="titleDiv" ' + sstyle + '></span>');
        }
    });
}

function removeColour(whatTodo) {
    $('td[class = "seeders"]').each(function(){
        var sstyle = 'style="color:#71942c"';
        if (whatTodo === undefined) {
            $(this).find('.seederDiv').contents().unwrap();
        }else{
            var titleOjb = $(this).closest('tr').find('.titleDiv').html();
            $(this).closest('tr').find('.title a').empty();
            $(this).closest('tr').find('.title a').wrapInner(titleOjb);
        }
    });
}


(function ($, AdminLTE) {

  "use strict";

  setup();

  function setup() {
    $("[data-controlsidebar]").on('click', function () {
       // console.log("tst");
      var slide = !AdminLTE.options.controlSidebarOptions.slide;
      AdminLTE.options.controlSidebarOptions.slide = slide;
      if (!slide)
        $('.control-sidebar').removeClass('control-sidebar-open');
    });

   $("[data-boldtitles='toggle']").on('click', function () {
      var fontWeight = $('.display .title').css('font-weight');
      if (fontWeight == 'normal' || fontWeight == '400') {
         $('.display .title').css("font-weight", "bold");
         store('boldtitles', "bold");
      } else {
         $('.display .title').css("font-weight", "normal");
         store('boldtitles', "normal");
      }
    });

    $("[data-boldseeders='toggle']").on('click', function () {
      var fontWeight = $('.display .seeders').css('font-weight');
      if (fontWeight == 'normal' || fontWeight == '400') {
         $('.display .seeders').css("font-weight", "bold");
         store('boldseeders', "bold");
      } else {
         $('.display .seeders').css("font-weight", "normal");
         store('boldseeders', "normal");
      }
    });

    $("[data-coloredtitles='toggle']").on('click', function () {
        if ($(this).prop('checked')===true){
            addColour('title');
            store('colortitles', 1);
        }
        else if($(this).prop("checked") === false){
            removeColour('title');
            store('colortitles', 0);
        }
    });

    $("[data-coloredseeders='toggle']").on('click', function () {
        if ($(this).prop('checked')===true){
            addColour();
            store('colorseeders', 1);
        }
        else if($(this).prop("checked") === false){
            removeColour();
            store('colorseeders', 0);
        }
    });

    $("[data-tightbox='toggle']").on('click', function () {
        if ($(this).prop('checked')===true){
            $('.col-xs-12').removeClass('col-xs-12').addClass('col-xs-10');
            $('.col-xs-2').removeClass('col-xs-2').addClass('col-xs-3');
            store('tighterbox', "small");
        }
        else if($(this).prop("checked") === false){
            $('.col-xs-10').removeClass('col-xs-10').addClass('col-xs-12');
            $('.col-xs-3').removeClass('col-xs-3').addClass('col-xs-2');
            store('tighterbox', "wide");
        }
    });

    $("[data-imdbdetails='toggle']").on('click', function () {
        if ($(this).prop('checked')===true){
            $("[id=imdbOnBrowse]").show();
            store('imdbdetails', "1");
        }
        else if($(this).prop("checked") === false){
           $("[id=imdbOnBrowse]").hide();
           store('imdbdetails', "0");
        }
    });

    $("#data-reset-cookies").on('click', function () {
      localStorage.clear();
      alert("Settings restored. Please refresh the page!");
      document.location.reload();
     });


  }
})(jQuery, $.AdminLTE);
