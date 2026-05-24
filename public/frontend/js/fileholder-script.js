import { icons } from "./fileholder-icon.js";
import { fileHolderData } from "./fileholder-data.js";
import { fileHolderElementClass } from "./fileholder-element-class.js";
import { fileHolderSettings,fileHolderAttr } from "./fileholder-settings.js";
import {fileHolderFunctions} from "./fileholder-core.js";

var fileHolderLoadElementAll = document.querySelectorAll('.file-holder');

// Making FileHolder Layout
function fileHolderLayout(fileHolderLoadElement){

    // Fileholder Main Wrap with class fileholder
    let fileHolderMainWrpElement = document.createElement('div');
    fileHolderMainWrpElement.classList.add(fileHolderElementClass.mainWrapClass);

    // FileHolder Content Element with Content Class
    let fileHolderContentElement = document.createElement('div');
    fileHolderContentElement.classList.add(fileHolderElementClass.contentClass);
    fileHolderMainWrpElement.append(fileHolderContentElement); // append

    let fileHolderIconTitleWrp = document.createElement('div');
    fileHolderIconTitleWrp.classList.add(fileHolderElementClass.iconTitleWrpClass);
    fileHolderContentElement.prepend(fileHolderIconTitleWrp); // append

    let fileHolderDragDropBoxElement = document.createElement('div');
    fileHolderDragDropBoxElement.classList.add(fileHolderElementClass.dragDropBoxClass);
    fileHolderIconTitleWrp.append(fileHolderDragDropBoxElement); // append

    // File Holder Drop Text Element
    let fileHolderDropTextWrpElement = fileHolderAppend(fileHolderContentElement,fileHolderElementClass.dropTextWrpElementClass);
    let fileHolderDropTextElement =  fileHolderAppend(fileHolderDropTextWrpElement,fileHolderElementClass.dropTextElementClass);
    fileHolderInnerText(fileHolderDropTextElement,fileHolderData.dropText);

    fileHolderLoadElement.insertAdjacentHTML("afterend",`${fileHolderMainWrpElement.outerHTML}`);

}


//*
function fileHolderAppend(motherElement,appendElementClass = null,elementType = "div") {
    let element = document.createElement(elementType);
    element.classList.add(appendElementClass);
    motherElement.append(element);
    return element;
}

function fileHolderInnerText (element,text) {
    element.textContent = text;
}

// Website Onload Atitude ############## FILE HOLDER LOAD START ##########################
window.addEventListener("load",function(){

    fileHolderLoadElementAll.forEach(function(fileHolderLoadElement,fileHolderIndex) { // Foreach Loop
        // Calculate height And Parent Height
        if(fileHolderLoadElement != null) {

            var fileHolderHeight = fileHolderSettings.defaultHeight;
            if(fileHolderLoadElement.getAttribute('data-height')) {
                if(parseInt(fileHolderLoadElement.getAttribute('data-height')) < fileHolderSettings.minimumHeight ) {
                    alert("Keep data-height is greater then or equal 130px. Otherwise FileHolder drop box design will be break.");
                }else {
                    fileHolderHeight = fileHolderLoadElement.getAttribute('data-height');
                }

            }
        }

        if(fileHolderLoadElement != null) {
            if(fileHolderInit(fileHolderLoadElement) == true) {
                fileHolderLayout(fileHolderLoadElement);
                var fileHolderMainWrpElement = fileHolderLoadElement.nextSibling;
                var fileHoloderDragAndDropBox = fileHolderMainWrpElement.querySelector("." + fileHolderElementClass.dragDropBoxClass);
                loadFileHolderDragAndDropIcon(icons.fileHolderDragAndDropIcon,fileHoloderDragAndDropBox);
                loadFileHOlderDragAndDropTitle(fileHolderData.boxTitle,fileHoloderDragAndDropBox);
                setTimeout(fileHolderOnloadAnimation,fileHolderSettings.multipleFileHolderAnimationDelay * (fileHolderIndex + 1),fileHolderMainWrpElement,fileHolderHeight); // Run Every Fileholder after a time

                fileHolderDragAndDrop(fileHolderMainWrpElement,fileHolderLoadElement);

                fileHolderClickToUpload(fileHolderMainWrpElement,fileHolderLoadElement);

                // Load Old File
                fileHolderPreviewOldFiles(fileHolderLoadElement);

            }
        }

    });

});
// --------------------- ############## FILE HOLDER LOAD END ############################

// File Holder Init ----------- #################### Initialize Individual Fileholder START ########################
function fileHolderInit(element){
    if(element.tagName == "INPUT") {
        // Init File Holder
        element.setAttribute("type","file");
        element.style.display = "none";
        return true;
    }else {
        // File Holder Can't init 
        alert("Something Worng! Element Tag Must be a INPUT tag");
    }
}
// -------------------------- #################### Initialize Individual Fileholder END ########################

function loadFileHOlderDragAndDropTitle(data,parentElement) {
    let boxLabelPlaceElement = document.createElement('label');
    boxLabelPlaceElement.setAttribute('class',fileHolderElementClass.uploadBoxTitleClass);
    boxLabelPlaceElement.innerHTML = data;
    parentElement.append(boxLabelPlaceElement);
}

function loadFileHolderDragAndDropIcon (icon,parentElement) {
    let fileHolderIconPlaceElement = document.createElement('div');
    fileHolderIconPlaceElement.setAttribute('class',fileHolderElementClass.uploadIconElementClass);
    fileHolderPlaceElement(fileHolderIconPlaceElement,icon);
    parentElement.prepend(fileHolderIconPlaceElement);
}

function fileHolderPlaceElement (motherElement, childElement) {
    motherElement.insertAdjacentHTML("afterbegin",childElement);
}

function fileHolderOnloadAnimation(fileHolder,height) {
    fileHolder.classList.add('active');
    fileHolder.style.minHeight = parseInt(height) + "px";
}


// Drag and drop functions 
function fileHolderDragAndDrop(fileHolderWrpElement,fileInputElement) {

    fileHolderWrpElement.addEventListener("dragover",event =>{ // Drag Drop Box Drag Over
        event.preventDefault();
        event.target.classList.add(fileHolderElementClass.dragOverClass);
    });

    ['dragleave','dragend'].forEach(type => { // Drop Leave or End Event
        fileHolderWrpElement.addEventListener(type, event => {
            event.target.classList.remove(fileHolderElementClass.dragOverClass);
        });
    });

    fileHolderWrpElement.addEventListener("drop",event => { // Drop Event
        event.preventDefault();
        event.target.classList.remove(fileHolderElementClass.dragOverClass);
        let dropFiles = event.dataTransfer.files;

        // Load File Validation
        let fileHolderValidationOutput = fileHolderValidation(dropFiles,fileInputElement);
        fileHolderValidatedFiles(fileHolderValidationOutput);

    });
}

// FileHolder Click Event
function fileHolderClickToUpload(fileHolder,fileInputElement) {
    fileHolder.addEventListener("click",(event) => {
        if(event.target.closest("."+fileHolderElementClass.singleFileViewElementClass) == null) {
            fileInputElement.click();
        }
    });

    fileInputElement.addEventListener("change",(event) => {
        let selectedFiles = event.target.files;
        let fileHolderValidationOutput = fileHolderValidation(selectedFiles,fileInputElement);
        fileHolderValidatedFiles(fileHolderValidationOutput);
    });
}


// FileholderValid Files
function fileHolderValidatedFiles(fileInfoObj) {

    let fileInputElement = fileInfoObj.fileInputElement;
    let fileHolderValidFiles = fileInfoObj.fileHolderDataTransfer.files;
    let fileHolderFilesViewWrpElement = fileHolderFilesViewLayout(fileInputElement);
    let validMimes = fileInfoObj.validMimes;

    // Check Input field is multiple or not
    let inputMultiple = fileHolderCheckInputMultiple(fileInputElement);
    if(inputMultiple == true) {
        // plus equal input values
        let oldFiles = fileInputElement.files;
    }else {
        // Initialize Files to Input Element
        fileInputElement.files = fileHolderValidFiles;

        fileHolderFilesViewWrpElement.classList.add("accept-single-file");
    }
    
    if(fileHolderValidFiles.length > 0) {
        // Load Image Single by Single
        Object.keys(fileHolderValidFiles).forEach((index) => {
            let fileHolderSingleFileWrp = fileHolderSingleFileViewLayout(fileHolderFilesViewWrpElement,fileHolderValidFiles[index],validMimes);
        });

        // Remove FileHolder Box Header With Title
        fileHolderDragAndDropBoxTitleRemove(fileInputElement);
    }


} //--------------------------------------------------------------------------------------


/**
 * Function for remove fileholder box header when fileholder contain minumum one file. It will must reverse when fileholder file container is empty.
 * @param {HTML DOM Element} fileInputElement 
 */
function fileHolderDragAndDropBoxTitleRemove(fileInputElement) {
    // console.log(fileInputElement);
    let fileHolder = fileInputElement.nextSibling;
    if(fileHolder.classList.contains(fileHolderElementClass.mainWrapClass)) {
        let fileHolderFilesWrapElement = fileHolder.querySelector("."+fileHolderElementClass.filesViewWrpElementClass);
        if(fileHolderFilesWrapElement.children.length > 0) {
            // Remove FileHolder Drag and Drop Box Header
            let fileHolderDragAndDropTitleWrap = fileHolder.querySelector("."+fileHolderElementClass.iconTitleWrpClass);
            fileHolderDragAndDropTitleWrap.style.display = "none";
        }
    }
}


/**
 * 
 * @param {HTML DOM Element} inputElement input[type=file] 
 * @return {Boolean} True|False 
 */
function fileHolderCheckInputMultiple(inputElement) {
    if(inputElement.hasAttribute("multiple")) {
        return true;
    }
    return false;
}


// View Files Single by Single
function fileHolderSingleFileViewLayout(filesWrp,validFile,validMimes) {
    let fileHolderSingleFileWrp = fileHolderAppend(filesWrp,fileHolderElementClass.singleFileViewElementClass);
    let fileHolderFileType = validFile.type.split("/").shift();
    
    if(fileHolderFileType == "image") {
        fileHolderLoadImage(fileHolderSingleFileWrp,validFile,validMimes);
    }
}

// FileHolder Image Load
function fileHolderLoadImage(wrapperElement,imageFile,validMimes) {
    let fileHolderImageWrpElement = fileHolderAppend(wrapperElement,fileHolderElementClass.imageWrpElementClass);
    fileHolderFunctions.fileHolderBasicLoading(fileHolderImageWrpElement); // Start FileHolder Basic Loading

    setTimeout(timeoutFunc,500);

    function timeoutFunc() {
        let fileHolderImageElement = fileHolderAppend(fileHolderImageWrpElement,fileHolderElementClass.imageClass,"img");
        fileHolderSingleFileFooterLayout(wrapperElement);

        let fileHolderFileReader = new FileReader();
        fileHolderFileReader.readAsDataURL(imageFile);
        fileHolderFileReader.onloadend  = () => {
            fileHolderImageElement.setAttribute("src",fileHolderFileReader.result);
            fileHolderImageElement.classList.add(fileHolderElementClass.basicShow);

            // FileHolder Server Init
            fileHolderFunctions.fileHolderServerInit(fileHolderSettings.urls,imageFile,wrapperElement,validMimes);
        }
        URL.createObjectURL(imageFile);
    }
}

// Fileholder Single File Footer Layout Design
function fileHolderSingleFileFooterLayout(motherElement) {
    let footerMainWrapElement               = fileHolderAppend(motherElement,fileHolderElementClass.singleFileFooter);
    let footerTitleElement                  = fileHolderAppend(footerMainWrapElement,fileHolderElementClass.fileTitleClass);

    let footerProgressBarElement            = fileHolderAppend(footerMainWrapElement,fileHolderElementClass.fileProgressBarClass);
    let footerProgressBarInnerElement       = fileHolderAppend(footerProgressBarElement,fileHolderElementClass.fileProgressBarInnerElementClass);
    let footerProgressDetailsElement        = fileHolderAppend(footerMainWrapElement,fileHolderElementClass.fileProgressDetails);
    let fileTotalSizeAndLoadedElement       = fileHolderAppend(footerProgressDetailsElement,fileHolderElementClass.totalSizeAndLoadedClass);
    let fileHodlerTotalSizeElement          = fileHolderAppend(fileTotalSizeAndLoadedElement,fileHolderElementClass.fileTotalSizeElementClass,"span");

    let fileHolderLoadedSizeElement         = fileHolderAppend(fileTotalSizeAndLoadedElement,fileHolderElementClass.fileTotalLoadedElementClass,"span");

    let fileHolderLoadedPercentageElement   = fileHolderAppend(footerProgressDetailsElement,fileHolderElementClass.fileLoadedPercentageElementClass);
}


// FileHolder Validation
function fileHolderValidation(uploadFiles,fileInputElement) {
    if(fileInputElement.hasAttribute("accept")) {
        // Continue File Validation 
        let validationRules = fileInputElement.getAttribute("accept");
        let validMimes = fileHolderCheckValidValidationMimes(validationRules,fileInputElement);

        // File Limit Validation
        let limitValidation = fileHolderFileLimitValidation(uploadFiles,fileInputElement);
        uploadFiles = limitValidation.acceptFiles;

        // File Size Validation
        let sizeValidation = fileHolderFileSizeValidation(uploadFiles,fileInputElement);
        uploadFiles = sizeValidation.acceptFiles;

        let fileHolderDataTransfer = new DataTransfer();
        // Check Files is Valid Or Not
        Object.keys(uploadFiles).forEach((index) => {
            let ext_type = uploadFiles[index].type;
            let file_ext = ext_type.split("/").pop();
            if(!validMimes.includes(file_ext)) {
                // throw error
                alert(
                    "File must be type of: " + validMimes.join(",") + 
                    "This File Information: Name- " + uploadFiles[index].name + ", File Extension - " + ext_type + ". So fileHolder skip this file."
                );
            }else {
                // This file is valid
                fileHolderDataTransfer.items.add(uploadFiles[index]);
            }
        });
        
        return {
            fileHolderDataTransfer:fileHolderDataTransfer,
            fileInputElement:fileInputElement,
            validMimes:validMimes,
        };
    }
}


/**
 * @param {HTML DOM Element} inputElement input[type=file]
 * @param {Files} files Valid Files Object
 * @return {Files Object}
 */
function fileHolderFileSizeValidation(files,inputElement) {
    let acceptFiles = [];
    if(inputElement.hasAttribute(fileHolderAttr.fileMazSize)) {
        let fileMaxSize = inputElement.getAttribute(fileHolderAttr.fileMazSize);
        Object.keys(files).forEach((index,item) => {
            let fileSizeMB = fileHolderGetFileSizeMB(files[item]);
            if(Math.ceil(fileMaxSize) > Math.ceil(fileSizeMB)) {
                Array.prototype.push.call(acceptFiles,files[item]);
            }else {
                alert("File size is two long. Please make sure your file size is max: " + fileMaxSize + ". File Name: " +files[item].name + ", File Size: " + files[item].size + ".");
            }
        });
    }else {
        acceptFiles = files;
    }

    return {
        acceptFiles: acceptFiles,
    };
}


/**
 * @param {File} 
 * @return {File Size(MB)}
 */
function fileHolderGetFileSizeMB(file) {
    let rowSize = file.size;
    let fileSizeKB = "";
    let fileSizeMB = "";
    if(isNaN(rowSize) || rowSize < 0 ) {
        alert("File Size is not a number. Please enter a valid file. File Name " + file.name + " ."); 
    }else {
        // Calculate Size
        fileSizeKB = parseFloat(rowSize / 1024).toFixed(2);
        fileSizeMB = parseFloat(fileSizeKB / 1024).toFixed(2);
    }

    return fileSizeMB;
}


/**
 * 
 * @param {HTML DOM Element} inputElement input[type=file] 
 * @param {Files} files Valid Files Object 
 * @returns {Files Object}
 */
function fileHolderFileLimitValidation(files,inputElement) {
    let multipleAttr = inputElement.getAttribute("multiple");
    let multipleFiles = false;
    let filePreviewLimit = 0;
    let fileLimit = 0;
    if(multipleAttr != null) {
        multipleFiles = true;
        filePreviewLimit = false;
    }
    if(multipleFiles == true) {
        // Check File Limit
        let fileLimitAttr = inputElement.getAttribute(fileHolderAttr.maxFileLimit);
        if(fileLimitAttr != null) {
            if(isNaN(fileLimitAttr) || fileLimitAttr <= 0 || fileLimitAttr == "") {
                // throw Error
                alert("Please enter a valid file limit number or remove (" + fileHolderAttr.maxFileLimit + ") from input field.");
            }else {
                fileLimit = fileLimitAttr;
                filePreviewLimit = fileLimitAttr;
            }
        }else {
            fileLimit = files.length;
        }
    }else {
        fileLimit = 1;
        filePreviewLimit = 1;
    }

    // Check Already Viewd Files
    if(inputElement.nextSibling.classList.contains(fileHolderElementClass.mainWrapClass) === true) {
        let previewdFilesCount = inputElement.nextSibling.querySelectorAll("."+fileHolderElementClass.singleFileViewElementClass).length;
        if(filePreviewLimit != false) {
            if(parseInt(previewdFilesCount) < parseInt(filePreviewLimit)) {
                fileLimit = parseInt(filePreviewLimit) - parseInt(previewdFilesCount);
            }else {
                // throw error
                alert("You Can't upload greater then " + filePreviewLimit + " files.");
                fileLimit = 0;
            }
        }
    }else {
        // throw error
        alert("Something Went worng! FileHolder Not loaded properly. Please reload your page again.");
        return false;
    }

    if(files.length < fileLimit) {
        fileLimit = files.length;
    }

    let acceptFiles = [];
    for (let index = 0; index < fileLimit; index++) {
        Array.prototype.push.call(acceptFiles,files[index]);
    }

    return {
        acceptFiles: acceptFiles,
        multiple: multipleFiles,
    };
}

// FileHolder Image Small View Layout
function fileHolderFilesViewLayout(fileInputElement) {
    let fileHolderElement = fileInputElement.nextSibling;
    let fileHolderContentElement = fileHolderElement.querySelector("." + fileHolderElementClass.contentClass);
    if(fileHolderElement.classList.contains(fileHolderElementClass.mainWrapClass)) {

        let fileHodlerFilesViewWrpElement = fileHolderContentElement.querySelector("."+fileHolderElementClass.filesViewWrpElementClass);
        if(fileHodlerFilesViewWrpElement == null) {
            fileHodlerFilesViewWrpElement =  fileHolderAppend(fileHolderContentElement,fileHolderElementClass.filesViewWrpElementClass);
        }
        return fileHodlerFilesViewWrpElement;
    }else {
        // throw error
        alert("FileHolder Not Loaded Properly. Please Reload This Page for Fix This Issue.");
    }
}

/**
 * 
 * @param {string} rules 
 */
function fileHolderCheckValidValidationMimes (rules,inputField = null) {
    if(typeof rules == 'string') {
        return fileHolderAcceptMimes(rules,inputField);
    }else {
        // throw error
    }
}

function fileHolderAcceptMimes(rules,inputField = null) {
    let mimesCollection = [];
    let splitWithComma = rules.split(',');

    splitWithComma.forEach((item,index) => {
        let dot = item.match(/\./g); // Check Dot is Available or not
        let slash = item.match(/\//g); // Check Slash is available or not
        let fileInputElement = inputField; // Which input field is working on it
        if(dot != null) {
            let dotCount = dot.length;
            if(dotCount == 1) {
                // Split with dot and get the extension name
                let extension = item.split('.').pop();
                if(fileHolderFileExtensionValidation(extension) === true) {
                    if(!mimesCollection.includes(extension)) {
                        mimesCollection.push(extension);
                    }
                }

            }else {
                // Invalid Extension throw error
                alert("Input Field Extension is Invalid! Every extension can contain only one dot. Extension Position: " + (parseInt(index) + 1) + ", Extension Name: " + item + ". Please fix it. Otherwise this Extension is not countable. Input field details: Type="+ fileInputElement.getAttribute("type") + ", Class= " + fileInputElement.getAttribute("class") + ", Name= " + fileInputElement.getAttribute("name"));
            }
        }else if(slash != null) {
            let slashCount = slash.length;
            if(slashCount == 1) {
                // Split with slash get the extension name
                var extension = item.split('/').pop();
                let extensionType = item.split('/').shift();
                let getAllExtensions = fileHolderGetExtensions(extensionType,extension); // Get FileHolder Available Extensions Using Extension Type
                getAllExtensions.forEach(singleExt => {
                    if(!mimesCollection.includes(singleExt)) {
                        mimesCollection.push(singleExt);
                    }
                });
            }else {
                // Invalid Extension throw error
                alert("Input Field Extension Name is Invalid! Every extension can contain only one Slash. Extension Position: " + (parseInt(index) + 1) + ", Extension Name: " + item + ". Please fix it. Otherwise this Extension is not countable. Input field details: Type="+ fileInputElement.getAttribute("type") + ", Class= " + fileInputElement.getAttribute("class") + ", Name= " + fileInputElement.getAttribute("name"));
            }
        }

    });

    return mimesCollection;
}

function fileHolderAllfileExtensions() {
    let allExtensions = fileHolderData.fileExtensions;
    let allExtensionsMerge = [];
    Object.keys(allExtensions).forEach((index) => {
        allExtensions[index].forEach(singleExt => {
            allExtensionsMerge.push(singleExt);
        });
    });
    return allExtensionsMerge;
}

function fileHolderFileExtensionValidation(extension,type = null) {
    let allFileExt = fileHolderAllfileExtensions();
    if(type == null) {
        if(allFileExt.includes(extension)) {
            return true;
        }else {
            alert("Input Filed Extension: '"+extension+"' is not available right now on fileHolder. We will update it in our next version.");
        }
    }
    return false;
}


function fileHolderGetExtensions(type,ext) {
    // Check the type is valid or invalid
    let fileHolderValidFileTypes = fileHolderData.validFileTypes;
    if(fileHolderValidFileTypes.includes(type) === true) {
        if(type == "image") {
            if(fileHolderData.fileExtensions.image) {
                if(ext == "*") {
                    return fileHolderData.fileExtensions.image;
                }else {
                    // Check this extension is available or not in fileHolder
                    if(fileHolderData.fileExtensions.image.includes(ext)) {
                        return [ext];
                    }else {
                        // throw error
                        alert("File Extension Type: " + type + " & Extension: "+ ext + " is not available on fileHolder. We will marge it in our next update.");
                    }
                }
            }else {
                // throw error
                alert("File Extension Type: " + type + " is not available on fileHolder. We will marge it in our next update.");
            }
        }else {
            alert("Opps! Currently This Extension Type: " + type + " is not available in fileHolder. We will update it soon.");
            return [];
        }
    }else {
        // throw error
        // Invalid Extension Type
        alert("File Extension Type: '" + type + "' is invalid. Please Enter a valid type.");
    }
    
}

/**
 * Reload Guard
 */
// fileHolderFunctions.fileHolderBrowserTabReloadGuard();


function fileHolderPreviewOldFiles(inputField) {
    // Check Its Multiple File or not 
    let multiple = false;
    if(inputField.hasAttribute("multiple")) {
        multiple = true;
    }

    if(inputField.hasAttribute(fileHolderAttr.filePreviewPath) && inputField.getAttribute(fileHolderAttr.filePreviewPath) != "") {
        if(inputField.hasAttribute(fileHolderAttr.filePreviewName) && inputField.getAttribute(fileHolderAttr.filePreviewName) != "") {
            let filePreviewPath = inputField.getAttribute(fileHolderAttr.filePreviewPath);
            let filePreviewName = inputField.getAttribute(fileHolderAttr.filePreviewName);

            if(Array.isArray(filePreviewName)) {
                if(multiple === true) {
                    // Need to view multiple files
                    return true;
                }
            }else {
                // Need to view only one file
                let fileFullLink = filePreviewPath + "/" + filePreviewName;

                let fileHolderFilesViewWrap = fileHolderFilesViewLayout(inputField);
                let fileHolderPreviewFile = fileHolderFilesViewWrap.querySelector("."+fileHolderElementClass.singleFileViewElementClass);
                if(fileHolderPreviewFile != null ) {
                    fileHolderPreviewFile.remove();
                }

                if(fileHolderData.fileExtensions.image.includes(filePreviewName.split(".").pop())) {
                    let fileHolderFilePreviewElement = fileHolderAppend(fileHolderFilesViewWrap,fileHolderElementClass.singleFileViewElementClass);
                    fileHolderDragAndDropBoxTitleRemove(inputField);
                    fileHolderFilesViewWrap.classList.add(fileHolderElementClass.singlePreviewClass);
                    // View Image layout
                    let fileHolderImageElement = fileHolderAppend(fileHolderFilePreviewElement,fileHolderElementClass.previewImageTagClass,"img");
                    fileHolderImageElement.setAttribute("src",fileFullLink);
                    fileHolderImageElement.setAttribute("alt","Preview");

                    // Remove Attribute From Input Field
                    // inputField.removeAttribute(fileHolderAttr.filePreviewPath);
                    // inputField.removeAttribute(fileHolderAttr.filePreviewName);

                    // FileHolder Preview Image Close Layout
                    fileHolderPreviewFileCloseLayout(fileHolderFilePreviewElement);

                }else {
                    // preview file is not support in fileholder
                    // throw error
                    alert("preview file can't support in fileholder. We will update it in out next version.");
                }

                return true;

            }
        }
    }

    fileHolderRemoveOldFilesAndViewDefaultLayout(inputField);

}

/**
 * Function for check the input field and reinitialize the fileholder view layout
 * @param {HTML DOM Element} inputField 
 * @returns boolean
 */
function fileHolderRemoveOldFilesAndViewDefaultLayout(inputField) {
    let fileHolder = inputField.nextElementSibling;

    if(fileHolder == null) {
        if(fileHolderInit(inputField) == true) {

            var fileHolderHeight = fileHolderSettings.defaultHeight;
            if(inputField.getAttribute('data-height')) {
                if(parseInt(inputField.getAttribute('data-height')) < fileHolderSettings.minimumHeight ) {
                    alert("Keep data-height is greater then or equal 130px. Otherwise FileHolder drop box design will be break.");
                }else {
                    fileHolderHeight = inputField.getAttribute('data-height');
                }

            }

            fileHolderLayout(inputField);
            var fileHolderMainWrpElement = inputField.nextSibling;
            var fileHoloderDragAndDropBox = fileHolderMainWrpElement.querySelector("." + fileHolderElementClass.dragDropBoxClass);
            loadFileHolderDragAndDropIcon(icons.fileHolderDragAndDropIcon,fileHoloderDragAndDropBox);
            loadFileHOlderDragAndDropTitle(fileHolderData.boxTitle,fileHoloderDragAndDropBox);
            setTimeout(fileHolderOnloadAnimation,fileHolderSettings.multipleFileHolderAnimationDelay * 1,fileHolderMainWrpElement,fileHolderHeight); // Run Every Fileholder after a time

            fileHolderDragAndDrop(fileHolderMainWrpElement,inputField);

            fileHolderClickToUpload(fileHolderMainWrpElement,inputField);
        }
        return false;
    }

    var fileHolderSinglePreview = fileHolder.querySelector("."+fileHolderElementClass.singlePreviewClass);

    if(fileHolderSinglePreview != null) {
        // fileHolderFunctions.fileHolderElementRemoveAnimation(fileHolderSinglePreview);
        fileHolderSinglePreview.remove();
        let fileHolderIconTitleWrap = fileHolder.querySelector("."+fileHolderElementClass.iconTitleWrpClass);
        fileHolderIconTitleWrap.style.display = "block";
    }
}


/**
 * Function for Adding Preview File Remove Button On Preview File.
 * @param {HTML Element} previewElement 
 */
function fileHolderPreviewFileCloseLayout(previewElement) {
    let fileHolderButtonsWrpElement = fileHolderAppend(previewElement,fileHolderElementClass.singleFileButtonsWrpElementClass);
    let fileHolderFileRemoveButton = fileHolderAppend(fileHolderButtonsWrpElement,fileHolderElementClass.singlePreviewFileRemoveElementClass);
    fileHolderFileRemoveButton.innerHTML = icons.fileHolderFileRemoveIcon;

    fileHolderFileRemoveButton.addEventListener("click",(event) => {
        //throw error
        let confirmAlert = confirm("Are you sure?");
        if(confirmAlert === true) {
            // previewElement.remove();
            // fileHolderElementRemoveAnimation(previewElement);
            fileHolderFunctions.fileHolderElementRemoveAnimation(previewElement);
        }
    });
}


// export functions
export const previewFunctions = {
    previewReInit: function(inputField) {
        if(inputField == null) {
            return false;
        }
        fileHolderPreviewOldFiles(inputField);
    }
}