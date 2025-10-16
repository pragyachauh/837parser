const toggleSwitch = document.getElementById('toggle-switch');
const professionalText = document.getElementById('professional-text');
const institutionalText = document.getElementById('institutional-text');

toggleSwitch.addEventListener('change', () => {
    if (toggleSwitch.checked) {
        professionalText.classList.remove('active');
        institutionalText.classList.add('active');
    } else {
        professionalText.classList.add('active');
        institutionalText.classList.remove('active');
    }
});

// Set initial state
professionalText.classList.add('active');

// Global variable to track current files
let currentFiles = [];

// Delete file function
function deleteFile(index) {
    // Get the file item element to animate
    const fileItems = document.querySelectorAll('.file-item');
    const fileItemToRemove = fileItems[index];
    
    if (fileItemToRemove) {
        // Start simple fade out
        fileItemToRemove.classList.add('fade-out');
        
        // After animation completes, remove from array and update
        setTimeout(() => {
            // Remove file from array
            currentFiles.splice(index, 1);
            
            // Remove the DOM element
            fileItemToRemove.remove();
            
            // Update file count if needed
            updateFileCount();
            
            // If no files left, hide preview
            if (currentFiles.length === 0) {
                const previewElement = document.querySelector('.preview');
                const parseButtonContainer = document.getElementById('parse-button-container');
                previewElement.style.display = 'none';
                parseButtonContainer.style.display = 'none';
                parseButtonContainer.classList.remove('show');
                return;
            }
            
            // Update the onclick handlers for remaining files
            updateFileIndices();
            
        }, 200); // Match the CSS transition duration
    }
}

// Function to update file count display
function updateFileCount() {
    const filesDisplay = document.getElementById('files-display');
    const existingCount = filesDisplay.querySelector('.files-count');
    
    if (currentFiles.length > 1) {
        if (existingCount) {
            existingCount.textContent = `${currentFiles.length} files selected`;
        } else {
            const countElement = document.createElement('div');
            countElement.className = 'files-count';
            countElement.textContent = `${currentFiles.length} files selected`;
            filesDisplay.insertBefore(countElement, filesDisplay.firstChild);
        }
    } else {
        if (existingCount) {
            existingCount.remove();
        }
    }
}

// Function to update onclick handlers after file removal
function updateFileIndices() {
    const fileItems = document.querySelectorAll('.file-item');
    fileItems.forEach((item, newIndex) => {
        const deleteBtn = item.querySelector('.delete-file-btn');
        if (deleteBtn) {
            deleteBtn.setAttribute('onclick', `deleteFile(${newIndex})`);
        }
        item.setAttribute('data-file-index', newIndex);
    });
}

// Function to display results in a themed table
function displayResultsTable(data) {
    const tableContainer = document.getElementById('results-table-container');
    const table = document.getElementById('results-table');
    const thead = table.querySelector('thead tr');
    const tbody = table.querySelector('tbody');
    
    // Clear existing content
    thead.innerHTML = '';
    tbody.innerHTML = '';
    
    if (!data || data.length === 0) {
        tableContainer.style.display = 'none';
        return;
    }
    
    // Get column headers from the first object
    const headers = Object.keys(data[0]);
    
    // Create header row
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        thead.appendChild(th);
    });
    
    // Create data rows
    data.forEach(row => {
        const tr = document.createElement('tr');
        headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = row[header] || '';
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    
    // Show the table with fade in
    tableContainer.style.display = 'block';
    setTimeout(() => {
        tableContainer.style.opacity = '1';
    }, 50);
}

// Sample function to simulate results (replace with actual data processing)
function processFiles() {
    // This would be called after file processing is complete
    // For demonstration, here's sample data structure:
    const sampleData = [
        {
            "Patient Name": "John Doe",
            "Patient ID": "12345",
            "Service Date": "2024-01-15",
            "Provider": "Dr. Smith",
            "Diagnosis": "Routine Checkup",
            "Amount": "$150.00"
        },
        {
            "Patient Name": "Jane Smith",
            "Patient ID": "67890",
            "Service Date": "2024-01-16",
            "Provider": "Dr. Johnson",
            "Diagnosis": "Physical Therapy",
            "Amount": "$80.00"
        }
    ];
    
    // Call this function with your actual parsed data
    // displayResultsTable(sampleData);
}

// Function to render files
function renderFiles() {
    const filesDisplay = document.getElementById('files-display');
    const previewContent = document.querySelector('.preview-content');
    const parseButtonContainer = document.getElementById('parse-button-container');
    
    // Clear previous files
    filesDisplay.innerHTML = '';
    
    // Add files count
    if (currentFiles.length > 1) {
        const countElement = document.createElement('div');
        countElement.className = 'files-count';
        countElement.textContent = `${currentFiles.length} files selected`;
        filesDisplay.appendChild(countElement);
    }
    
    // Create file items for each file
    currentFiles.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.setAttribute('data-file-index', index);
        
        fileItem.innerHTML = `
            <div class="file-content">
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="rgba(255, 255, 255, 0.7)" class="file-icon">
                    <path d="M240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h360l200 200v520q0 33-23.5 56.5T720-80H240Zm0-80h480v-480H560v-160H240v640Zm240-40q67 0 113.5-47T640-360v-160h-80v160q0 33-23 56.5T480-280q-33 0-56.5-23.5T400-360v-220q0-9 6-14.5t14-5.5q9 0 14.5 5.5T440-580v220h80v-220q0-42-29-71t-71-29q-42 0-71 29t-29 71v220q0 66 47 113t113 47ZM240-800v160-160 640-640Z"/>
                </svg>
                <span class="file-name">${file.name}</span>
            </div>
            <button class="delete-file-btn" onclick="deleteFile(${index})">
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="rgba(255, 255, 255, 0.6)">
                    <path d="m336-280-56-56 144-144-144-143 56-56 144 144 143-144 56 56-144 143 144 144-56 56-143-144-144 144Z"/>
                </svg>
            </button>
        `;
        
        filesDisplay.appendChild(fileItem);
    });
    
    // Show/hide parse button based on file count
    if (currentFiles.length > 0) {
        parseButtonContainer.style.display = 'flex';
        // Don't automatically show - wait for upload completion
        parseButtonContainer.classList.remove('show');
    } else {
        parseButtonContainer.style.display = 'none';
        parseButtonContainer.classList.remove('show');
    }
}

// Drag and drop functionality
const dragDropArea = document.getElementById('drag-drop-area');
const fileInput = document.getElementById('file-input');
const chooseFileBtn = document.getElementById('choose-file-btn');

// Handle drag and drop events
dragDropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dragDropArea.classList.add('dragover');
});

dragDropArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dragDropArea.classList.remove('dragover');
});

dragDropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dragDropArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFiles(files);
    }
});

// Handle click to select file
dragDropArea.addEventListener('click', () => {
    fileInput.click();
});

chooseFileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
});

fileInput.addEventListener('change', (event) => {
    const files = event.target.files;
    if (files.length > 0) {
        handleFiles(files);
    }
});

function handleFiles(files) {
    console.log(`${files.length} file(s) selected`);
    
    // Store current files
    currentFiles = Array.from(files);
    
    // Get the elements
    const previewElement = document.querySelector('.preview');
    const previewContent = document.querySelector('.preview-content');
    const progressContainer = document.getElementById('progress-container');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    // Show the preview div and start simple fade in
    previewElement.style.display = 'block';
    previewContent.style.display = 'flex';
    
    // Render files
    renderFiles();
    
    // Simple fade in
    setTimeout(() => {
        previewElement.classList.add('fade-in');
    }, 50);
    
    // Show progress container and start upload simulation
    progressContainer.style.display = 'block';
    
    // Reset progress
    progressFill.style.width = '0%';
    progressText.textContent = '0%';
    
    // Simulate file upload progress for all files
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10 + 3;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Hide progress bar after completion
            setTimeout(() => {
                progressContainer.style.display = 'none';
                
                // Show parse button with fade-in after files are loaded
                const parseButtonContainer = document.getElementById('parse-button-container');
                parseButtonContainer.style.display = 'flex';
                setTimeout(() => {
                    parseButtonContainer.classList.add('show');
                }, 100);
            }, 1000);
        }
        
        progressFill.style.width = progress + '%';
        progressText.textContent = Math.round(progress) + '%';
    }, 300);
}

// Parse button event listener
document.getElementById('parse-btn').addEventListener('click', function() {
    // Prevent multiple clicks
    if (this.disabled) return;
    this.disabled = true;
    
    // Show progress container
    const progressContainer = document.getElementById('progress-container');
    progressContainer.style.display = 'block';
    
    // Reset progress
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    progressFill.style.width = '0%';
    progressText.textContent = '0%';
    
    // Simulate parsing progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Hide progress bar and show results after completion
            setTimeout(() => {
                progressContainer.style.display = 'none';
                
                // Fade out current page and navigate to table.html
                document.body.style.transition = 'opacity 0.5s ease';
                document.body.style.opacity = '0';
                
                setTimeout(() => {
                    window.location.href = 'table.html';
                }, 500);
            }, 500);
        }
        
        progressFill.style.width = progress + '%';
        progressText.textContent = Math.round(progress) + '%';
    }, 200);
});