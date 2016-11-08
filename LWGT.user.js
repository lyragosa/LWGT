// ==UserScript==
// @name         Lyragosa's WoW Glossary Translation in NGA
// @namespace    https://github.com/lyragosa/LWGT
// @version      0.1 Alpha
// @description  给使用繁体中文魔兽世界客户端的NGA论坛用户提供的一个方便快捷的一键转换简繁术语的功能。你们是不知道我在宠物区看到一大堆宠物名字然后在繁体客户端里面抓瞎一个也搜不到的痛苦之处……
// @author       Lyragosa
// @require      http://cdn.bootcss.com/jquery/1.10.2/jquery.min.js
// @include      /^http://(bbs\.ngacn\.cc|nga\.178\.com|bbs\.nga\.cn|bbs\.bigccq\.cn)/(read\.php|post\.php)/
// @grant        GM_xmlhttpRequest 
// ==/UserScript==

jQuery.noConflict();

function getSelectionText() {
    var text = "";
    var activeEl = document.activeElement;
    var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
    if (
        (activeElTagName == "textarea" || activeElTagName == "input") &&
        /^(?:text|search|password|tel|url)$/i.test(activeEl.type) &&
        (typeof activeEl.selectionStart == "number")
    ) {
        text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
    } else if (window.getSelection) {
        text = window.getSelection().toString();
    }
    return text;
}


jQuery("body").on("click", "#LWGTWindow", function (e) {
    //nothing
    console.log('DO NOT CLOSE');
    e.stopPropagation();
    return false;
});


jQuery("body").on("mouseup", function (e) {
    var txt = getSelectionText();
    if (txt.length > 0 && jQuery("#selectTextHintWindow").length >= 0 && jQuery(e.target).attr("id") != 'LWGTWindow') {
        jQuery("#LWGTWindow").remove();
        //console.log(txt);
        var kks = jQuery("#selectTextHintWindow").offset(); //TODO 这是一种很不稳定的依靠地精科技的做法，如果以后接盘者发现崩溃，请检查这里。
        var y = kks.top;
        var x = kks.left;
        if (y > 0 && x > 0) {
            //console.log( getSelectionCharOffsetsWithin(document.body).start );
            var xm = jQuery("<div class='urltip' id='LWGTWindow' style='margin: 0px; line-height: 16px; left: " + x + "px; top: " + (y + 25) + "px; display: block;'></div>");
            var fin = '';
            jQuery.getJSON("http://db.178.com/wow/api/mobile_api.php?func=getlangconv&encode=GBK&s=" + txt, function (skt) {
                for (var i in skt.data) {
                    var px = skt.data[i];
                    //console.log(px.type_cn);
                    fin += "<span class='teal'>" + px.type_cn + "</span> " + px.name_cn + ' ' + px.name_tw + ' ' + px.name_en + '<br /> ';
                }
                xm.html(fin);
                if (fin) jQuery("body").append(xm);
            });
        }
    }
    else {
        if (jQuery(e.target).attr("id") != 'LWGTWindow')
            jQuery("#LWGTWindow").remove();
    }
});


function getSelectionCharOffsetsWithin(element) {
    var start = 0, end = 0;
    var sel, range, priorRange;
    if (typeof window.getSelection != "undefined") {
        range = window.getSelection().getRangeAt(0);
        priorRange = range.cloneRange();
        priorRange.selectNodeContents(element);
        priorRange.setEnd(range.startContainer, range.startOffset);
        start = priorRange.toString().length;
        end = start + range.toString().length;
    } else if (typeof document.selection != "undefined" &&
        (sel = document.selection).type != "Control") {
        range = sel.createRange();
        priorRange = document.body.createTextRange();
        priorRange.moveToElementText(element);
        priorRange.setEndPoint("EndToStart", range);
        start = priorRange.text.length;
        end = start + range.text.length;
    }
    return {
        start: start,
        end: end
    };
}

