
var gl_wizard = null;
var gl_wizard_steps = null;
var Welcome = null;
var Update_Task = null;
var Update_Location = null;
var Update_Type = null;
var Proxy_Setting = null;
var Target_Directory = null;
var Finish = null;

// importHtml to a specific location, function enhanced to support templates.
// options: object - two types of options, 1. contains importId, selectorId and hookId, this is to 
//insert the html content under hookId. 2. contains importId, selectorId, index and title, this is 
//to dynamically instert a jQuery step.
// returns: no returns
function importHtml(options) {
    if (typeof(options) == "undefined" || options == null) {
        console.log("importHtml doesn't define options");
        return doc;
    }
    var post = document.querySelector(options.importId).import;
    var doc = post.querySelector(options.selectorId);

    var template = Hogan.compile(doc.innerHTML);
    var renderedDoc = template.render(lang);

    if (options.title) {
        gl_wizard.steps("insert", options.index, {
            title: options.title,
            content: renderedDoc
        });
    } else {
        document.querySelector(options.hookId).innerHTML = renderedDoc;
        // var parser = new DOMParser();
        // var domNode = parser.parseFromString(renderedDoc, "text/xml");
        // document.querySelector(options.hookId).appendChild(domNode.documentElement); 
    }
    /*
        if (options.title) {
            gl_wizard.steps("insert", options.index, {
                title : options.title,
                content : doc.innerHTML
            });
        } else {
            document.querySelector(options.hookId).appendChild(doc.cloneNode(true)); 
        }
        */
}

function configSteps(newSteps){
    if ( gl_wizard_steps == null){
        //set default steps the same as html defined.
        gl_wizard_steps = [Welcome, Finish];
    }

    for (var i=0; i<newSteps.length; i++) {
        if (!newSteps[i]) {
            alert("Some steps are null");
            return;
        }
        newSteps[i].index = i;
        var stepFound = false;
        for (var j=i; j< gl_wizard_steps.length; j++){
            if (gl_wizard_steps[j].name == newSteps[i].name) {
                stepFound = true;
                if (j > i) {
                    for (var x = i; x < j; x++) {
                        gl_wizard.steps('remove', i);
                    }
                    gl_wizard_steps.splice(i,(j-i));
                } //else j==i
                break;
            }
        }
        if (!stepFound) {
            importHtml({
                importId: newSteps[i].importId,
                selectorId: newSteps[i].selectorId,
                index: i,
                title: newSteps[i].title
            });
            gl_wizard_steps.splice(i, 0, newSteps[i]);
        }
    }
    if (gl_wizard_steps.length > newSteps.length){
        for (i=newSteps.length; i<gl_wizard_steps.length; i++) {
            gl_wizard.steps('remove', newSteps.length);
        }
    }
    gl_wizard_steps = newSteps;
}

$(document).ready(function() {
    var post = null;
    var doc = null;

    importHtml({
        importId: '#import_license_modal',
        selectorId: '.license_modal',
        hookId: '#license_modal'
    });
    importHtml({
        importId: '#import_banner',
        selectorId: '.banner',
        hookId: '#banner'
    });
    importHtml({
        importId: '#import_welcome',
        selectorId: '.welcome',
        hookId: '#welcome'
    });
    importHtml({
        importId: '#import_finish',
        selectorId: '.finish',
        hookId: '#finish'
    });
    importHtml({
        importId: '#import_footer',
        selectorId: '.footer',
        hookId: '#footer'
    });    

    gl_wizard = $("#navigationbar-vertical").steps({
        headerTag: "h3",
        bodyTag: "section",
        transitionEffect: "slideLeft",
        stepsOrientation: "vertical", 
        onInit: function(event, currentIndex){
            //Fires when wizard is initialized.
            LicenseAgreement.checkLicense();
        },
        onStepChanging: function(event, currentIndex, newIndex) {

            // Always allow going backward even if the current step contains invalid fields!
            if (currentIndex > newIndex) {
                if (gl_wizard_steps[currentIndex].previousAction){
                    gl_wizard_steps[currentIndex].previousAction();
                }
                return true;
            }

            if (currentIndex < newIndex) {
                return gl_wizard_steps[currentIndex].nextAction();
            }
            /* TODO enable the following paragraph when wizard validation needed. 
            var form = $(this);

            // Clean up if user went backward before
            if (currentIndex < newIndex) {
                // To remove error styles
                $(".body:eq(" + newIndex + ") label.error", form).remove();
                $(".body:eq(" + newIndex + ") .error", form).removeClass("error");
            }

            // Disable validation on fields that are disabled or hidden.
            form.validate().settings.ignore = ":disabled,:hidden";

            // Start validation; Prevent going forward if false
            return form.valid(); */
        },
        onContentLoaded: function(event, currentIndex) {
            console.log("step "+ currentIndex + " loaded" + event);
        },
        onStepChanged: function(event, currentIndex, priorIndex) {
            console.log("step changed");
            //Refresh the step page if needRefresh
            if (currentIndex > priorIndex) {
                if (gl_wizard_steps[currentIndex].needRefresh){
                    importHtml({
                      importId: gl_wizard_steps[currentIndex].importId,
                      selectorId: gl_wizard_steps[currentIndex].selectorId,
                      hookId: '#navigationbar-vertical-p-' + currentIndex
                      });
                }
                gl_wizard_steps[currentIndex].init();
            } else if (gl_wizard_steps[currentIndex].backEntry) {
                gl_wizard_steps[currentIndex].backEntry();
            } 
            if (top.getEnv("SPI_BOOTABLE")) {
                if (priorIndex == 0 && gl_wizard_steps[priorIndex].name == "Welcome") {
                    //gl_wizard.steps('remove', 0);
                    //gl_wizard_steps = [Update_Comparison, Update_Options, Update_Execution, Finish];
                    configSteps([Finish]);
                }
            }
        
        },
        onFinishing: function(event, currentIndex) {
            var form = $(this);

            // Disable validation on fields that are disabled.
            // At this point it's recommended to do an overall check (mean ignoring only disabled fields)
            form.validate().settings.ignore = ":disabled";

            // Start validation; Prevent form submission if false
            //return form.valid();
            return true;
        },
        onFinished: function(event, currentIndex) {
            Exit(true);
        } 
    });

    if (!top.getEnv("SPI_BOOTABLE")) {
        configSteps([Welcome, Update_Task, Update_Location, Update_Type, Proxy_Setting, Finish]);
    } else {
        configSteps([Welcome, Finish]);
        gl_wizard.steps("next");
    }
    // TODO Enable this when wizard validation needed.
    // gl_wizard.validate({
    //     rules: {
    //         confirm: {
    //             equalTo: "#password"
    //         }
    //     }
    // });

    // resize function
    if (top.gl_current_os == "windows") {//for windows
        window.resize(833, $('body').height() + 58);
    } else {
        window.resize(833, $('body').height());
    }
    

});