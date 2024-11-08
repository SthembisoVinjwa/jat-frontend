let notApplied = document.getElementsByClassName('not-applied')[0];
let applied = document.getElementsByClassName('applied')[0];
let offer = document.getElementsByClassName('offer')[0];
let interview = document.getElementsByClassName('interview')[0];

let notAppliedSpan = document.getElementById('not-applied-count');
let appliedSpan = document.getElementById('applied-count');
let interviewSpan = document.getElementById('interview-count');
let offerSpan = document.getElementById('offer-count');

let addBtn = document.getElementById('add-job');
let overlay = document.getElementsByClassName('overlay')[0];
let formDiv = document.getElementsByClassName('addform-div')[0];
let overlayOpen = false;
let loader = document.getElementsByClassName('loader')[0];

let sortAsc = localStorage.getItem('sortAsc') === null ? true : localStorage.getItem('sortAsc') === 'true';
let filterType = localStorage.getItem('filterType') !== null ? localStorage.getItem('filterType') : 'role';
var originalData;

function sortAscByFilter(filterType, data) {
    return data.slice().sort((a, b) => {
        if (a.status === b.status) {
            // If status is the same, then sort asc by filterType   
            if (filterType === 'company') {
                return a.company.localeCompare(b.company);
            } else if (filterType === 'date') {
                return a.dateOfApplication.localeCompare(b.dateOfApplication);
            } else {
                return a.role.localeCompare(b.role);
            }
        } else {
            // Otherwise, sort by status
            return a.status.localeCompare(b.status);
        }
    });
}

function sortDscByFilter(filterType, data) {
    return data.slice().sort((a, b) => {
        if (a.status === b.status) {
            // If status is the same, then sort dsc by filterType
            if (filterType === 'company') {
                return b.company.localeCompare(a.company);
            } else if (filterType === 'date') {
                return b.dateOfApplication.localeCompare(a.dateOfApplication);
            } else {
                return b.role.localeCompare(a.role);
            }
        } else {
            // Otherwise, sort by status
            return a.status.localeCompare(b.status);
        }
    });
}

function displayJobs() {
    if (access_token === '' || access_token === null) {
        return;
    }

    showLoader();

    fetch(API_BASE_URL + '/api/applications', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token
        }
    }).then(result => {
        result.json().then(data => {
            let newData = (sortAsc == true ? sortAscByFilter(filterType, data) : sortDscByFilter(filterType, data));
            closeLoader();
            insertJobs(newData);
            originalData = newData;
        });
    }).catch(err => {
        closeLoader();
    });
}

function updateCategoryTotal(category, total) {
    if (category === 'not-applied') {
        notAppliedSpan.innerText = total;
    } else if (category === 'applied') {
        appliedSpan.innerText = total;
    } else if (category === 'interview') {
        interviewSpan.innerText = total;
    } else if (category === 'offer'){
        offerSpan.innerText = total;
    }
}

function removeAllJobs() {
    let jobs = document.getElementsByClassName('job');
    Array.from(jobs).forEach(job => {
        job.remove();
    });
}

function insertJobs(data) {
    let notAppliedCount = 0, appliedCount = 0, offerCount = 0, interviewCount = 0;

    for (i = 0; i < data.length; i++) {
        let job = document.createElement('div');
        job.className = 'job';
        job.id = data[i]['applicationId'];

        let saveId = document.createElement('div');
        saveId.className = 'saveId';
        saveId.style.display = 'none';
        saveId.id = data[i]['applicationId'];

        let jobTitle = document.createElement('div');
        jobTitle.className = 'job-title';
        let pJobTitle = document.createElement('p');
        pJobTitle.textContent = data[i]['role'] + ' - ' + data[i]['company'];
        jobTitle.appendChild(pJobTitle);
        jobTitle.addEventListener('click', function() {
            showLoader();
            fetch(API_BASE_URL + '/api/applications/' + job.id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                }
            }).then(result => {
                result.json().then(data => {
                    let formDiv = document.getElementById('showJob');

                    // close
                    let closeAddForm = document.getElementById('close-showform');
                    closeAddForm.addEventListener('click', function() {
                        closeOverlay();
                        formDiv.style.display = 'none';
                    });

                    // fetch data from server
                    fetch(API_BASE_URL + '/api/applications/' + job.id, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + access_token
                        }
                    }).then(result => {
                        result.json().then(data => {
                            closeLoader();

                            let company = document.getElementById('show-company');
                            company.innerText = data['company'];
                            let role = document.getElementById('show-role');
                            role.innerText = data['role'];
                            let status = document.getElementById('show-status');
                            status.innerText = data['status'];
                            let link = document.getElementById('show-link');
                            link.innerText = data['link'] !== '' ? data['link'] : 'no link';
                            let date = document.getElementById('show-date');
                            date.innerText = data['dateOfApplication'];
                            let notes = document.getElementById('show-notes');
                            notes.innerText = data['notes'];
                            notes.setAttribute('readonly', true);

                            // link clipboard function
                            let clipboardBtn = document.getElementById('copy-link');
                            clipboardBtn.addEventListener('click', function(){
                                navigator.clipboard.writeText(data['link']);
                                clipboardBtn.setAttribute("data-tooltip", "copied!");
                                setTimeout(() => {
                                    clipboardBtn.setAttribute("data-tooltip", "copy");
                                }, 1000)
                            });

                            let editBtn = document.getElementById('edit-job');
                            editBtn.addEventListener('click', function() {
                                let companyUpdate = document.getElementById('update-job-company');
                                companyUpdate.value = data['company'];
                                let roleUpdate = document.getElementById('update-job-role');
                                roleUpdate.value = data['role'];
                                let statusUpdate = document.getElementById('update-job-status');
                                statusUpdate.value = data['status'];
                                let dateUpdate = document.getElementById('update-job-date');
                                dateUpdate.value = data['dateOfApplication'];
                                let linkUpdate = document.getElementById('update-job-link');
                                linkUpdate.value = data['link'];
                                let notesUpdate = document.getElementById('update-job-notes');
                                notesUpdate.value = data['notes'];

                                let showJobDiv = document.getElementById('showJob');
                                showJobDiv.style.display = 'none';

                                let updateJobDiv = document.getElementById('update-job');
                                updateJobDiv.appendChild(saveId);
                                updateJobDiv.style.display = 'block';

                                let closeAddForm = document.getElementById('update-close-form');
                                closeAddForm.addEventListener('click', function() {
                                    closeOverlay();
                                    formDiv.style.display = 'none';
                                    updateJobDiv.style.display = 'none';
                                });
                            });

                            openOverlay();
                            formDiv.style.display = 'block';
                        });
                    }).catch(err => {
                        closeLoader();
                        alert(err);
                    });
                })
            }).catch(err => {
                closeLoader();
                alert(err);
            });
        });

        let deleteJob = document.createElement('div');
        deleteJob.className = 'delete-job';     
        let deleteIcon = document.createElement('i');
        deleteIcon.className = 'fa fa-times';
        deleteIcon.ariaHidden = 'true';
        deleteJob.appendChild(deleteIcon);
        deleteJob.onclick = function() {
            openOverlay();
            showLoader();

            fetch(API_BASE_URL + '/api/applications/delete/' + job.id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                }
            }).then(result => {
                closeOverlay();
                closeLoader();
                if (result.status !== 200) {
                    result.json().then(data => {
                        alert(data)
                    })
                } else {
                    removeAllJobs();
                    displayJobs();
                }
            }).catch(err => {
                closeOverlay();
                closeLoader();
                alert(err);
            });
        }
        
        job.appendChild(jobTitle);
        job.appendChild(deleteJob);

        if (data[i]['status'].toLowerCase() === 'not-applied') {
            notAppliedCount++;
            notApplied.appendChild(job);
        } else if (data[i]['status'].toLowerCase() === 'applied') {
            appliedCount++;
            applied.appendChild(job);
        } else if (data[i]['status'].toLowerCase() === 'interview') {
            interviewCount++;
            interview.appendChild(job);
        } else {
            offerCount++;
            offer.appendChild(job);
        }
    }

    updateCategoryTotal('not-applied', notAppliedCount);
    updateCategoryTotal('applied', appliedCount);
    updateCategoryTotal('interview', interviewCount);
    updateCategoryTotal('offer', offerCount);
}

displayJobs();

function resetJobList() {
    while (notApplied.childNodes.length > 2) {
        notApplied.removeChild(notApplied.lastChild);
    }

    while (applied.childNodes.length > 2) {
        applied.removeChild(applied.lastChild);
    }

    while (interview.childNodes.length > 2) {
        interview.removeChild(interview.lastChild);
    }

    while (offer.childNodes.length > 2) {
        offer.removeChild(offer.lastChild);
    }
}


function showLoader() {
    openOverlay();
    loader.style.display = 'block';
}

function closeLoader() {
    loader.style.display = 'none';
    closeOverlay();
}

function closeOverlayForm() {
    overlay.style.display = 'none'; 
    overlayOpen = false;
    formDiv.style.display = 'none';
}

function closeOverlay() {
    overlay.style.display = 'none'; 
    overlayOpen = false;
}    

function openOverlayForm() {
    overlay.style.display = 'block'; 
    overlayOpen = true;
    formDiv.style.display = 'block';
}

function openOverlay() {
    overlay.style.display = 'block'; 
    overlayOpen = true;
}

addBtn.onclick = function() {
    if (access_token === '' || access_token === null) {
        window.location.href = '/login';
    }
    
    if (!overlayOpen) {
        openOverlayForm();
    } else {
        closeOverlayForm();
    }
};

/* Add job */

let jobDate = document.getElementsByClassName('job-date')[0];
jobDate.valueAsDate = new Date();

let closeAddForm = document.getElementById('close-form');
closeAddForm.addEventListener('click', function() {
    closeOverlayForm();
});

function createJob() {
    if (access_token === '' || access_token === null) {
        window.location.href = '/login';
        return;
    }

    formDiv.style.zIndex = 0;
    showLoader();

    const company = document.getElementById('job-company').value;
    const role = document.getElementById('job-role').value;
    const status = document.getElementById('job-status').value;
    const link = document.getElementById('job-link').value;
    const date = document.getElementById('job-date').value.replaceAll('-', '/');
    const notes = document.getElementById('job-notes').value;

    fetch(API_BASE_URL + '/api/applications', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token
        },
        body: JSON.stringify({
            company: company,
            role: role,
            status: status,
            link: link,
            dateOfApplication: date,
            notes: notes
        })
    }).then(result => {
        result.json().then(data => {
            formDiv.style.zIndex = 2;
            document.getElementById('job-form').reset();
            closeLoader();
            closeOverlayForm();
            removeAllJobs();
            displayJobs();
        });
    }).catch(err => {
        closeLoader();
        closeOverlayForm();
        alert(err);
    });
}

function updateJob() {
    const company = document.getElementById('update-job-company').value;
    const role = document.getElementById('update-job-role').value;
    const status = document.getElementById('update-job-status').value;
    const link = document.getElementById('update-job-link').value;
    const date = document.getElementById('update-job-date').value.replaceAll('/', '-');
    const notes = document.getElementById('update-job-notes').value;

    let updateJobDiv = document.getElementById('update-job');
    let showJobDiv = document.getElementById('showJob');
    const update_id = document.getElementsByClassName('saveId')[0].id;

    showLoader();
    updateJobDiv.style.zIndex = 0;
    showJobDiv.style.zIndex = 0;

    fetch(API_BASE_URL + '/api/applications/update/' + update_id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token
        },
        body: JSON.stringify({
            company: company,
            role: role,
            status: status,
            link: link,
            dateOfApplication: date,
            notes: notes
        })
    }).then(result => {
        result.json().then(data => {
            closeOverlayForm();
            removeAllJobs();
            displayJobs();
            closeLoader();

            updateJobDiv.style.zIndex = 2;
            showJobDiv.style.zIndex = 2;
            updateJobDiv.style.display = 'none';
            showJobDiv.style.display = 'none';
        });
    }).catch(err => {
        closeOverlayForm();
        closeLoader();
        alert(err);
    });
}