Welcome = function() {

    function wl_init() {

    }

    function openLicenseFile() {
        var sWidth = 900;
        var sHeight = 690;
        var l = (screen.availWidth - sWidth) / 2;
        var t = (screen.availHeight - sHeight) / 2;
        var style = 'resizable=no,toolbar=no,status=no,menubar=no,personalbar=no,location=no,directories=no,titlebar=no,scrollbars=yes,close=yes';
        var loc = ',left=' + l + ',top=' + t + ',width=' + sWidth + ',height=' + sHeight;
        window.open(findFile(null, top.TOPDIR + "license.html"), '', style + loc);
    }

    $(document).ready(function() {
        function doCheckForLatest(ref) {
            var post = null;
            var doc = null;
            if (ref.is(':checked')) {
                configSteps([Welcome, Proxy_Setting, Update_Task, Update_Location, Update_Type, Finish]);
            } else {
                configSteps([Welcome, Update_Task, Update_Location, Update_Type, Finish]);
            }
        }

        $('#checkForLatest').click(function() {
            console.log("enter checkForLatest click");
            doCheckForLatest($(this));
        });
    });

    return {
        name: "Welcome",
        index: 0,
        init: wl_init, 
        nextAction: function() { return true;},
        importId: '#import_welcome',
        selectorId: '.welcome',
        title: "Welcome"        
    };
}();