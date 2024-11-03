/* sort */
let ascBtn = document.getElementById('asc');
ascBtn.onclick = function() {
    localStorage.setItem('sortAsc', true);
    window.location.reload();
}

let dscBtn = document.getElementById('dsc');
dscBtn.onclick = function() {
    localStorage.setItem('sortAsc', false);
    window.location.reload();
}

/* filter */
let filterBtn = document.getElementsByClassName("fa-filter")[0];
let filterDropdown = document.getElementsByClassName('filter-container')[0];
let companyFilter = document.getElementById('company-filter');
let roleFilter = document.getElementById('role-filter');
let dateFilter = document.getElementById('date-filter');
let filterDropdownOpen = false;

filterBtn.onclick = function() {
    if (!filterDropdownOpen) {
        filterDropdown.style.display = 'block';
        filterDropdownOpen = true;
    } else {
        filterDropdown.style.display = 'none';
        filterDropdownOpen = false;
    }
};

companyFilter.addEventListener('click', function() {
    localStorage.setItem('filterType', 'company');
    filterDropdown.style.display = 'none';
    filterDropdownOpen = false;
    window.location.reload();
});

roleFilter.addEventListener('click', function() {
    localStorage.setItem('filterType', 'role');
    filterDropdown.style.display = 'none';
    filterDropdownOpen = false;
    window.location.reload();
}); 

dateFilter.addEventListener('click', function() {
    localStorage.setItem('filterType', 'date');
    filterDropdown.style.display = 'none';
    filterDropdownOpen = false;
    window.location.reload();
});

/* search */
let searchBtn = document.getElementsByClassName('fa-search')[0];
let searchInput = document.getElementById('search-input');
let mustSearch = true; 

searchInput.addEventListener('focus', function() {
    searchBtn.className = 'fa fa-search';
    searchBtn.setAttribute('data-tooltip', 'search');
    mustSearch = true;
});

searchBtn.onclick = function() {
    if (mustSearch) {
        activateSearch();
    } else {
        clearSearch();
    }
};

function activateSearch() {
    searchBtn.className = 'fa fa-times';
    searchBtn.setAttribute('data-tooltip', 'clear search');
    searchBtn.style.margin = 'auto 7px';
    searchBtn.style.fontSize = '15px';

    searchBtn.style.cursor = 'pointer';
    searchResults();

    mustSearch = false; 
}

function clearSearch() {
    searchBtn.className = 'fa fa-search';
    searchBtn.setAttribute('data-tooltip', 'search');
    window.location.reload();
    mustSearch = true; 
}

function searchResults() {
    const searchWord = searchInput.value.toLowerCase();

    // Filter and then sort the data based on the search word
    let sortedData = originalData.filter(item => {
        // Check if there's at least one match in either company or role
        return getMatchScore(item.company.toLowerCase(), searchWord) > 0 ||
               getMatchScore(item.role.toLowerCase(), searchWord) > 0;
    }).sort((a, b) => {
        // Assign scores for sorting based on both company and role
        const scoreA = getMatchScore(a.company.toLowerCase(), searchWord) +
                       getMatchScore(a.role.toLowerCase(), searchWord);
        const scoreB = getMatchScore(b.company.toLowerCase(), searchWord) +
                       getMatchScore(b.role.toLowerCase(), searchWord);

        return scoreB - scoreA; // Sort by total score in descending order
    });

    resetJobList();
    insertJobs(sortedData);
}

// Function to calculate match score based on the search term
function getMatchScore(itemName, searchWord) {
    if (itemName.startsWith(searchWord)) {
        return 3; // Highest score for exact match
    } else if (itemName.includes(searchWord)) {
        return 2; // Medium score for partial match
    } else {
        return 0; // Lowest score for no match
    }
}
