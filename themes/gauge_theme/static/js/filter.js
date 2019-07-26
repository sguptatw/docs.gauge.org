let selections = { os: "macos", language: "javascript", ide: "vscode" };
const SELECTION_CLASSES = ['macos','windows','linux','javascript','java','python','ruby','csharp','vscode','intellij','visualstudio'];
const COMBINATIONS = ['javascript-vscode','java-vscode','python-vscode','ruby-vscode','csharp-vscode','java-intellij','csharp-visualstudio'];

function updateSelection(searchParam) {
    selections.os = searchParam.get('os');
    window.localStorage.setItem('os', selections.os)
    selections.language = searchParam.get('language');
    window.localStorage.setItem('language', selections.language)
    selections.ide = searchParam.get('ide');
    window.localStorage.setItem('ide', selections.ide)

}

function normalize(s) {
    return s.replace(/[&\/\\#,+()$~%.'":*?<>{}\s-]/g, '').toLowerCase();
}

function setSelections() {
    Object.keys(selections).forEach(function (k) {
        let entry = window.localStorage.getItem(k);
        if (entry)
            selections[k] = normalize(entry);
        else
            window.localStorage.setItem(k, normalize(selections[k]));
    });
}

function showContents() {
    Object.keys(selections).forEach(function (s) {
        document.querySelectorAll('.' + selections[s]).forEach(function (e) {
            e.classList.remove('hidden');
        })
    })
}

function setOnclickEvent(button) {
    let name = normalize(button.value);
    if (selections[button.name] === name) button.checked = true;
    button.onclick = function () {
        window.localStorage.setItem(button.name, name);
        selections[button.name] = name;
        window.location.search = (new URLSearchParams(selections)).toString();
    };
};

window.onload = function () {
    let queryString = window.location.search;
    if (queryString) {
        let searchParam = new URLSearchParams(queryString);
        updateSelection(searchParam);
    }
    setSelections();
    document.querySelectorAll(".search").forEach(setOnclickEvent);
    if (window.location.search === '') {
        window.location.search = (new URLSearchParams(selections)).toString();
    }
    showContents();
    changeFilter();
}
function changeFilter() {
    const changeFilterBtn = document.getElementById("change-filter");
    changeFilterBtn.onclick = showPopup;

    const cancelBtn = document.getElementsByClassName("cancel");
    cancelBtn[0].onclick = hidePopUp;

    const applyBtn = document.getElementsByClassName("apply-filter");
    applyBtn[0].onclick = showContent;

    showContent();
};

const showPopup = function() {
    const popUp = document.getElementsByClassName("proj-setup-filters");
    const changeFilterBtn = document.getElementById("change-filter");
    changeFilterBtn.classList.add("change-filter-btn");
    popUp[0].classList.remove("hidden");
};

const hidePopUp = function() {
    const popUp = document.getElementsByClassName("proj-setup-filters");
    const changeFilterBtn = document.getElementById("change-filter");
    changeFilterBtn.classList.remove("change-filter-btn");
    popUp[0].classList.add("hidden");
};

const changeSelectedDetails = function(selectedItems) {
    const appliedFilters = document.querySelectorAll(".applied-filter");

    appliedFilters.forEach((appliedFilter, index) => {
        appliedFilter.innerText = selectedItems[index];
    });
};

const isSelectionClass = function(className){
    return SELECTION_CLASSES.includes(className);
}

const hasSelectedClasses = function(selectedItems, className){
    return selectedItems.includes(className)
}

const showContent = function() {
    const dynamicElems = document.querySelectorAll(".dynamic-content");
    const selectionItems = document.querySelectorAll(".selection");
    const selectedItems = [];
    const selectedValues = [];

    selectionItems.forEach(selection => {
        for (e of selection.children) {
            if (e.firstChild.checked) {
                selectedItems.push(e.firstChild.value.split(" ").join("").toLowerCase());
                selectedValues.push(e.firstChild.value);
            }
        }
    });

    const selectedLanguage = selectedItems[1];
    const selectedIde = selectedItems[2];
    const selectedCombination = `${selectedLanguage}-${selectedIde}`
    if(!COMBINATIONS.includes(selectedCombination)) return;

    const isSelected = hasSelectedClasses.bind(null, selectedItems);

    dynamicElems.forEach(elem => {
        const elemSelectionClasses = elem.classList.value.split(" ").filter(isSelectionClass);
        const hasAllSelections = elemSelectionClasses.every(isSelected);
        elem.classList.remove('hidden');
        if(!hasAllSelections){
            elem.classList.add('hidden');
        }
    });
    
    hidePopUp();
    changeSelectedDetails(selectedValues);
};
