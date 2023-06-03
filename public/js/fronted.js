let doc = document;

function createNewFileUpload() {
    const addNew = doc.querySelector(".add-new");
    const dropInputArea = doc.querySelector(".all-inputs");

    if (addNew) {
        addNew.addEventListener("click", function () {
            let newDiv = doc.createElement("div");
            let newInput = doc.createElement("input");

            newDiv.classList.add("form-controls");
            newInput.setAttribute("type", "file");
            newInput.setAttribute("multiple", "");
            newInput.setAttribute("name", "csvfilesurl");
            newInput.classList.add("input-controls");

            //append input to div
            newDiv.append(newInput);

            //append new file upload control to all input area
            dropInputArea && dropInputArea.append(newDiv);

        })
    }
}


function openFileDialog() {
    const el = doc.querySelector("#openFileDialog");
    const triggerEL = doc.querySelector(".open-file");
    if (el && triggerEL) {
        triggerEL.addEventListener("click", function () {
            el.click();
        })

        el.addEventListener("change", function (event) {
            const fileData = event.target.files[0];
            if (fileData.type === "text/csv") {
                let url = window.location.origin + "/openfile";
                let xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    showFileData(JSON.parse(this.responseText))
                }
                xhr.open("POST", url);
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhr.send(`file=${fileData.name}`);
            } else {
                alert("Please select only csv file");
            }
        })
    }
}

function showFileData(data) {
    const fileDataDiv = doc.querySelector("#fileData");
    const controlArea = doc.querySelector(".control-area");
    if (fileDataDiv) {
        if (data.status == 200) {
            let allHeader = ``;
            let allRows = ``;
            data?.headings.forEach(title => {
                allHeader += `<th>${title.toUpperCase()}</th>`;
            });

            data?.csvfile.slice(1,50).forEach(row => {
                allRows += `<tr>`;
                Object.values(row).forEach(v =>{
                    allRows += `<td>${v}</td>`;
                })
                allRows += `</tr>`;
            });

            let html = `
                <table class="table table-hover">
                <thead><tr>${allHeader}</tr></thead>
                ${allRows}
                </table>
            `
            fileDataDiv.innerHTML = html;

        }else if(data.status == 404){
            creatMessage("error","CSV file not found");
        }else{
            creatMessage("error","something goes wrong");
        }
    }
}

function creatMessage(type, msg){
    const parentDiv = doc.querySelector(".control-area")
    const refNode = doc.querySelector("#file-upload-form");
    const div = doc.createElement("div");
    div.classList.add('msg');
    type == "succes" ? div.classList.add("success-msg") : div.classList.add("error-msg");

    div.innerHTML = `
    <span>${msg}</span>
    <i class="fa-solid fa-xmark"></i>
    `;

    parentDiv.insertBefore(div,refNode);
    closeMessages();
}

function closeMessages(){
    doc.querySelectorAll(".msg").forEach(el => {
        el.querySelector("i").addEventListener("click",function(){
            el.remove();
        })
    })
}

createNewFileUpload();
openFileDialog();
closeMessages();