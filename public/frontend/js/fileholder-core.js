import { fileHolderElementClass } from "./fileholder-element-class.js";
import { icons } from "./fileholder-icon.js";
import { fileHolderSettings , fileHolderAttr } from "./fileholder-settings.js";


/**
 * fileHolderServerInit: Function For Upload File On Server - [Peram: Server Url, File, HTML Element for Preview, Valid File MIMES]
 * fileHolderBrowserTabReloadGuard: Function for check uploaded files are available or not after click reload button- [No Peram]
 * fileHolderBasicLoading: Create a Basic Loading Animation and append it on element [Peram: Parent Element]
 * fileHolderElementRemoveAnimation: Remove an Element with Animation,
 */
export const fileHolderFunctions = {
    fileHolderServerInit: function(urls,validFile,previewElement,validMimes) {
        if(fileHolderGetLaravelCSRF().csrf === true) {
            var laravelMetaCSRF = fileHolderGetLaravelCSRF().csrfToken;
        }else {
            return false;
        }

        let uploadUrl = urls.uploadUrl;
        let validMimesString = validMimes.join(",");
    
        let form_data = new FormData();
        form_data.append('fileholder_files',validFile);
        form_data.append('_token',laravelMetaCSRF);
        form_data.append('mimes',validMimesString);
    
        // Show FileHolder Image Name
        if(previewElement != null) {
            let fileName        = validFile.name;
            let fileNameArray   = fileName.split(".");
            let fileExt         = fileNameArray.pop();
            let nameWithoutExt  = fileNameArray.join();
            if(nameWithoutExt.length > 16) {
                fileName = nameWithoutExt.substring(0,16) + "..." + fileExt;
            }else {
                fileName = nameWithoutExt + "." + fileExt;
            }
    
            previewElement.querySelector("."+fileHolderElementClass.fileTitleClass).innerHTML = fileName;
        }
    
    
        let formxhr = new XMLHttpRequest();
        formxhr.open("POST",uploadUrl);
    
        formxhr.upload.addEventListener("progress", ({loaded, total}) =>{
            fileHolderParentFormGuard(previewElement,true);
            let fileLoadedPercent = Math.floor((loaded / total) * 100);
            let totalFileSize = Math.floor(total / 1024); // KB
    
            let fileLoaded;
            if(totalFileSize < 1024) {
                fileLoaded = totalFileSize + " KB";
            }else {
                fileLoaded = (loaded / (1024*1024)).toFixed(2) + " MB";
            }
    
            let totalFileSizeText = totalFileSize + " KB";
            if(totalFileSize > 1024) {
                totalFileSize = Math.floor(totalFileSize / 1024); // MB
                totalFileSizeText = totalFileSize + " MB";
            }
            if(totalFileSize > 1024) {
                totalFileSize = Math.floor(totalFileSize / 1024) // GB;
                totalFileSizeText = totalFileSize + " GB";
            }
    
            // Preview Information
            if(previewElement != null) {
                previewElement.querySelector("."+fileHolderElementClass.fileTotalSizeElementClass).innerHTML = totalFileSizeText + "/";
                previewElement.querySelector("."+fileHolderElementClass.fileTotalLoadedElementClass).innerHTML = fileLoaded;
                previewElement.querySelector("."+fileHolderElementClass.fileLoadedPercentageElementClass).innerHTML = fileLoadedPercent + "%";
            }
            
            if(fileLoadedPercent > 0) {
                previewElement.querySelector("."+fileHolderElementClass.fileProgressBarClass).classList.add(fileHolderElementClass.fileHolderElementShowClass);
            }
    
            previewElement.querySelector("."+fileHolderElementClass.fileProgressBarInnerElementClass).style.width = fileLoadedPercent + "%";
            
        });
    
        formxhr.onload = function() {
            if(this.status == 200) {
                fileHolderParentFormGuard(previewElement,false);
                let response = JSON.parse(this.responseText);
                if(response.status === true) {

                    // Place Hidden input file with file name
                    let fileHolder = previewElement.closest("."+fileHolderElementClass.mainWrapClass);
                    let inputField = fileHolder.previousSibling;
                    if(inputField.classList.contains(fileHolderElementClass.inputClass)) {
                        let parentFormId = fileHolderSetParentFormId(fileHolder);
                        fileHolderDiscoverFileInput(inputField,parentFormId,response);
                    }else {
                        alert("Something Went Worng! Please Reload Page and try again.");
                        return false;
                    }

                    let fileMimeType = response.file_type.split("/").shift();

                    // Add Close Button
                    fileHolderFileCloseLayout(previewElement,response);
    
                    // Remove Basic Loading
                    fileHolderElementRemoveAnimation(previewElement.querySelector("."+fileHolderElementClass.basicLoading)); 
    
                    if(fileMimeType == "image") {
                        fileHolderUploadedImageHandle(previewElement,response);
                    }
    
                    // Mark as Load Completed
                }else {
                    // throw error
                    alert(response.error);
                }
            }else if(this.status == 400) {
                fileHolderParentFormGuard(previewElement,false);
                // Remove Basic Loading
                fileHolderElementRemoveAnimation(previewElement.querySelector("."+fileHolderElementClass.basicLoading)); 
                let response = JSON.parse(this.responseText);
    
                // throw error
                alert(response.error);
            }else {
                fileHolderParentFormGuard(previewElement,false);
                // Remove Basic Loading
                fileHolderElementRemoveAnimation(previewElement.querySelector("."+fileHolderElementClass.basicLoading)); 
            }
        }
    
        formxhr.send(form_data);
    },
    fileHolderBrowserTabReloadGuard: function() {
        window.onunload = function() {
            // console.log();
            return "Hey, FileHolder already loaded some files. Reload will destroy all loaded files. Are you sure to reload?";
            // var fileHolder = document.querySelectorAll("."+fileHolderElementClass.inputClass);
            // fileHolder.forEach((singleInput) => {
            //     if(singleInput.files.length > 0) {
            //         return "Hey, FileHolder already loaded some files. Reload will destroy all loaded files. Are you sure to reload?";
            //     }
            // });
        };
    },
    fileHolderBasicLoading: function(element){
        element.style.position = "relative";
        let basicLoadingWrp = fileHolderAppend(element,fileHolderElementClass.basicLoading);
        let translate = {
            1:"one",
            2:"two",
            3:"three",
            4:"four",
        };
        let layer = 3;
        for(let i = 1; i <= layer; i++) {
            let loadingCircle = fileHolderAppend(basicLoadingWrp,fileHolderElementClass.bnasicLoadingCircle);
            loadingCircle.classList.add(translate[i]);
        }
    
        return basicLoadingWrp;
    },
    fileHolderElementRemoveAnimation: function(element,delay=1000) {
        element.classList.add(fileHolderElementClass.basicHide);
        let fileHolder = element.closest("."+fileHolderElementClass.mainWrapClass);
        setTimeout(timeoutFunc,delay);

        function timeoutFunc() {
            element.remove();

            // Add fileHolder icon title wrap if has no file in fileholder
            fileHolderDragAndDropBoxTitleWrapAdd(fileHolder);
        }
    }
}


/**
 * Function for discover hidden input file 
 * @param {String} parentFormId 
 * @param {Object} response 
 */
function fileHolderDiscoverFileInput(inputField,parentFormId,response) {
    // let fileHolderHiddenInput = document.querySelector("input[name=fileholder-"+inputField.getAttribute("name")+"]");
    let fileHolderHiddenInput = document.querySelector("."+inputField.getAttribute(fileHolderAttr.dataHiddenClass));

    // console.log(fileHolderHiddenInput);
    // let fileHolderHiddenInput = null;

    if(fileHolderHiddenInput == null) {
        fileHolderHiddenInput = fileHolderAppend(document.querySelector("head"),fileHolderElementClass.hiddenFileInputClass,"input");
        fileHolderHiddenInput.setAttribute("form",parentFormId);
        fileHolderHiddenInput.setAttribute("name","fileholder-"+inputField.getAttribute("name"));

        var fileHolderHiddenInputClass = "fileholder-"+generateUniqueString(16);
        fileHolderHiddenInput.classList.add(fileHolderHiddenInputClass);
        inputField.setAttribute(fileHolderAttr.dataHiddenClass,fileHolderHiddenInputClass);
    }

    // Set Values
    let inputValues = fileHolderHiddenInput.value;
    if(inputValues != "") {
        let inputValuesArray = inputValues.split(",");
        inputValuesArray.push(response.file_name);
        inputValues = inputValuesArray.join(",");
    }else {
        inputValues = response.file_name;
    }
    fileHolderHiddenInput.value = inputValues;

    // console.log("Hidden Values = " + fileHolderHiddenInput.value);
}   


/**
 * Function for set parent form id attribute. If it's already exists then return it's otherwise set a new id and return
 * @param {HTML DOM Element} fileholder 
 */
function fileHolderSetParentFormId(fileHolder) {
    let parentForm = fileHolder.closest("form");
    let formId;

    // check id is exists or not
    if(parentForm.getAttribute("id") == null) {
        let randomString = new Date().getTime().toString(36);
        // Set Form ID
        parentForm.setAttribute("id",randomString);
        formId = parentForm.getAttribute("id");
    }else {
        formId = parentForm.getAttribute("id");
    }

    return formId;
}


/**
 * Function for remove a element from DOM with fadeOut Animation
 * @param {HTML Element} element 
 * @param {Integer Time(ms)} delay
 */
function fileHolderElementRemoveAnimation(element,delay=1000) { // the function is available in multiple file need to check it
    element.classList.add(fileHolderElementClass.basicHide);

    let fileholder = element.closest("."+fileHolderElementClass.mainWrapClass);

    setTimeout(timeoutFunc,delay);
    function timeoutFunc() {
        element.remove();

        // Add fileHolder icon title wrap if has no file in fileholder
        fileHolderDragAndDropBoxTitleWrapAdd(fileholder);
    }
}



/**
 * Function for handle Image file after successfully uploaded via AJAX request 
 * @param {HTML Element} previewElement 
 * @param {Object} response 
 */
function fileHolderUploadedImageHandle(previewElement,response) {
    // Add loaded tag on single file view element
    previewElement.setAttribute("data-loaded",true);
    let responseFileLink = response.file_link;
    let imageElement = previewElement.querySelector("."+fileHolderElementClass.imageClass).setAttribute("src",responseFileLink);
}


/**
 * Function for guard parent form for pause submit because fileholder still loading
 * @param {HTML Element} previewElement 
 * @param {Boolean} task 
 */
function fileHolderParentFormGuard(previewElement,loading=false) {
    let parentForm = previewElement.closest("form");
    let parentFormSubmitButton = parentForm.querySelector("input[type=submit],button[type=submit]");
    if(loading === true) {
        parentFormSubmitButton.setAttribute("disabled",true);
    }else {
        parentFormSubmitButton.removeAttribute("disabled");
    }

    return loading;
}


/**
 * Function for Adding File Remove Button On Every Loaded Files.
 * @param {HTML Element} previewElement 
 * @param {Object} response 
 */
function fileHolderFileCloseLayout(previewElement,response) {
    let fileHolderButtonsWrpElement = fileHolderAppend(previewElement,fileHolderElementClass.singleFileButtonsWrpElementClass);
    let fileHolderFileRemoveButton = fileHolderAppend(fileHolderButtonsWrpElement,fileHolderElementClass.singleFileRemoveElementClass);
    fileHolderFileRemoveButton.innerHTML = icons.fileHolderFileRemoveIcon;

    fileHolderFileRemoveButton.addEventListener("click",(event) => {
        //throw error
        let confirmAlert = confirm("Are you sure?");
        if(confirmAlert === true) {
            let fileHolderServerUrls = fileHolderSettings.urls;
            fileHolderRemoveFile(fileHolderServerUrls,previewElement,response);
        }
    });
}


/**
 * Function for Making a Brand New HTML Element and Append It Under a Mother Element With Class.
 * @param {HTML Element} motherElement 
 * @param {string} appendElementClass 
 * @param {String} elementType 
 * @returns HTML Element
 */
function fileHolderAppend(motherElement,appendElementClass = null,elementType = "div") {
    let element = document.createElement(elementType);
    element.classList.add(appendElementClass);
    motherElement.append(element);
    return element;
}


/**
 * Function For Remove Individual File From Server
 * @param {Object} response
 */
function fileHolderRemoveFile(urls,previewElement,response) {
    let responseJson = JSON.stringify(response);

    if(fileHolderGetLaravelCSRF().csrf === true) {
        var laravelMetaCSRF = fileHolderGetLaravelCSRF().csrfToken;
    }else {
        return false;
    }

    let removeUrl = urls.removeUrl;
    let formData = new FormData();
    formData.append('_token',laravelMetaCSRF);
    formData.append('file_info',responseJson);

    let formXHR = new XMLHttpRequest();
    formXHR.open("POST",removeUrl);

    // Start Loading 
    let fileHolderFileRemoveLoadingElement = fileHolderFileRemoveLoading(previewElement,response);

    formXHR.onload = function() {
    
        if(this.status == 200) {
            let response = JSON.parse(this.responseText);

            if(response.status === true) {
                // File Deleted
                // alert(response.message);

                // Remove File Preview Element
                fileHolderElementRemoveAnimation(previewElement);

                let fileHolder = previewElement.closest("."+fileHolderElementClass.mainWrapClass);
                // console.log(fileHolder.previousSibling.files);
                // console.log(response);
                fileHolderRemoveFileFromHiddenInput(fileHolder,responseJson);
                fileHolderRemoveFileFromInput(fileHolder,responseJson);

                // Need Modify
                // Need to remove file from input files value

            }

            // Remove Loader
            fileHolderElementRemoveAnimation(fileHolderFileRemoveLoadingElement);
        }else if (this.status == 404){
            fileHolderElementRemoveAnimation(fileHolderFileRemoveLoadingElement);

            // throw error
            alert("URL Not Found!");
        }else {
            fileHolderElementRemoveAnimation(fileHolderFileRemoveLoadingElement);

            let response = JSON.parse(this.responseText);
            alert(response.message);
        }
    }

    formXHR.send(formData);
}


/**
 * 
 * @param {HTML DOM Element} fileholder 
 * @param {JSON} responseJson 
 */
function fileHolderRemoveFileFromInput(fileholder,responseJson) {
    let inputFiles = fileholder.previousSibling.files;
    let removeFileName = JSON.parse(responseJson).file_old_name;
    let inputElement = fileholder.previousSibling;

    let fileHolderDataTransfer = new DataTransfer();
    Object.keys(inputFiles).forEach((index) => {
        if(inputFiles[index].name != removeFileName) {
            fileHolderDataTransfer.items.add(inputFiles[index]);
        }
    });
    inputElement.files = fileHolderDataTransfer.files;
}


/**
 * Function for remove file name from fileholder hidden input
 * @param {HTML DOM Element} fileHolder 
 * @param {JSON} response 
 */
function fileHolderRemoveFileFromHiddenInput(fileHolder,response) {
    let inputField = fileHolder.previousSibling;
    if(inputField.classList.contains(fileHolderElementClass.inputClass)) {
        let fileHolderHiddenInputFields = document.querySelector("."+inputField.getAttribute(fileHolderAttr.dataHiddenClass));
        // console.log(fileHolderHiddenInputFields);
        let responseFileName = JSON.parse(response).file_name;

        let fileHolderHiddenValuesArray = fileHolderHiddenInputFields.value.split(",");

        let fileHolderHiddenTargetValueIndex = fileHolderHiddenValuesArray.indexOf(responseFileName);
        fileHolderHiddenValuesArray.splice(fileHolderHiddenTargetValueIndex,1);

        fileHolderHiddenInputFields.value = fileHolderHiddenValuesArray.join(",");
    }
}


/**
 * Function for adding fileHolder Drag and Drop Box Title Wrap Element if fileHolder Container is empty.
 * @param {HTML DOM Element} fileHolder 
 */
function fileHolderDragAndDropBoxTitleWrapAdd(fileHolder) {
    let filesWrapperElement = fileHolder.querySelector("."+fileHolderElementClass.filesViewWrpElementClass);
    if(filesWrapperElement == null) {
        let fileHolderIconTitleWrap = fileHolder.querySelector("."+fileHolderElementClass.iconTitleWrpClass);
        fileHolderIconTitleWrap.style.display = "block";
        return true;
    }
    
    let fileholderSingleFiles = filesWrapperElement.querySelectorAll("."+fileHolderElementClass.singleFileViewElementClass);
    if(fileholderSingleFiles.length == 0) {
        let fileHolderIconTitleWrap = fileHolder.querySelector("."+fileHolderElementClass.iconTitleWrpClass);
        fileHolderIconTitleWrap.style.display = "block";
    }
}


/**
 * Function For Get Laravel CSRF Token 
 * @returns CSRF Token 
 */
function fileHolderGetLaravelCSRF() {
    let CSRFElement = document.querySelector("meta[name=csrf-token]");
    if(CSRFElement == null) {
        //throw error
        alert(`Laravel CSRF token is missing. Please add meta tag under HTML 'HEAD' Element. Ex: <meta name="csrf-token" content="XkHkxWliZpMa1p4wBQcWdgzsrFBuf4E2w5JgE5uF">`);
        return false;
    }

    let CSRFToken = document.querySelector("meta[name=csrf-token]").getAttribute("content");
    return {
        csrf:true,
        csrfToken:CSRFToken,
    };
}


/**
 * Function For Loading Animation During Removing a Element
 * @param {HTML Element} previewElement 
 * @param {Object} object 
 */
function fileHolderFileRemoveLoading(previewElement,object) {
    let fileType = object.file_type.split("/").shift();
    if(fileType == "image") {
        let fileHolderImageContainer = previewElement.querySelector("."+fileHolderElementClass.imageWrpElementClass);
        var loadingElement = fileHolderFunctions.fileHolderBasicLoading(fileHolderImageContainer);
    }

    return loadingElement;
}


// Generate Unique String ----- START ------------
function dec2hex (dec) {
    return dec.toString(16).padStart(2, "0");
}

function generateUniqueString (len) {
    var arr = new Uint8Array((len || 40) / 2);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, dec2hex).join('');
}
// Generate Unique String ----- END ------------