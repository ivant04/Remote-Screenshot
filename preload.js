const remote = require("@electron/remote");

const args = remote.getGlobal("args");

window.addEventListener("load", () => {
    if(args.scroll != undefined || args.scrollh != undefined)
    {
        let elem = document.createElement("script");
        elem.src = "https://code.jquery.com/jquery-3.6.1.js";
        elem.integrity = "sha256-3zlB5s2uwoUzrXK3BT7AX3FyvojsraNFxCc2vC/7pNI="
        elem.crossOrigin = "anonymous";
        document.head.appendChild(elem);


        window.scrollTo(args.scrollh || 0, args.scroll || 0);
    }
});


document.addEventListener("readystatechange", event => { 
    if(event.target.readyState === "complete") {
        setTimeout(() => {
            let time = 300;
            if(args.scroll != undefined || args.scrollh != undefined)
            {
                // Sometimes using "window.scrollTo()" doesn't work, but jquery scroll does
                // But some sites don't allow importing scripts so we use both methods

                const s1 = Number(args.scroll || 0);
                const s2 = Number(args.scrollh || 0);
                let elems = document.createElement("script");
                elems.innerHTML = '$("html, body").animate({ scrollTop: ' + s1 + ' }, 10); $("html, body").animate({ scrollLeft: ' + s2 + ' }, 10);';
                document.head.appendChild(elems);
                time += 700;
            }
            setTimeout(() => {
                if(args.scroll != undefined || args.scrollh != undefined) // Additional checks for scroll value
                {
                    if((args.scroll != undefined && document.body.scrollTop < args.scroll) || (args.scrollh != undefined && document.body.scrollLeft < args.scrollh))
                    {
                        window.scrollTo(args.scrollh || 0, args.scroll || 0);
                        const s1 = Number(args.scroll || 0);
                        const s2 = Number(args.scrollh || 0);
                        let elems = document.createElement("script");
                        elems.innerHTML = '$("html, body").animate({ scrollTop: ' + s1 + ' }, 10); $("html, body").animate({ scrollLeft: ' + s2 + ' }, 10);';
                        document.head.appendChild(elems);

                        setTimeout(() => {
                            document.title = "RS-Ready-Toxic48";
                        }, 500);
                    }
                    else document.title = "RS-Ready-Toxic48";
                }
                else document.title = "RS-Ready-Toxic48";
            }, time);
        }, 200);
    }
});